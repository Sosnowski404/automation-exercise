# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> /searchProduct endpoint tests >> API 5: Search returns matching products for "tshirt"
- Location: tests\api.spec.ts:68:9

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "tshirt"
Received string:    "pure cotton v-neck t-shirt"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { getProductsList, postToProductsList, deleteToProductsList, putToProductsList } from '../api/products.api';
  3   | import { getBrandsList, postToBrandsList, deleteToBrandsList, putToBrandsList } from '../api/brands.api';
  4   | import { searchProduct, searchProductWithoutParam, searchProductWithFormData, getSearchProduct, deleteSearchProduct, putSearchProduct } from '../api/search-product.api';
  5   | 
  6   | test.describe('/productsList endpoint tests', () => {
  7   |     test('API 1: Get All Products List should return 200 and products array', async ({ request }) => {
  8   |         const responseBody = await getProductsList(request);
  9   | 
  10  |         expect(responseBody.responseCode).toBe(200);
  11  |         expect(responseBody.products.length).toBeGreaterThan(0);
  12  |     });
  13  | 
  14  |     test('API 2: POST To All Products List should return 405', async ({ request }) => {
  15  |         const responseBody = await postToProductsList(request);
  16  | 
  17  |         expect(responseBody.responseCode).toBe(405);
  18  |     });
  19  | 
  20  |     test('API 3: DELETE To All Products List should return 405', async ({ request }) => {
  21  |         const responseBody = await deleteToProductsList(request);
  22  | 
  23  |         expect(responseBody.responseCode).toBe(405);
  24  |     });
  25  | 
  26  |     test('API 4: PUT To All Products List should return 405', async ({ request }) => {
  27  |         const responseBody = await putToProductsList(request);
  28  | 
  29  |         expect(responseBody.responseCode).toBe(405);
  30  |     });
  31  | });
  32  | 
  33  | test.describe('/brandsList endpoint tests', () => {
  34  |     test('API 3: Get All Brands List should return 200 and brands array', async ({ request }) => {
  35  |         const responseBody = await getBrandsList(request);
  36  | 
  37  |         expect(responseBody.responseCode).toBe(200);
  38  |         expect(responseBody.brands.length).toBeGreaterThan(0);
  39  |     });
  40  | 
  41  |     test('API 3: POST To All Brands List should return 405', async ({ request }) => {
  42  |         const responseBody = await postToBrandsList(request);
  43  | 
  44  |         expect(responseBody.responseCode).toBe(405);
  45  |     });
  46  | 
  47  |     test('API 3: DELETE To All Brands List should return 405', async ({ request }) => {
  48  |         const responseBody = await deleteToBrandsList(request);
  49  | 
  50  |         expect(responseBody.responseCode).toBe(405);
  51  |     });
  52  | 
  53  |     test('API 3: PUT To All Brands List should return 405', async ({ request }) => {
  54  |         const responseBody = await putToBrandsList(request);
  55  | 
  56  |         expect(responseBody.responseCode).toBe(405);
  57  |     });
  58  | });
  59  | 
  60  | test.describe('/searchProduct endpoint tests', () => {
  61  |     test('API 5: POST To Search Product with valid search_product param', async ({ request }) => {
  62  |         const responseBody = await searchProduct(request, 'top');
  63  | 
  64  |         expect(responseBody.responseCode).toBe(200);
  65  |         expect(responseBody.products!.length).toBeGreaterThan(0);
  66  |     });
  67  | 
  68  |     test('API 5: Search returns matching products for "tshirt"', async ({ request }) => {
  69  |         const responseBody = await searchProduct(request, 'tshirt');
  70  | 
  71  |         expect(responseBody.responseCode).toBe(200);
  72  |         expect(responseBody.products!.length).toBeGreaterThan(0);
  73  |         for (const product of responseBody.products!) {
> 74  |             expect(product.name.toLowerCase()).toContain('tshirt');
      |                                                ^ Error: expect(received).toContain(expected) // indexOf
  75  |         }
  76  |     });
  77  | 
  78  |     test('API 5: Search returns matching products for "jean"', async ({ request }) => {
  79  |         const responseBody = await searchProduct(request, 'jean');
  80  | 
  81  |         expect(responseBody.responseCode).toBe(200);
  82  |         expect(responseBody.products!.length).toBeGreaterThan(0);
  83  |         for (const product of responseBody.products!) {
  84  |             expect(product.name.toLowerCase()).toContain('jean');
  85  |         }
  86  |     });
  87  | 
  88  |     test('API 5: Search with non-existing product returns empty array', async ({ request }) => {
  89  |         const responseBody = await searchProduct(request, 'xyznonexistent123');
  90  | 
  91  |         expect(responseBody.responseCode).toBe(200);
  92  |         expect(responseBody.products!.length).toBe(0);
  93  |     });
  94  | 
  95  |     test('API 6: POST To Search Product without search_product param should return 400', async ({ request }) => {
  96  |         const responseBody = await searchProductWithoutParam(request);
  97  | 
  98  |         expect(responseBody.responseCode).toBe(400);
  99  |         expect(responseBody.message).toBe('Bad request, search_product parameter is missing in POST request.');
  100 |     });
  101 | 
  102 |     test('Negative: GET method on searchProduct should return 405', async ({ request }) => {
  103 |         const responseBody = await getSearchProduct(request);
  104 | 
  105 |         expect(responseBody.responseCode).toBe(405);
  106 |     });
  107 | 
  108 |     test('Negative: DELETE method on searchProduct should return 405', async ({ request }) => {
  109 |         const responseBody = await deleteSearchProduct(request);
  110 | 
  111 |         expect(responseBody.responseCode).toBe(405);
  112 |     });
  113 | 
  114 |     test('Negative: PUT method on searchProduct should return 405', async ({ request }) => {
  115 |         const responseBody = await putSearchProduct(request);
  116 | 
  117 |         expect(responseBody.responseCode).toBe(405);
  118 |     });
  119 | 
  120 |     test('Negative: Numeric value as search_product param', async ({ request }) => {
  121 |         const responseBody = await searchProduct(request, '12345');
  122 | 
  123 |         expect(responseBody.responseCode).toBe(200);
  124 |         expect(responseBody.products).toBeDefined();
  125 |     });
  126 | 
  127 |     test('Negative: Empty string as search_product param', async ({ request }) => {
  128 |         const responseBody = await searchProduct(request, '');
  129 | 
  130 |         expect(responseBody.responseCode).toBe(200);
  131 |         expect(responseBody.products).toBeDefined();
  132 |     });
  133 | 
  134 |     test('Negative: Special characters as search_product param', async ({ request }) => {
  135 |         const responseBody = await searchProduct(request, '!@#$%^&*()');
  136 | 
  137 |         expect(responseBody.responseCode).toBe(200);
  138 |         expect(responseBody.products).toBeDefined();
  139 |     });
  140 | 
  141 |     test('Negative: Very long string as search_product param', async ({ request }) => {
  142 |         const longString = 'a'.repeat(10000);
  143 |         const responseBody = await searchProduct(request, longString);
  144 | 
  145 |         expect(responseBody.responseCode).toBe(200);
  146 |         expect(responseBody.products).toBeDefined();
  147 |     });
  148 | 
  149 |     test('Negative: SQL injection attempt as search_product param', async ({ request }) => {
  150 |         const responseBody = await searchProduct(request, "' OR 1=1 --");
  151 | 
  152 |         expect(responseBody.responseCode).toBe(200);
  153 |         expect(responseBody.products).toBeDefined();
  154 |     });
  155 | 
  156 |     test('Negative: HTML/script injection as search_product param', async ({ request }) => {
  157 |         const responseBody = await searchProduct(request, '<script>alert(1)</script>');
  158 | 
  159 |         expect(responseBody.responseCode).toBe(200);
  160 |         expect(responseBody.products).toBeDefined();
  161 |     });
  162 | });
  163 | 
```