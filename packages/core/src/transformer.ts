import type { Rule, Root } from 'postcss';
import type { Diagnostic, Diagnostics } from './diagnostics';
import { getParentOfNestedRule, isNestedNode } from './helpers';
import type { CssJsxMeta } from './types';

export interface CssJsxTransformerParams {
    root: string;
    diagnostics: Diagnostics;
}

export interface TransformReturnType {
    css: Root;
    reports: Diagnostic[];
}
export class CssJsxTransformer {
    private constructor(private diagnostics: CssJsxTransformerParams['diagnostics']) {}

    static create({ diagnostics }: CssJsxTransformerParams) {
        return new this(diagnostics);
    }

    public transform({ ast: { css } }: CssJsxMeta): TransformReturnType {
        this.diagnostics.info('begin transform');

        css.walkRules((node) => {
            if (node.parent?.type === 'rule') {
                const parentRule = node.parent as Rule;
                node.selector = node.selector.replace(/&/g, parentRule.selector);

                css.append(node.clone());
                node.remove();
            }

            if (isNestedNode(node) && getParentOfNestedRule(node)?.type === 'rule') {
                node.selector = node.selector.replace(/&/g, getParentOfNestedRule(node)!.selector);
            }
        });

        return {
            css,
            reports: this.diagnostics.reports,
        };
    }
}
