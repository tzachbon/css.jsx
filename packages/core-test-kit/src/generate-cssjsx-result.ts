import { CssJsx } from 'css.jsx';
import deindent from 'deindent';

interface Config {
    entry: string;
    files: Record<string, string>;
}

export function generateCssJsxResult(config: Config) {
    const cssjsx = CssJsx.create({
        root: config.entry,
    });

    const { css, cssAst, reports, exports } = cssjsx.process(deindent(config.files[config.entry]));

    return {
        css,
        cssAst,
        reports,
        invalidReports: reports.filter((r) => r.type !== 'info'),
        exports,
    };
}
