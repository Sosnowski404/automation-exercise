import { test } from '../../../fixtures/base.fixture';
import {
    randomName,
    randomEmail,
    randomPassword,
    randomTitle,
    randomBirthDate,
    randomFirstName,
    randomLastName,
    randomCompany,
    randomAddress,
    randomCountry,
    randomState,
    randomCity,
    randomZipcode,
    randomPhone,
} from '../../../utils/helpers';

const name = randomName();
const email = randomEmail();
const password = randomPassword();

test.describe.serial('Test Case 4: Logout User', () => {
    test('setup: register user via UI', async ({ registerUserSteps }) => {
        const birth = randomBirthDate();

        await registerUserSteps.navigateToHomePage();
        await registerUserSteps.clickSignupLogin();
        await registerUserSteps.enterNameAndEmail(name, email);
        await registerUserSteps.clickSignupButton();

        await registerUserSteps.fillAccountDetails({
            title: randomTitle(),
            name,
            email,
            password,
            birthDay: birth.birth_date,
            birthMonth: birth.birth_month,
            birthYear: birth.birth_year,
        });

        await registerUserSteps.selectNewsletter();
        await registerUserSteps.selectOffers();

        await registerUserSteps.fillAddressDetails({
            firstName: randomFirstName(),
            lastName: randomLastName(),
            company: randomCompany(),
            address: randomAddress(),
            address2: randomAddress(),
            country: randomCountry(),
            state: randomState(),
            city: randomCity(),
            zipcode: randomZipcode(),
            mobileNumber: randomPhone(),
        });

        await registerUserSteps.clickCreateAccount();
        await registerUserSteps.verifyAccountCreated();
        await registerUserSteps.clickContinueAfterCreation();
    });

    test('should logout user and navigate to login page', async ({ loginUserSteps }) => {
        await loginUserSteps.navigateToHomePage();
        await loginUserSteps.verifyHomePageIsVisible();
        await loginUserSteps.clickSignupLogin();
        await loginUserSteps.verifyLoginHeaderIsVisible();
        await loginUserSteps.enterLoginCredentials(email, password);
        await loginUserSteps.clickLoginButton();
        await loginUserSteps.verifyLoggedInAs(name);
        await loginUserSteps.clickLogout();
        await loginUserSteps.verifyNavigatedToLoginPage();
    });
});
