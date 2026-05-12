# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api.spec.ts >> /createAccount endpoint tests >> API 11: Create account without address fields should return 201
- Location: tests\api.spec.ts:720:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 400
```

# Test source

```ts
  629 |     });
  630 | 
  631 |     test('Negative: Create account with only email should return 400', async ({ request }) => {
  632 |         const responseBody = await createAccount(request, {
  633 |             email: randomEmail(),
  634 |         });
  635 | 
  636 |         expect(responseBody.responseCode).toBe(400);
  637 |     });
  638 | 
  639 |     test('Negative: Create account with only password should return 400', async ({ request }) => {
  640 |         const responseBody = await createAccount(request, {
  641 |             password: randomPassword(),
  642 |         });
  643 | 
  644 |         expect(responseBody.responseCode).toBe(400);
  645 |     });
  646 | 
  647 |     test('Negative: Create account with name + email (no password) should return 400', async ({ request }) => {
  648 |         const responseBody = await createAccount(request, {
  649 |             name: randomName(),
  650 |             email: randomEmail(),
  651 |         });
  652 | 
  653 |         expect(responseBody.responseCode).toBe(400);
  654 |     });
  655 | 
  656 |     test('Negative: Create account with name + password (no email) should return 400', async ({ request }) => {
  657 |         const responseBody = await createAccount(request, {
  658 |             name: randomName(),
  659 |             password: randomPassword(),
  660 |         });
  661 | 
  662 |         expect(responseBody.responseCode).toBe(400);
  663 |     });
  664 | 
  665 |     test('Negative: Create account with email + password (no name) should return 400', async ({ request }) => {
  666 |         const responseBody = await createAccount(request, {
  667 |             email: randomEmail(),
  668 |             password: randomPassword(),
  669 |         });
  670 | 
  671 |         expect(responseBody.responseCode).toBe(400);
  672 |     });
  673 | 
  674 |     test('Negative: Create account with no params should return 400', async ({ request }) => {
  675 |         const responseBody = await createAccount(request, {});
  676 | 
  677 |         expect(responseBody.responseCode).toBe(400);
  678 |     });
  679 | 
  680 |     test('Negative: Create account with duplicate email should return 400', async ({ request }) => {
  681 |         const params = generateFullAccountParams();
  682 |         await createAccount(request, params);
  683 | 
  684 |         const duplicateResponse = await createAccount(request, {
  685 |             ...generateFullAccountParams(),
  686 |             email: params.email,
  687 |         });
  688 | 
  689 |         expect(duplicateResponse.responseCode).toBe(400);
  690 | 
  691 |         await deleteAccount(request, params.email!, params.password!);
  692 |     });
  693 | 
  694 |     test('API 11: Create account without title should return 400', async ({ request }) => {
  695 |         const params = generateFullAccountParams();
  696 |         delete params.title;
  697 |         const responseBody = await createAccount(request, params);
  698 |         expect(responseBody.responseCode).toBe(400);
  699 |     });
  700 | 
  701 |     test('API 11: Create account without birth fields should return 201', async ({ request }) => {
  702 |         const params = generateFullAccountParams();
  703 |         delete params.birth_date;
  704 |         delete params.birth_month;
  705 |         delete params.birth_year;
  706 |         const responseBody = await createAccount(request, params);
  707 |         expect(responseBody.responseCode).toBe(201);
  708 |         await deleteAccount(request, params.email!, params.password!);
  709 |     });
  710 | 
  711 |     test('API 11: Create account without firstname + lastname should return 201', async ({ request }) => {
  712 |         const params = generateFullAccountParams();
  713 |         delete params.firstname;
  714 |         delete params.lastname;
  715 |         const responseBody = await createAccount(request, params);
  716 |         expect(responseBody.responseCode).toBe(201);
  717 |         await deleteAccount(request, params.email!, params.password!);
  718 |     });
  719 | 
  720 |     test('API 11: Create account without address fields should return 201', async ({ request }) => {
  721 |         const params = generateFullAccountParams();
  722 |         delete params.address1;
  723 |         delete params.address2;
  724 |         delete params.country;
  725 |         delete params.zipcode;
  726 |         delete params.state;
  727 |         delete params.city;
  728 |         const responseBody = await createAccount(request, params);
> 729 |         expect(responseBody.responseCode).toBe(201);
      |                                           ^ Error: expect(received).toBe(expected) // Object.is equality
  730 |         await deleteAccount(request, params.email!, params.password!);
  731 |     });
  732 | 
  733 |     test('API 11: Create account without company + mobile should return 201', async ({ request }) => {
  734 |         const params = generateFullAccountParams();
  735 |         delete params.company;
  736 |         delete params.mobile_number;
  737 |         const responseBody = await createAccount(request, params);
  738 |         expect(responseBody.responseCode).toBe(201);
  739 |         await deleteAccount(request, params.email!, params.password!);
  740 |     });
  741 | 
  742 |     test('API 11: Created account can be verified via verifyLogin', async ({ request }) => {
  743 |         const params = generateFullAccountParams();
  744 |         await createAccount(request, params);
  745 | 
  746 |         const loginResponse = await verifyLogin(request, params.email!, params.password!);
  747 |         expect(loginResponse.responseCode).toBe(200);
  748 |         expect(loginResponse.message).toBe('User exists!');
  749 | 
  750 |         await deleteAccount(request, params.email!, params.password!);
  751 |     });
  752 | 
  753 |     test('Negative: GET method on createAccount should not return 201', async ({ request }) => {
  754 |         const responseBody = await getCreateAccount(request);
  755 |         expect(responseBody.responseCode).not.toBe(201);
  756 |     });
  757 | 
  758 |     test('Negative: PUT method on createAccount should not return 201', async ({ request }) => {
  759 |         const responseBody = await putCreateAccount(request);
  760 |         expect(responseBody.responseCode).not.toBe(201);
  761 |     });
  762 | 
  763 |     test('Negative: DELETE method on createAccount should not return 201', async ({ request }) => {
  764 |         const response = await rawRequest(request, {
  765 |             method: 'delete',
  766 |             endpoint: 'createAccount',
  767 |         });
  768 |         const body = await response.json();
  769 |         expect(body.responseCode).not.toBe(201);
  770 |     });
  771 | 
  772 |     test('Negative: Numeric value as name', async ({ request }) => {
  773 |         const params = generateFullAccountParams({ name: '12345' });
  774 |         const responseBody = await createAccount(request, params);
  775 |         expect(responseBody.responseCode).toBe(201);
  776 |         await deleteAccount(request, params.email!, params.password!);
  777 |     });
  778 | 
  779 |     test('Negative: Invalid email format', async ({ request }) => {
  780 |         const params = generateFullAccountParams({ email: 'not-an-email' });
  781 |         const responseBody = await createAccount(request, params);
  782 |         expect(responseBody.responseCode).not.toBe(201);
  783 |     });
  784 | 
  785 |     test('Negative: SQL injection in name field', async ({ request }) => {
  786 |         const params = generateFullAccountParams({ name: "' OR 1=1 --" });
  787 |         const responseBody = await createAccount(request, params);
  788 |         expect(responseBody.responseCode).toBe(201);
  789 |         await deleteAccount(request, params.email!, params.password!);
  790 |     });
  791 | 
  792 |     test('Negative: XSS injection in name field', async ({ request }) => {
  793 |         const params = generateFullAccountParams({ name: '<script>alert(1)</script>' });
  794 |         const responseBody = await createAccount(request, params);
  795 |         expect(responseBody.responseCode).toBe(201);
  796 |         await deleteAccount(request, params.email!, params.password!);
  797 |     });
  798 | 
  799 |     test('Negative: Very long string as name', async ({ request }) => {
  800 |         const params = generateFullAccountParams({ name: 'a'.repeat(10000) });
  801 |         const responseBody = await createAccount(request, params);
  802 |         expect(responseBody.responseCode).toBe(201);
  803 |         await deleteAccount(request, params.email!, params.password!);
  804 |     });
  805 | 
  806 |     test('Negative: Empty string as name', async ({ request }) => {
  807 |         const responseBody = await createAccount(request, {
  808 |             name: '',
  809 |             email: randomEmail(),
  810 |             password: randomPassword(),
  811 |         });
  812 |         expect(responseBody.responseCode).toBe(400);
  813 |     });
  814 | 
  815 |     test('Negative: Empty string as email', async ({ request }) => {
  816 |         const responseBody = await createAccount(request, {
  817 |             name: randomName(),
  818 |             email: '',
  819 |             password: randomPassword(),
  820 |         });
  821 |         expect(responseBody.responseCode).toBe(400);
  822 |     });
  823 | 
  824 |     test('Negative: Empty string as password', async ({ request }) => {
  825 |         const responseBody = await createAccount(request, {
  826 |             name: randomName(),
  827 |             email: randomEmail(),
  828 |             password: '',
  829 |         });
```