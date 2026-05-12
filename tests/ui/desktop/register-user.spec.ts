import { test, expect } from '../../../fixtures/base.fixture';
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

test.describe('Test Case 1: Register User', () => {
    test('should register a new user and delete account', async ({ registerUserSteps }) => {
        const name = randomName();
        const email = randomEmail();
        const password = randomPassword();
        const birth = randomBirthDate();

        await registerUserSteps.navigateToHomePage();
        await registerUserSteps.verifyHomePageIsVisible();
        await registerUserSteps.clickSignupLogin();
        await registerUserSteps.verifyNewUserSignupIsVisible();
        await registerUserSteps.enterNameAndEmail(name, email);
        await registerUserSteps.clickSignupButton();
        await registerUserSteps.verifyAccountInfoIsVisible();

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
        await registerUserSteps.verifyLoggedInAs(name);
        await registerUserSteps.clickDeleteAccount();
        await registerUserSteps.verifyAccountDeletedAndContinue();
    });
});
