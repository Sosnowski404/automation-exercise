# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> /createAccount endpoint tests >> Negative: GET method on createAccount should not return 201
- Location: tests\api.spec.ts:753:9

# Error details

```
Error: Unexpected fields in CreateAccountResponse: [detail]
```

# Test source

```ts
  1  | import { APIRequestContext } from '@playwright/test';
  2  | import { apiUrl } from '../constants/url';
  3  | import { CreateAccountParams } from '../utils/helpers';
  4  | 
  5  | export interface CreateAccountResponse {
  6  |     responseCode: number;
  7  |     message: string;
  8  | }
  9  | 
  10 | function validateKeys(obj: Record<string, unknown>, expectedKeys: string[], context: string): void {
  11 |     const actualKeys = Object.keys(obj).sort();
  12 |     const expected = [...expectedKeys].sort();
  13 |     const extraKeys = actualKeys.filter(key => !expected.includes(key));
  14 |     if (extraKeys.length > 0) {
> 15 |         throw new Error(`Unexpected fields in ${context}: [${extraKeys.join(', ')}]`);
     |               ^ Error: Unexpected fields in CreateAccountResponse: [detail]
  16 |     }
  17 |     const missingKeys = expected.filter(key => !actualKeys.includes(key));
  18 |     if (missingKeys.length > 0) {
  19 |         throw new Error(`Missing fields in ${context}: [${missingKeys.join(', ')}]`);
  20 |     }
  21 | }
  22 | 
  23 | function validateCreateAccountResponse(body: CreateAccountResponse): void {
  24 |     validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'message'], 'CreateAccountResponse');
  25 | }
  26 | 
  27 | export async function createAccount(request: APIRequestContext, params: CreateAccountParams): Promise<CreateAccountResponse> {
  28 |     const form: Record<string, string> = {};
  29 |     for (const [key, value] of Object.entries(params)) {
  30 |         if (value !== undefined) {
  31 |             form[key] = value;
  32 |         }
  33 |     }
  34 |     const response = await request.post(`${apiUrl}/createAccount`, { form });
  35 |     const body = await response.json();
  36 |     validateCreateAccountResponse(body);
  37 |     return body;
  38 | }
  39 | 
  40 | export async function createAccountRaw(request: APIRequestContext, form: Record<string, string>): Promise<CreateAccountResponse> {
  41 |     const response = await request.post(`${apiUrl}/createAccount`, { form });
  42 |     const body = await response.json();
  43 |     validateCreateAccountResponse(body);
  44 |     return body;
  45 | }
  46 | 
  47 | export async function deleteAccount(request: APIRequestContext, email: string, password: string): Promise<CreateAccountResponse> {
  48 |     const response = await request.delete(`${apiUrl}/deleteAccount`, {
  49 |         form: { email, password },
  50 |     });
  51 |     const body = await response.json();
  52 |     validateCreateAccountResponse(body);
  53 |     return body;
  54 | }
  55 | 
  56 | export async function getCreateAccount(request: APIRequestContext): Promise<CreateAccountResponse> {
  57 |     const response = await request.get(`${apiUrl}/createAccount`);
  58 |     const body = await response.json();
  59 |     validateCreateAccountResponse(body);
  60 |     return body;
  61 | }
  62 | 
  63 | export async function putCreateAccount(request: APIRequestContext): Promise<CreateAccountResponse> {
  64 |     const response = await request.put(`${apiUrl}/createAccount`);
  65 |     const body = await response.json();
  66 |     validateCreateAccountResponse(body);
  67 |     return body;
  68 | }
  69 | 
```