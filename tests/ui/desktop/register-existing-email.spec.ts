import { test } from '../../../fixtures/base.fixture';
import { randomName } from '../../../utils/helpers';

test.describe('Test Case 5: Register User with existing email', () => {
    test('should show error for already registered email', async ({ registerUserSteps }) => {
        await registerUserSteps.navigateToHomePage();
        await registerUserSteps.verifyHomePageIsVisible();
        await registerUserSteps.clickSignupLogin();
        await registerUserSteps.verifyNewUserSignupIsVisible();
        await registerUserSteps.enterNameAndEmail(randomName(), 'sosnowskimarcin.qa@gmail.com');
        await registerUserSteps.clickSignupButton();
        await registerUserSteps.verifySignupEmailAlreadyExists();
    });
});
