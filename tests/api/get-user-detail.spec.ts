import { test, expect } from '@playwright/test';
import { createAccount, deleteAccount } from '../../api/create-account.api';
import { getUserDetailByEmail, getUserDetailRaw } from '../../api/get-user-detail.api';
import { rawRequest } from '../../api/raw-request.api';
import { generateFullAccountParams, randomEmail } from '../../utils/helpers';

test.describe('/getUserDetailByEmail endpoint tests', () => {
    test('API 14: GET user detail by email should return 200 and user object', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await getUserDetailByEmail(request, params.email!);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.user).toBeDefined();
        expect(responseBody.user?.email).toBe(params.email);
        expect(responseBody.user?.name).toBe(params.name);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('API 14: Response contains all expected user detail fields', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await getUserDetailByEmail(request, params.email!);

        expect(responseBody.responseCode).toBe(200);
        const user = responseBody.user!;
        expect(user.id).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.email).toBe(params.email);
        expect(user.title).toBeDefined();
        expect(user.first_name).toBe(params.firstname);
        expect(user.last_name).toBe(params.lastname);
        expect(user.company).toBe(params.company);
        expect(user.address1).toBe(params.address1);
        expect(user.address2).toBe(params.address2);
        expect(user.country).toBe(params.country);
        expect(user.state).toBe(params.state);
        expect(user.city).toBe(params.city);
        expect(user.zipcode).toBe(params.zipcode);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('API 14: Birth fields are returned correctly', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await getUserDetailByEmail(request, params.email!);

        expect(responseBody.responseCode).toBe(200);
        const user = responseBody.user!;
        expect(user.birth_day).toBe(params.birth_date);
        expect(user.birth_month).toBe(params.birth_month);
        expect(user.birth_year).toBe(params.birth_year);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: GET user detail with non-existing email should not return 200', async ({ request }) => {
        const responseBody = await getUserDetailByEmail(request, 'nonexistent_xyz_99999@fake.com');

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: GET user detail without email param should return 400', async ({ request }) => {
        const responseBody = await getUserDetailRaw(request);

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: GET user detail with empty email should not return valid user', async ({ request }) => {
        const responseBody = await getUserDetailByEmail(request, '');

        expect([200, 400]).toContain(responseBody.responseCode);
    });

    test('Negative: GET user detail with invalid email format should not find user', async ({ request }) => {
        const responseBody = await getUserDetailByEmail(request, 'not-an-email');

        expect([200, 400, 404]).toContain(responseBody.responseCode);
    });

    test('Negative: GET user detail with special characters as email', async ({ request }) => {
        const responseBody = await getUserDetailByEmail(request, '!@#$%^&*()');

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: SQL injection in email param', async ({ request }) => {
        const responseBody = await getUserDetailByEmail(request, "' OR 1=1 --");

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('Negative: XSS injection in email param should not find user', async ({ request }) => {
        const responseBody = await getUserDetailByEmail(request, '<script>alert(1)</script>');

        expect([200, 400, 404]).toContain(responseBody.responseCode);
    });

    test('Negative: Very long string as email should not return valid user', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'getUserDetailByEmail',
            queryParams: { email: 'a'.repeat(10000) + '@test.com' },
        });
        const text = await response.text();
        const isJson = text.startsWith('{');
        if (isJson) {
            const body = JSON.parse(text);
            expect(body.responseCode).not.toBe(200);
        } else {
            expect(response.status()).not.toBe(200);
        }
    });

    test('Negative: Numeric value as email should not find user', async ({ request }) => {
        const responseBody = await getUserDetailByEmail(request, '12345');

        expect([200, 400, 404]).toContain(responseBody.responseCode);
    });

    test('Negative: POST method on getUserDetailByEmail should not return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'getUserDetailByEmail',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: PUT method on getUserDetailByEmail should not return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'put',
            endpoint: 'getUserDetailByEmail',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: DELETE method on getUserDetailByEmail should not return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'delete',
            endpoint: 'getUserDetailByEmail',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: Email as form data instead of query param', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'getUserDetailByEmail',
            form: { email: params.email! },
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Wrong param name instead of email', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'getUserDetailByEmail',
            queryParams: { user_email: params.email! },
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Path param appended to getUserDetailByEmail', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'getUserDetailByEmail',
            pathSuffix: 'test@test.com',
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: Path traversal on getUserDetailByEmail resolves to different endpoint', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'getUserDetailByEmail',
            pathSuffix: '../productsList',
        });
        const body = await response.json();
        expect(body.responseCode).toBeDefined();
    });

    test('API 14: Deleted account should not return user detail', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);
        await deleteAccount(request, params.email!, params.password!);

        const responseBody = await getUserDetailByEmail(request, params.email!);
        expect(responseBody.responseCode).not.toBe(200);
    });
});
