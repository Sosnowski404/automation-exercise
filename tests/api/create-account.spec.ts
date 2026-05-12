import { test, expect } from '@playwright/test';
import { createAccount, createAccountRaw, deleteAccount } from '../../api/create-account.api';
import { verifyLogin } from '../../api/verify-login.api';
import { rawRequest } from '../../api/raw-request.api';
import { generateFullAccountParams, randomEmail, randomPassword, randomName } from '../../utils/helpers';

test.describe('/createAccount endpoint tests', () => {
    test('API 11: POST Create Account with all params should return 201', async ({ request }) => {
        const params = generateFullAccountParams();
        const responseBody = await createAccount(request, params);

        expect(responseBody.responseCode).toBe(201);
        expect(responseBody.message).toBe('User created!');

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Create account with only name, email, password should return 400', async ({ request }) => {
        const responseBody = await createAccount(request, {
            name: randomName(),
            email: randomEmail(),
            password: randomPassword(),
        });

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Create account with only name should return 400', async ({ request }) => {
        const responseBody = await createAccount(request, {
            name: randomName(),
        });

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Create account with only email should return 400', async ({ request }) => {
        const responseBody = await createAccount(request, {
            email: randomEmail(),
        });

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Create account with only password should return 400', async ({ request }) => {
        const responseBody = await createAccount(request, {
            password: randomPassword(),
        });

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Create account with name + email (no password) should return 400', async ({ request }) => {
        const responseBody = await createAccount(request, {
            name: randomName(),
            email: randomEmail(),
        });

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Create account with name + password (no email) should return 400', async ({ request }) => {
        const responseBody = await createAccount(request, {
            name: randomName(),
            password: randomPassword(),
        });

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Create account with email + password (no name) should return 400', async ({ request }) => {
        const responseBody = await createAccount(request, {
            email: randomEmail(),
            password: randomPassword(),
        });

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Create account with no params should return 400', async ({ request }) => {
        const responseBody = await createAccount(request, {});

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Create account with duplicate email should return 400', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const duplicateResponse = await createAccount(request, {
            ...generateFullAccountParams(),
            email: params.email,
        });

        expect(duplicateResponse.responseCode).toBe(400);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('API 11: Create account without title should still return 201', async ({ request }) => {
        const params = generateFullAccountParams();
        delete params.title;
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).toBe(201);
        await deleteAccount(request, params.email!, params.password!);
    });

    test('API 11: Create account without birth fields should return 201', async ({ request }) => {
        const params = generateFullAccountParams();
        delete params.birth_date;
        delete params.birth_month;
        delete params.birth_year;
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).toBe(201);
        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Create account without firstname + lastname should return 400', async ({ request }) => {
        const params = generateFullAccountParams();
        delete params.firstname;
        delete params.lastname;
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Create account without address fields should return 400', async ({ request }) => {
        const params = generateFullAccountParams();
        delete params.address1;
        delete params.address2;
        delete params.country;
        delete params.zipcode;
        delete params.state;
        delete params.city;
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Create account without company + mobile should return 400', async ({ request }) => {
        const params = generateFullAccountParams();
        delete params.company;
        delete params.mobile_number;
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).toBe(400);
    });

    test('API 11: Created account can be verified via verifyLogin', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const loginResponse = await verifyLogin(request, params.email!, params.password!);
        expect(loginResponse.responseCode).toBe(200);
        expect(loginResponse.message).toBe('User exists!');

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: GET method on createAccount should not return 201', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'createAccount',
        });
        const body = await response.json();
        expect(body.responseCode ?? body.detail).toBeDefined();
        expect(body.responseCode).not.toBe(201);
    });

    test('Negative: PUT method on createAccount should not return 201', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'put',
            endpoint: 'createAccount',
        });
        const body = await response.json();
        expect(body.responseCode ?? body.detail).toBeDefined();
        expect(body.responseCode).not.toBe(201);
    });

    test('Negative: DELETE method on createAccount should not return 201', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'delete',
            endpoint: 'createAccount',
        });
        const body = await response.json();
        expect(body.responseCode ?? body.detail).toBeDefined();
        expect(body.responseCode).not.toBe(201);
    });

    test('Negative: Numeric value as name', async ({ request }) => {
        const params = generateFullAccountParams({ name: '12345' });
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).toBe(201);
        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Invalid email format', async ({ request }) => {
        const params = generateFullAccountParams({ email: 'not-an-email' });
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).not.toBe(201);
    });

    test('Negative: SQL injection in name field', async ({ request }) => {
        const params = generateFullAccountParams({ name: "' OR 1=1 --" });
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).toBe(201);
        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: XSS injection in name field', async ({ request }) => {
        const params = generateFullAccountParams({ name: '<script>alert(1)</script>' });
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).toBe(201);
        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Very long string as name', async ({ request }) => {
        const params = generateFullAccountParams({ name: 'a'.repeat(10000) });
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).toBe(201);
        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Empty string as name', async ({ request }) => {
        const responseBody = await createAccount(request, {
            name: '',
            email: randomEmail(),
            password: randomPassword(),
        });
        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Empty string as email', async ({ request }) => {
        const responseBody = await createAccount(request, {
            name: randomName(),
            email: '',
            password: randomPassword(),
        });
        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Empty string as password', async ({ request }) => {
        const responseBody = await createAccount(request, {
            name: randomName(),
            email: randomEmail(),
            password: '',
        });
        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Special characters as email', async ({ request }) => {
        const responseBody = await createAccount(request, {
            name: randomName(),
            email: '!@#$%^&*()',
            password: randomPassword(),
        });
        expect(responseBody.responseCode).not.toBe(201);
    });

    test('Negative: Params as query params instead of form data', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'createAccount',
            queryParams: { name: randomName(), email: randomEmail(), password: randomPassword() },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);
    });

    test('Negative: Wrong param names', async ({ request }) => {
        const responseBody = await createAccountRaw(request, {
            user_name: randomName(),
            user_email: randomEmail(),
            user_password: randomPassword(),
        });
        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Path param appended to createAccount', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'createAccount',
            pathSuffix: 'admin',
            form: { name: randomName(), email: randomEmail(), password: randomPassword() },
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: Invalid title value', async ({ request }) => {
        const params = generateFullAccountParams({ title: 'InvalidTitle' });
        const responseBody = await createAccount(request, params);
        expect(responseBody.responseCode).toBe(201);
        await deleteAccount(request, params.email!, params.password!);
    });
});
