# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.ts >> Registration Flow >> Register successfully without providing phone number
- Location: tests\register.spec.ts:268:7

# Error details

```
TimeoutError: page.fill: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[name="fullName"]')

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
  1   | import { Page, Locator } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Base Page Object
  5   |  * All pages inherit from this class for common utilities
  6   |  */
  7   | export abstract class BasePage {
  8   |   readonly page: Page;
  9   | 
  10  |   constructor(page: Page) {
  11  |     this.page = page;
  12  |   }
  13  | 
  14  |   /**
  15  |    * Navigate to a specific path
  16  |    */
  17  |   async goto(path: string) {
  18  |     await this.page.goto(path);
  19  |     await this.page.waitForLoadState('networkidle');
  20  |   }
  21  | 
  22  |   /**
  23  |    * Wait for page to be ready
  24  |    */
  25  |   async waitForReady() {
  26  |     await this.page.waitForLoadState('networkidle');
  27  |   }
  28  | 
  29  |   /**
  30  |    * Get page title
  31  |    */
  32  |   async getTitle(): Promise<string> {
  33  |     return this.page.title();
  34  |   }
  35  | 
  36  |   /**
  37  |    * Click an element
  38  |    */
  39  |   async click(selector: string) {
  40  |     await this.page.click(selector);
  41  |   }
  42  | 
  43  |   /**
  44  |    * Fill input field
  45  |    */
  46  |   async fill(selector: string, text: string) {
> 47  |     await this.page.fill(selector, text);
      |                     ^ TimeoutError: page.fill: Timeout 10000ms exceeded.
  48  |   }
  49  | 
  50  |   /**
  51  |    * Get text content
  52  |    */
  53  |   async getText(selector: string): Promise<string> {
  54  |     const element = await this.page.locator(selector);
  55  |     return element.textContent() || '';
  56  |   }
  57  | 
  58  |   /**
  59  |    * Check if element is visible
  60  |    */
  61  |   async isVisible(selector: string): Promise<boolean> {
  62  |     return this.page.locator(selector).isVisible();
  63  |   }
  64  | 
  65  |   /**
  66  |    * Wait for selector to be visible
  67  |    */
  68  |   async waitForSelector(selector: string, timeout = 5000) {
  69  |     await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  70  |   }
  71  | 
  72  |   /**
  73  |    * Wait for element to disappear
  74  |    */
  75  |   async waitForSelectorHidden(selector: string, timeout = 5000) {
  76  |     await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  77  |   }
  78  | 
  79  |   /**
  80  |    * Get attribute value
  81  |    */
  82  |   async getAttribute(selector: string, attribute: string): Promise<string | null> {
  83  |     return this.page.locator(selector).getAttribute(attribute);
  84  |   }
  85  | 
  86  |   /**
  87  |    * Check if element exists
  88  |    */
  89  |   async elementExists(selector: string): Promise<boolean> {
  90  |     const count = await this.page.locator(selector).count();
  91  |     return count > 0;
  92  |   }
  93  | 
  94  |   /**
  95  |    * Get all text content matching selector
  96  |    */
  97  |   async getTextList(selector: string): Promise<string[]> {
  98  |     const locators = await this.page.locator(selector).all();
  99  |     const texts: string[] = [];
  100 |     for (const locator of locators) {
  101 |       const text = await locator.textContent();
  102 |       if (text) texts.push(text);
  103 |     }
  104 |     return texts;
  105 |   }
  106 | 
  107 |   /**
  108 |    * Select option in dropdown
  109 |    */
  110 |   async selectOption(selector: string, value: string) {
  111 |     await this.page.selectOption(selector, value);
  112 |   }
  113 | 
  114 |   /**
  115 |    * Type text slowly (more reliable than fill for some cases)
  116 |    */
  117 |   async type(selector: string, text: string) {
  118 |     await this.page.locator(selector).type(text);
  119 |   }
  120 | 
  121 |   /**
  122 |    * Press key (Enter, Escape, etc)
  123 |    */
  124 |   async pressKey(key: string) {
  125 |     await this.page.keyboard.press(key);
  126 |   }
  127 | 
  128 |   /**
  129 |    * Take screenshot
  130 |    */
  131 |   async screenshot(name: string) {
  132 |     await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  133 |   }
  134 | 
  135 |   /**
  136 |    * Get all cookies
  137 |    */
  138 |   async getCookies() {
  139 |     return this.page.context()?.cookies() || [];
  140 |   }
  141 | 
  142 |   /**
  143 |    * Get localStorage value
  144 |    */
  145 |   async getLocalStorage(key: string): Promise<string | null> {
  146 |     return this.page.evaluate((k) => localStorage.getItem(k), key);
  147 |   }
```