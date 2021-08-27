import { CssJsAnalyzer } from './analyzer';
import { CssJsTransformer } from './transformer';
import { Diagnostics } from './diagnostics';
import { parse } from '@babel/parser';
import type { CssJsMeta } from './types';

export interface CssJsParams {
    root: string;
    analyzer?: CssJsAnalyzer;
    transformer?: CssJsTransformer;
    diagnostics?: Diagnostics;
}

export class CssJs {
    private constructor(
        private root: CssJsParams['root'],
        private diagnostics: NonNullable<CssJsParams['diagnostics']>,
        private analyzer: NonNullable<CssJsParams['analyzer']>,
        private transformer: NonNullable<CssJsParams['transformer']>
    ) {}

    static create({ root, analyzer, transformer, diagnostics }: CssJsParams) {
        diagnostics ??= new Diagnostics();

        return new this(
            root,
            diagnostics,
            analyzer ?? CssJsAnalyzer.create({ diagnostics }),
            transformer ?? CssJsTransformer.create({ root, diagnostics })
        );
    }

    public process(meta: string | CssJsMeta) {
        this.diagnostics.info('begin process in ' + this.root);

        if (typeof meta === 'string') {
            const parsedResult = parse(meta, { plugins: ['jsx'] });
            meta = this.analyzer.analyze(parsedResult);
        }

        const cssAst = this.transformer.transform(meta);
        const css = cssAst.toString();

        return {
            cssAst,
            css,
        };
    }
}
