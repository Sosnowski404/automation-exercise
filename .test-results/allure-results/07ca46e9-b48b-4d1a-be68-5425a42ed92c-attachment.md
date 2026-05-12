# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> /createAccount endpoint tests >> API 11: Create account with required + title
- Location: tests\api.spec.ts:699:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 400
```

# Test source

```ts
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
  619 |             password,
  620 |         });
  621 | 
  622 |         expect(responseBody.responseCode).toBe(201);
  623 |         expect(responseBody.message).toBe('User created!');
  624 | 
  625 |         await deleteAccount(request, email, password);
  626 |     });
  627 | 
  628 |     test('Negative: Create account with only name should return 400', async ({ request }) => {
  629 |         const responseBody = await createAccount(request, {
  630 |             name: randomName(),
  631 |         });
  632 | 
  633 |         expect(responseBody.responseCode).toBe(400);
  634 |     });
  635 | 
  636 |     test('Negative: Create account with only email should return 400', async ({ request }) => {
  637 |         const responseBody = await createAccount(request, {
  638 |             email: randomEmail(),
  639 |         });
  640 | 
  641 |         expect(responseBody.responseCode).toBe(400);
  642 |     });
  643 | 
  644 |     test('Negative: Create account with only password should return 400', async ({ request }) => {
  645 |         const responseBody = await createAccount(request, {
  646 |             password: randomPassword(),
  647 |         });
  648 | 
  649 |         expect(responseBody.responseCode).toBe(400);
  650 |     });
  651 | 
  652 |     test('Negative: Create account with name + email (no password) should return 400', async ({ request }) => {
  653 |         const responseBody = await createAccount(request, {
  654 |             name: randomName(),
  655 |             email: randomEmail(),
  656 |         });
  657 | 
  658 |         expect(responseBody.responseCode).toBe(400);
  659 |     });
  660 | 
  661 |     test('Negative: Create account with name + password (no email) should return 400', async ({ request }) => {
  662 |         const responseBody = await createAccount(request, {
  663 |             name: randomName(),
  664 |             password: randomPassword(),
  665 |         });
  666 | 
  667 |         expect(responseBody.responseCode).toBe(400);
  668 |     });
  669 | 
  670 |     test('Negative: Create account with email + password (no name) should return 400', async ({ request }) => {
  671 |         const responseBody = await createAccount(request, {
  672 |             email: randomEmail(),
  673 |             password: randomPassword(),
  674 |         });
  675 | 
  676 |         expect(responseBody.responseCode).toBe(400);
  677 |     });
  678 | 
  679 |     test('Negative: Create account with no params should return 400', async ({ request }) => {
  680 |         const responseBody = await createAccount(request, {});
  681 | 
  682 |         expect(responseBody.responseCode).toBe(400);
  683 |     });
  684 | 
  685 |     test('Negative: Create account with duplicate email should return 400', async ({ request }) => {
  686 |         const params = generateFullAccountParams();
  687 |         await createAccount(request, params);
  688 | 
  689 |         const duplicateResponse = await createAccount(request, {
  690 |             ...generateFullAccountParams(),
  691 |             email: params.email,
  692 |         });
  693 | 
  694 |         expect(duplicateResponse.responseCode).toBe(400);
  695 | 
  696 |         await deleteAccount(request, params.email!, params.password!);
  697 |     });
  698 | 
  699 |     test('API 11: Create account with required + title', async ({ request }) => {
  700 |         const email = randomEmail();
  701 |         const password = randomPassword();
  702 |         const responseBody = await createAccount(request, {
  703 |             name: randomName(), email, password,
  704 |             title: randomTitle(),
  705 |         });
> 706 |         expect(responseBody.responseCode).toBe(201);
      |                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  707 |         await deleteAccount(request, email, password);
  708 |     });
  709 | 
  710 |     test('API 11: Create account with required + birth fields', async ({ request }) => {
  711 |         const email = randomEmail();
  712 |         const password = randomPassword();
  713 |         const birth = randomBirthDate();
  714 |         const responseBody = await createAccount(request, {
  715 |             name: randomName(), email, password,
  716 |             ...birth,
  717 |         });
  718 |         expect(responseBody.responseCode).toBe(201);
  719 |         await deleteAccount(request, email, password);
  720 |     });
  721 | 
  722 |     test('API 11: Create account with required + firstname + lastname', async ({ request }) => {
  723 |         const email = randomEmail();
  724 |         const password = randomPassword();
  725 |         const responseBody = await createAccount(request, {
  726 |             name: randomName(), email, password,
  727 |             firstname: randomFirstName(),
  728 |             lastname: randomLastName(),
  729 |         });
  730 |         expect(responseBody.responseCode).toBe(201);
  731 |         await deleteAccount(request, email, password);
  732 |     });
  733 | 
  734 |     test('API 11: Create account with required + address fields', async ({ request }) => {
  735 |         const email = randomEmail();
  736 |         const password = randomPassword();
  737 |         const responseBody = await createAccount(request, {
  738 |             name: randomName(), email, password,
  739 |             address1: randomAddress(),
  740 |             address2: randomAddress(),
  741 |             country: randomCountry(),
  742 |             zipcode: randomZipcode(),
  743 |             state: randomState(),
  744 |             city: randomCity(),
  745 |         });
  746 |         expect(responseBody.responseCode).toBe(201);
  747 |         await deleteAccount(request, email, password);
  748 |     });
  749 | 
  750 |     test('API 11: Create account with required + company + mobile', async ({ request }) => {
  751 |         const email = randomEmail();
  752 |         const password = randomPassword();
  753 |         const responseBody = await createAccount(request, {
  754 |             name: randomName(), email, password,
  755 |             company: randomCompany(),
  756 |             mobile_number: randomPhone(),
  757 |         });
  758 |         expect(responseBody.responseCode).toBe(201);
  759 |         await deleteAccount(request, email, password);
  760 |     });
  761 | 
  762 |     test('API 11: Created account can be verified via verifyLogin', async ({ request }) => {
  763 |         const params = generateFullAccountParams();
  764 |         await createAccount(request, params);
  765 | 
  766 |         const loginResponse = await verifyLogin(request, params.email!, params.password!);
  767 |         expect(loginResponse.responseCode).toBe(200);
  768 |         expect(loginResponse.message).toBe('User exists!');
  769 | 
  770 |         await deleteAccount(request, params.email!, params.password!);
  771 |     });
  772 | 
  773 |     test('Negative: GET method on createAccount should return 405', async ({ request }) => {
  774 |         const responseBody = await getCreateAccount(request);
  775 |         expect(responseBody.responseCode).toBe(405);
  776 |     });
  777 | 
  778 |     test('Negative: PUT method on createAccount should return 405', async ({ request }) => {
  779 |         const responseBody = await putCreateAccount(request);
  780 |         expect(responseBody.responseCode).toBe(405);
  781 |     });
  782 | 
  783 |     test('Negative: DELETE method on createAccount should return 405', async ({ request }) => {
  784 |         const response = await rawRequest(request, {
  785 |             method: 'delete',
  786 |             endpoint: 'createAccount',
  787 |         });
  788 |         const body = await response.json();
  789 |         expect(body.responseCode).toBe(405);
  790 |     });
  791 | 
  792 |     test('Negative: Numeric value as name', async ({ request }) => {
  793 |         const email = randomEmail();
  794 |         const password = randomPassword();
  795 |         const responseBody = await createAccount(request, {
  796 |             name: '12345',
  797 |             email,
  798 |             password,
  799 |         });
  800 |         expect(responseBody.responseCode).toBe(201);
  801 |         await deleteAccount(request, email, password);
  802 |     });
  803 | 
  804 |     test('Negative: Invalid email format', async ({ request }) => {
  805 |         const responseBody = await createAccount(request, {
  806 |             name: randomName(),
```