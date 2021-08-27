import type { Root } from 'postcss';
import type { Diagnostics } from './diagnostics';
import type { CssJsMeta } from './types';

export interface CssJsTransformerParams {
    root: string;
    diagnostics: Diagnostics;
}

export class CssJsTransformer {
    private constructor(private diagnostics: CssJsTransformerParams['diagnostics']) {}

    static create({ diagnostics }: CssJsTransformerParams) {
        return new this(diagnostics);
    }

    public transform({ ast: { css } }: CssJsMeta): Root {
        this.diagnostics.info('begin transform');

        const output = css.clone();

        return output;
    }
}
