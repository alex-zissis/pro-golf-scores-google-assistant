import ssmlCheck from 'ssml-check';
import {diff} from 'jest-diff';

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValidSSMLAndEqual(expected: string, partial?: boolean): Promise<R>;
        }
    }
}

expect.extend({
    async toBeValidSSMLAndEqual(received: string, expected: string, partial = false) {
        const options = {
            comment: 'Object.is equality',
            isNot: this.isNot,
            promise: this.promise,
        };

        let toCheck = received;

        if (partial && !received.startsWith('<speak')) {
            toCheck = `<speak>${toCheck}</speak>`;
        }
        const err = await ssmlCheck.check(toCheck);
        let message: string;
        let pass = true;

        if (err) {
            message = `SSML validation failed. Error: ${JSON.stringify(err, null, 2)}`;
            pass = false;
        }

        pass = pass && received === expected;

        if (!message) {
            if (pass) {
                message = `${this.utils.matcherHint('toBeValidSSMLAndEqual', undefined, undefined, options)}

    Expected: not ${this.utils.printExpected(expected)}
    Received: ${this.utils.printReceived(received)}`;
            } else {
                const diffString = diff(expected, received, {
                    expand: this.expand,
                });
                message = `${this.utils.matcherHint('toBeValidSSMLAndEqual', undefined, undefined, options)}
                    
                    ${
                        diffString && diffString.includes('- Expect')
                            ? `
Difference:\n\n${diffString}`
                            : `
Expected: ${this.utils.printExpected(expected)}
Received: ${this.utils.printReceived(received)}`
                    }`;
            }
        }

        return {
            message: () => message,
            pass,
        };
    },
});

export {};
