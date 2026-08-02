# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/delete-account.spec.ts >> /deleteAccount endpoint tests >> Negative: Special characters as email
- Location: tests/api/delete-account.spec.ts:125:9

# Error details

```
SyntaxError: Unexpected token '<', "


<!DOCTYPE "... is not valid JSON
```

# Test source

```ts
  1  | import { APIRequestContext } from '@playwright/test';
  2  | import { apiUrl } from '../constants/url';
  3  | 
  4  | export interface DeleteAccountResponse {
  5  |     responseCode: number;
  6  |     message: string;
  7  | }
  8  | 
  9  | function validateKeys(obj: Record<string, unknown>, expectedKeys: string[], context: string): void {
  10 |     const actualKeys = Object.keys(obj).sort();
  11 |     const expected = [...expectedKeys].sort();
  12 |     const extraKeys = actualKeys.filter(key => !expected.includes(key));
  13 |     if (extraKeys.length > 0) {
  14 |         throw new Error(`Unexpected fields in ${context}: [${extraKeys.join(', ')}]`);
  15 |     }
  16 |     const missingKeys = expected.filter(key => !actualKeys.includes(key));
  17 |     if (missingKeys.length > 0) {
  18 |         throw new Error(`Missing fields in ${context}: [${missingKeys.join(', ')}]`);
  19 |     }
  20 | }
  21 | 
  22 | function validateDeleteAccountResponse(body: DeleteAccountResponse): void {
  23 |     validateKeys(body as unknown as Record<string, unknown>, ['responseCode', 'message'], 'DeleteAccountResponse');
  24 | }
  25 | 
  26 | export async function deleteAccountApi(request: APIRequestContext, email: string, password: string): Promise<DeleteAccountResponse> {
  27 |     const response = await request.delete(`${apiUrl}/deleteAccount`, {
  28 |         form: { email, password },
  29 |     });
> 30 |     const body = await response.json();
     |                  ^ SyntaxError: Unexpected token '<', "
  31 |     validateDeleteAccountResponse(body);
  32 |     return body;
  33 | }
  34 | 
  35 | export async function deleteAccountWithFormData(request: APIRequestContext, formData: Record<string, string>): Promise<DeleteAccountResponse> {
  36 |     const response = await request.delete(`${apiUrl}/deleteAccount`, {
  37 |         form: formData,
  38 |     });
  39 |     const body = await response.json();
  40 |     validateDeleteAccountResponse(body);
  41 |     return body;
  42 | }
  43 | 
  44 | export async function deleteAccountWithoutParams(request: APIRequestContext): Promise<DeleteAccountResponse> {
  45 |     const response = await request.delete(`${apiUrl}/deleteAccount`);
  46 |     const body = await response.json();
  47 |     validateDeleteAccountResponse(body);
  48 |     return body;
  49 | }
  50 | 
```