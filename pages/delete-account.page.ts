import { Page, Locator } from '@playwright/test';

export class DeleteAccountPage {
    readonly page: Page;
    readonly accountDeletedHeader: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.accountDeletedHeader = page.getByText('ACCOUNT DELETED!');
        this.continueButton = page.locator('[data-qa="continue-button"]');
    }

    async isAccountDeletedVisible(): Promise<boolean> {
        await this.accountDeletedHeader.waitFor({ state: 'visible', timeout: 30000 });
        return this.accountDeletedHeader.isVisible();
    }

    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }
}
