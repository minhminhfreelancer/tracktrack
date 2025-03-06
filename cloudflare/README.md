# Triển khai lên Cloudflare Pages

## Chuẩn bị

1. Tạo tài khoản Cloudflare nếu chưa có
2. Cài đặt Wrangler CLI: `npm install -g wrangler`
3. Đăng nhập vào Wrangler: `wrangler login`

## Các bước triển khai

### 1. Build ứng dụng

```bash
npm run build
```

### 2. Tạo KV Namespace cho lưu trữ dữ liệu phân tích

```bash
wrangler kv:namespace create KV_ANALYTICS
```

Sau khi chạy lệnh này, bạn sẽ nhận được ID của namespace. Cập nhật ID này vào file `wrangler.toml` trong phần `kv_namespaces`.

### 3. Triển khai lên Cloudflare Pages

#### Cách 1: Sử dụng Wrangler CLI

```bash
wrangler pages publish out --project-name=user-analytics-dashboard
```

#### Cách 2: Kết nối với GitHub

1. Đăng nhập vào Cloudflare Dashboard
2. Chọn "Pages" từ menu bên trái
3. Nhấp vào "Create a project"
4. Chọn "Connect to Git"
5. Chọn repository của bạn
6. Cấu hình build:
   - Build command: `npm run build`
   - Build output directory: `out`
7. Thêm biến môi trường cần thiết
8. Nhấp "Save and Deploy"

## Cấu hình Functions

Các file trong thư mục `functions` sẽ được triển khai tự động như Cloudflare Functions. Đảm bảo rằng:

1. File `_middleware.ts` xử lý CORS và các yêu cầu chung
2. File `api/track.ts` xử lý các yêu cầu theo dõi

## Cấu hình KV Storage

Sau khi triển khai, bạn cần liên kết KV Namespace với dự án Pages:

1. Đi đến dự án Pages trong Cloudflare Dashboard
2. Chọn tab "Settings" > "Functions"
3. Cuộn xuống phần "KV Namespace Bindings"
4. Nhấp "Add binding"
5. Đặt tên biến là "KV_ANALYTICS" và chọn namespace đã tạo

## Kiểm tra triển khai

Sau khi triển khai, bạn có thể truy cập ứng dụng tại URL được cung cấp bởi Cloudflare Pages. Kiểm tra xem các chức năng theo dõi có hoạt động bằng cách:

1. Đăng nhập vào ứng dụng
2. Tạo mã nhúng và thêm vào một trang web thử nghiệm
3. Kiểm tra dữ liệu phân tích trong dashboard
