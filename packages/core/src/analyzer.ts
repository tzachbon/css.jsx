import type { ParseResult } from '@babel/parser';
import traverse from '@babel/traverse';
import type { File, JSXElement, Node } from '@babel/types';
import * as postcss from 'postcss';
import type { Diagnostics } from './diagnostics';
import { getAttributes, handleNestedTextInRule } from './helpers';
import type { CssJsMeta } from './types';

export interface CssJsAnalyzerParams {
    diagnostics: Diagnostics;
}

export class CssJsAnalyzer {
    private constructor(protected diagnostics: CssJsAnalyzerParams['diagnostics']) {}

    static create({ diagnostics }: CssJsAnalyzerParams) {
        return new this(diagnostics);
    }

    analyze(cssjs: ParseResult<File>): CssJsMeta {
        this.diagnostics.info('begin analyze');

        const css = postcss.root();

        this.onTraverse(cssjs, css);

        return {
            ast: {
                css,
                cssjs,
            },
        };
    }

    private onTraverse(ast: Node, css: postcss.Root) {
        traverse(ast, {
            JSXElement: ({ node }) => {
                // fragment
                if (!node.openingElement.name) {
                    for (const child of node.children) {
                        this.onTraverse(child, css);
                    }
                } else {
                    let name: string | undefined;

                    if (node.openingElement.name.type === 'JSXIdentifier') {
                        name = node.openingElement.name.name;
                    }

                    if (!name) {
                        this.diagnostics.error('missing name', node);
                    }

                    switch (name) {
                        case 'rule': {
                            this.handleRule(node, css);
                            break;
                        }
                    }
                }
            },
        });
    }

    private handleRule(node: JSXElement, css: postcss.Root) {
        const { attributes } = getAttributes.call(this, node.openingElement);
        const selector = attributes.get('selector');

        if (!selector) {
            this.diagnostics.error('rule must have "selector" attribute', node);
        }

        const rule = postcss.rule({ selector });
        css.append(rule);

        for (const ruleChild of node.children) {
            switch (ruleChild.type) {
                case 'JSXText': {
                    if (!ruleChild.value.trim()) {
                        continue;
                    }

                    handleNestedTextInRule(ruleChild.value, rule, css);
                    break;
                }
                case 'JSXExpressionContainer': {
                    const { expression } = ruleChild;
                    if (expression.type === 'TemplateLiteral') {
                        for (const templateElement of expression.quasis) {
                            handleNestedTextInRule(templateElement.value.raw, rule, css);
                        }
                    }
                    break;
                }
            }
        }
    }
}
