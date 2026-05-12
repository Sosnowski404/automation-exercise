import { Page, Locator } from '@playwright/test';

export class AccountCreatedPage {
    readonly page: Page;
    readonly accountCreatedHeader: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.accountCreatedHeader = page.getByText('ACCOUNT CREATED!');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async isAccountCreatedVisible(): Promise<boolean> {
        await this.accountCreatedHeader.waitFor({ state: 'visible', timeout: 30000 });
        return this.accountCreatedHeader.isVisible();
    }

    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}
