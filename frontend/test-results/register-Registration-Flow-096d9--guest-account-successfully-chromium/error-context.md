# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.ts >> Registration Flow >> Register new guest account successfully
- Location: tests\register.spec.ts:11:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Ngân Hà Hotel" [ref=e5] [cursor=pointer]:
          - /url: /
          - generic [ref=e6]: Ngân Hà Hotel
        - navigation [ref=e7]:
          - link "Phòng nghỉ" [ref=e8] [cursor=pointer]:
            - /url: /rooms
          - link "Đánh giá" [ref=e9] [cursor=pointer]:
            - /url: /reviews
          - link "Giới thiệu" [ref=e10] [cursor=pointer]:
            - /url: /about
          - link "Liên hệ" [ref=e11] [cursor=pointer]:
            - /url: /contact
        - generic [ref=e12]:
          - link "Đăng nhập" [ref=e13] [cursor=pointer]:
            - /url: /login
            - button "Đăng nhập" [ref=e14]
          - link "Reserve Now" [ref=e15] [cursor=pointer]:
            - /url: /rooms
            - button "Reserve Now" [ref=e16]
    - main [ref=e17]:
      - generic [ref=e19]:
        - heading "404" [level=1] [ref=e20]
        - heading "Trang không tồn tại" [level=2] [ref=e21]
        - paragraph [ref=e22]: Xin lỗi, chúng tôi không tìm thấy trang bạn yêu cầu.
        - link "Về trang chủ" [ref=e23] [cursor=pointer]:
          - /url: /
          - button "Về trang chủ" [ref=e24]
    - contentinfo [ref=e25]:
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]:
            - heading "Khách Sạn Ngân Hà" [level=3] [ref=e29]
            - paragraph [ref=e30]: Nghỉ dưỡng tuyệt vời tại đảo Quan Lạn, vịnh Bái Tử Long
            - generic [ref=e31]:
              - link [ref=e32] [cursor=pointer]:
                - /url: https://facebook.com
                - img [ref=e33]
              - link [ref=e35] [cursor=pointer]:
                - /url: https://zalo.me/0912326997
                - img [ref=e36]
          - generic [ref=e38]:
            - heading "Loại phòng" [level=4] [ref=e39]
            - list [ref=e40]:
              - listitem [ref=e41]:
                - link "Phòng Đôi 2 Giường" [ref=e42] [cursor=pointer]:
                  - /url: /rooms?type=doi-2-giuong
              - listitem [ref=e43]:
                - link "Phòng Đơn View Biển" [ref=e44] [cursor=pointer]:
                  - /url: /rooms?type=don-view-bien
              - listitem [ref=e45]:
                - link "Phòng VIP" [ref=e46] [cursor=pointer]:
                  - /url: /rooms?type=vip
              - listitem [ref=e47]:
                - link "Phòng Gia Đình" [ref=e48] [cursor=pointer]:
                  - /url: /rooms?type=gia-dinh
          - generic [ref=e49]:
            - heading "Hỗ trợ" [level=4] [ref=e50]
            - list [ref=e51]:
              - listitem [ref=e52]:
                - link "Giới thiệu" [ref=e53] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e54]:
                - link "Câu hỏi thường gặp" [ref=e55] [cursor=pointer]:
                  - /url: /faq
              - listitem [ref=e56]:
                - link "Chính sách đặt phòng" [ref=e57] [cursor=pointer]:
                  - /url: /policy
              - listitem [ref=e58]:
                - link "Điều khoản sử dụng" [ref=e59] [cursor=pointer]:
                  - /url: /terms
          - generic [ref=e60]:
            - heading "Liên hệ" [level=4] [ref=e61]
            - list [ref=e62]:
              - listitem [ref=e63]:
                - img [ref=e65]
                - link "0912 326 997" [ref=e67] [cursor=pointer]:
                  - /url: tel:0912326997
              - listitem [ref=e68]:
                - img [ref=e70]
                - link "nganhahotelquanlan@gmail.com" [ref=e73] [cursor=pointer]:
                  - /url: mailto:nganhahotelquanlan@gmail.com
              - listitem [ref=e74]:
                - img [ref=e76]
                - generic [ref=e79]: Đảo Quan Lạn, Vân Đồn, Quảng Ninh
              - listitem [ref=e80]:
                - img [ref=e82]
                - generic [ref=e85]: "Check-in: 13:00 • Check-out: 12:00"
        - paragraph [ref=e87]: © 2026 Khách Sạn Ngân Hà - Quan Lạn. All rights reserved.
  - alert [ref=e88]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { RegisterPage } from '../pages/register.page';
  3   | import { LoginPage } from '../pages/login.page';
  4   | import { authFixture } from '../fixtures/auth.fixture';
  5   | import { generateTestEmail, testData } from '../fixtures/test-data';
  6   | 
  7   | test.describe('Registration Flow', () => {
  8   |   /**
  9   |    * TEST 1: Register new guest account successfully
  10  |    */
  11  |   test('Register new guest account successfully', async ({ page }) => {
  12  |     const registerPage = new RegisterPage(page);
  13  |     const loginPage = new LoginPage(page);
  14  | 
  15  |     // Navigate to register page
  16  |     await registerPage.goto();
  17  | 
  18  |     // Verify page loaded
  19  |     expect(page.url()).toContain('/register');
  20  |     const isFormVisible = await registerPage.isFormVisible();
> 21  |     expect(isFormVisible).toBeTruthy();
      |                           ^ Error: expect(received).toBeTruthy()
  22  | 
  23  |     // Register with valid data
  24  |     const testEmail = generateTestEmail('newguest');
  25  |     await registerPage.register(
  26  |       'Nguyễn Văn A',
  27  |       testEmail,
  28  |       '0901234567',
  29  |       'TestPassword123',
  30  |       'TestPassword123'
  31  |     );
  32  | 
  33  |     // Verify redirected to login page
  34  |     await page.waitForLoadState('networkidle');
  35  |     expect(page.url()).toContain('/login');
  36  |   });
  37  | 
  38  |   /**
  39  |    * TEST 2: Password mismatch validation error
  40  |    */
  41  |   test('Show error when passwords do not match', async ({ page }) => {
  42  |     const registerPage = new RegisterPage(page);
  43  | 
  44  |     // Navigate to register page
  45  |     await registerPage.goto();
  46  | 
  47  |     // Fill form with mismatched passwords
  48  |     const testEmail = generateTestEmail('mismatch');
  49  |     await registerPage.setFullName('Test User');
  50  |     await registerPage.setEmail(testEmail);
  51  |     await registerPage.setPhone('0901234567');
  52  |     await registerPage.setPassword('TestPassword123');
  53  |     await registerPage.setConfirmPassword('DifferentPassword123');
  54  | 
  55  |     // Submit form
  56  |     await registerPage.clickSubmit();
  57  | 
  58  |     // Verify error message is displayed
  59  |     await page.waitForTimeout(500);
  60  |     const hasError = await registerPage.hasError();
  61  |     expect(hasError).toBeTruthy();
  62  | 
  63  |     // Error should mention password mismatch
  64  |     const errorMessage = await registerPage.getErrorMessage();
  65  |     expect(errorMessage.toLowerCase()).toContain('mật khẩu');
  66  |   });
  67  | 
  68  |   /**
  69  |    * TEST 3: Password too short validation error
  70  |    */
  71  |   test('Show error when password is less than 6 characters', async ({ page }) => {
  72  |     const registerPage = new RegisterPage(page);
  73  | 
  74  |     // Navigate to register page
  75  |     await registerPage.goto();
  76  | 
  77  |     // Fill form with short password
  78  |     const testEmail = generateTestEmail('shortpass');
  79  |     await registerPage.setFullName('Test User');
  80  |     await registerPage.setEmail(testEmail);
  81  |     await registerPage.setPhone('0901234567');
  82  |     await registerPage.setPassword('short');
  83  |     await registerPage.setConfirmPassword('short');
  84  | 
  85  |     // Submit form
  86  |     await registerPage.clickSubmit();
  87  | 
  88  |     // Verify error message is displayed
  89  |     await page.waitForTimeout(500);
  90  |     const hasError = await registerPage.hasError();
  91  |     expect(hasError).toBeTruthy();
  92  | 
  93  |     // Error should mention password length
  94  |     const errorMessage = await registerPage.getErrorMessage();
  95  |     expect(errorMessage.toLowerCase()).toContain('ít nhất');
  96  |   });
  97  | 
  98  |   /**
  99  |    * TEST 4: Duplicate email validation error
  100 |    */
  101 |   test('Show error when email already exists', async ({ page }) => {
  102 |     // Setup: Create a user first
  103 |     const existingUser = await authFixture.registerTestUser('guest');
  104 | 
  105 |     const registerPage = new RegisterPage(page);
  106 | 
  107 |     // Navigate to register page
  108 |     await registerPage.goto();
  109 | 
  110 |     // Try to register with existing email
  111 |     await registerPage.setFullName('Another User');
  112 |     await registerPage.setEmail(existingUser.email);
  113 |     await registerPage.setPhone('0901234567');
  114 |     await registerPage.setPassword('TestPassword123');
  115 |     await registerPage.setConfirmPassword('TestPassword123');
  116 | 
  117 |     // Submit form
  118 |     await registerPage.clickSubmit();
  119 | 
  120 |     // Verify error message is displayed
  121 |     await page.waitForTimeout(500);
```