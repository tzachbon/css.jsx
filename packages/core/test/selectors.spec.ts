import * as chai from 'chai';
import type { Rule, Declaration } from 'postcss';
import { snapshotPlugin, generateCssJsxResult } from '@cssjsx/core-test-kit';
const { expect } = chai;

chai.use(snapshotPlugin);

describe('Selectors', () => {
    it('should handle simple selector', function () {
        const { cssAst, invalidReports, exports } = generateCssJsxResult({
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

        expect(rule.selector).to.eql('.scbc45a__btn');
        expect(decl.prop).to.eql('color');
        expect(decl.value).to.eql('red');

        expect(cssAst.toString()).to.matchSnapshot(this);
        expect(invalidReports).to.have.length(0);

        expect(exports.classes).to.eql({ btn: 'scbc45a__btn' });
    });

    it('should handle simple nested selector', function () {
        const { cssAst, invalidReports, exports } = generateCssJsxResult({
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

        expect(rule.selector).to.eql('.scbc45a__btn');
        expect(decl.prop).to.eql('color');
        expect(decl.value).to.eql('blue');

        expect(nestedRule.selector).to.eql('.scbc45a__btn:hover');
        expect(nestedRuleDecl.prop).to.eql('color');
        expect(nestedRuleDecl.value).to.eql('red');

        expect(cssAst.toString()).to.matchSnapshot(this);
        expect(invalidReports).to.have.length(0);

        expect(exports.classes).to.eql({ btn: 'scbc45a__btn' });
    });

    it('should handle multi nested selector', function () {
        const { cssAst, invalidReports, exports } = generateCssJsxResult({
            entry: '/entry.css.js',
            files: {
                '/entry.css.js': `
                        <rule selector=".btn">
                            {\`
                                color: blue;

                                &:hover {
                                    color: red;

                                    & li {
                                        color: gold
                                    }
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

        const multiNestedRule = cssAst.nodes[2] as Rule;
        const multiNestedRuleDecl = multiNestedRule.nodes[0] as Declaration;

        expect(rule.selector).to.eql('.scbc45a__btn');
        expect(decl.prop).to.eql('color');
        expect(decl.value).to.eql('blue');

        expect(nestedRule.selector).to.eql('.scbc45a__btn:hover');
        expect(nestedRuleDecl.prop).to.eql('color');
        expect(nestedRuleDecl.value).to.eql('red');

        expect(multiNestedRule.selector).to.eql('.scbc45a__btn:hover li');
        expect(multiNestedRuleDecl.prop).to.eql('color');
        expect(multiNestedRuleDecl.value).to.eql('gold');

        expect(cssAst.toString()).to.matchSnapshot(this);
        expect(invalidReports).to.have.length(0);

        expect(exports.classes).to.eql({ btn: 'scbc45a__btn' });
    });
});
