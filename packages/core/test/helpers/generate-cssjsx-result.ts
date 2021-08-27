import { CssJsx } from 'css.js';
import deindent from 'deindent';

interface Config {
    entry: string;
    files: Record<string, string>;
}

export function generateCssJsxResult(config: Config) {
    const cssjsx = CssJsx.create({
        root: config.entry,
    });

    return cssjsx.process(deindent(config.files[config.entry]));
}
