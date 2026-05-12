# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\get-user-detail.spec.ts >> /getUserDetailByEmail endpoint tests >> Negative: Very long string as email
- Location: tests\api\get-user-detail.spec.ts:104:9

# Error details

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

# Test source

```ts
  1  | import { APIRequestContext } from '@playwright/test';
  2  | import { apiUrl } from '../constants/url';
  3  | 
  4  | export interface UserDetail {
  5  |     id: number;
  6  |     name: string;
  7  |     email: string;
  8  |     title: string;
  9  |     birth_day: string;
  10 |     birth_month: string;
  11 |     birth_year: string;
  12 |     first_name: string;
  13 |     last_name: string;
  14 |     company: string;
  15 |     address1: string;
  16 |     address2: string;
  17 |     country: string;
  18 |     state: string;
  19 |     city: string;
  20 |     zipcode: string;
  21 | }
  22 | 
  23 | export interface GetUserDetailResponse {
  24 |     responseCode: number;
  25 |     user?: UserDetail;
  26 |     message?: string;
  27 | }
  28 | 
  29 | function validateKeys(obj: Record<string, unknown>, expectedKeys: string[], context: string): void {
  30 |     const actualKeys = Object.keys(obj).sort();
  31 |     const expected = [...expectedKeys].sort();
  32 |     const extraKeys = actualKeys.filter(key => !expected.includes(key));
  33 |     if (extraKeys.length > 0) {
  34 |         throw new Error(`Unexpected fields in ${context}: [${extraKeys.join(', ')}]`);
  35 |     }
  36 |     const missingKeys = expected.filter(key => !actualKeys.includes(key));
  37 |     if (missingKeys.length > 0) {
  38 |         throw new Error(`Missing fields in ${context}: [${missingKeys.join(', ')}]`);
  39 |     }
  40 | }
  41 | 
  42 | export async function getUserDetailByEmail(request: APIRequestContext, email: string): Promise<GetUserDetailResponse> {
  43 |     const response = await request.get(`${apiUrl}/getUserDetailByEmail`, {
  44 |         params: { email },
  45 |     });
> 46 |     const body = await response.json();
     |                  ^ SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
  47 |     return body;
  48 | }
  49 | 
  50 | export async function getUserDetailRaw(request: APIRequestContext): Promise<GetUserDetailResponse> {
  51 |     const response = await request.get(`${apiUrl}/getUserDetailByEmail`);
  52 |     const body = await response.json();
  53 |     return body;
  54 | }
  55 | 
```