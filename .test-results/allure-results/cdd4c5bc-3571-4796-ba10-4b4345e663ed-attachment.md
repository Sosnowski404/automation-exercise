# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> /verifyLogin endpoint tests >> API 7: POST To Verify Login with valid details should return 200
- Location: tests\api.spec.ts:378:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Test source

```ts
  281 |         const responseBody = await searchProduct(request, "' OR 1=1 --");
  282 | 
  283 |         expect(responseBody.responseCode).toBe(200);
  284 |         expect(responseBody.products).toBeDefined();
  285 |     });
  286 | 
  287 |     test('Negative: HTML/script injection as search_product param', async ({ request }) => {
  288 |         const responseBody = await searchProduct(request, '<script>alert(1)</script>');
  289 | 
  290 |         expect(responseBody.responseCode).toBe(200);
  291 |         expect(responseBody.products).toBeDefined();
  292 |     });
  293 | 
  294 |     test('Negative: Extra unknown form params alongside search_product', async ({ request }) => {
  295 |         const response = await rawRequest(request, {
  296 |             method: 'post',
  297 |             endpoint: 'searchProduct',
  298 |             form: { search_product: 'top', extra_param: 'should_be_ignored', limit: '5' },
  299 |         });
  300 |         const body = await response.json();
  301 |         expect(body.responseCode).toBe(200);
  302 |     });
  303 | 
  304 |     test('Negative: Wrong param name instead of search_product', async ({ request }) => {
  305 |         const response = await rawRequest(request, {
  306 |             method: 'post',
  307 |             endpoint: 'searchProduct',
  308 |             form: { search: 'top' },
  309 |         });
  310 |         const body = await response.json();
  311 |         expect(body.responseCode).toBe(400);
  312 |     });
  313 | 
  314 |     test('Negative: search_product as query param instead of form data', async ({ request }) => {
  315 |         const response = await rawRequest(request, {
  316 |             method: 'post',
  317 |             endpoint: 'searchProduct',
  318 |             queryParams: { search_product: 'top' },
  319 |         });
  320 |         const body = await response.json();
  321 |         expect(body.responseCode).toBe(400);
  322 |     });
  323 | 
  324 |     test('Negative: Path param appended to searchProduct', async ({ request }) => {
  325 |         const response = await rawRequest(request, {
  326 |             method: 'post',
  327 |             endpoint: 'searchProduct',
  328 |             pathSuffix: 'top',
  329 |             form: { search_product: 'top' },
  330 |         });
  331 |         expect(response.status()).not.toBe(200);
  332 |     });
  333 | 
  334 |     test('Negative: SQL injection in form param name', async ({ request }) => {
  335 |         const response = await rawRequest(request, {
  336 |             method: 'post',
  337 |             endpoint: 'searchProduct',
  338 |             form: { "search_product' OR '1'='1": 'top' },
  339 |         });
  340 |         const body = await response.json();
  341 |         expect(body.responseCode).toBe(400);
  342 |     });
  343 | 
  344 |     test('Negative: Numeric path param on searchProduct', async ({ request }) => {
  345 |         const response = await rawRequest(request, {
  346 |             method: 'post',
  347 |             endpoint: 'searchProduct',
  348 |             pathSuffix: '123',
  349 |         });
  350 |         expect(response.status()).not.toBe(200);
  351 |     });
  352 | 
  353 |     test('Negative: Multiple search_product values via comma', async ({ request }) => {
  354 |         const response = await rawRequest(request, {
  355 |             method: 'post',
  356 |             endpoint: 'searchProduct',
  357 |             form: { search_product: 'top,jean,tshirt' },
  358 |         });
  359 |         const body = await response.json();
  360 |         expect(body.responseCode).toBe(200);
  361 |     });
  362 | 
  363 |     test('Negative: Path traversal on searchProduct', async ({ request }) => {
  364 |         const response = await rawRequest(request, {
  365 |             method: 'post',
  366 |             endpoint: 'searchProduct',
  367 |             pathSuffix: '../productsList',
  368 |         });
  369 |         const body = await response.json();
  370 |         expect(body.responseCode).toBe(405);
  371 |     });
  372 | });
  373 | 
  374 | test.describe('/verifyLogin endpoint tests', () => {
  375 |     const validEmail = process.env.TEST_USER_EMAIL!;
  376 |     const validPassword = process.env.TEST_USER_PASSWORD!;
  377 | 
  378 |     test('API 7: POST To Verify Login with valid details should return 200', async ({ request }) => {
  379 |         const responseBody = await verifyLogin(request, validEmail, validPassword);
  380 | 
> 381 |         expect(responseBody.responseCode).toBe(200);
      |                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  382 |         expect(responseBody.message).toBe('User exists!');
  383 |     });
  384 | 
  385 |     test('API 8: POST To Verify Login without email param should return 400', async ({ request }) => {
  386 |         const responseBody = await verifyLoginWithFormData(request, { password: validPassword });
  387 | 
  388 |         expect(responseBody.responseCode).toBe(400);
  389 |         expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');
  390 |     });
  391 | 
  392 |     test('API 8: POST To Verify Login without password param should return 400', async ({ request }) => {
  393 |         const responseBody = await verifyLoginWithFormData(request, { email: validEmail });
  394 | 
  395 |         expect(responseBody.responseCode).toBe(400);
  396 |         expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');
  397 |     });
  398 | 
  399 |     test('API 8: POST To Verify Login without any params should return 400', async ({ request }) => {
  400 |         const responseBody = await verifyLoginWithoutParams(request);
  401 | 
  402 |         expect(responseBody.responseCode).toBe(400);
  403 |         expect(responseBody.message).toBe('Bad request, email or password parameter is missing in POST request.');
  404 |     });
  405 | 
  406 |     test('API 9: DELETE To Verify Login should return 405', async ({ request }) => {
  407 |         const responseBody = await deleteVerifyLogin(request);
  408 | 
  409 |         expect(responseBody.responseCode).toBe(405);
  410 |         expect(responseBody.message).toBe('This request method is not supported.');
  411 |     });
  412 | 
  413 |     test('Negative: GET method on verifyLogin should return 405', async ({ request }) => {
  414 |         const responseBody = await getVerifyLogin(request);
  415 | 
  416 |         expect(responseBody.responseCode).toBe(405);
  417 |     });
  418 | 
  419 |     test('Negative: PUT method on verifyLogin should return 405', async ({ request }) => {
  420 |         const responseBody = await putVerifyLogin(request);
  421 | 
  422 |         expect(responseBody.responseCode).toBe(405);
  423 |     });
  424 | 
  425 |     test('Negative: Invalid email with valid password should not return 200', async ({ request }) => {
  426 |         const responseBody = await verifyLogin(request, 'nonexistent@fake.com', validPassword);
  427 | 
  428 |         expect(responseBody.responseCode).not.toBe(200);
  429 |     });
  430 | 
  431 |     test('Negative: Valid email with wrong password should not return 200', async ({ request }) => {
  432 |         const responseBody = await verifyLogin(request, validEmail, 'wrongpassword123');
  433 | 
  434 |         expect(responseBody.responseCode).not.toBe(200);
  435 |     });
  436 | 
  437 |     test('Negative: Both email and password invalid should not return 200', async ({ request }) => {
  438 |         const responseBody = await verifyLogin(request, 'fake@fake.com', 'fakepass');
  439 | 
  440 |         expect(responseBody.responseCode).not.toBe(200);
  441 |     });
  442 | 
  443 |     test('Negative: Numeric value as email', async ({ request }) => {
  444 |         const responseBody = await verifyLogin(request, '12345', validPassword);
  445 | 
  446 |         expect(responseBody.responseCode).not.toBe(200);
  447 |     });
  448 | 
  449 |     test('Negative: Empty string as email', async ({ request }) => {
  450 |         const responseBody = await verifyLoginWithFormData(request, { email: '', password: validPassword });
  451 | 
  452 |         expect(responseBody.responseCode).not.toBe(200);
  453 |     });
  454 | 
  455 |     test('Negative: Empty string as password', async ({ request }) => {
  456 |         const responseBody = await verifyLoginWithFormData(request, { email: validEmail, password: '' });
  457 | 
  458 |         expect(responseBody.responseCode).not.toBe(200);
  459 |     });
  460 | 
  461 |     test('Negative: SQL injection in email field', async ({ request }) => {
  462 |         const responseBody = await verifyLogin(request, "' OR 1=1 --", validPassword);
  463 | 
  464 |         expect(responseBody.responseCode).not.toBe(200);
  465 |     });
  466 | 
  467 |     test('Negative: SQL injection in password field', async ({ request }) => {
  468 |         const responseBody = await verifyLogin(request, validEmail, "' OR 1=1 --");
  469 | 
  470 |         expect(responseBody.responseCode).not.toBe(200);
  471 |     });
  472 | 
  473 |     test('Negative: XSS injection in email field', async ({ request }) => {
  474 |         const responseBody = await verifyLogin(request, '<script>alert(1)</script>', validPassword);
  475 | 
  476 |         expect(responseBody.responseCode).not.toBe(200);
  477 |     });
  478 | 
  479 |     test('Negative: Special characters as email', async ({ request }) => {
  480 |         const responseBody = await verifyLogin(request, '!@#$%^&*()', validPassword);
  481 | 
```