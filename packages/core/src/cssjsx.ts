import { CssJsxAnalyzer } from './analyzer';
import { CssJsxTransformer, NamespaceResolver } from './transformer';
import { Diagnostics } from './diagnostics';
import { parse } from '@babel/parser';
import { namespaceResolver } from './namespace-resolver';
import type { CssJsxMeta } from './types';

export interface CssJsxParams {
    root: string;
    analyzer?: CssJsxAnalyzer;
    transformer?: CssJsxTransformer;
    diagnostics?: Diagnostics;
    namespaceResolver?: NamespaceResolver;
}

export class CssJsx {
    private constructor(
        private root: CssJsxParams['root'],
        private diagnostics: NonNullable<CssJsxParams['diagnostics']>,
        private analyzer: NonNullable<CssJsxParams['analyzer']>,
        private transformer: NonNullable<CssJsxParams['transformer']>
    ) {}

    static create({
        root,
        analyzer,
        transformer,
        diagnostics,
        namespaceResolver: namespaceResolverFn,
    }: CssJsxParams) {
        diagnostics ??= new Diagnostics();
        namespaceResolverFn ??= namespaceResolver;

        return new this(
            root,
            diagnostics,
            analyzer ?? CssJsxAnalyzer.create({ diagnostics }),
            transformer ??
                CssJsxTransformer.create({
                    root,
                    diagnostics,
                    namespaceResolver: namespaceResolverFn,
                })
        );
    }

    public process(meta: string | CssJsxMeta) {
        this.diagnostics.info('begin process in ' + this.root);

        if (typeof meta === 'string') {
            const parsedResult = parse(meta, { plugins: ['jsx'] });
            meta = this.analyzer.analyze(parsedResult);
        }

        const { css: cssAst, reports, exports } = this.transformer.transform(meta);
        const css = cssAst.toString();

        return {
            cssAst,
            css,
            reports,
            exports,
        };
    }
}
