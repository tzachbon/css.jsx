import type { ParseResult } from '@babel/parser';
import type { File } from '@babel/types';
import type { Root } from 'postcss';

export interface CssJsxMeta {
    ast: {
        cssjsx: ParseResult<File>;
        css: Root;
    };
}
