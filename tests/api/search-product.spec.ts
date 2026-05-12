import { test, expect } from '@playwright/test';
import { searchProduct, searchProductWithoutParam, searchProductWithFormData, getSearchProduct, deleteSearchProduct, putSearchProduct } from '../../api/search-product.api';
import { rawRequest } from '../../api/raw-request.api';

test.describe('/searchProduct endpoint tests', () => {
    test('API 5: POST To Search Product with valid search_product param', async ({ request }) => {
        const responseBody = await searchProduct(request, 'top');

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products!.length).toBeGreaterThan(0);
    });

    test('API 5: Search returns products for "tshirt"', async ({ request }) => {
        const responseBody = await searchProduct(request, 'tshirt');

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products!.length).toBeGreaterThan(0);
    });

    test('API 5: Search returns products for "jean"', async ({ request }) => {
        const responseBody = await searchProduct(request, 'jean');

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products!.length).toBeGreaterThan(0);
    });

    test('API 5: Search with non-existing product returns empty array', async ({ request }) => {
        const responseBody = await searchProduct(request, 'xyznonexistent123');

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products!.length).toBe(0);
    });

    test('API 6: POST To Search Product without search_product param should return 400', async ({ request }) => {
        const responseBody = await searchProductWithoutParam(request);

        expect(responseBody.responseCode).toBe(400);
        expect(responseBody.message).toBe('Bad request, search_product parameter is missing in POST request.');
    });

    test('Negative: GET method on searchProduct should return 405', async ({ request }) => {
        const responseBody = await getSearchProduct(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('Negative: DELETE method on searchProduct should return 405', async ({ request }) => {
        const responseBody = await deleteSearchProduct(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('Negative: PUT method on searchProduct should return 405', async ({ request }) => {
        const responseBody = await putSearchProduct(request);

        expect(responseBody.responseCode).toBe(405);
    });

    test('Negative: Numeric value as search_product param', async ({ request }) => {
        const responseBody = await searchProduct(request, '12345');

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products).toBeDefined();
    });

    test('Negative: Empty string as search_product param', async ({ request }) => {
        const responseBody = await searchProduct(request, '');

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products).toBeDefined();
    });

    test('Negative: Special characters as search_product param', async ({ request }) => {
        const responseBody = await searchProduct(request, '!@#$%^&*()');

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products).toBeDefined();
    });

    test('Negative: Very long string as search_product param', async ({ request }) => {
        const longString = 'a'.repeat(10000);
        const responseBody = await searchProduct(request, longString);

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products).toBeDefined();
    });

    test('Negative: SQL injection attempt as search_product param', async ({ request }) => {
        const responseBody = await searchProduct(request, "' OR 1=1 --");

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products).toBeDefined();
    });

    test('Negative: HTML/script injection as search_product param', async ({ request }) => {
        const responseBody = await searchProduct(request, '<script>alert(1)</script>');

        expect(responseBody.responseCode).toBe(200);
        expect(responseBody.products).toBeDefined();
    });

    test('Negative: Extra unknown form params alongside search_product', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'searchProduct',
            form: { search_product: 'top', extra_param: 'should_be_ignored', limit: '5' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
    });

    test('Negative: Wrong param name instead of search_product', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'searchProduct',
            form: { search: 'top' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);
    });

    test('Negative: search_product as query param instead of form data', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'searchProduct',
            queryParams: { search_product: 'top' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);
    });

    test('Negative: Path param appended to searchProduct', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'searchProduct',
            pathSuffix: 'top',
            form: { search_product: 'top' },
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: SQL injection in form param name', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'searchProduct',
            form: { "search_product' OR '1'='1": 'top' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(400);
    });

    test('Negative: Numeric path param on searchProduct', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'searchProduct',
            pathSuffix: '123',
        });
        expect(response.status()).not.toBe(200);
    });

    test('Negative: Multiple search_product values via comma', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'searchProduct',
            form: { search_product: 'top,jean,tshirt' },
        });
        const body = await response.json();
        expect(body.responseCode).toBe(200);
    });

    test('Negative: Path traversal on searchProduct', async ({ request }) => {
        const response = await rawRequest(request, {
            method: 'post',
            endpoint: 'searchProduct',
            pathSuffix: '../productsList',
        });
        const body = await response.json();
        expect(body.responseCode).toBe(405);
    });
});
