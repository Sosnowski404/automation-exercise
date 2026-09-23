# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/delete-account.spec.ts >> /deleteAccount endpoint tests >> Negative: GET method on deleteAccount should not return 200
- Location: tests/api/delete-account.spec.ts:73:9

# Error details

```
SyntaxError: Unexpected token '<', "<h2>This w"... is not valid JSON
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { createAccount, deleteAccount } from '../../api/create-account.api';
  3   | import { verifyLogin } from '../../api/verify-login.api';
  4   | import { deleteAccountApi, deleteAccountWithFormData, deleteAccountWithoutParams } from '../../api/delete-account.api';
  5   | import { rawRequest } from '../../api/raw-request.api';
  6   | import { generateFullAccountParams, randomEmail, randomPassword } from '../../utils/helpers';
  7   | 
  8   | test.describe('/deleteAccount endpoint tests', () => {
  9   |     test('API 12: DELETE account with valid email and password should return 200', async ({ request }) => {
  10  |         const params = generateFullAccountParams();
  11  |         await createAccount(request, params);
  12  | 
  13  |         const responseBody = await deleteAccountApi(request, params.email!, params.password!);
  14  | 
  15  |         expect(responseBody.responseCode).toBe(200);
  16  |         expect(responseBody.message).toBe('Account deleted!');
  17  |     });
  18  | 
  19  |     test('API 12: Deleted account should no longer be verifiable via login', async ({ request }) => {
  20  |         const params = generateFullAccountParams();
  21  |         await createAccount(request, params);
  22  |         await deleteAccountApi(request, params.email!, params.password!);
  23  | 
  24  |         const loginResponse = await verifyLogin(request, params.email!, params.password!);
  25  |         expect(loginResponse.responseCode).toBe(404);
  26  |     });
  27  | 
  28  |     test('API 12: Deleting same account twice should fail on second attempt', async ({ request }) => {
  29  |         const params = generateFullAccountParams();
  30  |         await createAccount(request, params);
  31  | 
  32  |         const firstDelete = await deleteAccountApi(request, params.email!, params.password!);
  33  |         expect(firstDelete.responseCode).toBe(200);
  34  | 
  35  |         const secondDelete = await deleteAccountApi(request, params.email!, params.password!);
  36  |         expect(secondDelete.responseCode).not.toBe(200);
  37  |     });
  38  | 
  39  |     test('Negative: DELETE without email param should return 400', async ({ request }) => {
  40  |         const responseBody = await deleteAccountWithFormData(request, { password: randomPassword() });
  41  | 
  42  |         expect(responseBody.responseCode).toBe(400);
  43  |     });
  44  | 
  45  |     test('Negative: DELETE without password param should return 400', async ({ request }) => {
  46  |         const responseBody = await deleteAccountWithFormData(request, { email: randomEmail() });
  47  | 
  48  |         expect(responseBody.responseCode).toBe(400);
  49  |     });
  50  | 
  51  |     test('Negative: DELETE without any params should return 400', async ({ request }) => {
  52  |         const responseBody = await deleteAccountWithoutParams(request);
  53  | 
  54  |         expect(responseBody.responseCode).toBe(400);
  55  |     });
  56  | 
  57  |     test('Negative: DELETE with non-existing email should not return 200', async ({ request }) => {
  58  |         const responseBody = await deleteAccountApi(request, 'nonexistent_xyz@fake.com', randomPassword());
  59  | 
  60  |         expect(responseBody.responseCode).not.toBe(200);
  61  |     });
  62  | 
  63  |     test('Negative: DELETE with valid email but wrong password should not return 200', async ({ request }) => {
  64  |         const params = generateFullAccountParams();
  65  |         await createAccount(request, params);
  66  | 
  67  |         const responseBody = await deleteAccountApi(request, params.email!, 'wrongpassword123');
  68  |         expect(responseBody.responseCode).not.toBe(200);
  69  | 
  70  |         await deleteAccountApi(request, params.email!, params.password!);
  71  |     });
  72  | 
  73  |     test('Negative: GET method on deleteAccount should not return 200', async ({ request }) => {
  74  |         const response = await rawRequest(request, {
  75  |             method: 'get',
  76  |             endpoint: 'deleteAccount',
  77  |         });
> 78  |         const body = await response.json();
      |                      ^ SyntaxError: Unexpected token '<', "<h2>This w"... is not valid JSON
  79  |         expect(body.responseCode).not.toBe(200);
  80  |     });
  81  | 
  82  |     test('Negative: POST method on deleteAccount should not return 200', async ({ request }) => {
  83  |         const response = await rawRequest(request, {
  84  |             method: 'post',
  85  |             endpoint: 'deleteAccount',
  86  |         });
  87  |         const body = await response.json();
  88  |         expect(body.responseCode).not.toBe(200);
  89  |     });
  90  | 
  91  |     test('Negative: PUT method on deleteAccount should not return 200', async ({ request }) => {
  92  |         const response = await rawRequest(request, {
  93  |             method: 'put',
  94  |             endpoint: 'deleteAccount',
  95  |         });
  96  |         const body = await response.json();
  97  |         expect(body.responseCode).not.toBe(200);
  98  |     });
  99  | 
  100 |     test('Negative: Empty string as email', async ({ request }) => {
  101 |         const responseBody = await deleteAccountWithFormData(request, { email: '', password: randomPassword() });
  102 |         expect(responseBody.responseCode).not.toBe(200);
  103 |     });
  104 | 
  105 |     test('Negative: Empty string as password', async ({ request }) => {
  106 |         const responseBody = await deleteAccountWithFormData(request, { email: randomEmail(), password: '' });
  107 |         expect(responseBody.responseCode).not.toBe(200);
  108 |     });
  109 | 
  110 |     test('Negative: SQL injection in email field', async ({ request }) => {
  111 |         const responseBody = await deleteAccountApi(request, "' OR 1=1 --", randomPassword());
  112 |         expect(responseBody.responseCode).not.toBe(200);
  113 |     });
  114 | 
  115 |     test('Negative: SQL injection in password field', async ({ request }) => {
  116 |         const responseBody = await deleteAccountApi(request, randomEmail(), "' OR 1=1 --");
  117 |         expect(responseBody.responseCode).not.toBe(200);
  118 |     });
  119 | 
  120 |     test('Negative: XSS injection in email field', async ({ request }) => {
  121 |         const responseBody = await deleteAccountApi(request, '<script>alert(1)</script>', randomPassword());
  122 |         expect(responseBody.responseCode).not.toBe(200);
  123 |     });
  124 | 
  125 |     test('Negative: Special characters as email', async ({ request }) => {
  126 |         const responseBody = await deleteAccountApi(request, '!@#$%^&*()', randomPassword());
  127 |         expect(responseBody.responseCode).not.toBe(200);
  128 |     });
  129 | 
  130 |     test('Negative: Very long string as email', async ({ request }) => {
  131 |         const responseBody = await deleteAccountApi(request, 'a'.repeat(10000) + '@test.com', randomPassword());
  132 |         expect(responseBody.responseCode).not.toBe(200);
  133 |     });
  134 | 
  135 |     test('Negative: Very long string as password', async ({ request }) => {
  136 |         const responseBody = await deleteAccountApi(request, randomEmail(), 'a'.repeat(10000));
  137 |         expect(responseBody.responseCode).not.toBe(200);
  138 |     });
  139 | 
  140 |     test('Negative: Credentials as query params instead of form data', async ({ request }) => {
  141 |         const response = await rawRequest(request, {
  142 |             method: 'delete',
  143 |             endpoint: 'deleteAccount',
  144 |             queryParams: { email: randomEmail(), password: randomPassword() },
  145 |         });
  146 |         const body = await response.json();
  147 |         expect(body.responseCode).toBe(400);
  148 |     });
  149 | 
  150 |     test('Negative: Wrong param names', async ({ request }) => {
  151 |         const responseBody = await deleteAccountWithFormData(request, {
  152 |             user_email: randomEmail(),
  153 |             user_password: randomPassword(),
  154 |         });
  155 |         expect(responseBody.responseCode).toBe(400);
  156 |     });
  157 | 
  158 |     test('Negative: Path param appended to deleteAccount', async ({ request }) => {
  159 |         const response = await rawRequest(request, {
  160 |             method: 'delete',
  161 |             endpoint: 'deleteAccount',
  162 |             pathSuffix: '1',
  163 |         });
  164 |         expect(response.status()).not.toBe(200);
  165 |     });
  166 | 
  167 |     test('Negative: Path traversal on deleteAccount', async ({ request }) => {
  168 |         const response = await rawRequest(request, {
  169 |             method: 'delete',
  170 |             endpoint: 'deleteAccount',
  171 |             pathSuffix: '../productsList',
  172 |         });
  173 |         const body = await response.json();
  174 |         expect(body.responseCode).not.toBe(200);
  175 |     });
  176 | 
  177 |     test('Negative: Swapped param values (password in email field)', async ({ request }) => {
  178 |         const params = generateFullAccountParams();
```