# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/products-list.spec.ts >> /productsList endpoint tests >> API 1: Get All Products List should return 200 and products array
- Location: tests/api/products-list.spec.ts:6:9

# Error details

```
Error: Unexpected fields in ProductsListResponse: [message]
```

# Test source

```ts
  1  | import { APIRequestContext } from '@playwright/test';
  2  | import { apiUrl } from '../constants/url';
  3  | 
  4  | export interface Category {
  5  |     usertype: {
  6  |         usertype: string;
  7  |     };
  8  |     category: string;
  9  | }
  10 | 
  11 | export interface Product {
  12 |     id: number;
  13 |     name: string;
  14 |     price: string;
  15 |     brand: string;
  16 |     category: Category;
  17 | }
  18 | 
  19 | export interface ProductsListResponse {
  20 |     responseCode: number;
  21 |     products: Product[];
  22 | }
  23 | 
  24 | function validateKeys(obj: Record<string, unknown>, expectedKeys: string[], context: string): void {
  25 |     const actualKeys = Object.keys(obj).sort();
  26 |     const expected = [...expectedKeys].sort();
  27 |     const extraKeys = actualKeys.filter(key => !expected.includes(key));
  28 |     if (extraKeys.length > 0) {
> 29 |         throw new Error(`Unexpected fields in ${context}: [${extraKeys.join(', ')}]`);
     |               ^ Error: Unexpected fields in ProductsListResponse: [message]
  30 |     }
  31 |     const missingKeys = expected.filter(key => !actualKeys.includes(key));
  32 |     if (missingKeys.length > 0) {
  33 |         throw new Error(`Missing fields in ${context}: [${missingKeys.join(', ')}]`);
  34 |     }
  35 | }
  36 | 
  37 | function validateProduct(product: Record<string, unknown>): void {
  38 |     validateKeys(product, ['id', 'name', 'price', 'brand', 'category'], 'Product');
  39 |     const category = product.category as Record<string, unknown>;
  40 |     validateKeys(category, ['usertype', 'category'], 'Category');
  41 |     validateKeys(category.usertype as Record<string, unknown>, ['usertype'], 'Usertype');
  42 | }
  43 | 
  44 | function validateProductsListResponse(body: ProductsListResponse): void {
  45 |     validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'products'], 'ProductsListResponse');
  46 |     if (body.products) {
  47 |         body.products.forEach(product => validateProduct(product as unknown as Record<string, unknown>));
  48 |     }
  49 | }
  50 | 
  51 | export async function getProductsList(request: APIRequestContext): Promise<ProductsListResponse> {
  52 |     const response = await request.get(`${apiUrl}/productsList`);
  53 |     const body = await response.json();
  54 |     validateProductsListResponse(body);
  55 |     return body;
  56 | }
  57 | 
  58 | export async function postToProductsList(request: APIRequestContext): Promise<ProductsListResponse> {
  59 |     const response = await request.post(`${apiUrl}/productsList`);
  60 |     return response.json();
  61 | }
  62 | 
  63 | export async function deleteToProductsList(request: APIRequestContext): Promise<ProductsListResponse> {
  64 |     const response = await request.delete(`${apiUrl}/productsList`);
  65 |     return response.json();
  66 | }
  67 | 
  68 | export async function putToProductsList(request: APIRequestContext): Promise<ProductsListResponse> {
  69 |     const response = await request.put(`${apiUrl}/productsList`);
  70 |     return response.json();
  71 | }
  72 | 
```