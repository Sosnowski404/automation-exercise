# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/search-product.spec.ts >> /searchProduct endpoint tests >> API 5: POST To Search Product with valid search_product param
- Location: tests/api/search-product.spec.ts:6:9

# Error details

```
Error: Unexpected fields in SearchProductResponse: [message]
```

# Test source

```ts
  1  | import { APIRequestContext } from '@playwright/test';
  2  | import { apiUrl } from '../constants/url';
  3  | 
  4  | export interface SearchProductResponse {
  5  |     responseCode: number;
  6  |     products?: Product[];
  7  |     message?: string;
  8  | }
  9  | 
  10 | export interface Product {
  11 |     id: number;
  12 |     name: string;
  13 |     price: string;
  14 |     brand: string;
  15 |     category: Category;
  16 | }
  17 | 
  18 | export interface Category {
  19 |     usertype: {
  20 |         usertype: string;
  21 |     };
  22 |     category: string;
  23 | }
  24 | 
  25 | function validateKeys(obj: Record<string, unknown>, expectedKeys: string[], context: string): void {
  26 |     const actualKeys = Object.keys(obj).sort();
  27 |     const expected = [...expectedKeys].sort();
  28 |     const extraKeys = actualKeys.filter(key => !expected.includes(key));
  29 |     if (extraKeys.length > 0) {
> 30 |         throw new Error(`Unexpected fields in ${context}: [${extraKeys.join(', ')}]`);
     |               ^ Error: Unexpected fields in SearchProductResponse: [message]
  31 |     }
  32 |     const missingKeys = expected.filter(key => !actualKeys.includes(key));
  33 |     if (missingKeys.length > 0) {
  34 |         throw new Error(`Missing fields in ${context}: [${missingKeys.join(', ')}]`);
  35 |     }
  36 | }
  37 | 
  38 | function validateProduct(product: Record<string, unknown>): void {
  39 |     validateKeys(product, ['id', 'name', 'price', 'brand', 'category'], 'Product');
  40 |     const category = product.category as Record<string, unknown>;
  41 |     validateKeys(category, ['usertype', 'category'], 'Category');
  42 |     validateKeys(category.usertype as Record<string, unknown>, ['usertype'], 'Usertype');
  43 | }
  44 | 
  45 | function validateSearchProductResponse(body: SearchProductResponse): void {
  46 |     validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'products'], 'SearchProductResponse');
  47 |     if (body.products) {
  48 |         body.products.forEach(product => validateProduct(product as unknown as Record<string, unknown>));
  49 |     }
  50 | }
  51 | 
  52 | function validateErrorResponse(body: SearchProductResponse): void {
  53 |     validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'message'], 'SearchProductErrorResponse');
  54 | }
  55 | 
  56 | export async function searchProduct(request: APIRequestContext, searchTerm: string): Promise<SearchProductResponse> {
  57 |     const response = await request.post(`${apiUrl}/searchProduct`, {
  58 |         form: { search_product: searchTerm },
  59 |     });
  60 |     const body = await response.json();
  61 |     validateSearchProductResponse(body);
  62 |     return body;
  63 | }
  64 | 
  65 | export async function searchProductWithoutParam(request: APIRequestContext): Promise<SearchProductResponse> {
  66 |     const response = await request.post(`${apiUrl}/searchProduct`);
  67 |     const body = await response.json();
  68 |     validateErrorResponse(body);
  69 |     return body;
  70 | }
  71 | 
  72 | export async function searchProductWithFormData(request: APIRequestContext, formData: Record<string, string>): Promise<SearchProductResponse> {
  73 |     const response = await request.post(`${apiUrl}/searchProduct`, {
  74 |         form: formData,
  75 |     });
  76 |     return response.json();
  77 | }
  78 | 
  79 | export async function getSearchProduct(request: APIRequestContext): Promise<SearchProductResponse> {
  80 |     const response = await request.get(`${apiUrl}/searchProduct`);
  81 |     return response.json();
  82 | }
  83 | 
  84 | export async function deleteSearchProduct(request: APIRequestContext): Promise<SearchProductResponse> {
  85 |     const response = await request.delete(`${apiUrl}/searchProduct`);
  86 |     return response.json();
  87 | }
  88 | 
  89 | export async function putSearchProduct(request: APIRequestContext): Promise<SearchProductResponse> {
  90 |     const response = await request.put(`${apiUrl}/searchProduct`);
  91 |     return response.json();
  92 | }
  93 | 
```