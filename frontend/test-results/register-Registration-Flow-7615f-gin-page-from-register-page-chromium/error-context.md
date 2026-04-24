# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.ts >> Registration Flow >> Navigate to login page from register page
- Location: tests\register.spec.ts:164:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/login"
Received string:    "http://localhost:3000/(auth)/register"
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
            - button "Đăng nhập" [active] [ref=e14]
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
  122 |     const hasError = await registerPage.hasError();
  123 |     expect(hasError).toBeTruthy();
  124 | 
  125 |     // Verify still on register page
  126 |     expect(page.url()).toContain('/register');
  127 |   });
  128 | 
  129 |   /**
  130 |    * TEST 5: Required fields validation
  131 |    */
  132 |   test('Prevent submission when required fields are empty', async ({ page }) => {
  133 |     const registerPage = new RegisterPage(page);
  134 | 
  135 |     // Navigate to register page
  136 |     await registerPage.goto();
  137 | 
  138 |     // Leave required fields empty and try to submit
  139 |     await registerPage.setEmail('');
  140 |     await registerPage.setPassword('');
  141 |     await registerPage.setConfirmPassword('');
  142 | 
  143 |     // Get initial state
  144 |     const emailValue = await registerPage.getEmailValue();
  145 |     const passwordValue = await registerPage.getPasswordValue();
  146 | 
  147 |     // Verify fields are empty
  148 |     expect(emailValue).toBe('');
  149 |     expect(passwordValue).toBe('');
  150 | 
  151 |     // Try to submit
  152 |     await registerPage.clickSubmit();
  153 | 
  154 |     // Either form should not submit or show validation error
  155 |     // Browser HTML5 validation should prevent submission
  156 |     await page.waitForTimeout(500);
  157 |     const stillOnRegister = page.url().includes('/register');
  158 |     expect(stillOnRegister).toBeTruthy();
  159 |   });
  160 | 
  161 |   /**
  162 |    * TEST 6: Navigation to login page
  163 |    */
  164 |   test('Navigate to login page from register page', async ({ page }) => {
  165 |     const registerPage = new RegisterPage(page);
  166 | 
  167 |     // Navigate to register page
  168 |     await registerPage.goto();
  169 | 
  170 |     // Click login link
  171 |     await registerPage.clickLoginLink();
  172 | 
  173 |     // Verify redirected to login page
> 174 |     expect(page.url()).toContain('/login');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  175 |   });
  176 | 
  177 |   /**
  178 |    * TEST 7: Form persistence during typing
  179 |    */
  180 |   test('Form inputs maintain values while typing', async ({ page }) => {
  181 |     const registerPage = new RegisterPage(page);
  182 | 
  183 |     // Navigate to register page
  184 |     await registerPage.goto();
  185 | 
  186 |     // Fill form
  187 |     const testEmail = generateTestEmail('formtest');
  188 |     const fullName = 'Test User Full Name';
  189 |     const phone = '0901234567';
  190 |     const password = 'TestPassword123';
  191 | 
  192 |     await registerPage.setFullName(fullName);
  193 |     await registerPage.setEmail(testEmail);
  194 |     await registerPage.setPhone(phone);
  195 |     await registerPage.setPassword(password);
  196 |     await registerPage.setConfirmPassword(password);
  197 | 
  198 |     // Get values
  199 |     const values = await registerPage.getFormValues();
  200 | 
  201 |     // Verify all values are correct
  202 |     expect(values.fullName).toBe(fullName);
  203 |     expect(values.email).toBe(testEmail);
  204 |     expect(values.phone).toBe(phone);
  205 |     expect(values.password).toBe(password);
  206 |     expect(values.confirmPassword).toBe(password);
  207 |   });
  208 | 
  209 |   /**
  210 |    * TEST 8: Submit form using Enter key
  211 |    */
  212 |   test('Submit form using Enter key on confirm password field', async ({ page }) => {
  213 |     const registerPage = new RegisterPage(page);
  214 | 
  215 |     // Navigate to register page
  216 |     await registerPage.goto();
  217 | 
  218 |     // Fill form
  219 |     const testEmail = generateTestEmail('enterkey');
  220 |     await registerPage.setFullName('Test User');
  221 |     await registerPage.setEmail(testEmail);
  222 |     await registerPage.setPhone('0901234567');
  223 |     await registerPage.setPassword('TestPassword123');
  224 |     await registerPage.setConfirmPassword('TestPassword123');
  225 | 
  226 |     // Submit using Enter key
  227 |     await registerPage.submitWithEnter();
  228 | 
  229 |     // Verify redirected to login page
  230 |     await page.waitForLoadState('networkidle');
  231 |     expect(page.url()).toContain('/login');
  232 |   });
  233 | 
  234 |   /**
  235 |    * TEST 9: Register form displays correctly
  236 |    */
  237 |   test('Register form elements are displayed correctly', async ({ page }) => {
  238 |     const registerPage = new RegisterPage(page);
  239 | 
  240 |     // Navigate to register page
  241 |     await registerPage.goto();
  242 | 
  243 |     // Verify form is visible
  244 |     const isFormVisible = await registerPage.isFormVisible();
  245 |     expect(isFormVisible).toBeTruthy();
  246 | 
  247 |     // Verify page title
  248 |     const pageTitle = await registerPage.getPageTitle();
  249 |     expect(pageTitle).toContain('Đăng ký');
  250 | 
  251 |     // Verify form inputs exist
  252 |     const emailExists = await registerPage.elementExists(registerPage.emailInput);
  253 |     const passwordExists = await registerPage.elementExists(registerPage.passwordInput);
  254 |     const submitButtonExists = await registerPage.elementExists(registerPage.submitButton);
  255 | 
  256 |     expect(emailExists).toBeTruthy();
  257 |     expect(passwordExists).toBeTruthy();
  258 |     expect(submitButtonExists).toBeTruthy();
  259 | 
  260 |     // Verify button text
  261 |     const submitButtonText = await registerPage.getSubmitButtonText();
  262 |     expect(submitButtonText).toContain('Đăng ký');
  263 |   });
  264 | 
  265 |   /**
  266 |    * TEST 10: Phone field is optional
  267 |    */
  268 |   test('Register successfully without providing phone number', async ({ page }) => {
  269 |     const registerPage = new RegisterPage(page);
  270 | 
  271 |     // Navigate to register page
  272 |     await registerPage.goto();
  273 | 
  274 |     // Register without phone number
```