# Tech Store 🛒

Tech Store là một ứng dụng quản lý cửa hàng công nghệ (điện thoại, laptop, linh kiện, …), hỗ trợ quản lý sản phẩm, danh mục, khách hàng và đơn hàng.  
Dự án được xây dựng với **JavaScript** (Frontend) và **Java** (Backend).

---

## 📌 Công nghệ sử dụng

- **JavaScript** =
  - Giao diện người dùng, xử lý tương tác trên trình duyệt
  - Hiển thị danh sách sản phẩm, giỏ hàng, tìm kiếm, lọc sản phẩm, v.v.

- **Java** 
  - Xử lý nghiệp vụ (business logic)
  - API / service quản lý sản phẩm, danh mục, đơn hàng
  - Kiểm tra dữ liệu, tính toán giá, tổng tiền, v.v.

##  Tính năng chính 

Tùy vào code thực tế trong repo, bạn có thể giữ hoặc chỉnh lại phần này:

- Quản lý **sản phẩm**
  - Thêm / sửa / xóa sản phẩm
  - Tìm kiếm theo tên, mã, danh mục
  - Lọc theo khoảng giá (từ giá X đến giá Y)
- Quản lý **danh mục**
  - Thêm / sửa / xóa danh mục
  - Gán sản phẩm vào danh mục
- **Giỏ hàng** (nếu có)
  - Thêm sản phẩm vào giỏ
  - Cập nhật số lượng
  - Tính tổng tiền
- **Giao diện người dùng**
  - Danh sách sản phẩm
  - Form nhập thông tin sản phẩm
  - Bảng hiển thị/tra cứu
  - Nhận thông báo trạng thái đơn hàng 
  - Tính năng yêu thích sản phẩm
- **Xem Ảnh Lưu ở MinIO** 
  - Lưu ảnh ở minIO "
---

##  Cấu trúc thư mục (ví dụ)

```text
Tech_Store/
├── backend/              # Code Java (API, service, model,…)
│   ├── src/
│   └── pom.xml / build.gradle
├── tmp/             # Code JavaScript (UI, view,…)
│   ├── index.html
│   ├── css/
│   └── js/
├── README.md
└── ...
```
---

##  Cách chạy dự án

### 1. Yêu cầu môi trường

- **Java** (JDK 8+ hoặc 11+)
- **Node.js & npm** 
- IDE gợi ý:
  - IntelliJ IDEA / Eclipse / VS Code

### 2. Chạy backend (Java)

Ví dụ nếu dùng Maven:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

```bash
cd backend
javac -d out src/**/*.java
java -cp out Main
```

### 3. Chạy frontend (JavaScript)
- Nếu dùng npm:

  ```bash
  cd frontend
  npm install
  npm run dev   # hoặc npm start, tùy script bạn định nghĩa
  ```

### 4. Chạy bằng docker compose 
  ```bash
  cd backend
  docker compose up --build -d
  ```
---

## 🔗 Kết nối Frontend & Backend

- Backend Java lắng nghe tại: `http://localhost:8080` (ví dụ)
- Frontend gọi API qua các endpoint, ví dụ:

```text
GET    /api/products
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```


##  Góp ý & phát triển

- Mở **issue** nếu bạn phát hiện bug hoặc muốn đề xuất tính năng mới.
- Tạo **pull request** nếu bạn muốn đóng góp code:
  1. Fork repo
  2. Tạo branch mới (`feature/ten-tinh-nang`)
  3. Commit và push
  4. Mở pull request

---


 -  **Siuuuuuuuuuuuuuuuuuuu**