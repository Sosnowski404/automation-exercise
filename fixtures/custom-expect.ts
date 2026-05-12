import { expect as baseExpect, Locator } from '@playwright/test';

export const expect = baseExpect.extend({
    async toBeClickable(locator: Locator, timeoutOrOptions?: number | { timeout?: number }) {
        const assertionName = 'toBeClickable';
        let pass: boolean;
        let matcherResult: any;
        const timeout =
            typeof timeoutOrOptions === 'number'
                ? timeoutOrOptions
                : (timeoutOrOptions?.timeout ?? 10000);
        try {
            await locator.click({ trial: true, timeout });
            pass = true;
        } catch (e: any) {
            matcherResult = e.matcherResult ?? { actual: e.message };
            pass = false;
        }

        if (this.isNot) {
            pass = !pass;
        }

        const message = pass
            ? () =>
                this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
                '\n\n' +
                `Locator: ${locator}\n` +
                `Expected: not to be clickable\n` +
                (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '')
            : () =>
                this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
                '\n\n' +
                `Locator: ${locator}\n` +
                `Expected: to be clickable\n` +
                (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '');

        return {
            message,
            pass,
            name: assertionName,
            expected: 'clickable',
            actual: matcherResult?.actual,
        };
    },
});
