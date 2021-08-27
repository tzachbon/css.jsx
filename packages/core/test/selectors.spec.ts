import { generateCssJsResult } from './helpers/generate-cssjs-result';
import { expect } from 'chai';
import type { Rule, Declaration } from 'postcss';

describe('Selectors', () => {
    it('should handle simple selector', () => {
        const { cssAst } = generateCssJsResult({
            entry: '/entry.css.js',
            files: {
                '/entry.css.js': `
                        <rule selector=".btn">
                            color: red;
                        </rule>
                    `,
            },
        });

        const rule = cssAst.nodes[0] as Rule;
        const decl = rule.nodes[0] as Declaration;

        expect(rule.selector).to.eql('.btn');
        expect(decl.prop).to.eql('color');
        expect(decl.value).to.eql('red');
    });

    it('should handle simple nested selector', () => {
        const { cssAst } = generateCssJsResult({
            entry: '/entry.css.js',
            files: {
                '/entry.css.js': `
                        <rule selector=".btn">
                            {\`
                                color: blue;

                                &:hover {
                                    color: red;
                                }
                            \`}
                        </rule>
                    `,
            },
        });

        const rule = cssAst.nodes[0] as Rule;
        const decl = rule.nodes[0] as Declaration;

        const nestedRule = cssAst.nodes[1] as Rule;
        const nestedRuleDecl = nestedRule.nodes[0] as Declaration;

        expect(rule.selector).to.eql('.btn');
        expect(decl.prop).to.eql('color');
        expect(decl.value).to.eql('blue');

        expect(nestedRule.selector).to.eql('.btn:hover');
        expect(nestedRuleDecl.prop).to.eql('color');
        expect(nestedRuleDecl.value).to.eql('red');
    });
});
