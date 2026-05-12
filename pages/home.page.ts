import { Page, Locator } from '@playwright/test';
import { uiUrl } from '../constants/url';

export class HomePage {
    readonly page: Page;
    readonly signupLoginLink: Locator;
    readonly loggedInAs: Locator;
    readonly deleteAccountLink: Locator;
    readonly slider: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.loggedInAs = page.locator('a').filter({ hasText: 'Logged in as' });
        this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.slider = page.locator('#slider-carousel');
    }

    async navigate(): Promise<void> {
        await this.page.goto(uiUrl);
        await this.slider.waitFor({ state: 'visible', timeout: 60000 });
    }

    async isHomePageVisible(): Promise<boolean> {
        await this.slider.waitFor({ state: 'visible', timeout: 30000 });
        return this.slider.isVisible();
    }

    async clickSignupLogin(): Promise<void> {
        await this.signupLoginLink.click();
    }

    async getLoggedInUsername(): Promise<string> {
        const text = await this.loggedInAs.textContent();
        return text?.replace('Logged in as ', '').trim() ?? '';
    }

    async isLoggedInAsVisible(): Promise<boolean> {
        return this.loggedInAs.isVisible();
    }

    async clickDeleteAccount(): Promise<void> {
        await this.deleteAccountLink.click();
    }

    async clickLogout(): Promise<void> {
        await this.logoutLink.click();
    }
}
