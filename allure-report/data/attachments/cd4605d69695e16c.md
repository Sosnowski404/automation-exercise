# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/search-product.spec.ts >> /searchProduct endpoint tests >> Negative: PUT method on searchProduct should return 405
- Location: tests/api/search-product.spec.ts:53:9

# Error details

```
SyntaxError: Unexpected token '<', "


<!DOCTYPE "... is not valid JSON
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { searchProduct, searchProductWithoutParam, searchProductWithFormData, getSearchProduct, deleteSearchProduct, putSearchProduct } from '../../api/search-product.api';
  3   | import { rawRequest } from '../../api/raw-request.api';
  4   | 
  5   | test.describe('/searchProduct endpoint tests', () => {
  6   |     test('API 5: POST To Search Product with valid search_product param', async ({ request }) => {
  7   |         const responseBody = await searchProduct(request, 'top');
  8   | 
  9   |         expect(responseBody.responseCode).toBe(200);
  10  |         expect(responseBody.products!.length).toBeGreaterThan(0);
  11  |     });
  12  | 
  13  |     test('API 5: Search returns products for "tshirt"', async ({ request }) => {
  14  |         const responseBody = await searchProduct(request, 'tshirt');
  15  | 
  16  |         expect(responseBody.responseCode).toBe(200);
  17  |         expect(responseBody.products!.length).toBeGreaterThan(0);
  18  |     });
  19  | 
  20  |     test('API 5: Search returns products for "jean"', async ({ request }) => {
  21  |         const responseBody = await searchProduct(request, 'jean');
  22  | 
  23  |         expect(responseBody.responseCode).toBe(200);
  24  |         expect(responseBody.products!.length).toBeGreaterThan(0);
  25  |     });
  26  | 
  27  |     test('API 5: Search with non-existing product returns empty array', async ({ request }) => {
  28  |         const responseBody = await searchProduct(request, 'xyznonexistent123');
  29  | 
  30  |         expect(responseBody.responseCode).toBe(200);
  31  |         expect(responseBody.products!.length).toBe(0);
  32  |     });
  33  | 
  34  |     test('API 6: POST To Search Product without search_product param should return 400', async ({ request }) => {
  35  |         const responseBody = await searchProductWithoutParam(request);
  36  | 
  37  |         expect(responseBody.responseCode).toBe(400);
  38  |         expect(responseBody.message).toBe('Bad request, search_product parameter is missing in POST request.');
  39  |     });
  40  | 
  41  |     test('Negative: GET method on searchProduct should return 405', async ({ request }) => {
  42  |         const responseBody = await getSearchProduct(request);
  43  | 
  44  |         expect(responseBody.responseCode).toBe(405);
  45  |     });
  46  | 
  47  |     test('Negative: DELETE method on searchProduct should return 405', async ({ request }) => {
  48  |         const responseBody = await deleteSearchProduct(request);
  49  | 
  50  |         expect(responseBody.responseCode).toBe(405);
  51  |     });
  52  | 
  53  |     test('Negative: PUT method on searchProduct should return 405', async ({ request }) => {
> 54  |         const responseBody = await putSearchProduct(request);
      |                              ^ SyntaxError: Unexpected token '<', "
  55  | 
  56  |         expect(responseBody.responseCode).toBe(405);
  57  |     });
  58  | 
  59  |     test('Negative: Numeric value as search_product param', async ({ request }) => {
  60  |         const responseBody = await searchProduct(request, '12345');
  61  | 
  62  |         expect(responseBody.responseCode).toBe(200);
  63  |         expect(responseBody.products).toBeDefined();
  64  |     });
  65  | 
  66  |     test('Negative: Empty string as search_product param', async ({ request }) => {
  67  |         const responseBody = await searchProduct(request, '');
  68  | 
  69  |         expect(responseBody.responseCode).toBe(200);
  70  |         expect(responseBody.products).toBeDefined();
  71  |     });
  72  | 
  73  |     test('Negative: Special characters as search_product param', async ({ request }) => {
  74  |         const responseBody = await searchProduct(request, '!@#$%^&*()');
  75  | 
  76  |         expect(responseBody.responseCode).toBe(200);
  77  |         expect(responseBody.products).toBeDefined();
  78  |     });
  79  | 
  80  |     test('Negative: Very long string as search_product param', async ({ request }) => {
  81  |         const longString = 'a'.repeat(10000);
  82  |         const responseBody = await searchProduct(request, longString);
  83  | 
  84  |         expect(responseBody.responseCode).toBe(200);
  85  |         expect(responseBody.products).toBeDefined();
  86  |     });
  87  | 
  88  |     test('Negative: SQL injection attempt as search_product param', async ({ request }) => {
  89  |         const responseBody = await searchProduct(request, "' OR 1=1 --");
  90  | 
  91  |         expect(responseBody.responseCode).toBe(200);
  92  |         expect(responseBody.products).toBeDefined();
  93  |     });
  94  | 
  95  |     test('Negative: HTML/script injection as search_product param', async ({ request }) => {
  96  |         const responseBody = await searchProduct(request, '<script>alert(1)</script>');
  97  | 
  98  |         expect(responseBody.responseCode).toBe(200);
  99  |         expect(responseBody.products).toBeDefined();
  100 |     });
  101 | 
  102 |     test('Negative: Extra unknown form params alongside search_product', async ({ request }) => {
  103 |         const response = await rawRequest(request, {
  104 |             method: 'post',
  105 |             endpoint: 'searchProduct',
  106 |             form: { search_product: 'top', extra_param: 'should_be_ignored', limit: '5' },
  107 |         });
  108 |         const body = await response.json();
  109 |         expect(body.responseCode).toBe(200);
  110 |     });
  111 | 
  112 |     test('Negative: Wrong param name instead of search_product', async ({ request }) => {
  113 |         const response = await rawRequest(request, {
  114 |             method: 'post',
  115 |             endpoint: 'searchProduct',
  116 |             form: { search: 'top' },
  117 |         });
  118 |         const body = await response.json();
  119 |         expect(body.responseCode).toBe(400);
  120 |     });
  121 | 
  122 |     test('Negative: search_product as query param instead of form data', async ({ request }) => {
  123 |         const response = await rawRequest(request, {
  124 |             method: 'post',
  125 |             endpoint: 'searchProduct',
  126 |             queryParams: { search_product: 'top' },
  127 |         });
  128 |         const body = await response.json();
  129 |         expect(body.responseCode).toBe(400);
  130 |     });
  131 | 
  132 |     test('Negative: Path param appended to searchProduct', async ({ request }) => {
  133 |         const response = await rawRequest(request, {
  134 |             method: 'post',
  135 |             endpoint: 'searchProduct',
  136 |             pathSuffix: 'top',
  137 |             form: { search_product: 'top' },
  138 |         });
  139 |         expect(response.status()).not.toBe(200);
  140 |     });
  141 | 
  142 |     test('Negative: SQL injection in form param name', async ({ request }) => {
  143 |         const response = await rawRequest(request, {
  144 |             method: 'post',
  145 |             endpoint: 'searchProduct',
  146 |             form: { "search_product' OR '1'='1": 'top' },
  147 |         });
  148 |         const body = await response.json();
  149 |         expect(body.responseCode).toBe(400);
  150 |     });
  151 | 
  152 |     test('Negative: Numeric path param on searchProduct', async ({ request }) => {
  153 |         const response = await rawRequest(request, {
  154 |             method: 'post',
```