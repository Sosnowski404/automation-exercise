import { Page, Locator } from '@playwright/test';

export interface AccountDetails {
    title: string;
    name: string;
    email: string;
    password: string;
    birthDay: string;
    birthMonth: string;
    birthYear: string;
}

export interface AddressDetails {
    firstName: string;
    lastName: string;
    company: string;
    address: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
}

export class SignupPage {
    readonly page: Page;
    readonly accountInfoHeader: Locator;
    readonly titleMr: Locator;
    readonly titleMrs: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly daysSelect: Locator;
    readonly monthsSelect: Locator;
    readonly yearsSelect: Locator;
    readonly newsletterCheckbox: Locator;
    readonly offersCheckbox: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly addressInput: Locator;
    readonly address2Input: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly createAccountButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.accountInfoHeader = page.getByText('Enter Account Information');
        this.titleMr = page.locator('#id_gender1');
        this.titleMrs = page.locator('#id_gender2');
        this.nameInput = page.locator('input[data-qa="name"]');
        this.emailInput = page.locator('input[data-qa="email"]');
        this.passwordInput = page.locator('input[data-qa="password"]');
        this.daysSelect = page.locator('#days');
        this.monthsSelect = page.locator('#months');
        this.yearsSelect = page.locator('#years');
        this.newsletterCheckbox = page.locator('#newsletter');
        this.offersCheckbox = page.locator('#optin');
        this.firstNameInput = page.locator('input[data-qa="first_name"]');
        this.lastNameInput = page.locator('input[data-qa="last_name"]');
        this.companyInput = page.locator('input[data-qa="company"]');
        this.addressInput = page.locator('input[data-qa="address"]');
        this.address2Input = page.locator('input[data-qa="address2"]');
        this.countrySelect = page.locator('select[data-qa="country"]');
        this.stateInput = page.locator('input[data-qa="state"]');
        this.cityInput = page.locator('input[data-qa="city"]');
        this.zipcodeInput = page.locator('input[data-qa="zipcode"]');
        this.mobileNumberInput = page.locator('input[data-qa="mobile_number"]');
        this.createAccountButton = page.locator('button[data-qa="create-account"]');
    }

    async isAccountInfoVisible(): Promise<boolean> {
        return this.accountInfoHeader.isVisible();
    }

    async selectTitle(title: string): Promise<void> {
        if (title === 'Mr') {
            await this.titleMr.check();
        } else {
            await this.titleMrs.check();
        }
    }

    async fillAccountDetails(details: AccountDetails): Promise<void> {
        await this.selectTitle(details.title);
        await this.passwordInput.fill(details.password);
        await this.daysSelect.selectOption(details.birthDay);
        await this.monthsSelect.selectOption(details.birthMonth);
        await this.yearsSelect.selectOption(details.birthYear);
    }

    async selectNewsletter(): Promise<void> {
        await this.newsletterCheckbox.check();
    }

    async selectOffers(): Promise<void> {
        await this.offersCheckbox.check();
    }

    async fillAddressDetails(details: AddressDetails): Promise<void> {
        await this.firstNameInput.fill(details.firstName);
        await this.lastNameInput.fill(details.lastName);
        await this.companyInput.fill(details.company);
        await this.addressInput.fill(details.address);
        await this.address2Input.fill(details.address2);
        await this.countrySelect.selectOption(details.country);
        await this.stateInput.fill(details.state);
        await this.cityInput.fill(details.city);
        await this.zipcodeInput.fill(details.zipcode);
        await this.mobileNumberInput.fill(details.mobileNumber);
    }

    async clickCreateAccount(): Promise<void> {
        await this.createAccountButton.click();
    }
}
