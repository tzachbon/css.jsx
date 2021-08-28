import type { Root, Rule } from 'postcss';
import selectorParser from 'postcss-selector-parser';
import type { Diagnostic, Diagnostics } from './diagnostics';
import { getParentOfNestedRule, isNestedNode } from './helpers';
import type { CssJsxMeta } from './types';

export interface Exports {
    classes: Record<string, string>;
}

export interface CssJsxTransformerParams {
    root: string;
    diagnostics: Diagnostics;
    namespaceResolver: NamespaceResolver;
}

export interface TransformReturnType {
    css: Root;
    reports: Diagnostic[];
    exports: Exports;
}

export type NamespaceResolver = (name: string) => string;

export class CssJsxTransformer {
    private constructor(
        private root: CssJsxTransformerParams['root'],
        private diagnostics: CssJsxTransformerParams['diagnostics'],
        private namespaceResolver: CssJsxTransformerParams['namespaceResolver']
    ) {}
    private exports: Exports = { classes: {} };

    static create({ root, diagnostics, namespaceResolver }: CssJsxTransformerParams) {
        return new this(root, diagnostics, namespaceResolver);
    }

    public transform({ ast: { css } }: CssJsxMeta): TransformReturnType {
        this.diagnostics.info('begin transform');

        this.handleRules(css);

        return {
            css,
            reports: this.diagnostics.reports,
            exports: this.exports,
        };
    }

    private handleRules(css: Root) {
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

        css.walkRules((node) => {
            const selectorAst = selectorParser().astSync(node);

            selectorAst.walkClasses((classSelector) => {
                const name = classSelector.value;
                const scopedName = this.scope(name, 's');

                this.exports.classes[name] = scopedName;
                classSelector.value = scopedName;
            });

            node.selector = selectorAst.toString();
        });
    }

    private scope(name: string, prefix: string = '') {
        return `${prefix}${this.namespaceResolver(this.root)}__${name}`;
    }
}
