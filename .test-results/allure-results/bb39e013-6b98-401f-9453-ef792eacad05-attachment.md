# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> /verifyLogin endpoint tests >> Negative: Extra unknown form params alongside valid credentials
- Location: tests\api.spec.ts:509:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Test source

```ts
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
  482 |         expect(responseBody.responseCode).not.toBe(200);
  483 |     });
  484 | 
  485 |     test('Negative: Very long string as email', async ({ request }) => {
  486 |         const longEmail = 'a'.repeat(10000) + '@test.com';
  487 |         const responseBody = await verifyLogin(request, longEmail, validPassword);
  488 | 
  489 |         expect(responseBody.responseCode).not.toBe(200);
  490 |     });
  491 | 
  492 |     test('Negative: Very long string as password', async ({ request }) => {
  493 |         const longPassword = 'a'.repeat(10000);
  494 |         const responseBody = await verifyLogin(request, validEmail, longPassword);
  495 | 
  496 |         expect(responseBody.responseCode).not.toBe(200);
  497 |     });
  498 | 
  499 |     test('Negative: Credentials as query params instead of form data', async ({ request }) => {
  500 |         const response = await rawRequest(request, {
  501 |             method: 'post',
  502 |             endpoint: 'verifyLogin',
  503 |             queryParams: { email: validEmail, password: validPassword },
  504 |         });
  505 |         const body = await response.json();
  506 |         expect(body.responseCode).toBe(400);
  507 |     });
  508 | 
  509 |     test('Negative: Extra unknown form params alongside valid credentials', async ({ request }) => {
  510 |         const response = await rawRequest(request, {
  511 |             method: 'post',
  512 |             endpoint: 'verifyLogin',
  513 |             form: { email: validEmail, password: validPassword, role: 'admin', token: 'fake123' },
  514 |         });
  515 |         const body = await response.json();
> 516 |         expect(body.responseCode).toBe(200);
      |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  517 |         expect(body.message).toBe('User exists!');
  518 |     });
  519 | 
  520 |     test('Negative: Wrong param names for email and password', async ({ request }) => {
  521 |         const response = await rawRequest(request, {
  522 |             method: 'post',
  523 |             endpoint: 'verifyLogin',
  524 |             form: { user_email: validEmail, user_password: validPassword },
  525 |         });
  526 |         const body = await response.json();
  527 |         expect(body.responseCode).toBe(400);
  528 |     });
  529 | 
  530 |     test('Negative: Path param appended to verifyLogin', async ({ request }) => {
  531 |         const response = await rawRequest(request, {
  532 |             method: 'post',
  533 |             endpoint: 'verifyLogin',
  534 |             pathSuffix: 'admin',
  535 |             form: { email: validEmail, password: validPassword },
  536 |         });
  537 |         expect(response.status()).not.toBe(200);
  538 |     });
  539 | 
  540 |     test('Negative: Numeric path param on verifyLogin', async ({ request }) => {
  541 |         const response = await rawRequest(request, {
  542 |             method: 'post',
  543 |             endpoint: 'verifyLogin',
  544 |             pathSuffix: '1',
  545 |         });
  546 |         expect(response.status()).not.toBe(200);
  547 |     });
  548 | 
  549 |     test('Negative: Path traversal on verifyLogin', async ({ request }) => {
  550 |         const response = await rawRequest(request, {
  551 |             method: 'post',
  552 |             endpoint: 'verifyLogin',
  553 |             pathSuffix: '../productsList',
  554 |         });
  555 |         const body = await response.json();
  556 |         expect(body.responseCode).toBe(405);
  557 |     });
  558 | 
  559 |     test('Negative: SQL injection in form param name', async ({ request }) => {
  560 |         const response = await rawRequest(request, {
  561 |             method: 'post',
  562 |             endpoint: 'verifyLogin',
  563 |             form: { "email' OR '1'='1": validEmail, password: validPassword },
  564 |         });
  565 |         const body = await response.json();
  566 |         expect(body.responseCode).toBe(400);
  567 |     });
  568 | 
  569 |     test('Negative: Swapped param names (password in email field)', async ({ request }) => {
  570 |         const response = await rawRequest(request, {
  571 |             method: 'post',
  572 |             endpoint: 'verifyLogin',
  573 |             form: { email: validPassword, password: validEmail },
  574 |         });
  575 |         const body = await response.json();
  576 |         expect(body.responseCode).not.toBe(200);
  577 |     });
  578 | 
  579 |     test('Negative: Duplicate email params with different values', async ({ request }) => {
  580 |         const response = await rawRequest(request, {
  581 |             method: 'post',
  582 |             endpoint: 'verifyLogin',
  583 |             form: { email: 'fake@fake.com', password: validPassword },
  584 |         });
  585 |         const body = await response.json();
  586 |         expect(body.responseCode).not.toBe(200);
  587 |     });
  588 | 
  589 |     test('Negative: GET with credentials as query params', async ({ request }) => {
  590 |         const response = await rawRequest(request, {
  591 |             method: 'get',
  592 |             endpoint: 'verifyLogin',
  593 |             queryParams: { email: validEmail, password: validPassword },
  594 |         });
  595 |         const body = await response.json();
  596 |         expect(body.responseCode).toBe(405);
  597 |     });
  598 | });
  599 | 
```