# Product Management Web App (Node.js + AWS)

## 1. Giới thiệu đề tài

Ứng dụng web quản lý sản phẩm được xây dựng nhằm mục đích thực hành và vận dụng các kiến thức về lập trình web với Node.js, Express, EJS cùng với các dịch vụ điện toán đám mây của AWS như DynamoDB (Database), S3 (Storage) và EC2 (Compute).

Ứng dụng cho phép người dùng thực hiện các thao tác CRUD (Create, Read, Update, Delete) đối với sản phẩm, trong đó thông tin chi tiết được lưu trữ tại DynamoDB và hình ảnh được lưu trữ trên S3.

## 2. Kiến trúc hệ thống

Hệ thống được thiết kế theo mô hình MVC (Model-View-Controller) đơn giản:

- **Client**: Trình duyệt web giao tiếp với server qua HTTP.
- **Server (EC2)**: Chạy ứng dụng Node.js/Express.
  - **Controller**: Xử lý logic nghiệp vụ.
  - **Services**: Tương tác với AWS SDK (DynamoDB Client, S3 Client).
  - **Views**: Render giao diện HTML sử dụng EJS template engine.
- **Database (DynamoDB)**: Lưu trữ metadata của sản phẩm.
- **Storage (S3)**: Lưu trữ file hình ảnh sản phẩm.

## 3. Thiết kế cơ sở dữ liệu (DynamoDB)

Bảng: `Products`

- **Partition Key**: `id` (String)

Hệ thống sử dụng mô hình NoSQL với cấu trúc item như sau:

```json
{
  "id": "uuid-v4-string",
  "name": "Tên sản phẩm",
  "price": 100000,
  "quantity": 10,
  "url_image": "https://bucket-name.s3.region.amazonaws.com/image-key.jpg"
}
```

## 4. Mô tả chức năng (CRUD)

1.  **Read (Xem danh sách)**:
    - Khi truy cập trang chủ, Controller gọi DynamoDB Service để `Scan` toàn bộ bảng Products.
    - Dữ liệu trả về được đưa vào View `index.ejs` để hiển thị.
2.  **Create (Thêm mới)**:
    - Người dùng nhập thông tin và chọn ảnh.
    - Controller nhận file qua `multer`.
    - Service upload file lên S3, nhận về URL.
    - Service tạo Item mới chứa URL và thông tin khác, `Put` vào DynamoDB.
3.  **Update (Cập nhật)**:
    - Người dùng chỉnh sửa thông tin.
    - Nếu có upload ảnh mới: Upload lên S3 -> Cập nhật URL mới.
    - Cập nhật các thuộc tính thay đổi vào DynamoDB dùng `UpdateCommand`.
4.  **Delete (Xóa)**:
    - Lấy thông tin sản phẩm để có URL ảnh.
    - Xóa ảnh trên S3 (Optional).
    - Xóa Item trong DynamoDB dùng `DeleteCommand`.

## 5. Hướng dẫn cài đặt và chạy (Deployment)

### Yêu cầu

- Node.js installed.
- AWS Account (Access Key, Secret Key).
- Đã tạo bảng `Products` trên DynamoDB.
- Đã tạo Bucket trên S3 (và cấu hình Policy cho phép public read hoặc ứng dụng có quyền generate signed URL, bài này dùng public URL đơn giản).

### Cài đặt biến môi trường

Tạo file `.env` từ `.env.example`:

```ini
PORT=3000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY
DYNAMODB_TABLE_NAME=Products
S3_BUCKET_NAME=your-s3-bucket-name
```

### Chạy ứng dụng

```bash
npm install
npm start
```

Truy cập: `http://localhost:3000`

## 6. Kết luận

Dự án đã hoàn thành các yêu cầu cơ bản về quản lý sản phẩm trên nền tảng AWS. Hệ thống minh họa rõ ràng cách tích hợp Node.js với các dịch vụ đám mây, là nền tảng tốt để phát triển các tính năng phức tạp hơn như xác thực người dùng, giỏ hàng, và thanh toán.
