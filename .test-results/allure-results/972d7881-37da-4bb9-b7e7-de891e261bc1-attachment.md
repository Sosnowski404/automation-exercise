# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\update-account.spec.ts >> /updateAccount endpoint tests >> Negative: Update with only email and password (missing other params) should return 400
- Location: tests\api\update-account.spec.ts:93:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 200
```

# Test source

```ts
  2   | import { createAccount, deleteAccount } from '../../api/create-account.api';
  3   | import { updateAccount, updateAccountRaw } from '../../api/update-account.api';
  4   | import { getUserDetailByEmail } from '../../api/get-user-detail.api';
  5   | import { rawRequest } from '../../api/raw-request.api';
  6   | import { generateFullAccountParams, randomName, randomEmail, randomPassword, randomFirstName, randomLastName, randomCompany, randomAddress, randomPhone } from '../../utils/helpers';
  7   | 
  8   | test.describe('/updateAccount endpoint tests', () => {
  9   |     test('API 13: PUT Update Account with all params should return 200', async ({ request }) => {
  10  |         const params = generateFullAccountParams();
  11  |         await createAccount(request, params);
  12  | 
  13  |         const updatedParams = {
  14  |             ...params,
  15  |             name: randomName(),
  16  |             firstname: randomFirstName(),
  17  |             lastname: randomLastName(),
  18  |             company: randomCompany(),
  19  |             address1: randomAddress(),
  20  |             mobile_number: randomPhone(),
  21  |         };
  22  |         const responseBody = await updateAccount(request, updatedParams);
  23  | 
  24  |         expect(responseBody.responseCode).toBe(200);
  25  |         expect(responseBody.message).toBe('User updated!');
  26  | 
  27  |         await deleteAccount(request, params.email!, params.password!);
  28  |     });
  29  | 
  30  |     test('API 13: Updated fields are reflected in getUserDetailByEmail', async ({ request }) => {
  31  |         const params = generateFullAccountParams();
  32  |         await createAccount(request, params);
  33  | 
  34  |         const newFirstName = 'UpdatedFirstName';
  35  |         const newLastName = 'UpdatedLastName';
  36  |         const newCompany = 'UpdatedCompany';
  37  | 
  38  |         await updateAccount(request, {
  39  |             ...params,
  40  |             firstname: newFirstName,
  41  |             lastname: newLastName,
  42  |             company: newCompany,
  43  |         });
  44  | 
  45  |         const detail = await getUserDetailByEmail(request, params.email!);
  46  |         expect(detail.responseCode).toBe(200);
  47  |         expect(detail.user?.first_name).toBe(newFirstName);
  48  |         expect(detail.user?.last_name).toBe(newLastName);
  49  |         expect(detail.user?.company).toBe(newCompany);
  50  | 
  51  |         await deleteAccount(request, params.email!, params.password!);
  52  |     });
  53  | 
  54  |     test('API 13: Update only name field', async ({ request }) => {
  55  |         const params = generateFullAccountParams();
  56  |         await createAccount(request, params);
  57  | 
  58  |         const newName = 'BrandNewName';
  59  |         const responseBody = await updateAccount(request, { ...params, name: newName });
  60  | 
  61  |         expect(responseBody.responseCode).toBe(200);
  62  |         expect(responseBody.message).toBe('User updated!');
  63  | 
  64  |         await deleteAccount(request, params.email!, params.password!);
  65  |     });
  66  | 
  67  |     test('API 13: Update address fields', async ({ request }) => {
  68  |         const params = generateFullAccountParams();
  69  |         await createAccount(request, params);
  70  | 
  71  |         const responseBody = await updateAccount(request, {
  72  |             ...params,
  73  |             address1: '999 New Street',
  74  |             address2: 'Apt 42',
  75  |         });
  76  | 
  77  |         expect(responseBody.responseCode).toBe(200);
  78  | 
  79  |         const detail = await getUserDetailByEmail(request, params.email!);
  80  |         expect(detail.user?.address1).toBe('999 New Street');
  81  |         expect(detail.user?.address2).toBe('Apt 42');
  82  | 
  83  |         await deleteAccount(request, params.email!, params.password!);
  84  |     });
  85  | 
  86  |     test('Negative: Update non-existing account should not return 200', async ({ request }) => {
  87  |         const params = generateFullAccountParams();
  88  |         const responseBody = await updateAccount(request, params);
  89  | 
  90  |         expect(responseBody.responseCode).not.toBe(200);
  91  |     });
  92  | 
  93  |     test('Negative: Update with only email and password (missing other params) should return 400', async ({ request }) => {
  94  |         const params = generateFullAccountParams();
  95  |         await createAccount(request, params);
  96  | 
  97  |         const responseBody = await updateAccount(request, {
  98  |             email: params.email,
  99  |             password: params.password,
  100 |         });
  101 | 
> 102 |         expect(responseBody.responseCode).toBe(400);
      |                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  103 | 
  104 |         await deleteAccount(request, params.email!, params.password!);
  105 |     });
  106 | 
  107 |     test('Negative: Update without email param should return 400', async ({ request }) => {
  108 |         const params = generateFullAccountParams();
  109 |         delete params.email;
  110 |         const responseBody = await updateAccount(request, params);
  111 | 
  112 |         expect(responseBody.responseCode).toBe(400);
  113 |     });
  114 | 
  115 |     test('Negative: Update without password param should return 400', async ({ request }) => {
  116 |         const params = generateFullAccountParams();
  117 |         delete params.password;
  118 |         const responseBody = await updateAccount(request, params);
  119 | 
  120 |         expect(responseBody.responseCode).toBe(400);
  121 |     });
  122 | 
  123 |     test('Negative: Update with no params should return 400', async ({ request }) => {
  124 |         const responseBody = await updateAccount(request, {});
  125 | 
  126 |         expect(responseBody.responseCode).toBe(400);
  127 |     });
  128 | 
  129 |     test('Negative: POST method on updateAccount should not return 200', async ({ request }) => {
  130 |         const response = await rawRequest(request, {
  131 |             method: 'post',
  132 |             endpoint: 'updateAccount',
  133 |         });
  134 |         const body = await response.json();
  135 |         expect(body.responseCode).not.toBe(200);
  136 |     });
  137 | 
  138 |     test('Negative: GET method on updateAccount should not return 200', async ({ request }) => {
  139 |         const response = await rawRequest(request, {
  140 |             method: 'get',
  141 |             endpoint: 'updateAccount',
  142 |         });
  143 |         const body = await response.json();
  144 |         expect(body.responseCode).not.toBe(200);
  145 |     });
  146 | 
  147 |     test('Negative: DELETE method on updateAccount should not return 200', async ({ request }) => {
  148 |         const response = await rawRequest(request, {
  149 |             method: 'delete',
  150 |             endpoint: 'updateAccount',
  151 |         });
  152 |         const body = await response.json();
  153 |         expect(body.responseCode).not.toBe(200);
  154 |     });
  155 | 
  156 |     test('Negative: SQL injection in name field', async ({ request }) => {
  157 |         const params = generateFullAccountParams();
  158 |         await createAccount(request, params);
  159 | 
  160 |         const responseBody = await updateAccount(request, { ...params, name: "' OR 1=1 --" });
  161 |         expect(responseBody.responseCode).toBe(200);
  162 | 
  163 |         await deleteAccount(request, params.email!, params.password!);
  164 |     });
  165 | 
  166 |     test('Negative: XSS injection in firstname field', async ({ request }) => {
  167 |         const params = generateFullAccountParams();
  168 |         await createAccount(request, params);
  169 | 
  170 |         const responseBody = await updateAccount(request, { ...params, firstname: '<script>alert(1)</script>' });
  171 |         expect(responseBody.responseCode).toBe(200);
  172 | 
  173 |         await deleteAccount(request, params.email!, params.password!);
  174 |     });
  175 | 
  176 |     test('Negative: Very long string as name', async ({ request }) => {
  177 |         const params = generateFullAccountParams();
  178 |         await createAccount(request, params);
  179 | 
  180 |         const responseBody = await updateAccount(request, { ...params, name: 'a'.repeat(10000) });
  181 |         expect(responseBody.responseCode).toBe(200);
  182 | 
  183 |         await deleteAccount(request, params.email!, params.password!);
  184 |     });
  185 | 
  186 |     test('Negative: Empty string as name', async ({ request }) => {
  187 |         const params = generateFullAccountParams();
  188 |         await createAccount(request, params);
  189 | 
  190 |         const responseBody = await updateAccount(request, { ...params, name: '' });
  191 |         expect(responseBody.responseCode).toBe(200);
  192 | 
  193 |         await deleteAccount(request, params.email!, params.password!);
  194 |     });
  195 | 
  196 |     test('Negative: Wrong param names', async ({ request }) => {
  197 |         const params = generateFullAccountParams();
  198 |         await createAccount(request, params);
  199 | 
  200 |         const responseBody = await updateAccountRaw(request, {
  201 |             user_email: params.email!,
  202 |             user_password: params.password!,
```