# 🏨 Khách Sạn Ngân Hà — khachsannganha.com

Website đặt phòng khách sạn Ngân Hà, xây dựng trên nền tảng **WordPress** với hệ thống quản lý và đặt phòng trực tuyến.

---

## 📋 Tổng quan

| Thông số | Chi tiết |
|---|---|
| **Nền tảng** | WordPress |
| **Theme cha** | Fleur De Sel v2.0.4 (Awethemes) — theme chuyên ngành khách sạn/resort |
| **Theme con** | khachsannganha (Web3B v1.0.0) — tác giả: Quang Hoa (thietkeweb3b.com) |
| **Database** | MariaDB / MySQL — charset utf8mb4 |
| **Table Prefix** | `sh_` |
| **Ngôn ngữ** | Tiếng Việt (hỗ trợ đa ngôn ngữ qua Google Translate) |

---

## 📁 Cấu trúc dự án

```
khachsannganha.com/
├── wp-config.php                          # Cấu hình WordPress & database
├── khachsanng_khachsannganha_260317.sql   # Backup database
├── .htaccess                              # Cấu hình Apache (pretty permalinks)
│
├── wp-content/
│   ├── themes/
│   │   ├── fleurdesel/                    # Theme cha — hotel theme đầy đủ
│   │   └── khachsannganha/                # Theme con — tùy biến riêng
│   │       ├── style.css                  # Styles tùy biến
│   │       ├── functions.php              # Đăng ký scripts, image sizes, widgets
│   │       ├── footer.php                 # Footer tùy biến
│   │       ├── inc/                       # Shortcodes, VC templates, widgets
│   │       ├── template-parts/            # Header, footer, pagination, events, packages
│   │       ├── lib/                       # Thư viện JS (Slick Slider)
│   │       └── languages/                 # File ngôn ngữ
│   │
│   ├── plugins/                           # 15 plugins (xem danh sách bên dưới)
│   └── uploads/                           # Media files (2013–2026)
│
├── wp-admin/                              # WordPress admin core
└── wp-includes/                           # WordPress core includes
```

---

## 🔌 Plugins

### Chức năng chính
| Plugin | Phiên bản | Mô tả |
|---|---|---|
| **AweBooking** | 3.2.14 | Hệ thống đặt phòng khách sạn trực tuyến |
| **WPBakery Page Builder** | 5.7 | Xây dựng trang kéo thả (Visual Composer) |
| **Slider Revolution** | 5.4.8 | Slider/banner chuyên nghiệp |
| **Fleur De Sel Required** | 2.0.0 | Custom post types & fields cho theme |

### SEO & Marketing
| Plugin | Phiên bản | Mô tả |
|---|---|---|
| **Yoast SEO** | 11.1 | Tối ưu SEO on-page & XML sitemaps |
| **Google Language Translator** | 5.0.48 | Dịch đa ngôn ngữ tự động |

### Liên hệ & Hỗ trợ
| Plugin | Phiên bản | Mô tả |
|---|---|---|
| **Contact Form 7** | 5.1.1 | Form liên hệ |
| **Hotline Phone Ring** | 2.0.4 | Nút gọi hotline cố định trên màn hình |
| **WP SMTP** | 1.1.10 | Gửi email qua SMTP server |

### Tiện ích
| Plugin | Phiên bản | Mô tả |
|---|---|---|
| **Really Simple SSL** | 3.1.5 | Cấu hình SSL/HTTPS |
| **Loco Translate** | 2.2.2 | Dịch theme & plugin trong admin |
| **Duplicate Post** | 3.2.2 | Nhân bản bài viết/trang |
| **Flexible Posts Widget** | 3.5.0 | Widget hiển thị bài viết nâng cao |
| **TinyMCE Advanced** | 5.1.0 | Mở rộng trình soạn thảo |
| **WP Simple Iconfonts** | 0.5.1 | Quản lý & chọn icon fonts |

---

## 🗄️ Database

- **File backup:** `khachsanng_khachsannganha_260317.sql`
- **29 bảng** bao gồm WordPress core + AweBooking
- **26 phòng** khách sạn đã cấu hình
- **Giá phòng:** ~500,000 VNĐ | **VAT:** 10%
- **~42,000+ comments**

### Bảng chính của AweBooking
| Bảng | Chức năng |
|---|---|
| `sh_awebooking_rooms` | Danh sách 26 phòng |
| `sh_awebooking_booking` | Đơn đặt phòng |
| `sh_awebooking_booking_items` | Chi tiết đơn đặt |
| `sh_awebooking_availability` | Lịch phòng trống (ngày 1–31) |
| `sh_awebooking_pricing` | Bảng giá theo ngày |
| `sh_awebooking_tax_rates` | Thuế VAT |

---

## 🎨 Tùy biến Theme

Theme con `khachsannganha` mở rộng theme cha `fleurdesel` với:

- **Image sizes riêng:** `sh_thumb320x220`, `sh_thumb255x170`
- **Widgets tùy biến:** Menu Sidebar, Information Widget
- **Shortcodes:** Blog shortcodes, Visual Composer templates
- **Thư viện:** Slick Slider, custom `main.js`
- **Template parts:** Header, footer, pagination, page-title, event & package layouts

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu hệ thống
- PHP 5.2.4+ (khuyến nghị PHP 7.2+)
- MySQL 5.0+ (khuyến nghị MySQL 5.6+)
- Apache với `mod_rewrite`
- HTTPS (SSL certificate)

### Các bước cài đặt

1. **Upload source code** lên hosting/server

2. **Import database:**
   ```bash
   mysql -u <username> -p <database_name> < khachsanng_khachsannganha_260317.sql
   ```

3. **Cấu hình `wp-config.php`** — cập nhật thông tin kết nối database:
   ```php
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_database_user');
   define('DB_PASSWORD', 'your_database_password');
   define('DB_HOST', 'localhost');
   ```

4. **Cập nhật URL** trong database (nếu đổi domain):
   ```sql
   UPDATE sh_options SET option_value = 'https://your-domain.com' WHERE option_name = 'siteurl';
   UPDATE sh_options SET option_value = 'https://your-domain.com' WHERE option_name = 'home';
   ```

5. **Đăng nhập admin** tại `https://your-domain.com/wp-admin`

---

## ⚠️ Lưu ý

- **Bảo mật:** Sau khi cài đặt, hãy thay đổi toàn bộ Authentication Keys & Salts trong `wp-config.php` tại [WordPress Salt Generator](https://api.wordpress.org/secret-key/1.1/salt/).
- **Mật khẩu DB:** Thay đổi mật khẩu database mặc định trong `wp-config.php`.
- **Plugins premium:** `WPBakery Page Builder` và `Slider Revolution` là plugin trả phí, cần license hợp lệ để cập nhật.
- **Backup:** Luôn tạo backup trước khi thực hiện bất kỳ thay đổi nào.

---

## 📄 License

WordPress được phát hành theo giấy phép [GNU GPL v2](license.txt) hoặc phiên bản mới hơn.
