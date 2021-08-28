declare namespace Chai {
    interface Assertion {
        matchSnapshot(ctx: Mocha.Context): void;
        isForced: Assertion;
    }
}
