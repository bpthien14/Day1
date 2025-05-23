# Auto Atlas (Texture Atlas tự động)

## Tổng quan

Auto Atlas Asset là một sprite sheet. Trong Cocos Creator, nhờ có chức năng sẵn có là Auto Atlas, có thể chỉ định một loạt các hình ảnh nhỏ (sprite) được đóng gói vào một hình ảnh lớn, chức năng này tương tự như công cụ Texture Packer.

## Cách tạo Auto Atlas

Trong bảng Assets, nhấp chuột phải vào một thư mục, và chọn mục sau trong menu ngữ cảnh:
```
Create -> Auto Atlas
```

Hành động này sẽ tạo ra một tệp tài nguyên `AutoAtlas.pac` để chứa cấu hình atlas cho thư mục hiện tại.

> **Lưu ý:** Sau khi tạo Auto Atlas, tất cả các SpriteFrame trong thư mục đó và các thư mục con sẽ được dùng để tạo sprite sheet trong quá trình build. Các SpriteFrame được thêm vào sau trong thư mục hoặc thư mục con cũng sẽ được thêm vào atlas tự động.

Nếu các SpriteFrame có thiết lập riêng (như trim), thì những thiết lập này vẫn sẽ được giữ nguyên khi atlas được tạo ra.

## Cấu hình Auto Atlas

Sau khi chọn một tài nguyên Auto Atlas trong bảng Assets, bảng Properties sẽ hiển thị tất cả các thuộc tính có thể cấu hình cho Auto Atlas đó.

| Thuộc tính | Mô tả |
|------------|-------|
| **Max Width** | Chiều rộng tối đa của một atlas |
| **Max Height** | Chiều cao tối đa của một atlas |
| **Padding** | Khoảng cách giữa các sprite trong atlas |
| **Allow Rotation** | Cho phép xoay các sprite để tối ưu không gian |
| **Force Squared** | Ép atlas có kích thước hình vuông |
| **Power Of Two** | Ép kích thước atlas là lũy thừa của 2 |
| **Heuristics** | Chiến lược đóng gói atlas, các chiến lược gồm: MaxRect
| **Padding Bleed** | Thêm 1 pixel "bleed" xung quanh mỗi texture bằng cách sao chép pixel gần nhất — còn gọi là "Extrude" |
| **Filter Unused Resources** | Tùy chọn này không hoạt động trong chế độ xem trước (preview), chỉ có hiệu lực trong quá trình build |

## Xem trước kết quả

Sau khi cấu hình xong, có thể nhấn nút **Preview** để xem trước kết quả đóng gói. Kết quả sẽ được hiển thị bên dưới bảng thuộc tính.

> ⚠️ **Lưu ý:** Mỗi khi thay đổi cấu hình, phải nhấn Preview lại để làm mới bản xem trước.

Kết quả xem trước bao gồm:

### 📦 Packed Textures
Hiển thị các texture atlas đã được đóng gói và thông tin liên quan. Nếu có nhiều texture, tất cả sẽ được liệt kê.

### ❌ Unpacked Textures
Hiển thị các texture không thể đóng gói vào atlas (thường do kích thước sprite quá lớn so với atlas).

## Quá trình đóng gói atlas

Khi đã tạo Auto Atlas đúng cách, có thể xây dựng (build) các cảnh hoặc hoạt ảnh bằng cách sử dụng các sprite gốc.
Trong quá trình Build, Cocos Creator sẽ tự động đóng gói các SpriteFrame trong thư mục có Auto Atlas thành atlas, và cập nhật tất cả các tham chiếu trong toàn bộ dự án.

> ⚠️ **Lưu ý:** Phiên bản Cocos Creator v2.1 không hỗ trợ Premultiply Alpha trong Auto Atlas.

## Tại sao giới hạn max witdh/heigh là 2048?
Tương thích phần cứng GPU: Rất nhiều thiết bị di động cũ hoặc yếu không hỗ trợ texture lớn hơn 2048x2048. Nếu build cho Android hoặc Web, nên dùng tối đa 2048 để đảm bảo chạy ổn định.
Hiệu năng và bộ nhớ: Texture quá lớn sẽ chiếm nhiều bộ nhớ GPU, dễ gây giật lag hoặc crash trên thiết bị yếu.
Đảm bảo load nhanh hơn: Nhiều texture nhỏ gộp vào atlas 2048x2048 là mức cân bằng tốt giữa chất lượng và tốc độ load.