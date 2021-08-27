import type { Root } from 'postcss';
import type { Diagnostics } from './diagnostics';
import type { CssJsxMeta } from './types';

export interface CssJsxTransformerParams {
    root: string;
    diagnostics: Diagnostics;
}

export class CssJsxTransformer {
    private constructor(private diagnostics: CssJsxTransformerParams['diagnostics']) {}

    static create({ diagnostics }: CssJsxTransformerParams) {
        return new this(diagnostics);
    }

    public transform({ ast: { css } }: CssJsxMeta): Root {
        this.diagnostics.info('begin transform');

        const output = css.clone();

        return output;
    }
}
