import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { SignupLoginPage } from '../pages/signup-login.page';
import { SignupPage } from '../pages/signup.page';
import { AccountCreatedPage } from '../pages/account-created.page';
import { DeleteAccountPage } from '../pages/delete-account.page';
import { RegisterUserSteps } from '../steps/register-user.steps';
import { LoginUserSteps } from '../steps/login-user.steps';

export { expect } from './custom-expect';

async function dismissCookieConsent(page: import('@playwright/test').Page): Promise<void> {
    page.on('load', async () => {
        const consentButton = page.locator('.fc-consent-root .fc-cta-consent');
        try {
            await consentButton.click({ timeout: 5000 });
        } catch {
            // consent dialog not present — continue
        }
    });
}

type UiFixtures = {
    homePage: HomePage;
    signupLoginPage: SignupLoginPage;
    signupPage: SignupPage;
    accountCreatedPage: AccountCreatedPage;
    deleteAccountPage: DeleteAccountPage;
    registerUserSteps: RegisterUserSteps;
    loginUserSteps: LoginUserSteps;
};

export const test = base.extend<UiFixtures>({
    homePage: async ({ page }, use) => {
        await dismissCookieConsent(page);
        await use(new HomePage(page));
    },

    signupLoginPage: async ({ page }, use) => {
        await use(new SignupLoginPage(page));
    },

    signupPage: async ({ page }, use) => {
        await use(new SignupPage(page));
    },

    accountCreatedPage: async ({ page }, use) => {
        await use(new AccountCreatedPage(page));
    },

    deleteAccountPage: async ({ page }, use) => {
        await use(new DeleteAccountPage(page));
    },

    registerUserSteps: async (
        { homePage, signupLoginPage, signupPage, accountCreatedPage, deleteAccountPage },
        use,
    ) => {
        await use(
            new RegisterUserSteps(
                homePage,
                signupLoginPage,
                signupPage,
                accountCreatedPage,
                deleteAccountPage,
            ),
        );
    },

    loginUserSteps: async (
        { homePage, signupLoginPage, deleteAccountPage },
        use,
    ) => {
        await use(
            new LoginUserSteps(
                homePage,
                signupLoginPage,
                deleteAccountPage,
            ),
        );
    },
});
