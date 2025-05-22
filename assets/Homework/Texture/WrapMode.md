# Wrap Mode (Chế độ lặp texture)

## Tổng quan

Trong đồ họa máy tính, Wrap Mode quyết định cách xử lý khi tọa độ UV vượt ra ngoài phạm vi tiêu chuẩn [0, 1].

> Tham khảo: [Tài liệu Cocos Creator về Wrap Mode](https://docs.cocos.com/creator/2.1/manual/en/asset-workflow/sprite.html#wrap-mode)

## Cơ bản về tọa độ UV

Tọa độ UV là hệ tọa độ 2D được sử dụng để ánh xạ texture lên bề mặt của một đối tượng 3D. Thông thường:
- Giá trị tọa độ UV nằm trong khoảng [0, 1]
- U tương ứng với trục X (ngang)
- V tương ứng với trục Y (dọc)

## Các chế độ Wrap chính

| Chế độ | Mô tả | Ứng dụng |
|--------|-------|----------|
| **Clamp** | Giới hạn tọa độ UV trong khoảng [0, 1] | Texture đơn lẻ, không lặp lại |
| **Repeat** | Lặp lại texture khi tọa độ UV vượt ngoài [0, 1] | Texture cần lặp lại (ví dụ: nền gạch) |

### Chế độ Clamp (Clamp Mode)

- Giới hạn tọa độ UV trong khoảng từ 0 đến 1
- Chỉ sử dụng nội dung texture trong khoảng [0, 1] một lần
- Đối với tọa độ UV vượt ra ngoài phạm vi [0, 1], nội dung tại cạnh của texture sẽ được kéo dài (giống như lặp lại pixel cạnh)

### Chế độ Lặp (Repeat Mode)

- Đối với tọa độ UV vượt ngoài phạm vi [0, 1], nội dung trong khoảng [0, 1] của texture sẽ được lặp lại
- Công thức áp dụng: UV' = UV - floor(UV)

## Ví dụ thực tế

### Clamp Mode
Thích hợp cho:
- Texture độc lập (như logo, hình ảnh nhân vật)
- Các hình ảnh cần giữ nguyên tỷ lệ
- Tránh artifact khi lấy mẫu gần cạnh texture

### Repeat Mode
Thích hợp cho:
- Texture nền cần lặp lại (gạch, sàn, tường)
- Tạo hiệu ứng lặp lại theo mẫu
- Tối ưu bộ nhớ bằng cách sử dụng texture nhỏ lặp lại

## Lưu ý

Khi thiết kế texture dùng cho chế độ Repeat, cần đảm bảo các cạnh khớp nhau (seamless) để tránh xuất hiện đường nối khi texture được lặp lại.