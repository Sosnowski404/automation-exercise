export function randomString(length: number = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function randomEmail(): string {
    return `test_${randomString(10)}_${Date.now()}@testmail.com`;
}

export function randomPassword(length: number = 12): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function randomName(): string {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

export function randomFirstName(): string {
    const names = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
    return names[Math.floor(Math.random() * names.length)];
}

export function randomLastName(): string {
    const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
    return names[Math.floor(Math.random() * names.length)];
}

export function randomTitle(): string {
    const titles = ['Mr', 'Mrs', 'Miss'];
    return titles[Math.floor(Math.random() * titles.length)];
}

export function randomBirthDate(): { birth_date: string; birth_month: string; birth_year: string } {
    const day = Math.floor(Math.random() * 28) + 1;
    const month = Math.floor(Math.random() * 12) + 1;
    const year = Math.floor(Math.random() * (2000 - 1970)) + 1970;
    return {
        birth_date: day.toString(),
        birth_month: month.toString(),
        birth_year: year.toString(),
    };
}

export function randomPhone(): string {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
}

export function randomZipcode(): string {
    return Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
}

export function randomAddress(): string {
    const num = Math.floor(Math.random() * 9999) + 1;
    const streets = ['Main St', 'Oak Ave', 'Elm St', 'Pine Rd', 'Maple Dr', 'Cedar Ln'];
    return `${num} ${streets[Math.floor(Math.random() * streets.length)]}`;
}

export function randomCity(): string {
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Denver'];
    return cities[Math.floor(Math.random() * cities.length)];
}

export function randomState(): string {
    const states = ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Colorado'];
    return states[Math.floor(Math.random() * states.length)];
}

export function randomCountry(): string {
    const countries = ['United States', 'Canada', 'India', 'United Kingdom', 'Australia'];
    return countries[Math.floor(Math.random() * countries.length)];
}

export function randomCompany(): string {
    const companies = ['Acme Corp', 'Globex', 'Initech', 'Umbrella Corp', 'Stark Industries'];
    return companies[Math.floor(Math.random() * companies.length)];
}

export interface CreateAccountParams {
    name?: string;
    email?: string;
    password?: string;
    title?: string;
    birth_date?: string;
    birth_month?: string;
    birth_year?: string;
    firstname?: string;
    lastname?: string;
    company?: string;
    address1?: string;
    address2?: string;
    country?: string;
    zipcode?: string;
    state?: string;
    city?: string;
    mobile_number?: string;
}

export function generateFullAccountParams(overrides?: Partial<CreateAccountParams>): CreateAccountParams {
    const birth = randomBirthDate();
    return {
        name: randomName(),
        email: randomEmail(),
        password: randomPassword(),
        title: randomTitle(),
        birth_date: birth.birth_date,
        birth_month: birth.birth_month,
        birth_year: birth.birth_year,
        firstname: randomFirstName(),
        lastname: randomLastName(),
        company: randomCompany(),
        address1: randomAddress(),
        address2: randomAddress(),
        country: randomCountry(),
        zipcode: randomZipcode(),
        state: randomState(),
        city: randomCity(),
        mobile_number: randomPhone(),
        ...overrides,
    };
}
