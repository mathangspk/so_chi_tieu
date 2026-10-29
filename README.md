# Sổ Chi Tiêu — demo làm app bằng OpenCode

Mã nguồn app quản lý chi tiêu cá nhân đi kèm video hướng dẫn dùng OpenCode và model AI miễn phí của kênh **Thang Ma (@thangma51)**. App dùng HTML, CSS và JavaScript, không có backend hay bước build.

## Tải và mở app

1. Chọn **Code → Download ZIP** trên trang repo, rồi giải nén toàn bộ thư mục.
2. Mở `index.html` bằng trình duyệt hiện đại; giữ nguyên các thư mục `css/` và `js/` đi kèm.
3. Nhập số tiền, danh mục, ngày và ghi chú để thêm khoản chi. Có thể sửa/xóa khoản chi đã nhập.
4. Chọn tháng ở phần thống kê để xem tổng chi và biểu đồ theo danh mục. Nhấn **Xuất Excel** để tải CSV của tháng đang chọn.

[Tải toàn bộ mã nguồn dạng ZIP](https://github.com/mathangspk/so_chi_tieu/archive/refs/heads/main.zip)

App tải Chart.js và phông chữ từ CDN, vì vậy cần Internet để tải đầy đủ biểu đồ/phông. Dữ liệu khoản chi được lưu bằng `localStorage` của trình duyệt đang dùng, không tự đồng bộ giữa thiết bị hay trình duyệt. Xóa dữ liệu trang web có thể làm mất khoản chi đã lưu; nên xuất CSV khi cần sao lưu.

Nút **Xuất Excel** tạo **CSV có BOM UTF-8**, không tạo tệp XLSX. Hãy mở file xuất ra trong Excel để kiểm tra dữ liệu và tiếng Việt trên máy của bạn.

## Các tệp chính

```text
index.html       Giao diện và liên kết thư viện
css/style.css    Kiểu hiển thị
js/utils.js      Định dạng và kiểm tra dữ liệu
js/storage.js    Đọc/ghi localStorage
js/app.js        Thêm, sửa, xóa, thống kê và xuất CSV
```

## Làm lại bằng OpenCode

Video minh họa OpenCode 1 và model `opencode/big-pickle` trong lần thử ngày **27/10/2026**. Danh sách model, điều kiện miễn phí và giao diện công cụ có thể thay đổi. “Khoảng 6 phút” là thời gian AI xử lý của lần thử đó, không phải tổng thời gian thao tác hay cam kết cho mọi lần chạy; chi phí model ghi nhận trong lần thử là 0đ.

- [OpenCode](https://opencode.ai/)
- [Hướng dẫn cài đặt OpenCode 1](https://opencode.ai/docs/)
- [Tải Node.js](https://nodejs.org/en/download)

Lệnh cài đặt được dùng trong demo:

```text
npm install -g opencode-ai
```

Mở terminal tại **một thư mục trống khác** nếu muốn tự làm lại, rồi chạy `opencode`. Chọn model phù hợp qua `/models` và kiểm tra điều kiện sử dụng hiện tại. Phím `Tab` chuyển giữa Plan và Build trong giao diện minh họa. Xem tài liệu đúng phiên bản bạn cài nếu giao diện/lệnh đã thay đổi.

## Prompt mẫu

Các prompt dưới đây để người xem làm theo và điều chỉnh; kết quả vẫn cần được kiểm tra trên tệp và app thực tế.

### 1. Plan — lên kế hoạch trước

Chuyển sang Plan, rồi gửi:

```text
Tôi muốn làm web app "Sổ Chi Tiêu" chỉ dùng HTML, CSS, JavaScript thuần, không backend.
Chức năng: thêm khoản chi (số tiền VNĐ, danh mục, ngày, ghi chú), hiển thị danh sách,
xóa/sửa, lưu bằng localStorage. Giao diện tiếng Việt, đẹp, dùng tốt trên điện thoại.
Hãy lên kế hoạch các file và các bước, chưa viết code.
```

### 2. Build — thực hiện kế hoạch

Đọc kế hoạch, sửa yêu cầu nếu cần, chuyển sang Build rồi gửi:

```text
Kế hoạch tốt. Hãy thực hiện kế hoạch trên và viết code đầy đủ.
```

Mở app để kiểm tra thêm/sửa/xóa khoản chi, tổng tiền và việc lưu dữ liệu trước khi thêm tính năng tiếp theo.

### 3. Thống kê và biểu đồ

```text
Thêm phần thống kê: chọn tháng, hiện tổng chi trong tháng và biểu đồ tròn theo danh mục
bằng Chart.js (dùng CDN).
```

### 4. Xuất CSV mở bằng Excel

```text
Thêm nút "Xuất Excel" để tải danh sách chi tiêu của tháng đang chọn ra file CSV,
mở được bằng Excel và không lỗi font tiếng Việt.
```

### Tùy chỉnh thêm: vị trí form

```text
Đưa form thêm khoản chi lên đầu trang, ngay dưới tiêu đề.
```

Nếu thay đổi chưa đúng ý, có thể thử `/undo` theo tài liệu phiên bản đang dùng, sửa yêu cầu và kiểm tra lại kết quả. Prompt tùy chỉnh này là gợi ý; không có nghĩa bản mã nguồn trong repo đã áp dụng mọi thay đổi của từng lần thử trong video.

## Kiểm tra khi làm theo

- Thêm một vài khoản ở các tháng khác nhau, đối chiếu tổng tiền và thống kê tháng.
- Sửa/xóa một khoản và tải lại trang để kiểm tra dữ liệu lưu.
- Xuất CSV, mở bằng Excel và đối chiếu số dòng, tổng cộng, tiếng Việt.
- Thử bố cục trên kích thước màn hình bạn dùng.

Đây là mã nguồn demo để học và thử nghiệm. Việc có mã nguồn hoặc dùng prompt không thay thế bước kiểm tra app thực tế; không gửi dữ liệu hoặc mã nguồn bí mật vào dịch vụ AI khi chưa hiểu chính sách của nhà cung cấp.
