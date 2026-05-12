# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api\get-user-detail.spec.ts >> /getUserDetailByEmail endpoint tests >> Negative: Path traversal on getUserDetailByEmail
- Location: tests\api\get-user-detail.spec.ts:182:9

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not 200
```

# Test source

```ts
  89  |         expect(responseBody.responseCode).not.toBe(200);
  90  |     });
  91  | 
  92  |     test('Negative: SQL injection in email param', async ({ request }) => {
  93  |         const responseBody = await getUserDetailByEmail(request, "' OR 1=1 --");
  94  | 
  95  |         expect(responseBody.responseCode).not.toBe(200);
  96  |     });
  97  | 
  98  |     test('Negative: XSS injection in email param', async ({ request }) => {
  99  |         const responseBody = await getUserDetailByEmail(request, '<script>alert(1)</script>');
  100 | 
  101 |         expect(responseBody.responseCode).not.toBe(200);
  102 |     });
  103 | 
  104 |     test('Negative: Very long string as email', async ({ request }) => {
  105 |         const responseBody = await getUserDetailByEmail(request, 'a'.repeat(10000) + '@test.com');
  106 | 
  107 |         expect(responseBody.responseCode).not.toBe(200);
  108 |     });
  109 | 
  110 |     test('Negative: Numeric value as email', async ({ request }) => {
  111 |         const responseBody = await getUserDetailByEmail(request, '12345');
  112 | 
  113 |         expect(responseBody.responseCode).not.toBe(200);
  114 |     });
  115 | 
  116 |     test('Negative: POST method on getUserDetailByEmail should not return 200', async ({ request }) => {
  117 |         const response = await rawRequest(request, {
  118 |             method: 'post',
  119 |             endpoint: 'getUserDetailByEmail',
  120 |         });
  121 |         const body = await response.json();
  122 |         expect(body.responseCode).not.toBe(200);
  123 |     });
  124 | 
  125 |     test('Negative: PUT method on getUserDetailByEmail should not return 200', async ({ request }) => {
  126 |         const response = await rawRequest(request, {
  127 |             method: 'put',
  128 |             endpoint: 'getUserDetailByEmail',
  129 |         });
  130 |         const body = await response.json();
  131 |         expect(body.responseCode).not.toBe(200);
  132 |     });
  133 | 
  134 |     test('Negative: DELETE method on getUserDetailByEmail should not return 200', async ({ request }) => {
  135 |         const response = await rawRequest(request, {
  136 |             method: 'delete',
  137 |             endpoint: 'getUserDetailByEmail',
  138 |         });
  139 |         const body = await response.json();
  140 |         expect(body.responseCode).not.toBe(200);
  141 |     });
  142 | 
  143 |     test('Negative: Email as form data instead of query param', async ({ request }) => {
  144 |         const params = generateFullAccountParams();
  145 |         await createAccount(request, params);
  146 | 
  147 |         const response = await rawRequest(request, {
  148 |             method: 'get',
  149 |             endpoint: 'getUserDetailByEmail',
  150 |             form: { email: params.email! },
  151 |         });
  152 |         const body = await response.json();
  153 |         expect(body.responseCode).not.toBe(200);
  154 | 
  155 |         await deleteAccount(request, params.email!, params.password!);
  156 |     });
  157 | 
  158 |     test('Negative: Wrong param name instead of email', async ({ request }) => {
  159 |         const params = generateFullAccountParams();
  160 |         await createAccount(request, params);
  161 | 
  162 |         const response = await rawRequest(request, {
  163 |             method: 'get',
  164 |             endpoint: 'getUserDetailByEmail',
  165 |             queryParams: { user_email: params.email! },
  166 |         });
  167 |         const body = await response.json();
  168 |         expect(body.responseCode).not.toBe(200);
  169 | 
  170 |         await deleteAccount(request, params.email!, params.password!);
  171 |     });
  172 | 
  173 |     test('Negative: Path param appended to getUserDetailByEmail', async ({ request }) => {
  174 |         const response = await rawRequest(request, {
  175 |             method: 'get',
  176 |             endpoint: 'getUserDetailByEmail',
  177 |             pathSuffix: 'test@test.com',
  178 |         });
  179 |         expect(response.status()).not.toBe(200);
  180 |     });
  181 | 
  182 |     test('Negative: Path traversal on getUserDetailByEmail', async ({ request }) => {
  183 |         const response = await rawRequest(request, {
  184 |             method: 'get',
  185 |             endpoint: 'getUserDetailByEmail',
  186 |             pathSuffix: '../productsList',
  187 |         });
  188 |         const body = await response.json();
> 189 |         expect(body.responseCode).not.toBe(200);
      |                                       ^ Error: expect(received).not.toBe(expected) // Object.is equality
  190 |     });
  191 | 
  192 |     test('API 14: Deleted account should not return user detail', async ({ request }) => {
  193 |         const params = generateFullAccountParams();
  194 |         await createAccount(request, params);
  195 |         await deleteAccount(request, params.email!, params.password!);
  196 | 
  197 |         const responseBody = await getUserDetailByEmail(request, params.email!);
  198 |         expect(responseBody.responseCode).not.toBe(200);
  199 |     });
  200 | });
  201 | 
```