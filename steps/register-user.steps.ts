import { test } from '@playwright/test';
import { expect } from '../fixtures/custom-expect';
import { HomePage } from '../pages/home.page';
import { SignupLoginPage } from '../pages/signup-login.page';
import { SignupPage, AccountDetails, AddressDetails } from '../pages/signup.page';
import { AccountCreatedPage } from '../pages/account-created.page';
import { DeleteAccountPage } from '../pages/delete-account.page';

export class RegisterUserSteps {
    constructor(
        private homePage: HomePage,
        private signupLoginPage: SignupLoginPage,
        private signupPage: SignupPage,
        private accountCreatedPage: AccountCreatedPage,
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

    async verifyNewUserSignupIsVisible(): Promise<void> {
        await test.step('Then New User Signup! should be visible', async () => {
            expect(await this.signupLoginPage.isNewUserSignupVisible()).toBeTruthy();
        });
    }

    async enterNameAndEmail(name: string, email: string): Promise<void> {
        await test.step('When user enters name and email address', async () => {
            await this.signupLoginPage.enterSignupName(name);
            await this.signupLoginPage.enterSignupEmail(email);
        });
    }

    async clickSignupButton(): Promise<void> {
        await test.step('And user clicks Signup button', async () => {
            await this.signupLoginPage.clickSignup();
        });
    }

    async verifyAccountInfoIsVisible(): Promise<void> {
        await test.step('Then ENTER ACCOUNT INFORMATION should be visible', async () => {
            expect(await this.signupPage.isAccountInfoVisible()).toBeTruthy();
        });
    }

    async fillAccountDetails(details: AccountDetails): Promise<void> {
        await test.step('When user fills account details: Title, Name, Email, Password, Date of birth', async () => {
            await this.signupPage.fillAccountDetails(details);
        });
    }

    async selectNewsletter(): Promise<void> {
        await test.step('And user selects checkbox Sign up for our newsletter!', async () => {
            await this.signupPage.selectNewsletter();
        });
    }

    async selectOffers(): Promise<void> {
        await test.step('And user selects checkbox Receive special offers from our partners!', async () => {
            await this.signupPage.selectOffers();
        });
    }

    async fillAddressDetails(details: AddressDetails): Promise<void> {
        await test.step('And user fills address details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number', async () => {
            await this.signupPage.fillAddressDetails(details);
        });
    }

    async clickCreateAccount(): Promise<void> {
        await test.step('And user clicks Create Account button', async () => {
            await expect(this.signupPage.createAccountButton).toBeClickable();
            await this.signupPage.clickCreateAccount();
        });
    }

    async verifyAccountCreated(): Promise<void> {
        await test.step('Then ACCOUNT CREATED! should be visible', async () => {
            expect(await this.accountCreatedPage.isAccountCreatedVisible()).toBeTruthy();
        });
    }

    async clickContinueAfterCreation(): Promise<void> {
        await test.step('When user clicks Continue button', async () => {
            await this.accountCreatedPage.clickContinue();
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

    async verifyAccountDeletedAndContinue(): Promise<void> {
        await test.step('Then ACCOUNT DELETED! should be visible and user clicks Continue button', async () => {
            expect(await this.deleteAccountPage.isAccountDeletedVisible()).toBeTruthy();
            await this.deleteAccountPage.clickContinue();
        });
    }

    async verifySignupEmailAlreadyExists(): Promise<void> {
        await test.step('Then error Email Address already exist! should be visible', async () => {
            expect(await this.signupLoginPage.isSignupErrorVisible()).toBeTruthy();
        });
    }
}
