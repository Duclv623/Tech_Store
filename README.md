# Tech Store 🛒

Tech Store là một ứng dụng quản lý cửa hàng công nghệ (điện thoại, laptop, linh kiện, …), hỗ trợ quản lý sản phẩm, danh mục, khách hàng và đơn hàng.  
Dự án được xây dựng với **JavaScript** (Frontend) và **Java** (Backend).

---

## 📌 Công nghệ sử dụng

- **JavaScript** – 77.2%
  - Giao diện người dùng, xử lý tương tác trên trình duyệt
  - Hiển thị danh sách sản phẩm, giỏ hàng, tìm kiếm, lọc sản phẩm, v.v.

- **Java** – 22.2%
  - Xử lý nghiệp vụ (business logic)
  - API / service quản lý sản phẩm, danh mục, đơn hàng
  - Kiểm tra dữ liệu, tính toán giá, tổng tiền, v.v.

- **Khác** – 0.6%
  - File cấu hình, script build, tài nguyên tĩnh,…

> Lưu ý: Tỷ lệ trên được lấy từ ngôn ngữ của repository do GitHub thống kê.

---

## ✨ Tính năng chính (dự kiến)

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

---

## 🧱 Cấu trúc thư mục (ví dụ)

Tùy theo repo thực tế, bạn chỉnh lại cho đúng:

```text
Tech_Store/
├── backend/              # Code Java (API, service, model,…)
│   ├── src/
│   └── pom.xml / build.gradle
├── frontend/             # Code JavaScript (UI, view,…)
│   ├── index.html
│   ├── css/
│   └── js/
├── README.md
└── ...
```

---

## 🚀 Cách chạy dự án

### 1. Yêu cầu môi trường

- **Java** (JDK 8+ hoặc 11+)
- **Node.js & npm** (nếu frontend dùng npm/bundler)
- IDE gợi ý:
  - IntelliJ IDEA / Eclipse / VS Code

### 2. Chạy backend (Java)

Ví dụ nếu dùng Maven:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Hoặc nếu là project Java thường (không Spring):

```bash
cd backend
javac -d out src/**/*.java
java -cp out Main
```

> Cập nhật lại lệnh cho đúng với cấu trúc thực tế của bạn.

### 3. Chạy frontend (JavaScript)

- Nếu chỉ là file tĩnh:

  ```bash
  cd frontend
  # Mở file index.html bằng trình duyệt
  ```

- Nếu dùng npm:

  ```bash
  cd frontend
  npm install
  npm run dev   # hoặc npm start, tùy script bạn định nghĩa
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

Bạn có thể cập nhật lại đúng endpoint của dự án.

---

## 🧪 Kiểm thử

Nếu có test, bạn có thể thêm phần này:

### Backend (Java)

```bash
cd backend
mvn test
```

### Frontend (JavaScript)

```bash
cd frontend
npm test
```

---

## 📄 License

Bạn có thể chọn license phù hợp (MIT, Apache 2.0, GPL,…) và thêm file `LICENSE`.  
Ví dụ:

> This project is licensed under the MIT License.

---

## 👨‍💻 Tác giả

- GitHub: [@BruceLeeVanDuc](https://github.com/BruceLeeVanDuc)

---

## 📝 Góp ý & phát triển

- Mở **issue** nếu bạn phát hiện bug hoặc muốn đề xuất tính năng mới.
- Tạo **pull request** nếu bạn muốn đóng góp code:
  1. Fork repo
  2. Tạo branch mới (`feature/ten-tinh-nang`)
  3. Commit và push
  4. Mở pull request

---

> Nếu bạn gửi thêm cấu trúc thư mục hoặc file chính (ví dụ: có Spring Boot hay Java thuần, có React/Vue hay JS thuần), mình có thể sửa README này cho khớp 100% với dự án Tech_Store của bạn.
