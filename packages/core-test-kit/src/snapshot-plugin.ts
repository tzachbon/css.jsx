import fs from 'fs';
import path from 'path';
import './snapshot-types';

const fileCache: Record<string, Record<string, object>> = {};
export default plugin;

function plugin(chai: any, utils: any) {
    utils.addProperty(chai.Assertion.prototype, 'isForced', function (this: any) {
        utils.flag(this, 'updateSnapshot', true);
    });

    utils.addMethod(
        chai.Assertion.prototype,
        'matchSnapshot',
        function (this: any, passedContext: Mocha.Context) {
            const actual = utils.flag(this, 'object');
            const isForced = process.env.CHAI_SNAPSHOT_UPDATE || utils.flag(this, 'updateSnapshot');

            const context = ('test' in passedContext ? passedContext.test : passedContext) as any;
            const filename = path.basename(context.file!);
            const snapshotFile = path.join(process.cwd(), '__snapshots__', filename + '.snap.json');

            const prepareTitle = (chain: any): string => {
                if (
                    chain.parent &&
                    chain.parent.file &&
                    path.basename(chain.parent.file) === filename
                ) {
                    return `${prepareTitle(chain.parent)} : ${chain.title}`;
                }
                return chain.title;
            };

            if (!context.matchSequence) {
                context.matchSequence = 1;
            }

            const name = `${prepareTitle(context)} ${context.matchSequence++}`;
            let expected;
            try {
                expected = readSnap(snapshotFile, name);
            } catch (e) {
                if (!isForced) {
                    throw e;
                }
            }
            if (isForced) {
                writeSnap(snapshotFile, name, actual);
                expected = actual;
            }

            if (actual !== null && typeof actual === 'object') {
                chai.assert.deepEqual(actual, expected);
            } else {
                chai.assert.equal(actual, expected);
            }
        }
    );
}

function readSnap(file: string, name: string) {
    if (fileCache[file] === undefined) {
        fileCache[file] = fs.existsSync(file) ? require(file) : false;
    }
    if (!fileCache[file] || !(name in fileCache[file])) {
        throw new Error('Snapshot does not exists');
    }
    return fileCache[file][name];
}

function writeSnap(file: string, name: string, data: object) {
    let snap: Record<string, any> = {};
    if (!fs.existsSync(path.dirname(file))) {
        fs.mkdirSync(path.dirname(file));
    }
    const snapShotCountsBefore = fileCache[file] ? Object.keys(fileCache[file]).length : 0;

    if (snapShotCountsBefore === 0) {
        fileCache[file] = { [name]: data };
    } else {
        fileCache[file][name] = data;
    }

    const snapShotCountsAfter = Object.keys(fileCache[file]).length;
    if (snapShotCountsBefore === 0 || snapShotCountsBefore !== snapShotCountsAfter) {
        snap[name] = data;
    } else {
        for (let snapshot in fileCache[file]) {
            snap[snapshot] = fileCache[file][snapshot];
        }
    }

    fs.writeFileSync(file, JSON.stringify(snap, null, '  '), {
        encoding: 'utf8',
    });

    return true;
}
