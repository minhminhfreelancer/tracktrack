# Hệ thống phân tích người dùng

Hệ thống phân tích người dùng hoạt động trên hai domain:

- **quanlythoigian.io.vn** - Giao diện người dùng
- **tracktrack.pages.dev** - API và dịch vụ theo dõi

## Cấu trúc dự án

- `src/` - Mã nguồn Next.js cho giao diện người dùng
- `cloudflare/functions/` - Cloudflare Functions cho API và dịch vụ theo dõi
- `public/` - Tài nguyên tĩnh

## Triển khai

### Triển khai lên Cloudflare Pages

1. Kết nối repository với Cloudflare Pages
2. Cấu hình build:
   - Build command: `npm run build`
   - Build output directory: `.cloudflare/functions`
3. Thêm biến môi trường cần thiết

### Biến môi trường

- `CLOUDFLARE_API_TOKEN` - Token API Cloudflare
- `CLOUDFLARE_ACCOUNT_ID` - ID tài khoản Cloudflare

## Phát triển

```bash
# Cài đặt dependencies
npm install

# Chạy môi trường phát triển
npm run dev
```

## Tính năng

- Theo dõi thông tin người dùng (IP, trình duyệt, nhà mạng, kết nối, hệ điều hành, kích thước màn hình)
- Theo dõi tương tác (click vào số điện thoại, Zalo, Messenger)
- Tạo mã nhúng tùy chỉnh cho website
- Dashboard phân tích dữ liệu
