import { test, expect } from '@playwright/test';
import { getProductsList, postToProductsList, deleteToProductsList, putToProductsList } from '../../api/products.api';
import { rawRequest } from '../../api/raw-request.api';

test.describe('/productsList endpoint tests', () => {
    test('API 1: Get All Products List should return 200 and products array', async ({ request }) => {
        const responseBody = await getProductsList(request);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products.length).toBeGreaterThan(0);
    });

    test('API 2: POST To All Products List should return 405', async ({ request }) => {
        const responseBody = await postToProductsList(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('API 3: DELETE To All Products List should return 405', async ({ request }) => {
        const responseBody = await deleteToProductsList(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('API 4: PUT To All Products List should return 405', async ({ request }) => {
        const responseBody = await putToProductsList(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('Negative: Random query params should be ignored and return 200', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'productsList',
            queryParams: { foo: 'bar', id: '999', sort: 'desc' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
    });

    test('Negative: SQL injection in query param', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'productsList',
            queryParams: { id: "' OR 1=1 --" },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
    });

    test('Negative: Path traversal attempt', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'productsList',
            pathSuffix: '../users',
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: Numeric path param appended', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'productsList',
            pathSuffix: '1',
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: Random string path param', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'productsList',
            pathSuffix: 'randomString',
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: POST with unexpected form data', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'productsList',
            form: { id: '1', name: 'test', action: 'delete' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(405);
    });

    test('Negative: GET with empty query param values', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'productsList',
            queryParams: { id: '', name: '', category: '' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
    });

    test('Negative: GET with special chars in query params', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'get',
            endpoint: 'productsList',
            queryParams: { filter: '<script>alert(1)</script>', sort: '!@#$%' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
    });
});
