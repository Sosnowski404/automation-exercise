# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> /verifyLogin endpoint tests >> Negative: Path traversal on verifyLogin
- Location: tests\api.spec.ts:548:9

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not 200
```

# Test source

```ts
  454 |     test('Negative: Empty string as password', async ({ request }) => {
  455 |         const responseBody = await verifyLoginWithFormData(request, { email: validEmail, password: '' });
  456 | 
  457 |         expect(responseBody.responseCode).not.toBe(200);
  458 |     });
  459 | 
  460 |     test('Negative: SQL injection in email field', async ({ request }) => {
  461 |         const responseBody = await verifyLogin(request, "' OR 1=1 --", validPassword);
  462 | 
  463 |         expect(responseBody.responseCode).not.toBe(200);
  464 |     });
  465 | 
  466 |     test('Negative: SQL injection in password field', async ({ request }) => {
  467 |         const responseBody = await verifyLogin(request, validEmail, "' OR 1=1 --");
  468 | 
  469 |         expect(responseBody.responseCode).not.toBe(200);
  470 |     });
  471 | 
  472 |     test('Negative: XSS injection in email field', async ({ request }) => {
  473 |         const responseBody = await verifyLogin(request, '<script>alert(1)</script>', validPassword);
  474 | 
  475 |         expect(responseBody.responseCode).not.toBe(200);
  476 |     });
  477 | 
  478 |     test('Negative: Special characters as email', async ({ request }) => {
  479 |         const responseBody = await verifyLogin(request, '!@#$%^&*()', validPassword);
  480 | 
  481 |         expect(responseBody.responseCode).not.toBe(200);
  482 |     });
  483 | 
  484 |     test('Negative: Very long string as email', async ({ request }) => {
  485 |         const longEmail = 'a'.repeat(10000) + '@test.com';
  486 |         const responseBody = await verifyLogin(request, longEmail, validPassword);
  487 | 
  488 |         expect(responseBody.responseCode).not.toBe(200);
  489 |     });
  490 | 
  491 |     test('Negative: Very long string as password', async ({ request }) => {
  492 |         const longPassword = 'a'.repeat(10000);
  493 |         const responseBody = await verifyLogin(request, validEmail, longPassword);
  494 | 
  495 |         expect(responseBody.responseCode).not.toBe(200);
  496 |     });
  497 | 
  498 |     test('Negative: Credentials as query params instead of form data', async ({ request }) => {
  499 |         const response = await rawRequest(request, {
  500 |             method: 'post',
  501 |             endpoint: 'verifyLogin',
  502 |             queryParams: { email: validEmail, password: validPassword },
  503 |         });
  504 |         const body = await response.json();
  505 |         expect(body.responseCode).toBe(400);
  506 |     });
  507 | 
  508 |     test('Negative: Extra unknown form params alongside valid credentials', async ({ request }) => {
  509 |         const response = await rawRequest(request, {
  510 |             method: 'post',
  511 |             endpoint: 'verifyLogin',
  512 |             form: { email: validEmail, password: validPassword, role: 'admin', token: 'fake123' },
  513 |         });
  514 |         const body = await response.json();
  515 |         expect(body.responseCode).toBe(200);
  516 |         expect(body.message).toBe('User exists!');
  517 |     });
  518 | 
  519 |     test('Negative: Wrong param names for email and password', async ({ request }) => {
  520 |         const response = await rawRequest(request, {
  521 |             method: 'post',
  522 |             endpoint: 'verifyLogin',
  523 |             form: { user_email: validEmail, user_password: validPassword },
  524 |         });
  525 |         const body = await response.json();
  526 |         expect(body.responseCode).toBe(400);
  527 |     });
  528 | 
  529 |     test('Negative: Path param appended to verifyLogin', async ({ request }) => {
  530 |         const response = await rawRequest(request, {
  531 |             method: 'post',
  532 |             endpoint: 'verifyLogin',
  533 |             pathSuffix: 'admin',
  534 |             form: { email: validEmail, password: validPassword },
  535 |         });
  536 |         expect(response.status()).not.toBe(200);
  537 |     });
  538 | 
  539 |     test('Negative: Numeric path param on verifyLogin', async ({ request }) => {
  540 |         const response = await rawRequest(request, {
  541 |             method: 'post',
  542 |             endpoint: 'verifyLogin',
  543 |             pathSuffix: '1',
  544 |         });
  545 |         expect(response.status()).not.toBe(200);
  546 |     });
  547 | 
  548 |     test('Negative: Path traversal on verifyLogin', async ({ request }) => {
  549 |         const response = await rawRequest(request, {
  550 |             method: 'post',
  551 |             endpoint: 'verifyLogin',
  552 |             pathSuffix: '../productsList',
  553 |         });
> 554 |         expect(response.status()).not.toBe(200);
      |                                       ^ Error: expect(received).not.toBe(expected) // Object.is equality
  555 |     });
  556 | 
  557 |     test('Negative: SQL injection in form param name', async ({ request }) => {
  558 |         const response = await rawRequest(request, {
  559 |             method: 'post',
  560 |             endpoint: 'verifyLogin',
  561 |             form: { "email' OR '1'='1": validEmail, password: validPassword },
  562 |         });
  563 |         const body = await response.json();
  564 |         expect(body.responseCode).toBe(400);
  565 |     });
  566 | 
  567 |     test('Negative: Swapped param names (password in email field)', async ({ request }) => {
  568 |         const response = await rawRequest(request, {
  569 |             method: 'post',
  570 |             endpoint: 'verifyLogin',
  571 |             form: { email: validPassword, password: validEmail },
  572 |         });
  573 |         const body = await response.json();
  574 |         expect(body.responseCode).not.toBe(200);
  575 |     });
  576 | 
  577 |     test('Negative: Duplicate email params with different values', async ({ request }) => {
  578 |         const response = await rawRequest(request, {
  579 |             method: 'post',
  580 |             endpoint: 'verifyLogin',
  581 |             form: { email: 'fake@fake.com', password: validPassword },
  582 |         });
  583 |         const body = await response.json();
  584 |         expect(body.responseCode).not.toBe(200);
  585 |     });
  586 | 
  587 |     test('Negative: GET with credentials as query params', async ({ request }) => {
  588 |         const response = await rawRequest(request, {
  589 |             method: 'get',
  590 |             endpoint: 'verifyLogin',
  591 |             queryParams: { email: validEmail, password: validPassword },
  592 |         });
  593 |         const body = await response.json();
  594 |         expect(body.responseCode).toBe(405);
  595 |     });
  596 | });
  597 | 
```