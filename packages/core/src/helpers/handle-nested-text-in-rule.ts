import * as postcss from 'postcss';
import type { NestedNode } from '../types';

export const parentSymbol = Symbol('nested-parent');

export function handleNestedTextInRule(value: string, rule: postcss.Rule, css: postcss.Root) {
    const textAst = postcss.parse(value);

    for (const textNode of textAst.nodes.slice()) {
        const cloned = textNode.clone() as NestedNode;
        cloned[parentSymbol] = rule;

        if (textNode.type === 'decl') {
            rule.append(cloned);
        } else {
            css.append(cloned);
        }
    }
}

export function isNestedNode(node: postcss.AnyNode | NestedNode): node is NestedNode {
    return Boolean((node as NestedNode)[parentSymbol]);
}

export function getParentOfNestedRule(node: NestedNode) {
    return node[parentSymbol];
}
