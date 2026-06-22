# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/create-account.spec.ts >> /createAccount endpoint tests >> Negative: GET method on createAccount should not return 201
- Location: tests/api/create-account.spec.ts:156:9

# Error details

```
Error: expect(received).toBeDefined()

Received: undefined
```

# Test source

```ts
  62  |         const responseBody = await createAccount(request, {
  63  |             name: randomName(),
  64  |             password: randomPassword(),
  65  |         });
  66  | 
  67  |         expect(responseBody.responseCode).toBe(400);
  68  |     });
  69  | 
  70  |     test('Negative: Create account with email + password (no name) should return 400', async ({ request }) => {
  71  |         const responseBody = await createAccount(request, {
  72  |             email: randomEmail(),
  73  |             password: randomPassword(),
  74  |         });
  75  | 
  76  |         expect(responseBody.responseCode).toBe(400);
  77  |     });
  78  | 
  79  |     test('Negative: Create account with no params should return 400', async ({ request }) => {
  80  |         const responseBody = await createAccount(request, {});
  81  | 
  82  |         expect(responseBody.responseCode).toBe(400);
  83  |     });
  84  | 
  85  |     test('Negative: Create account with duplicate email should return 400', async ({ request }) => {
  86  |         const params = generateFullAccountParams();
  87  |         await createAccount(request, params);
  88  | 
  89  |         const duplicateResponse = await createAccount(request, {
  90  |             ...generateFullAccountParams(),
  91  |             email: params.email,
  92  |         });
  93  | 
  94  |         expect(duplicateResponse.responseCode).toBe(400);
  95  | 
  96  |         await deleteAccount(request, params.email!, params.password!);
  97  |     });
  98  | 
  99  |     test('API 11: Create account without title should still return 201', async ({ request }) => {
  100 |         const params = generateFullAccountParams();
  101 |         delete params.title;
  102 |         const responseBody = await createAccount(request, params);
  103 |         expect(responseBody.responseCode).toBe(201);
  104 |         await deleteAccount(request, params.email!, params.password!);
  105 |     });
  106 | 
  107 |     test('API 11: Create account without birth fields should return 201', async ({ request }) => {
  108 |         const params = generateFullAccountParams();
  109 |         delete params.birth_date;
  110 |         delete params.birth_month;
  111 |         delete params.birth_year;
  112 |         const responseBody = await createAccount(request, params);
  113 |         expect(responseBody.responseCode).toBe(201);
  114 |         await deleteAccount(request, params.email!, params.password!);
  115 |     });
  116 | 
  117 |     test('Negative: Create account without firstname + lastname should return 400', async ({ request }) => {
  118 |         const params = generateFullAccountParams();
  119 |         delete params.firstname;
  120 |         delete params.lastname;
  121 |         const responseBody = await createAccount(request, params);
  122 |         expect(responseBody.responseCode).toBe(400);
  123 |     });
  124 | 
  125 |     test('Negative: Create account without address fields should return 400', async ({ request }) => {
  126 |         const params = generateFullAccountParams();
  127 |         delete params.address1;
  128 |         delete params.address2;
  129 |         delete params.country;
  130 |         delete params.zipcode;
  131 |         delete params.state;
  132 |         delete params.city;
  133 |         const responseBody = await createAccount(request, params);
  134 |         expect(responseBody.responseCode).toBe(400);
  135 |     });
  136 | 
  137 |     test('Negative: Create account without company + mobile should return 400', async ({ request }) => {
  138 |         const params = generateFullAccountParams();
  139 |         delete params.company;
  140 |         delete params.mobile_number;
  141 |         const responseBody = await createAccount(request, params);
  142 |         expect(responseBody.responseCode).toBe(400);
  143 |     });
  144 | 
  145 |     test('API 11: Created account can be verified via verifyLogin', async ({ request }) => {
  146 |         const params = generateFullAccountParams();
  147 |         await createAccount(request, params);
  148 | 
  149 |         const loginResponse = await verifyLogin(request, params.email!, params.password!);
  150 |         expect(loginResponse.responseCode).toBe(200);
  151 |         expect(loginResponse.message).toBe('User exists!');
  152 | 
  153 |         await deleteAccount(request, params.email!, params.password!);
  154 |     });
  155 | 
  156 |     test('Negative: GET method on createAccount should not return 201', async ({ request }) => {
  157 |         const response = await rawRequest(request, {
  158 |             method: 'get',
  159 |             endpoint: 'createAccount',
  160 |         });
  161 |         const body = await response.json();
> 162 |         expect(body.responseCode ?? body.detail).toBeDefined();
      |                                                  ^ Error: expect(received).toBeDefined()
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
  262 |         const body = await response.json();
```