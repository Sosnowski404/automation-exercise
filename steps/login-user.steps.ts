import { test } from '@playwright/test';
import { expect } from '../fixtures/custom-expect';
import { HomePage } from '../pages/home.page';
import { SignupLoginPage } from '../pages/signup-login.page';
import { DeleteAccountPage } from '../pages/delete-account.page';

export class LoginUserSteps {
    constructor(
        private homePage: HomePage,
        private signupLoginPage: SignupLoginPage,
        private deleteAccountPage: DeleteAccountPage,
    ) {}

    async navigateToHomePage(): Promise<void> {
        await test.step('Given user navigates to home page', async () => {
            await this.homePage.navigate();
        });
    }

    async verifyHomePageIsVisible(): Promise<void> {
        await test.step('Then home page should be visible successfully', async () => {
            expect(await this.homePage.isHomePageVisible()).toBeTruthy();
        });
    }

    async clickSignupLogin(): Promise<void> {
        await test.step('When user clicks on Signup / Login button', async () => {
            await this.homePage.clickSignupLogin();
        });
    }

    async verifyLoginHeaderIsVisible(): Promise<void> {
        await test.step('Then Login to your account should be visible', async () => {
            expect(await this.signupLoginPage.isLoginHeaderVisible()).toBeTruthy();
        });
    }

    async enterLoginCredentials(email: string, password: string): Promise<void> {
        await test.step('When user enters email address and password', async () => {
            await this.signupLoginPage.enterLoginEmail(email);
            await this.signupLoginPage.enterLoginPassword(password);
        });
    }

    async clickLoginButton(): Promise<void> {
        await test.step('And user clicks login button', async () => {
            await this.signupLoginPage.clickLogin();
        });
    }

    async verifyLoggedInAs(username: string): Promise<void> {
        await test.step(`Then Logged in as ${username} should be visible`, async () => {
            expect(await this.homePage.isLoggedInAsVisible()).toBeTruthy();
        });
    }

    async clickDeleteAccount(): Promise<void> {
        await test.step('When user clicks Delete Account button', async () => {
            await this.homePage.clickDeleteAccount();
        });
    }

    async verifyAccountDeleted(): Promise<void> {
        await test.step('Then ACCOUNT DELETED! should be visible', async () => {
            expect(await this.deleteAccountPage.isAccountDeletedVisible()).toBeTruthy();
        });
    }

    async verifyLoginError(): Promise<void> {
        await test.step('Then error Your email or password is incorrect! should be visible', async () => {
            expect(await this.signupLoginPage.isLoginErrorVisible()).toBeTruthy();
        });
    }

    async clickLogout(): Promise<void> {
        await test.step('When user clicks Logout button', async () => {
            await this.homePage.clickLogout();
        });
    }

    async verifyNavigatedToLoginPage(): Promise<void> {
        await test.step('Then user is navigated to login page', async () => {
            expect(await this.signupLoginPage.isLoginHeaderVisible()).toBeTruthy();
        });
    }
}
