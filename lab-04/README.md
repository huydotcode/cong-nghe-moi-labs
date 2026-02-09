# Lab-04: Product Management Web App (Advanced Extension)

Nâng cấp từ Lab-03 với các tính năng: Authentication, Categories, Soft Delete, Audit Logging, và phân quyền.

## 🌟 Tính năng mới

| Tính năng             | Mô tả                            |
| --------------------- | -------------------------------- |
| **Authentication**    | Session-based login/logout       |
| **Role-based Access** | Admin: full CRUD, Staff: chỉ xem |
| **Categories**        | Quản lý danh mục sản phẩm        |
| **Soft Delete**       | Xóa mềm (isDeleted flag)         |
| **Search & Filter**   | Tìm kiếm, lọc theo category/giá  |
| **Pagination**        | Phân trang danh sách             |
| **Inventory Status**  | Còn hàng, Sắp hết, Hết hàng      |
| **Audit Logging**     | Ghi log CREATE/UPDATE/DELETE     |

## 🗄️ DynamoDB Tables

| Table       | Partition Key | Mô tả            |
| ----------- | ------------- | ---------------- |
| Products    | id            | Sản phẩm         |
| Users       | userId        | Người dùng       |
| Categories  | categoryId    | Danh mục         |
| ProductLogs | logId         | Lịch sử thao tác |

## 🚀 Cài đặt

```bash
# 1. Cài dependencies
npm install

# 2. Tạo file .env từ .env.example và cấu hình

# 3. Tạo các bảng DynamoDB
npm run create-tables

# 4. Tạo users mẫu
npm run seed

# 5. Chạy ứng dụng
npm run dev
```

## 🔐 Tài khoản mẫu

| Username | Password | Role  |
| -------- | -------- | ----- |
| admin    | admin123 | admin |
| staff    | staff123 | staff |

## 📁 Cấu trúc thư mục

```
src/
├── config/           # AWS configuration
├── controllers/      # Request handlers
├── middlewares/      # Auth & Role middleware
├── repositories/     # DynamoDB operations
├── routes/           # Express routes
├── services/         # Business logic
└── views/            # EJS templates
```

## 🔗 API Endpoints

| Method | Route                  | Role   | Mô tả               |
| ------ | ---------------------- | ------ | ------------------- |
| GET    | /login                 | Public | Trang đăng nhập     |
| POST   | /login                 | Public | Xử lý đăng nhập     |
| GET    | /logout                | Auth   | Đăng xuất           |
| GET    | /                      | Auth   | Danh sách sản phẩm  |
| GET    | /add                   | Admin  | Form thêm sản phẩm  |
| POST   | /add                   | Admin  | Tạo sản phẩm        |
| GET    | /edit/:id              | Admin  | Form sửa sản phẩm   |
| POST   | /edit/:id              | Admin  | Cập nhật sản phẩm   |
| POST   | /delete/:id            | Admin  | Xóa sản phẩm (soft) |
| GET    | /categories            | Auth   | Danh sách danh mục  |
| GET    | /categories/add        | Admin  | Form thêm danh mục  |
| POST   | /categories/add        | Admin  | Tạo danh mục        |
| GET    | /categories/edit/:id   | Admin  | Form sửa danh mục   |
| POST   | /categories/edit/:id   | Admin  | Cập nhật danh mục   |
| POST   | /categories/delete/:id | Admin  | Xóa danh mục        |

## 📝 Biến môi trường (.env)

```ini
PORT=3000
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

S3_BUCKET_NAME=your-bucket
SESSION_SECRET=your_session_secret
```

## 💡 So sánh DynamoDB vs MySQL

| Tiêu chí | DynamoDB            | MySQL             |
| -------- | ------------------- | ----------------- |
| Schema   | Schema-less (NoSQL) | Fixed schema      |
| JOIN     | Không hỗ trợ        | Hỗ trợ            |
| Scale    | Auto-scaling        | Manual sharding   |
| Query    | Scan + Filter       | SQL queries       |
| Chi phí  | Pay per request     | Fixed server cost |

> **Lưu ý:** DynamoDB không hỗ trợ JOIN. Quan hệ được xử lý ở application layer.
