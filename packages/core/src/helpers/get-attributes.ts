import type { JSXOpeningElement } from '@babel/types';
import type { CssJsxAnalyzer } from '../analyzer';

export function getAttributes(this: CssJsxAnalyzer, node: JSXOpeningElement) {
    const attributes = new Map();
    for (const attribute of node.attributes) {
        if (attribute.type !== 'JSXAttribute') {
            this.diagnostics.error(`cannot parse attribute of type ${attribute.type}`, node);

            continue;
        }

        if (attribute.value?.type !== 'StringLiteral') {
            if (attribute.value) {
                this.diagnostics.error(
                    `cannot parse attribute value of type ${attribute.value.type}`,
                    node
                );
            }

            continue;
        }

        attributes.set(attribute.name.name, attribute.value.value as string);
    }

    return {
        attributes,
    };
}
