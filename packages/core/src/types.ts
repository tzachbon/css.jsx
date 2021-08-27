import type * as postcss from 'postcss';
import type { ParseResult } from '@babel/parser';
import type { File } from '@babel/types';
import { parentSymbol } from './helpers';
export interface CssJsxMeta {
    ast: {
        cssjsx: ParseResult<File>;
        css: postcss.Root;
    };
}

export type NestedNode<T extends postcss.AnyNode = postcss.AnyNode> = T & {
    [parentSymbol]?: postcss.Rule;
};
