# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/create-account.spec.ts >> /createAccount endpoint tests >> Negative: Params as query params instead of form data
- Location: tests/api/create-account.spec.ts:256:9

# Error details

```
SyntaxError: Unexpected token '<', "<h2>This w"... is not valid JSON
```

# Test source

```ts
  162 |         expect(body.responseCode ?? body.detail).toBeDefined();
  163 |         expect(body.responseCode).not.toBe(201);
  164 |     });
  165 | 
  166 |     test('Negative: PUT method on createAccount should not return 201', async ({ request }) => {
  167 |         const response = await rawRequest(request, {
  168 |             method: 'put',
  169 |             endpoint: 'createAccount',
  170 |         });
  171 |         const body = await response.json();
  172 |         expect(body.responseCode ?? body.detail).toBeDefined();
  173 |         expect(body.responseCode).not.toBe(201);
  174 |     });
  175 | 
  176 |     test('Negative: DELETE method on createAccount should not return 201', async ({ request }) => {
  177 |         const response = await rawRequest(request, {
  178 |             method: 'delete',
  179 |             endpoint: 'createAccount',
  180 |         });
  181 |         const body = await response.json();
  182 |         expect(body.responseCode ?? body.detail).toBeDefined();
  183 |         expect(body.responseCode).not.toBe(201);
  184 |     });
  185 | 
  186 |     test('Negative: Numeric value as name', async ({ request }) => {
  187 |         const params = generateFullAccountParams({ name: '12345' });
  188 |         const responseBody = await createAccount(request, params);
  189 |         expect(responseBody.responseCode).toBe(201);
  190 |         await deleteAccount(request, params.email!, params.password!);
  191 |     });
  192 | 
  193 |     test('Negative: Invalid email format', async ({ request }) => {
  194 |         const params = generateFullAccountParams({ email: 'not-an-email' });
  195 |         const responseBody = await createAccount(request, params);
  196 |         expect(responseBody.responseCode).not.toBe(201);
  197 |     });
  198 | 
  199 |     test('Negative: SQL injection in name field', async ({ request }) => {
  200 |         const params = generateFullAccountParams({ name: "' OR 1=1 --" });
  201 |         const responseBody = await createAccount(request, params);
  202 |         expect(responseBody.responseCode).toBe(201);
  203 |         await deleteAccount(request, params.email!, params.password!);
  204 |     });
  205 | 
  206 |     test('Negative: XSS injection in name field', async ({ request }) => {
  207 |         const params = generateFullAccountParams({ name: '<script>alert(1)</script>' });
  208 |         const responseBody = await createAccount(request, params);
  209 |         expect(responseBody.responseCode).toBe(201);
  210 |         await deleteAccount(request, params.email!, params.password!);
  211 |     });
  212 | 
  213 |     test('Negative: Very long string as name', async ({ request }) => {
  214 |         const params = generateFullAccountParams({ name: 'a'.repeat(10000) });
  215 |         const responseBody = await createAccount(request, params);
  216 |         expect(responseBody.responseCode).toBe(201);
  217 |         await deleteAccount(request, params.email!, params.password!);
  218 |     });
  219 | 
  220 |     test('Negative: Empty string as name', async ({ request }) => {
  221 |         const responseBody = await createAccount(request, {
  222 |             name: '',
  223 |             email: randomEmail(),
  224 |             password: randomPassword(),
  225 |         });
  226 |         expect(responseBody.responseCode).toBe(400);
  227 |     });
  228 | 
  229 |     test('Negative: Empty string as email', async ({ request }) => {
  230 |         const responseBody = await createAccount(request, {
  231 |             name: randomName(),
  232 |             email: '',
  233 |             password: randomPassword(),
  234 |         });
  235 |         expect(responseBody.responseCode).toBe(400);
  236 |     });
  237 | 
  238 |     test('Negative: Empty string as password', async ({ request }) => {
  239 |         const responseBody = await createAccount(request, {
  240 |             name: randomName(),
  241 |             email: randomEmail(),
  242 |             password: '',
  243 |         });
  244 |         expect(responseBody.responseCode).toBe(400);
  245 |     });
  246 | 
  247 |     test('Negative: Special characters as email', async ({ request }) => {
  248 |         const responseBody = await createAccount(request, {
  249 |             name: randomName(),
  250 |             email: '!@#$%^&*()',
  251 |             password: randomPassword(),
  252 |         });
  253 |         expect(responseBody.responseCode).not.toBe(201);
  254 |     });
  255 | 
  256 |     test('Negative: Params as query params instead of form data', async ({ request }) => {
  257 |         const response = await rawRequest(request, {
  258 |             method: 'post',
  259 |             endpoint: 'createAccount',
  260 |             queryParams: { name: randomName(), email: randomEmail(), password: randomPassword() },
  261 |         });
> 262 |         const body = await response.json();
      |                      ^ SyntaxError: Unexpected token '<', "<h2>This w"... is not valid JSON
  263 |         expect(body.responseCode).toBe(400);
  264 |     });
  265 | 
  266 |     test('Negative: Wrong param names', async ({ request }) => {
  267 |         const responseBody = await createAccountRaw(request, {
  268 |             user_name: randomName(),
  269 |             user_email: randomEmail(),
  270 |             user_password: randomPassword(),
  271 |         });
  272 |         expect(responseBody.responseCode).toBe(400);
  273 |     });
  274 | 
  275 |     test('Negative: Path param appended to createAccount', async ({ request }) => {
  276 |         const response = await rawRequest(request, {
  277 |             method: 'post',
  278 |             endpoint: 'createAccount',
  279 |             pathSuffix: 'admin',
  280 |             form: { name: randomName(), email: randomEmail(), password: randomPassword() },
  281 |         });
  282 |         expect(response.status()).not.toBe(200);
  283 |     });
  284 | 
  285 |     test('Negative: Invalid title value', async ({ request }) => {
  286 |         const params = generateFullAccountParams({ title: 'InvalidTitle' });
  287 |         const responseBody = await createAccount(request, params);
  288 |         expect(responseBody.responseCode).toBe(201);
  289 |         await deleteAccount(request, params.email!, params.password!);
  290 |     });
  291 | });
  292 | 
```