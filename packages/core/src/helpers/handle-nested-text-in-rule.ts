import * as postcss from 'postcss';

export function handleNestedTextInRule(value: string, rule: postcss.Rule, css: postcss.Root) {
    const textAst = postcss.parse(value.replace(/&/g, rule.selector));

    for (const textNode of textAst.nodes.slice()) {
        if (textNode.type === 'decl') {
            rule.append(textNode.clone());
        } else {
            css.append(textNode.clone());
        }
    }
}
