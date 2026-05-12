import { test, expect } from '@playwright/test';
import { verifyLogin, verifyLoginWithFormData, verifyLoginWithoutParams, deleteVerifyLogin, getVerifyLogin, putVerifyLogin } from '../../api/verify-login.api';
import { rawRequest } from '../../api/raw-request.api';
import { createAccount, deleteAccount } from '../../api/create-account.api';
import { generateFullAccountParams } from '../../utils/helpers';

test.describe('/verifyLogin endpoint tests', () => {
    let validEmail: string;
    let validPassword: string;

    test.beforeAll(async ({ request }) => {
        const params = generateFullAccountParams();
        validEmail = params.email!;
        validPassword = params.password!;
        await createAccount(request, params);
    });

    test.afterAll(async ({ request }) => {
        await deleteAccount(request, validEmail, validPassword);
    });

    test('API 7: POST To Verify Login with valid details should return 200', async ({ request }) => {
        const responseBody = await verifyLogin(request, validEmail, validPassword);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('User exists!');
    });

    test('API 8: POST To Verify Login without email param should return 400', async ({ request }) => {
        const responseBody = await verifyLoginWithFormData(request, { password: validPassword });

        expect(responseBody.responseCode).toBe(400);
        expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');
    });

    test('API 8: POST To Verify Login without password param should return 400', async ({ request }) => {
        const responseBody = await verifyLoginWithFormData(request, { email: validEmail });

        expect(responseBody.responseCode).toBe(400);
        expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');
    });

    test('API 8: POST To Verify Login without any params should return 400', async ({ request }) => {
        const responseBody = await verifyLoginWithoutParams(request);

        expect(responseBody.responseCode).toBe(400);
        expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');
    });

    test('API 9: DELETE To Verify Login should return 405', async ({ request }) => {
        const responseBody = await deleteVerifyLogin(request);

        expect(responseBody.responseCode).toBe(405);
        expect(responseBody.message).toBe('This request method is not supported.');
    });

    test('Negative: GET method on verifyLogin should return 405', async ({ request }) => {
        const responseBody = await getVerifyLogin(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('Negative: PUT method on verifyLogin should return 405', async ({ request }) => {
        const responseBody = await putVerifyLogin(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('Negative: Invalid email with valid password should not return 200', async ({ request }) => {
        const responseBody = await verifyLogin(request, 'nonexistent@fake.com', validPassword);

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Valid email with wrong password should not return 200', async ({ request }) => {
        const responseBody = await verifyLogin(request, validEmail, 'wrongpassword123');

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Both email and password invalid should not return 200', async ({ request }) => {
        const responseBody = await verifyLogin(request, 'fake@fake.com', 'fakepass');

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Numeric value as email', async ({ request }) => {
        const responseBody = await verifyLogin(request, '12345', validPassword);

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Empty string as email', async ({ request }) => {
        const responseBody = await verifyLoginWithFormData(request, { email: '', password: validPassword });

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Empty string as password', async ({ request }) => {
        const responseBody = await verifyLoginWithFormData(request, { email: validEmail, password: '' });

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: SQL injection in email field', async ({ request }) => {
        const responseBody = await verifyLogin(request, "' OR 1=1 --", validPassword);

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: SQL injection in password field', async ({ request }) => {
        const responseBody = await verifyLogin(request, validEmail, "' OR 1=1 --");

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: XSS injection in email field', async ({ request }) => {
        const responseBody = await verifyLogin(request, '<script>alert(1)</script>', validPassword);

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Special characters as email', async ({ request }) => {
        const responseBody = await verifyLogin(request, '!@#$%^&*()', validPassword);

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Very long string as email', async ({ request }) => {
        const longEmail = 'a'.repeat(10000) + '@test.com';
        const responseBody = await verifyLogin(request, longEmail, validPassword);

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Very long string as password', async ({ request }) => {
        const longPassword = 'a'.repeat(10000);
        const responseBody = await verifyLogin(request, validEmail, longPassword);

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Credentials as query params instead of form data', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'verifyLogin',
            queryParams: { email: validEmail, password: validPassword },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);
    });

    test('Negative: Extra unknown form params alongside valid credentials', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'verifyLogin',
            form: { email: validEmail, password: validPassword, role: 'admin', token: 'fake123' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
        expect(body.message).toBe('User exists!');
    });

    test('Negative: Wrong param names for email and password', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'verifyLogin',
            form: { user_email: validEmail, user_password: validPassword },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);
    });

    test('Negative: Path param appended to verifyLogin', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'verifyLogin',
            pathSuffix: 'admin',
            form: { email: validEmail, password: validPassword },
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: Numeric path param on verifyLogin', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'verifyLogin',
            pathSuffix: '1',
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: Path traversal on verifyLogin', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'verifyLogin',
            pathSuffix: '../productsList',
        });
        const body = await response.json();
        expect(body.responseCode).toBe(405);
    });

    test('Negative: SQL injection in form param name', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'verifyLogin',
            form: { "email' OR '1'='1": validEmail, password: validPassword },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);
    });

    test('Negative: Swapped param names (password in email field)', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'verifyLogin',
            form: { email: validPassword, password: validEmail },
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: Duplicate email params with different values', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'verifyLogin',
            form: { email: 'fake@fake.com', password: validPassword },
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: GET with credentials as query params', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'verifyLogin',
            queryParams: { email: validEmail, password: validPassword },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(405);
    });
});
