import type { ParseResult } from '@babel/parser';
import type { File } from '@babel/types';
import type { Root } from 'postcss';

export interface CssJsMeta {
    ast: {
        cssjs: ParseResult<File>;
        css: Root;
    };
}
