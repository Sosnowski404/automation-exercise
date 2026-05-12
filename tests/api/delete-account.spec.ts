import { test, expect } from '@playwright/test';
import { createAccount, deleteAccount } from '../../api/create-account.api';
import { verifyLogin } from '../../api/verify-login.api';
import { deleteAccountApi, deleteAccountWithFormData, deleteAccountWithoutParams } from '../../api/delete-account.api';
import { rawRequest } from '../../api/raw-request.api';
import { generateFullAccountParams, randomEmail, randomPassword } from '../../utils/helpers';

test.describe('/deleteAccount endpoint tests', () => {
    test('API 12: DELETE account with valid email and password should return 200', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await deleteAccountApi(request, params.email!, params.password!);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('Account deleted!');
    });

    test('API 12: Deleted account should no longer be verifiable via login', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);
        await deleteAccountApi(request, params.email!, params.password!);

        const loginResponse = await verifyLogin(request, params.email!, params.password!);
        expect(loginResponse.responseCode).toBe(404);
    });

    test('API 12: Deleting same account twice should fail on second attempt', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const firstDelete = await deleteAccountApi(request, params.email!, params.password!);
        expect(firstDelete.responseCode).toBe(200);

        const secondDelete = await deleteAccountApi(request, params.email!, params.password!);
        expect(secondDelete.responseCode).not.toBe(200);
    });

    test('Negative: DELETE without email param should return 400', async ({ request }) => {
        const responseBody = await deleteAccountWithFormData(request, { password: randomPassword() });

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: DELETE without password param should return 400', async ({ request }) => {
        const responseBody = await deleteAccountWithFormData(request, { email: randomEmail() });

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: DELETE without any params should return 400', async ({ request }) => {
        const responseBody = await deleteAccountWithoutParams(request);

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: DELETE with non-existing email should not return 200', async ({ request }) => {
        const responseBody = await deleteAccountApi(request, 'nonexistent_xyz@fake.com', randomPassword());

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: DELETE with valid email but wrong password should not return 200', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await deleteAccountApi(request, params.email!, 'wrongpassword123');
        expect(responseBody.responseCode).not.toBe(200);

        await deleteAccountApi(request, params.email!, params.password!);
    });

    test('Negative: GET method on deleteAccount should not return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'deleteAccount',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: POST method on deleteAccount should not return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'deleteAccount',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: PUT method on deleteAccount should not return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'put',
            endpoint: 'deleteAccount',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: Empty string as email', async ({ request }) => {
        const responseBody = await deleteAccountWithFormData(request, { email: '', password: randomPassword() });
        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Empty string as password', async ({ request }) => {
        const responseBody = await deleteAccountWithFormData(request, { email: randomEmail(), password: '' });
        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: SQL injection in email field', async ({ request }) => {
        const responseBody = await deleteAccountApi(request, "' OR 1=1 --", randomPassword());
        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: SQL injection in password field', async ({ request }) => {
        const responseBody = await deleteAccountApi(request, randomEmail(), "' OR 1=1 --");
        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: XSS injection in email field', async ({ request }) => {
        const responseBody = await deleteAccountApi(request, '<script>alert(1)</script>', randomPassword());
        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Special characters as email', async ({ request }) => {
        const responseBody = await deleteAccountApi(request, '!@#$%^&*()', randomPassword());
        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Very long string as email', async ({ request }) => {
        const responseBody = await deleteAccountApi(request, 'a'.repeat(10000) + '@test.com', randomPassword());
        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Very long string as password', async ({ request }) => {
        const responseBody = await deleteAccountApi(request, randomEmail(), 'a'.repeat(10000));
        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: Credentials as query params instead of form data', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'delete',
            endpoint: 'deleteAccount',
            queryParams: { email: randomEmail(), password: randomPassword() },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);
    });

    test('Negative: Wrong param names', async ({ request }) => {
        const responseBody = await deleteAccountWithFormData(request, {
            user_email: randomEmail(),
            user_password: randomPassword(),
        });
        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Path param appended to deleteAccount', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'delete',
            endpoint: 'deleteAccount',
            pathSuffix: '1',
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: Path traversal on deleteAccount', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'delete',
            endpoint: 'deleteAccount',
            pathSuffix: '../productsList',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: Swapped param values (password in email field)', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await deleteAccountApi(request, params.password!, params.email!);
        expect(responseBody.responseCode).not.toBe(200);

        await deleteAccountApi(request, params.email!, params.password!);
    });
});
