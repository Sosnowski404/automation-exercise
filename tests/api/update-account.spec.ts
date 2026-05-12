import { test, expect } from '@playwright/test';
import { createAccount, deleteAccount } from '../../api/create-account.api';
import { updateAccount, updateAccountRaw } from '../../api/update-account.api';
import { getUserDetailByEmail } from '../../api/get-user-detail.api';
import { rawRequest } from '../../api/raw-request.api';
import { generateFullAccountParams, randomName, randomEmail, randomPassword, randomFirstName, randomLastName, randomCompany, randomAddress, randomPhone } from '../../utils/helpers';

test.describe('/updateAccount endpoint tests', () => {
    test('API 13: PUT Update Account with all params should return 200', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const updatedParams = {
            ...params,
            name: randomName(),
            firstname: randomFirstName(),
            lastname: randomLastName(),
            company: randomCompany(),
            address1: randomAddress(),
            mobile_number: randomPhone(),
        };
        const responseBody = await updateAccount(request, updatedParams);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('User updated!');

        await deleteAccount(request, params.email!, params.password!);
    });

    test('API 13: Updated fields are reflected in getUserDetailByEmail', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const newFirstName = 'UpdatedFirstName';
        const newLastName = 'UpdatedLastName';
        const newCompany = 'UpdatedCompany';

        await updateAccount(request, {
            ...params,
            firstname: newFirstName,
            lastname: newLastName,
            company: newCompany,
        });

        const detail = await getUserDetailByEmail(request, params.email!);
        expect(detail.responseCode).toBe(200);
        expect(detail.user?.first_name).toBe(newFirstName);
        expect(detail.user?.last_name).toBe(newLastName);
        expect(detail.user?.company).toBe(newCompany);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('API 13: Update only name field', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const newName = 'BrandNewName';
        const responseBody = await updateAccount(request, { ...params, name: newName });

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('User updated!');

        await deleteAccount(request, params.email!, params.password!);
    });

    test('API 13: Update address fields', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await updateAccount(request, {
            ...params,
            address1: '999 New Street',
            address2: 'Apt 42',
        });

        expect(responseBody.responseCode).toBe(200);

        const detail = await getUserDetailByEmail(request, params.email!);
        expect(detail.user?.address1).toBe('999 New Street');
        expect(detail.user?.address2).toBe('Apt 42');

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Update non-existing account should not return 200', async ({ request }) => {
        const params = generateFullAccountParams();
        const responseBody = await updateAccount(request, params);

        expect(responseBody.responseCode).not.toBe(200);
    });

    test('API 13: Update with only email and password accepts partial update', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await updateAccount(request, {
            email: params.email,
            password: params.password,
        });

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.message).toBe('User updated!');

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Update without email param should return 400', async ({ request }) => {
        const params = generateFullAccountParams();
        delete params.email;
        const responseBody = await updateAccount(request, params);

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Update without password param should return 400', async ({ request }) => {
        const params = generateFullAccountParams();
        delete params.password;
        const responseBody = await updateAccount(request, params);

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: Update with no params should return 400', async ({ request }) => {
        const responseBody = await updateAccount(request, {});

        expect(responseBody.responseCode).toBe(400);
    });

    test('Negative: POST method on updateAccount should not return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'updateAccount',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: GET method on updateAccount should not return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'updateAccount',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: DELETE method on updateAccount should not return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'delete',
            endpoint: 'updateAccount',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: SQL injection in name field', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await updateAccount(request, { ...params, name: "' OR 1=1 --" });
        expect(responseBody.responseCode).toBe(200);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: XSS injection in firstname field', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await updateAccount(request, { ...params, firstname: '<script>alert(1)</script>' });
        expect(responseBody.responseCode).toBe(200);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Very long string as name', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await updateAccount(request, { ...params, name: 'a'.repeat(10000) });
        expect(responseBody.responseCode).toBe(200);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Empty string as name', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await updateAccount(request, { ...params, name: '' });
        expect(responseBody.responseCode).toBe(200);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Wrong param names', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await updateAccountRaw(request, {
            user_email: params.email!,
            user_password: params.password!,
            user_name: randomName(),
        });
        expect(responseBody.responseCode).toBe(400);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Params as query params instead of form data', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const response = await rawRequest(request, {
            method: 'put',
            endpoint: 'updateAccount',
            queryParams: { email: params.email!, password: params.password!, name: randomName() },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Path param appended to updateAccount', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'put',
            endpoint: 'updateAccount',
            pathSuffix: '1',
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: Path traversal on updateAccount', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'put',
            endpoint: 'updateAccount',
            pathSuffix: '../productsList',
        });
        const body = await response.json();
        expect(body.responseCode).not.toBe(200);
    });

    test('Negative: Update with wrong password for existing account', async ({ request }) => {
        const params = generateFullAccountParams();
        await createAccount(request, params);

        const responseBody = await updateAccount(request, { ...params, password: 'wrongpassword123' });
        expect(responseBody.responseCode).not.toBe(200);

        await deleteAccount(request, params.email!, params.password!);
    });

    test('Negative: Special characters as email in update', async ({ request }) => {
        const params = generateFullAccountParams();
        const responseBody = await updateAccount(request, { ...params, email: '!@#$%^&*()' });
        expect(responseBody.responseCode).not.toBe(200);
    });
});
