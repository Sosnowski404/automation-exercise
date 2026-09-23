# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/search-product.spec.ts >> /searchProduct endpoint tests >> Negative: Path traversal on searchProduct
- Location: tests/api/search-product.spec.ts:171:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 405
Received: undefined
```

# Test source

```ts
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
  155 |             endpoint: 'searchProduct',
  156 |             pathSuffix: '123',
  157 |         });
  158 |         expect(response.status()).not.toBe(200);
  159 |     });
  160 | 
  161 |     test('Negative: Multiple search_product values via comma', async ({ request }) => {
  162 |         const response = await rawRequest(request, {
  163 |             method: 'post',
  164 |             endpoint: 'searchProduct',
  165 |             form: { search_product: 'top,jean,tshirt' },
  166 |         });
  167 |         const body = await response.json();
  168 |         expect(body.responseCode).toBe(200);
  169 |     });
  170 | 
  171 |     test('Negative: Path traversal on searchProduct', async ({ request }) => {
  172 |         const response = await rawRequest(request, {
  173 |             method: 'post',
  174 |             endpoint: 'searchProduct',
  175 |             pathSuffix: '../productsList',
  176 |         });
  177 |         const body = await response.json();
> 178 |         expect(body.responseCode).toBe(405);
      |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  179 |     });
  180 | });
  181 | 
```