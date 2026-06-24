# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/products-list.spec.ts >> /productsList endpoint tests >> Negative: POST with unexpected form data
- Location: tests/api/products-list.spec.ts:78:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 405
Received: undefined
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { getProductsList, postToProductsList, deleteToProductsList, putToProductsList } from '../../api/products.api';
  3   | import { rawRequest } from '../../api/raw-request.api';
  4   | 
  5   | test.describe('/productsList endpoint tests', () => {
  6   |     test('API 1: Get All Products List should return 200 and products array', async ({ request }) => {
  7   |         const responseBody = await getProductsList(request);
  8   | 
  9   |         expect(responseBody.responseCode).toBe(200);
  10  |         expect(responseBody.products.length).toBeGreaterThan(0);
  11  |     });
  12  | 
  13  |     test('API 2: POST To All Products List should return 405', async ({ request }) => {
  14  |         const responseBody = await postToProductsList(request);
  15  | 
  16  |         expect(responseBody.responseCode).toBe(405);
  17  |     });
  18  | 
  19  |     test('API 3: DELETE To All Products List should return 405', async ({ request }) => {
  20  |         const responseBody = await deleteToProductsList(request);
  21  | 
  22  |         expect(responseBody.responseCode).toBe(405);
  23  |     });
  24  | 
  25  |     test('API 4: PUT To All Products List should return 405', async ({ request }) => {
  26  |         const responseBody = await putToProductsList(request);
  27  | 
  28  |         expect(responseBody.responseCode).toBe(405);
  29  |     });
  30  | 
  31  |     test('Negative: Random query params should be ignored and return 200', async ({ request }) => {
  32  |         const response = await rawRequest(request, {
  33  |             method: 'get',
  34  |             endpoint: 'productsList',
  35  |             queryParams: { foo: 'bar', id: '999', sort: 'desc' },
  36  |         });
  37  |         const body = await response.json();
  38  |         expect(body.responseCode).toBe(200);
  39  |     });
  40  | 
  41  |     test('Negative: SQL injection in query param', async ({ request }) => {
  42  |         const response = await rawRequest(request, {
  43  |             method: 'get',
  44  |             endpoint: 'productsList',
  45  |             queryParams: { id: "' OR 1=1 --" },
  46  |         });
  47  |         const body = await response.json();
  48  |         expect(body.responseCode).toBe(200);
  49  |     });
  50  | 
  51  |     test('Negative: Path traversal attempt', async ({ request }) => {
  52  |         const response = await rawRequest(request, {
  53  |             method: 'get',
  54  |             endpoint: 'productsList',
  55  |             pathSuffix: '../users',
  56  |         });
  57  |         expect(response.status()).not.toBe(200);
  58  |     });
  59  | 
  60  |     test('Negative: Numeric path param appended', async ({ request }) => {
  61  |         const response = await rawRequest(request, {
  62  |             method: 'get',
  63  |             endpoint: 'productsList',
  64  |             pathSuffix: '1',
  65  |         });
  66  |         expect(response.status()).not.toBe(200);
  67  |     });
  68  | 
  69  |     test('Negative: Random string path param', async ({ request }) => {
  70  |         const response = await rawRequest(request, {
  71  |             method: 'get',
  72  |             endpoint: 'productsList',
  73  |             pathSuffix: 'randomString',
  74  |         });
  75  |         expect(response.status()).not.toBe(200);
  76  |     });
  77  | 
  78  |     test('Negative: POST with unexpected form data', async ({ request }) => {
  79  |         const response = await rawRequest(request, {
  80  |             method: 'post',
  81  |             endpoint: 'productsList',
  82  |             form: { id: '1', name: 'test', action: 'delete' },
  83  |         });
  84  |         const body = await response.json();
> 85  |         expect(body.responseCode).toBe(405);
      |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  86  |     });
  87  | 
  88  |     test('Negative: GET with empty query param values', async ({ request }) => {
  89  |         const response = await rawRequest(request, {
  90  |             method: 'get',
  91  |             endpoint: 'productsList',
  92  |             queryParams: { id: '', name: '', category: '' },
  93  |         });
  94  |         const body = await response.json();
  95  |         expect(body.responseCode).toBe(200);
  96  |     });
  97  | 
  98  |     test('Negative: GET with special chars in query params', async ({ request }) => {
  99  |         const response = await rawRequest(request, {
  100 |             method: 'get',
  101 |             endpoint: 'productsList',
  102 |             queryParams: { filter: '<script>alert(1)</script>', sort: '!@#$%' },
  103 |         });
  104 |         const body = await response.json();
  105 |         expect(body.responseCode).toBe(200);
  106 |     });
  107 | });
  108 | 
```