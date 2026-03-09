# Product Management Web App

## Node.js + Express + EJS + MVC + DynamoDB + S3

---

## 1. Giới thiệu

Ứng dụng web quản lý sản phẩm với đầy đủ chức năng CRUD (Thêm, Xem, Sửa, Xóa) và Tìm kiếm. Dữ liệu sản phẩm được lưu trữ trên **Amazon DynamoDB**, hình ảnh sản phẩm được upload và lưu trữ trên **Amazon S3**.

## 2. Kiến trúc hệ thống (MVC)

```
src/
├── app.js                  # Entry point - khởi tạo Express server
├── config/
│   └── awsConfig.js        # Cấu hình AWS SDK (DynamoDB Client, S3 Client)
├── models/
│   └── productModel.js     # Model - thao tác dữ liệu Products trên DynamoDB
├── controllers/
│   └── productController.js # Controller - xử lý logic nghiệp vụ
├── services/
│   └── s3Service.js        # Service - upload/xóa ảnh trên S3
├── routes/
│   └── productRoutes.js    # Routes - định tuyến URL
├── views/                  # Views - giao diện EJS
│   ├── index.ejs           # Danh sách sản phẩm
│   ├── add.ejs             # Form thêm sản phẩm
│   ├── edit.ejs            # Form sửa sản phẩm
│   ├── error.ejs           # Trang lỗi
│   └── partials/
│       ├── header.ejs      # Header + Navbar + Search
│       └── footer.ejs      # Footer
└── public/
    ├── css/styles.css      # CSS tùy chỉnh
    └── images/no-image.png # Ảnh mặc định
```

## 3. Cấu trúc dữ liệu DynamoDB

**Table: `Products`**

| Thuộc tính | Kiểu   | Mô tả                  |
|-----------|--------|--------------------------|
| ID        | String | Khóa chính (Partition Key) |
| name      | String | Tên sản phẩm             |
| image     | String | URL ảnh trên S3           |
| price     | Number | Giá sản phẩm (double)     |
| quantity  | Number | Số lượng (integer)        |

## 4. Chức năng

### 4.1. Hiển thị danh sách (GET `/`)
- Scan toàn bộ bảng Products
- Hiển thị: Mã SP, Hình ảnh, Tên, Giá, Số lượng
- Phân trang (5 sản phẩm/trang)
- Ảnh mặc định nếu chưa có ảnh

### 4.2. Tìm kiếm (GET `/search?keyword=...`)
- Tìm kiếm gần đúng theo tên (DynamoDB `contains`)
- Hiển thị kết quả trên cùng giao diện danh sách

### 4.3. Thêm sản phẩm (GET `/add`, POST `/add`)
- Form nhập: ID, Tên, Giá, Số lượng, Hình ảnh
- Chọn ảnh từ máy tính → Upload lên S3 → Lưu URL vào DynamoDB
- Kiểm tra dữ liệu hợp lệ (ID không trống, name không trống, price > 0, quantity >= 0)
- Kiểm tra ID trùng

### 4.4. Sửa sản phẩm (GET `/edit/:id`, POST `/edit/:id`)
- Pre-fill form với dữ liệu hiện tại
- Hỗ trợ giữ ảnh cũ hoặc chọn ảnh mới
- Nếu chọn ảnh mới: upload lên S3, xóa ảnh cũ trên S3

### 4.5. Xóa sản phẩm (POST `/delete/:id`)
- Xác nhận trước khi xóa (confirm dialog)
- Xóa ảnh trên S3 + xóa item trong DynamoDB

## 5. Kết nối DynamoDB

Sử dụng **AWS SDK v3**:
- `@aws-sdk/client-dynamodb` - DynamoDB client
- `@aws-sdk/lib-dynamodb` - Document client (đơn giản hóa thao tác)

Các lệnh sử dụng: `ScanCommand`, `GetCommand`, `PutCommand`, `UpdateCommand`, `DeleteCommand`

## 6. Upload ảnh lên S3

Sử dụng **AWS SDK v3**:
- `@aws-sdk/client-s3` - S3 client
- `@aws-sdk/lib-storage` - Upload class (multipart upload)

Quy trình:
1. Multer nhận file vào memory buffer
2. Kiểm tra file hợp lệ (JPEG, PNG, GIF, WEBP, tối đa 5MB)
3. Tạo tên file unique (UUID + extension)
4. Upload lên S3 bucket
5. Tạo public URL trả về

## 7. Hướng dẫn cài đặt và chạy

### Yêu cầu
- Node.js >= 18
- AWS Account với Access Key
- Tạo bảng `Products` trên DynamoDB (Partition Key: `ID`, kiểu String)
- Tạo S3 Bucket (cho phép public read)

### Cài đặt

```bash
# Clone và vào thư mục
cd lab-06

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env
# Sửa thông tin AWS trong .env
```

### Chạy ứng dụng

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

Truy cập: `http://localhost:3000`

## 8. Xử lý lỗi

- Upload ảnh thất bại → Hiển thị thông báo lỗi, giữ nguyên form
- Thêm/sửa/xóa thất bại → Hiển thị thông báo lỗi cụ thể
- Không tìm thấy sản phẩm → Trang lỗi 404
- File ảnh không hợp lệ → Từ chối upload, thông báo lỗi
- ID trùng → Thông báo "Mã sản phẩm đã tồn tại"
