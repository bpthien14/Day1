# Filter Mode (Chế độ lọc texture)

## Khái niệm cơ bản

**Texel** là viết tắt của Texture Element — hay có thể hiểu đơn giản là một điểm ảnh (pixel) trong một texture.

**Mipmap** là một kỹ thuật tối ưu hóa hiển thị texture trong đồ họa máy tính, đặc biệt hữu ích khi texture được hiển thị ở kích thước nhỏ hơn kích thước gốc (ví dụ khi vật thể ở xa camera).

## Chế độ lọc (Filter Mode)

Khi kích thước gốc của Texture không khớp với kích thước ảnh texture được ánh xạ lên màn hình, việc ánh xạ đơn vị texture đến pixel sẽ tạo ra các hiệu ứng khác nhau tùy theo phương pháp lọc texture được sử dụng. Có ba chế độ lọc chính:

### 🔹 Lọc điểm (Point filtering)

- **Nguyên lý:** Đơn giản chỉ lấy màu của texel gần nhất với tâm pixel để làm màu cho pixel đó.
- **Ưu điểm:** Thuật toán đơn giản, tính toán nhẹ.
- **Nhược điểm:** Gây ra nhiều hiện tượng lỗi thị giác – ảnh bị vỡ khi phóng to, và răng cưa/chớp nháy khi thu nhỏ.

### 🔹 Lọc song tuyến (Bilinear filtering)

- **Nguyên lý:** Lấy mẫu bốn texel gần nhất với tâm pixel (ở mipmap cấp gần nhất), sau đó trung bình trọng số các màu theo khoảng cách.
- **Ưu điểm:** Loại bỏ hiện tượng ảnh bị vỡ khi phóng to, vì màu sắc giữa các texel được làm mượt, không bị thay đổi đột ngột khi tâm pixel vượt qua ranh giới texel.
- **Nhược điểm:** Tính toán phức tạp hơn một chút so với Point filtering.


### 🔹 Lọc tam tuyến (Trilinear filtering)

- **Nguyên lý:** Dựa trên Bilinear filtering, nhưng thực hiện thêm:
  1. Tìm kiếm texture và lọc song tuyến trên hai cấp mipmap gần nhất (một cấp chất lượng cao hơn và một thấp hơn)
  2. Sau đó nội suy tuyến tính giữa hai kết quả này
- **Ưu điểm:** So với Point và Bilinear, Trilinear cho kết quả mượt và chính xác nhất
- **Nhược điểm:** Tốn nhiều tài nguyên tính toán nhất

## So sánh các chế độ lọc

| Chế độ lọc | Chất lượng hình ảnh | Hiệu suất | Ứng dụng thích hợp |
|------------|---------------------|-----------|-------------------|
| **Point** | Thấp | Cao | UI pixelated, retro games |
| **Bilinear** | Khá | Trung bình | Texture thông thường |
| **Trilinear** | Cao | Thấp | Texture có độ chi tiết cao |

## 💡 Ghi chú thêm

Ngoài việc thiết lập chế độ lọc trực tiếp trong trình chỉnh sửa (Editor), engine còn cung cấp API `cc.view.enableAntiAlias` để bật/tắt khử răng cưa (anti-aliasing) cho texture một cách động:

- Nếu **bật anti-aliasing** → Tất cả texture trong game sẽ dùng lọc tuyến tính (linear)
- Nếu **tắt** → Sẽ dùng lọc điểm (Point sampling)

> ⚠️ **Lưu ý:** Trong phiên bản hiện tại của engine, hiệu ứng của Trilinear filtering giống với Bilinear filtering.