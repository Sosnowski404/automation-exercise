import { Page, Locator } from '@playwright/test';

export class SignupLoginPage {
    readonly page: Page;
    readonly newUserSignupHeader: Locator;
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;
    readonly loginHeader: Locator;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    readonly loginErrorMessage: Locator;
    readonly signupErrorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newUserSignupHeader = page.getByText('New User Signup!');
        this.signupNameInput = page.locator('input[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.locator('button[data-qa="signup-button"]');
        this.loginHeader = page.getByText('Login to your account');
        this.loginEmailInput = page.locator('input[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
        this.loginButton = page.locator('button[data-qa="login-button"]');
        this.loginErrorMessage = page.getByText('Your email or password is incorrect!');
        this.signupErrorMessage = page.getByText('Email Address already exist!');
    }

    async isNewUserSignupVisible(): Promise<boolean> {
        return this.newUserSignupHeader.isVisible();
    }

    async enterSignupName(name: string): Promise<void> {
        await this.signupNameInput.fill(name);
    }

    async enterSignupEmail(email: string): Promise<void> {
        await this.signupEmailInput.fill(email);
    }

    async clickSignup(): Promise<void> {
        await this.signupButton.click();
    }

    async isLoginHeaderVisible(): Promise<boolean> {
        return this.loginHeader.isVisible();
    }

    async enterLoginEmail(email: string): Promise<void> {
        await this.loginEmailInput.fill(email);
    }

    async enterLoginPassword(password: string): Promise<void> {
        await this.loginPasswordInput.fill(password);
    }

    async clickLogin(): Promise<void> {
        await this.loginButton.click();
    }

    async isLoginErrorVisible(): Promise<boolean> {
        await this.loginErrorMessage.waitFor({ state: 'visible', timeout: 10000 });
        return this.loginErrorMessage.isVisible();
    }

    async isSignupErrorVisible(): Promise<boolean> {
        await this.signupErrorMessage.waitFor({ state: 'visible', timeout: 10000 });
        return this.signupErrorMessage.isVisible();
    }
}
