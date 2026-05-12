# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> /verifyLogin endpoint tests >> API 7: POST To Verify Login with valid details should return 200
- Location: tests\api.spec.ts:380:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Test source

```ts
  283 |         const responseBody = await searchProduct(request, "' OR 1=1 --");
  284 | 
  285 |         expect(responseBody.responseCode).toBe(200);
  286 |         expect(responseBody.products).toBeDefined();
  287 |     });
  288 | 
  289 |     test('Negative: HTML/script injection as search_product param', async ({ request }) => {
  290 |         const responseBody = await searchProduct(request, '<script>alert(1)</script>');
  291 | 
  292 |         expect(responseBody.responseCode).toBe(200);
  293 |         expect(responseBody.products).toBeDefined();
  294 |     });
  295 | 
  296 |     test('Negative: Extra unknown form params alongside search_product', async ({ request }) => {
  297 |         const response = await rawRequest(request, {
  298 |             method: 'post',
  299 |             endpoint: 'searchProduct',
  300 |             form: { search_product: 'top', extra_param: 'should_be_ignored', limit: '5' },
  301 |         });
  302 |         const body = await response.json();
  303 |         expect(body.responseCode).toBe(200);
  304 |     });
  305 | 
  306 |     test('Negative: Wrong param name instead of search_product', async ({ request }) => {
  307 |         const response = await rawRequest(request, {
  308 |             method: 'post',
  309 |             endpoint: 'searchProduct',
  310 |             form: { search: 'top' },
  311 |         });
  312 |         const body = await response.json();
  313 |         expect(body.responseCode).toBe(400);
  314 |     });
  315 | 
  316 |     test('Negative: search_product as query param instead of form data', async ({ request }) => {
  317 |         const response = await rawRequest(request, {
  318 |             method: 'post',
  319 |             endpoint: 'searchProduct',
  320 |             queryParams: { search_product: 'top' },
  321 |         });
  322 |         const body = await response.json();
  323 |         expect(body.responseCode).toBe(400);
  324 |     });
  325 | 
  326 |     test('Negative: Path param appended to searchProduct', async ({ request }) => {
  327 |         const response = await rawRequest(request, {
  328 |             method: 'post',
  329 |             endpoint: 'searchProduct',
  330 |             pathSuffix: 'top',
  331 |             form: { search_product: 'top' },
  332 |         });
  333 |         expect(response.status()).not.toBe(200);
  334 |     });
  335 | 
  336 |     test('Negative: SQL injection in form param name', async ({ request }) => {
  337 |         const response = await rawRequest(request, {
  338 |             method: 'post',
  339 |             endpoint: 'searchProduct',
  340 |             form: { "search_product' OR '1'='1": 'top' },
  341 |         });
  342 |         const body = await response.json();
  343 |         expect(body.responseCode).toBe(400);
  344 |     });
  345 | 
  346 |     test('Negative: Numeric path param on searchProduct', async ({ request }) => {
  347 |         const response = await rawRequest(request, {
  348 |             method: 'post',
  349 |             endpoint: 'searchProduct',
  350 |             pathSuffix: '123',
  351 |         });
  352 |         expect(response.status()).not.toBe(200);
  353 |     });
  354 | 
  355 |     test('Negative: Multiple search_product values via comma', async ({ request }) => {
  356 |         const response = await rawRequest(request, {
  357 |             method: 'post',
  358 |             endpoint: 'searchProduct',
  359 |             form: { search_product: 'top,jean,tshirt' },
  360 |         });
  361 |         const body = await response.json();
  362 |         expect(body.responseCode).toBe(200);
  363 |     });
  364 | 
  365 |     test('Negative: Path traversal on searchProduct', async ({ request }) => {
  366 |         const response = await rawRequest(request, {
  367 |             method: 'post',
  368 |             endpoint: 'searchProduct',
  369 |             pathSuffix: '../productsList',
  370 |         });
  371 |         const body = await response.json();
  372 |         expect(body.responseCode).toBe(405);
  373 |     });
  374 | });
  375 | 
  376 | test.describe('/verifyLogin endpoint tests', () => {
  377 |     const validEmail = process.env.TEST_USER_EMAIL!;
  378 |     const validPassword = process.env.TEST_USER_PASSWORD!;
  379 | 
  380 |     test('API 7: POST To Verify Login with valid details should return 200', async ({ request }) => {
  381 |         const responseBody = await verifyLogin(request, validEmail, validPassword);
  382 | 
> 383 |         expect(responseBody.responseCode).toBe(200);
      |                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  384 |         expect(responseBody.message).toBe('User exists!');
  385 |     });
  386 | 
  387 |     test('API 8: POST To Verify Login without email param should return 400', async ({ request }) => {
  388 |         const responseBody = await verifyLoginWithFormData(request, { password: validPassword });
  389 | 
  390 |         expect(responseBody.responseCode).toBe(400);
  391 |         expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');
  392 |     });
  393 | 
  394 |     test('API 8: POST To Verify Login without password param should return 400', async ({ request }) => {
  395 |         const responseBody = await verifyLoginWithFormData(request, { email: validEmail });
  396 | 
  397 |         expect(responseBody.responseCode).toBe(400);
  398 |         expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');
  399 |     });
  400 | 
  401 |     test('API 8: POST To Verify Login without any params should return 400', async ({ request }) => {
  402 |         const responseBody = await verifyLoginWithoutParams(request);
  403 | 
  404 |         expect(responseBody.responseCode).toBe(400);
  405 |         expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');
  406 |     });
  407 | 
  408 |     test('API 9: DELETE To Verify Login should return 405', async ({ request }) => {
  409 |         const responseBody = await deleteVerifyLogin(request);
  410 | 
  411 |         expect(responseBody.responseCode).toBe(405);
  412 |         expect(responseBody.message).toBe('This request method is not supported.');
  413 |     });
  414 | 
  415 |     test('Negative: GET method on verifyLogin should return 405', async ({ request }) => {
  416 |         const responseBody = await getVerifyLogin(request);
  417 | 
  418 |         expect(responseBody.responseCode).toBe(405);
  419 |     });
  420 | 
  421 |     test('Negative: PUT method on verifyLogin should return 405', async ({ request }) => {
  422 |         const responseBody = await putVerifyLogin(request);
  423 | 
  424 |         expect(responseBody.responseCode).toBe(405);
  425 |     });
  426 | 
  427 |     test('Negative: Invalid email with valid password should not return 200', async ({ request }) => {
  428 |         const responseBody = await verifyLogin(request, 'nonexistent@fake.com', validPassword);
  429 | 
  430 |         expect(responseBody.responseCode).not.toBe(200);
  431 |     });
  432 | 
  433 |     test('Negative: Valid email with wrong password should not return 200', async ({ request }) => {
  434 |         const responseBody = await verifyLogin(request, validEmail, 'wrongpassword123');
  435 | 
  436 |         expect(responseBody.responseCode).not.toBe(200);
  437 |     });
  438 | 
  439 |     test('Negative: Both email and password invalid should not return 200', async ({ request }) => {
  440 |         const responseBody = await verifyLogin(request, 'fake@fake.com', 'fakepass');
  441 | 
  442 |         expect(responseBody.responseCode).not.toBe(200);
  443 |     });
  444 | 
  445 |     test('Negative: Numeric value as email', async ({ request }) => {
  446 |         const responseBody = await verifyLogin(request, '12345', validPassword);
  447 | 
  448 |         expect(responseBody.responseCode).not.toBe(200);
  449 |     });
  450 | 
  451 |     test('Negative: Empty string as email', async ({ request }) => {
  452 |         const responseBody = await verifyLoginWithFormData(request, { email: '', password: validPassword });
  453 | 
  454 |         expect(responseBody.responseCode).not.toBe(200);
  455 |     });
  456 | 
  457 |     test('Negative: Empty string as password', async ({ request }) => {
  458 |         const responseBody = await verifyLoginWithFormData(request, { email: validEmail, password: '' });
  459 | 
  460 |         expect(responseBody.responseCode).not.toBe(200);
  461 |     });
  462 | 
  463 |     test('Negative: SQL injection in email field', async ({ request }) => {
  464 |         const responseBody = await verifyLogin(request, "' OR 1=1 --", validPassword);
  465 | 
  466 |         expect(responseBody.responseCode).not.toBe(200);
  467 |     });
  468 | 
  469 |     test('Negative: SQL injection in password field', async ({ request }) => {
  470 |         const responseBody = await verifyLogin(request, validEmail, "' OR 1=1 --");
  471 | 
  472 |         expect(responseBody.responseCode).not.toBe(200);
  473 |     });
  474 | 
  475 |     test('Negative: XSS injection in email field', async ({ request }) => {
  476 |         const responseBody = await verifyLogin(request, '<script>alert(1)</script>', validPassword);
  477 | 
  478 |         expect(responseBody.responseCode).not.toBe(200);
  479 |     });
  480 | 
  481 |     test('Negative: Special characters as email', async ({ request }) => {
  482 |         const responseBody = await verifyLogin(request, '!@#$%^&*()', validPassword);
  483 | 
```