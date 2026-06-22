# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/update-account.spec.ts >> /updateAccount endpoint tests >> Negative: Update without email param should return 400
- Location: tests/api/update-account.spec.ts:108:9

# Error details

```
Error: Missing fields in UpdateAccountResponse: [responseCode]
```

# Test source

```ts
  1  | import { APIRequestContext } from '@playwright/test';
  2  | import { apiUrl } from '../constants/url';
  3  | import { CreateAccountParams } from '../utils/helpers';
  4  | 
  5  | export interface UpdateAccountResponse {
  6  |     responseCode: number;
  7  |     message: string;
  8  | }
  9  | 
  10 | function validateKeys(obj: Record<string, unknown>, expectedKeys: string[], context: string): void {
  11 |     const actualKeys = Object.keys(obj).sort();
  12 |     const expected = [...expectedKeys].sort();
  13 |     const extraKeys = actualKeys.filter(key => !expected.includes(key));
  14 |     if (extraKeys.length > 0) {
  15 |         throw new Error(`Unexpected fields in ${context}: [${extraKeys.join(', ')}]`);
  16 |     }
  17 |     const missingKeys = expected.filter(key => !actualKeys.includes(key));
  18 |     if (missingKeys.length > 0) {
> 19 |         throw new Error(`Missing fields in ${context}: [${missingKeys.join(', ')}]`);
     |               ^ Error: Missing fields in UpdateAccountResponse: [responseCode]
  20 |     }
  21 | }
  22 | 
  23 | function validateUpdateAccountResponse(body: UpdateAccountResponse): void {
  24 |     validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'message'], 'UpdateAccountResponse');
  25 | }
  26 | 
  27 | export async function updateAccount(request: APIRequestContext, params: CreateAccountParams): Promise<UpdateAccountResponse> {
  28 |     const form: Record<string, string> = {};
  29 |     for (const [key, value] of Object.entries(params)) {
  30 |         if (value !== undefined) {
  31 |             form[key] = value;
  32 |         }
  33 |     }
  34 |     const response = await request.put(`${apiUrl}/updateAccount`, { form });
  35 |     const body = await response.json();
  36 |     validateUpdateAccountResponse(body);
  37 |     return body;
  38 | }
  39 | 
  40 | export async function updateAccountRaw(request: APIRequestContext, form: Record<string, string>): Promise<UpdateAccountResponse> {
  41 |     const response = await request.put(`${apiUrl}/updateAccount`, { form });
  42 |     const body = await response.json();
  43 |     validateUpdateAccountResponse(body);
  44 |     return body;
  45 | }
  46 | 
```