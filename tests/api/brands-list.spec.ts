import { test, expect } from '@playwright/test';
import { getBrandsList, postToBrandsList, deleteToBrandsList, putToBrandsList } from '../../api/brands.api';
import { rawRequest } from '../../api/raw-request.api';

test.describe('/brandsList endpoint tests', () => {
    test('API 3: Get All Brands List should return 200 and brands array', async ({ request }) => {
        const responseBody = await getBrandsList(request);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.brands.length).toBeGreaterThan(0);
    });

    test('API 3: POST To All Brands List should return 405', async ({ request }) => {
        const responseBody = await postToBrandsList(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('API 3: DELETE To All Brands List should return 405', async ({ request }) => {
        const responseBody = await deleteToBrandsList(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('API 3: PUT To All Brands List should return 405', async ({ request }) => {
        const responseBody = await putToBrandsList(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('Negative: Random query params should be ignored and return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'brandsList',
            queryParams: { brand_id: '999', limit: '10', offset: '0' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
    });

    test('Negative: SQL injection in query param', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'brandsList',
            queryParams: { id: "1; DROP TABLE brands--" },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
    });

    test('Negative: Path traversal attempt', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'brandsList',
            pathSuffix: '../../etc/passwd',
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: Numeric path param appended', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'brandsList',
            pathSuffix: '42',
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: POST with unexpected form data', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'brandsList',
            form: { brand_name: 'FakeBrand', action: 'create' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(405);
    });

    test('Negative: GET with XSS in query params', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'brandsList',
            queryParams: { callback: 'javascript:alert(1)', name: '<img onerror=alert(1) src=x>' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
    });
});
