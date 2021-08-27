import { CssJs } from 'css.js';
import deindent from 'deindent';

interface Config {
    entry: string;
    files: Record<string, string>;
}

export function generateCssJsResult(config: Config) {
    const cssjs = CssJs.create({
        root: config.entry,
    });

    return cssjs.process(deindent(config.files[config.entry]));
}
