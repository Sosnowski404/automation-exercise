# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/update-account.spec.ts >> /updateAccount endpoint tests >> Negative: Params as query params instead of form data
- Location: tests/api/update-account.spec.ts:211:9

# Error details

```
SyntaxError: Unexpected token '<', "<h2>This w"... is not valid JSON
```

# Test source

```ts
  120 | 
  121 |         expect(responseBody.responseCode).toBe(400);
  122 |     });
  123 | 
  124 |     test('Negative: Update with no params should return 400', async ({ request }) => {
  125 |         const responseBody = await updateAccount(request, {});
  126 | 
  127 |         expect(responseBody.responseCode).toBe(400);
  128 |     });
  129 | 
  130 |     test('Negative: POST method on updateAccount should not return 200', async ({ request }) => {
  131 |         const response = await rawRequest(request, {
  132 |             method: 'post',
  133 |             endpoint: 'updateAccount',
  134 |         });
  135 |         const body = await response.json();
  136 |         expect(body.responseCode).not.toBe(200);
  137 |     });
  138 | 
  139 |     test('Negative: GET method on updateAccount should not return 200', async ({ request }) => {
  140 |         const response = await rawRequest(request, {
  141 |             method: 'get',
  142 |             endpoint: 'updateAccount',
  143 |         });
  144 |         const body = await response.json();
  145 |         expect(body.responseCode).not.toBe(200);
  146 |     });
  147 | 
  148 |     test('Negative: DELETE method on updateAccount should not return 200', async ({ request }) => {
  149 |         const response = await rawRequest(request, {
  150 |             method: 'delete',
  151 |             endpoint: 'updateAccount',
  152 |         });
  153 |         const body = await response.json();
  154 |         expect(body.responseCode).not.toBe(200);
  155 |     });
  156 | 
  157 |     test('Negative: SQL injection in name field', async ({ request }) => {
  158 |         const params = generateFullAccountParams();
  159 |         await createAccount(request, params);
  160 | 
  161 |         const responseBody = await updateAccount(request, { ...params, name: "' OR 1=1 --" });
  162 |         expect(responseBody.responseCode).toBe(200);
  163 | 
  164 |         await deleteAccount(request, params.email!, params.password!);
  165 |     });
  166 | 
  167 |     test('Negative: XSS injection in firstname field', async ({ request }) => {
  168 |         const params = generateFullAccountParams();
  169 |         await createAccount(request, params);
  170 | 
  171 |         const responseBody = await updateAccount(request, { ...params, firstname: '<script>alert(1)</script>' });
  172 |         expect(responseBody.responseCode).toBe(200);
  173 | 
  174 |         await deleteAccount(request, params.email!, params.password!);
  175 |     });
  176 | 
  177 |     test('Negative: Very long string as name', async ({ request }) => {
  178 |         const params = generateFullAccountParams();
  179 |         await createAccount(request, params);
  180 | 
  181 |         const responseBody = await updateAccount(request, { ...params, name: 'a'.repeat(10000) });
  182 |         expect(responseBody.responseCode).toBe(200);
  183 | 
  184 |         await deleteAccount(request, params.email!, params.password!);
  185 |     });
  186 | 
  187 |     test('Negative: Empty string as name', async ({ request }) => {
  188 |         const params = generateFullAccountParams();
  189 |         await createAccount(request, params);
  190 | 
  191 |         const responseBody = await updateAccount(request, { ...params, name: '' });
  192 |         expect(responseBody.responseCode).toBe(200);
  193 | 
  194 |         await deleteAccount(request, params.email!, params.password!);
  195 |     });
  196 | 
  197 |     test('Negative: Wrong param names', async ({ request }) => {
  198 |         const params = generateFullAccountParams();
  199 |         await createAccount(request, params);
  200 | 
  201 |         const responseBody = await updateAccountRaw(request, {
  202 |             user_email: params.email!,
  203 |             user_password: params.password!,
  204 |             user_name: randomName(),
  205 |         });
  206 |         expect(responseBody.responseCode).toBe(400);
  207 | 
  208 |         await deleteAccount(request, params.email!, params.password!);
  209 |     });
  210 | 
  211 |     test('Negative: Params as query params instead of form data', async ({ request }) => {
  212 |         const params = generateFullAccountParams();
  213 |         await createAccount(request, params);
  214 | 
  215 |         const response = await rawRequest(request, {
  216 |             method: 'put',
  217 |             endpoint: 'updateAccount',
  218 |             queryParams: { email: params.email!, password: params.password!, name: randomName() },
  219 |         });
> 220 |         const body = await response.json();
      |                      ^ SyntaxError: Unexpected token '<', "<h2>This w"... is not valid JSON
  221 |         expect(body.responseCode).toBe(400);
  222 | 
  223 |         await deleteAccount(request, params.email!, params.password!);
  224 |     });
  225 | 
  226 |     test('Negative: Path param appended to updateAccount', async ({ request }) => {
  227 |         const response = await rawRequest(request, {
  228 |             method: 'put',
  229 |             endpoint: 'updateAccount',
  230 |             pathSuffix: '1',
  231 |         });
  232 |         expect(response.status()).not.toBe(200);
  233 |     });
  234 | 
  235 |     test('Negative: Path traversal on updateAccount', async ({ request }) => {
  236 |         const response = await rawRequest(request, {
  237 |             method: 'put',
  238 |             endpoint: 'updateAccount',
  239 |             pathSuffix: '../productsList',
  240 |         });
  241 |         const body = await response.json();
  242 |         expect(body.responseCode).not.toBe(200);
  243 |     });
  244 | 
  245 |     test('Negative: Update with wrong password for existing account', async ({ request }) => {
  246 |         const params = generateFullAccountParams();
  247 |         await createAccount(request, params);
  248 | 
  249 |         const responseBody = await updateAccount(request, { ...params, password: 'wrongpassword123' });
  250 |         expect(responseBody.responseCode).not.toBe(200);
  251 | 
  252 |         await deleteAccount(request, params.email!, params.password!);
  253 |     });
  254 | 
  255 |     test('Negative: Special characters as email in update', async ({ request }) => {
  256 |         const params = generateFullAccountParams();
  257 |         const responseBody = await updateAccount(request, { ...params, email: '!@#$%^&*()' });
  258 |         expect(responseBody.responseCode).not.toBe(200);
  259 |     });
  260 | });
  261 | 
```