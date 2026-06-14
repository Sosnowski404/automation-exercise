# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/get-user-detail.spec.ts >> /getUserDetailByEmail endpoint tests >> Negative: PUT method on getUserDetailByEmail should not return 200
- Location: tests/api/get-user-detail.spec.ts:135:9

# Error details

```
SyntaxError: Unexpected token '<', "<h2>This w"... is not valid JSON
```

# Test source

```ts
  40  |         expect(user.state).toBe(params.state);
  41  |         expect(user.city).toBe(params.city);
  42  |         expect(user.zipcode).toBe(params.zipcode);
  43  | 
  44  |         await deleteAccount(request, params.email!, params.password!);
  45  |     });
  46  | 
  47  |     test('API 14: Birth fields are returned correctly', async ({ request }) => {
  48  |         const params = generateFullAccountParams();
  49  |         await createAccount(request, params);
  50  | 
  51  |         const responseBody = await getUserDetailByEmail(request, params.email!);
  52  | 
  53  |         expect(responseBody.responseCode).toBe(200);
  54  |         const user = responseBody.user!;
  55  |         expect(user.birth_day).toBe(params.birth_date);
  56  |         expect(user.birth_month).toBe(params.birth_month);
  57  |         expect(user.birth_year).toBe(params.birth_year);
  58  | 
  59  |         await deleteAccount(request, params.email!, params.password!);
  60  |     });
  61  | 
  62  |     test('Negative: GET user detail with non-existing email should not return 200', async ({ request }) => {
  63  |         const responseBody = await getUserDetailByEmail(request, 'nonexistent_xyz_99999@fake.com');
  64  | 
  65  |         expect(responseBody.responseCode).not.toBe(200);
  66  |     });
  67  | 
  68  |     test('Negative: GET user detail without email param should return 400', async ({ request }) => {
  69  |         const responseBody = await getUserDetailRaw(request);
  70  | 
  71  |         expect(responseBody.responseCode).toBe(400);
  72  |     });
  73  | 
  74  |     test('Negative: GET user detail with empty email should not return valid user', async ({ request }) => {
  75  |         const responseBody = await getUserDetailByEmail(request, '');
  76  | 
  77  |         expect([200, 400]).toContain(responseBody.responseCode);
  78  |     });
  79  | 
  80  |     test('Negative: GET user detail with invalid email format should not find user', async ({ request }) => {
  81  |         const responseBody = await getUserDetailByEmail(request, 'not-an-email');
  82  | 
  83  |         expect([200, 400, 404]).toContain(responseBody.responseCode);
  84  |     });
  85  | 
  86  |     test('Negative: GET user detail with special characters as email', async ({ request }) => {
  87  |         const responseBody = await getUserDetailByEmail(request, '!@#$%^&*()');
  88  | 
  89  |         expect(responseBody.responseCode).not.toBe(200);
  90  |     });
  91  | 
  92  |     test('Negative: SQL injection in email param', async ({ request }) => {
  93  |         const responseBody = await getUserDetailByEmail(request, "' OR 1=1 --");
  94  | 
  95  |         expect(responseBody.responseCode).not.toBe(200);
  96  |     });
  97  | 
  98  |     test('Negative: XSS injection in email param should not find user', async ({ request }) => {
  99  |         const responseBody = await getUserDetailByEmail(request, '<script>alert(1)</script>');
  100 | 
  101 |         expect([200, 400, 404]).toContain(responseBody.responseCode);
  102 |     });
  103 | 
  104 |     test('Negative: Very long string as email should not return valid user', async ({ request }) => {
  105 |         const response = await rawRequest(request, {
  106 |             method: 'get',
  107 |             endpoint: 'getUserDetailByEmail',
  108 |             queryParams: { email: 'a'.repeat(10000) + '@test.com' },
  109 |         });
  110 |         const text = await response.text();
  111 |         const isJson = text.startsWith('{');
  112 |         if (isJson) {
  113 |             const body = JSON.parse(text);
  114 |             expect(body.responseCode).not.toBe(200);
  115 |         } else {
  116 |             expect(response.status()).not.toBe(200);
  117 |         }
  118 |     });
  119 | 
  120 |     test('Negative: Numeric value as email should not find user', async ({ request }) => {
  121 |         const responseBody = await getUserDetailByEmail(request, '12345');
  122 | 
  123 |         expect([200, 400, 404]).toContain(responseBody.responseCode);
  124 |     });
  125 | 
  126 |     test('Negative: POST method on getUserDetailByEmail should not return 200', async ({ request }) => {
  127 |         const response = await rawRequest(request, {
  128 |             method: 'post',
  129 |             endpoint: 'getUserDetailByEmail',
  130 |         });
  131 |         const body = await response.json();
  132 |         expect(body.responseCode).not.toBe(200);
  133 |     });
  134 | 
  135 |     test('Negative: PUT method on getUserDetailByEmail should not return 200', async ({ request }) => {
  136 |         const response = await rawRequest(request, {
  137 |             method: 'put',
  138 |             endpoint: 'getUserDetailByEmail',
  139 |         });
> 140 |         const body = await response.json();
      |                      ^ SyntaxError: Unexpected token '<', "<h2>This w"... is not valid JSON
  141 |         expect(body.responseCode).not.toBe(200);
  142 |     });
  143 | 
  144 |     test('Negative: DELETE method on getUserDetailByEmail should not return 200', async ({ request }) => {
  145 |         const response = await rawRequest(request, {
  146 |             method: 'delete',
  147 |             endpoint: 'getUserDetailByEmail',
  148 |         });
  149 |         const body = await response.json();
  150 |         expect(body.responseCode).not.toBe(200);
  151 |     });
  152 | 
  153 |     test('Negative: Email as form data instead of query param', async ({ request }) => {
  154 |         const params = generateFullAccountParams();
  155 |         await createAccount(request, params);
  156 | 
  157 |         const response = await rawRequest(request, {
  158 |             method: 'get',
  159 |             endpoint: 'getUserDetailByEmail',
  160 |             form: { email: params.email! },
  161 |         });
  162 |         const body = await response.json();
  163 |         expect(body.responseCode).not.toBe(200);
  164 | 
  165 |         await deleteAccount(request, params.email!, params.password!);
  166 |     });
  167 | 
  168 |     test('Negative: Wrong param name instead of email', async ({ request }) => {
  169 |         const params = generateFullAccountParams();
  170 |         await createAccount(request, params);
  171 | 
  172 |         const response = await rawRequest(request, {
  173 |             method: 'get',
  174 |             endpoint: 'getUserDetailByEmail',
  175 |             queryParams: { user_email: params.email! },
  176 |         });
  177 |         const body = await response.json();
  178 |         expect(body.responseCode).not.toBe(200);
  179 | 
  180 |         await deleteAccount(request, params.email!, params.password!);
  181 |     });
  182 | 
  183 |     test('Negative: Path param appended to getUserDetailByEmail', async ({ request }) => {
  184 |         const response = await rawRequest(request, {
  185 |             method: 'get',
  186 |             endpoint: 'getUserDetailByEmail',
  187 |             pathSuffix: 'test@test.com',
  188 |         });
  189 |         expect(response.status()).not.toBe(200);
  190 |     });
  191 | 
  192 |     test('Negative: Path traversal on getUserDetailByEmail resolves to different endpoint', async ({ request }) => {
  193 |         const response = await rawRequest(request, {
  194 |             method: 'get',
  195 |             endpoint: 'getUserDetailByEmail',
  196 |             pathSuffix: '../productsList',
  197 |         });
  198 |         const body = await response.json();
  199 |         expect(body.responseCode).toBeDefined();
  200 |     });
  201 | 
  202 |     test('API 14: Deleted account should not return user detail', async ({ request }) => {
  203 |         const params = generateFullAccountParams();
  204 |         await createAccount(request, params);
  205 |         await deleteAccount(request, params.email!, params.password!);
  206 | 
  207 |         const responseBody = await getUserDetailByEmail(request, params.email!);
  208 |         expect(responseBody.responseCode).not.toBe(200);
  209 |     });
  210 | });
  211 | 
```