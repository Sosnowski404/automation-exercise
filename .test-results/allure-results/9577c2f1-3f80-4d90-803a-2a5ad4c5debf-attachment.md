# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> /verifyLogin endpoint tests >> Negative: Extra unknown form params alongside valid credentials
- Location: tests\api.spec.ts:511:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404
```

# Test source

```ts
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
  484 |         expect(responseBody.responseCode).not.toBe(200);
  485 |     });
  486 | 
  487 |     test('Negative: Very long string as email', async ({ request }) => {
  488 |         const longEmail = 'a'.repeat(10000) + '@test.com';
  489 |         const responseBody = await verifyLogin(request, longEmail, validPassword);
  490 | 
  491 |         expect(responseBody.responseCode).not.toBe(200);
  492 |     });
  493 | 
  494 |     test('Negative: Very long string as password', async ({ request }) => {
  495 |         const longPassword = 'a'.repeat(10000);
  496 |         const responseBody = await verifyLogin(request, validEmail, longPassword);
  497 | 
  498 |         expect(responseBody.responseCode).not.toBe(200);
  499 |     });
  500 | 
  501 |     test('Negative: Credentials as query params instead of form data', async ({ request }) => {
  502 |         const response = await rawRequest(request, {
  503 |             method: 'post',
  504 |             endpoint: 'verifyLogin',
  505 |             queryParams: { email: validEmail, password: validPassword },
  506 |         });
  507 |         const body = await response.json();
  508 |         expect(body.responseCode).toBe(400);
  509 |     });
  510 | 
  511 |     test('Negative: Extra unknown form params alongside valid credentials', async ({ request }) => {
  512 |         const response = await rawRequest(request, {
  513 |             method: 'post',
  514 |             endpoint: 'verifyLogin',
  515 |             form: { email: validEmail, password: validPassword, role: 'admin', token: 'fake123' },
  516 |         });
  517 |         const body = await response.json();
> 518 |         expect(body.responseCode).toBe(200);
      |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  519 |         expect(body.message).toBe('User exists!');
  520 |     });
  521 | 
  522 |     test('Negative: Wrong param names for email and password', async ({ request }) => {
  523 |         const response = await rawRequest(request, {
  524 |             method: 'post',
  525 |             endpoint: 'verifyLogin',
  526 |             form: { user_email: validEmail, user_password: validPassword },
  527 |         });
  528 |         const body = await response.json();
  529 |         expect(body.responseCode).toBe(400);
  530 |     });
  531 | 
  532 |     test('Negative: Path param appended to verifyLogin', async ({ request }) => {
  533 |         const response = await rawRequest(request, {
  534 |             method: 'post',
  535 |             endpoint: 'verifyLogin',
  536 |             pathSuffix: 'admin',
  537 |             form: { email: validEmail, password: validPassword },
  538 |         });
  539 |         expect(response.status()).not.toBe(200);
  540 |     });
  541 | 
  542 |     test('Negative: Numeric path param on verifyLogin', async ({ request }) => {
  543 |         const response = await rawRequest(request, {
  544 |             method: 'post',
  545 |             endpoint: 'verifyLogin',
  546 |             pathSuffix: '1',
  547 |         });
  548 |         expect(response.status()).not.toBe(200);
  549 |     });
  550 | 
  551 |     test('Negative: Path traversal on verifyLogin', async ({ request }) => {
  552 |         const response = await rawRequest(request, {
  553 |             method: 'post',
  554 |             endpoint: 'verifyLogin',
  555 |             pathSuffix: '../productsList',
  556 |         });
  557 |         const body = await response.json();
  558 |         expect(body.responseCode).toBe(405);
  559 |     });
  560 | 
  561 |     test('Negative: SQL injection in form param name', async ({ request }) => {
  562 |         const response = await rawRequest(request, {
  563 |             method: 'post',
  564 |             endpoint: 'verifyLogin',
  565 |             form: { "email' OR '1'='1": validEmail, password: validPassword },
  566 |         });
  567 |         const body = await response.json();
  568 |         expect(body.responseCode).toBe(400);
  569 |     });
  570 | 
  571 |     test('Negative: Swapped param names (password in email field)', async ({ request }) => {
  572 |         const response = await rawRequest(request, {
  573 |             method: 'post',
  574 |             endpoint: 'verifyLogin',
  575 |             form: { email: validPassword, password: validEmail },
  576 |         });
  577 |         const body = await response.json();
  578 |         expect(body.responseCode).not.toBe(200);
  579 |     });
  580 | 
  581 |     test('Negative: Duplicate email params with different values', async ({ request }) => {
  582 |         const response = await rawRequest(request, {
  583 |             method: 'post',
  584 |             endpoint: 'verifyLogin',
  585 |             form: { email: 'fake@fake.com', password: validPassword },
  586 |         });
  587 |         const body = await response.json();
  588 |         expect(body.responseCode).not.toBe(200);
  589 |     });
  590 | 
  591 |     test('Negative: GET with credentials as query params', async ({ request }) => {
  592 |         const response = await rawRequest(request, {
  593 |             method: 'get',
  594 |             endpoint: 'verifyLogin',
  595 |             queryParams: { email: validEmail, password: validPassword },
  596 |         });
  597 |         const body = await response.json();
  598 |         expect(body.responseCode).toBe(405);
  599 |     });
  600 | });
  601 | 
  602 | test.describe('/createAccount endpoint tests', () => {
  603 |     test('API 11: POST Create Account with all params should return 201', async ({ request }) => {
  604 |         const params = generateFullAccountParams();
  605 |         const responseBody = await createAccount(request, params);
  606 | 
  607 |         expect(responseBody.responseCode).toBe(201);
  608 |         expect(responseBody.message).toBe('User created!');
  609 | 
  610 |         await deleteAccount(request, params.email!, params.password!);
  611 |     });
  612 | 
  613 |     test('API 11: Create account with only required params (name, email, password)', async ({ request }) => {
  614 |         const email = randomEmail();
  615 |         const password = randomPassword();
  616 |         const responseBody = await createAccount(request, {
  617 |             name: randomName(),
  618 |             email,
```