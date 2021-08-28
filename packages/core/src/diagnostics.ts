import type { Node } from '@babel/types';

type DiagnosticType = 'info' | 'warning' | 'error';

type DiagnosticsMethod = (message: string, node: Node | null) => void;

type DiagnosticTypeMethods = {
    [key in DiagnosticType]: DiagnosticsMethod;
};

export interface Diagnostic {
    message: string;
    type: DiagnosticType;
    node?: Node | null;
}

export class Diagnostics implements DiagnosticTypeMethods {
    public reports: Diagnostic[] = [];

    private add(type: DiagnosticType, message: string, node?: Node | null) {
        this.reports.push({ type, message, node });
    }

    public info(message: string, node?: Node | null) {
        this.add('info', message, node);
    }

    public warning(message: string, node?: Node | null) {
        this.add('warning', message, node);
    }

    public error(message: string, node?: Node | null) {
        this.add('error', message, node);
    }
}
