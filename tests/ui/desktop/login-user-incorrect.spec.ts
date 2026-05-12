import { test } from '../../../fixtures/base.fixture';
import { randomEmail, randomPassword } from '../../../utils/helpers';

test.describe('Test Case 3: Login User with incorrect email and password', () => {
    test('should show error for incorrect credentials', async ({ loginUserSteps }) => {
        await loginUserSteps.navigateToHomePage();
        await loginUserSteps.verifyHomePageIsVisible();
        await loginUserSteps.clickSignupLogin();
        await loginUserSteps.verifyLoginHeaderIsVisible();
        await loginUserSteps.enterLoginCredentials(randomEmail(), randomPassword());
        await loginUserSteps.clickLoginButton();
        await loginUserSteps.verifyLoginError();
    });
});
