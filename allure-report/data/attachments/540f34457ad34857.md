# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/brands-list.spec.ts >> /brandsList endpoint tests >> API 3: PUT To All Brands List should return 405
- Location: tests/api/brands-list.spec.ts:25:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 405
Received: undefined
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { getBrandsList, postToBrandsList, deleteToBrandsList, putToBrandsList } from '../../api/brands.api';
  3  | import { rawRequest } from '../../api/raw-request.api';
  4  | 
  5  | test.describe('/brandsList endpoint tests', () => {
  6  |     test('API 3: Get All Brands List should return 200 and brands array', async ({ request }) => {
  7  |         const responseBody = await getBrandsList(request);
  8  | 
  9  |         expect(responseBody.responseCode).toBe(200);
  10 |         expect(responseBody.brands.length).toBeGreaterThan(0);
  11 |     });
  12 | 
  13 |     test('API 3: POST To All Brands List should return 405', async ({ request }) => {
  14 |         const responseBody = await postToBrandsList(request);
  15 | 
  16 |         expect(responseBody.responseCode).toBe(405);
  17 |     });
  18 | 
  19 |     test('API 3: DELETE To All Brands List should return 405', async ({ request }) => {
  20 |         const responseBody = await deleteToBrandsList(request);
  21 | 
  22 |         expect(responseBody.responseCode).toBe(405);
  23 |     });
  24 | 
  25 |     test('API 3: PUT To All Brands List should return 405', async ({ request }) => {
  26 |         const responseBody = await putToBrandsList(request);
  27 | 
> 28 |         expect(responseBody.responseCode).toBe(405);
     |                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  29 |     });
  30 | 
  31 |     test('Negative: Random query params should be ignored and return 200', async ({ request }) => {
  32 |         const response = await rawRequest(request, {
  33 |             method: 'get',
  34 |             endpoint: 'brandsList',
  35 |             queryParams: { brand_id: '999', limit: '10', offset: '0' },
  36 |         });
  37 |         const body = await response.json();
  38 |         expect(body.responseCode).toBe(200);
  39 |     });
  40 | 
  41 |     test('Negative: SQL injection in query param', async ({ request }) => {
  42 |         const response = await rawRequest(request, {
  43 |             method: 'get',
  44 |             endpoint: 'brandsList',
  45 |             queryParams: { id: "1; DROP TABLE brands--" },
  46 |         });
  47 |         const body = await response.json();
  48 |         expect(body.responseCode).toBe(200);
  49 |     });
  50 | 
  51 |     test('Negative: Path traversal attempt', async ({ request }) => {
  52 |         const response = await rawRequest(request, {
  53 |             method: 'get',
  54 |             endpoint: 'brandsList',
  55 |             pathSuffix: '../../etc/passwd',
  56 |         });
  57 |         expect(response.status()).not.toBe(200);
  58 |     });
  59 | 
  60 |     test('Negative: Numeric path param appended', async ({ request }) => {
  61 |         const response = await rawRequest(request, {
  62 |             method: 'get',
  63 |             endpoint: 'brandsList',
  64 |             pathSuffix: '42',
  65 |         });
  66 |         expect(response.status()).not.toBe(200);
  67 |     });
  68 | 
  69 |     test('Negative: POST with unexpected form data', async ({ request }) => {
  70 |         const response = await rawRequest(request, {
  71 |             method: 'post',
  72 |             endpoint: 'brandsList',
  73 |             form: { brand_name: 'FakeBrand', action: 'create' },
  74 |         });
  75 |         const body = await response.json();
  76 |         expect(body.responseCode).toBe(405);
  77 |     });
  78 | 
  79 |     test('Negative: GET with XSS in query params', async ({ request }) => {
  80 |         const response = await rawRequest(request, {
  81 |             method: 'get',
  82 |             endpoint: 'brandsList',
  83 |             queryParams: { callback: 'javascript:alert(1)', name: '<img onerror=alert(1) src=x>' },
  84 |         });
  85 |         const body = await response.json();
  86 |         expect(body.responseCode).toBe(200);
  87 |     });
  88 | });
  89 | 
```