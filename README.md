# SẮC MÀU PHỐ THỊ: DÁNG HÌNH BIÊN HÒA HÔM NAY VÀ MAI SAU
> **Website trình chiếu tương tác phục vụ bài thuyết trình môn Giáo dục địa phương**  
> **Chủ đề:** Tổng hòa kiến trúc thương mại, dịch vụ, nhà ở và di tích lịch sử trung tâm thành phố Biên Hòa, tỉnh Đồng Nai.  
> **Thành viên thực hiện:** M.Na · B.Phương · K.Phụng · Yến · Đ.Thắng · H.Châu · Đ.Phong · Q.Nguyên.

---

## I. GIỚI THIỆU DỰ ÁN

Website được xây dựng theo định hướng kết hợp giữa **triển lãm kiến trúc kỹ thuật số**, **tạp chí kiến trúc hiện đại** và **bài thuyết trình học đường chuyên nghiệp**. 

Toàn bộ dữ liệu (tên công trình, địa chỉ, mốc thời gian khởi công/khai trương, chức năng, vai trò đối với kinh tế – xã hội địa phương, ý nghĩa văn hóa – lịch sử) được trích xuất **chính xác 100% từ tài liệu gốc DOCX** (`gddp.docx`), bao gồm đủ **13 công trình kiến trúc tiêu biểu** được chia thành 4 nhóm công năng chính:

1. **Nhóm Thương mại – Dịch vụ:**
   - *The Pegasus Plaza* (53-55 Võ Thị Sáu, P. Quyết Thắng)
   - *Vincom Plaza Biên Hòa* (1096 Phạm Văn Thuận, P. Tam Hiệp)
   - *GO! Đồng Nai* (Xa lộ Hà Nội, Long Hưng)
   - *The Mira Central Park* (128/16 Nguyễn Ái Quốc, Tam Hiệp)
2. **Nhóm Nhà ở – Đô thị:**
   - *Khu đô thị sinh thái Aqua City* (Đường Hương Lộ 2, xã Long Hưng)
   - *Thanh Bình Plaza* (HUD Bộ Xây dựng, 11 tầng nổi + 1 tầng hầm)
   - *Topaz Twins Biên Hòa* (Đường số 1 gần Võ Thị Sáu)
   - *Bcons Central Park* (Hẻm 238 Phan Trung, Tam Hiệp)
3. **Nhóm Văn phòng – Hành chính:**
   - *Sonadezi Building* (Đường số 1, KCN Biên Hòa 1)
   - *BV Building* (197 Hà Huy Giáp)
   - *Trụ sở UBND tỉnh Đồng Nai* (Số 02 Nguyễn Văn Trị, P. Thanh Bình)
4. **Nhóm Di sản Văn hóa – Lịch sử:**
   - *Đình Tân Lân* (Di tích cấp quốc gia năm 1991, thờ Trần Thượng Xuyên)
   - *Chùa Ông – Thất Phủ Cổ Miếu* (Di tích cấp quốc gia năm 2001, xây dựng năm 1684 tại Cù Lao Phố)

Cùng với **Slide Dòng thời gian tương tác (1684 — 2026)**, **Slide Bảng so sánh 4 nhóm công trình** và **Slide Kết luận & Tri ân**. Tổng cộng: **20 slide**.

---

## II. CẤU TRÚC THƯ MỤC

```text
GDĐP ok/
├── index.html         # Cấu trúc HTML5 semantic, thanh điều hướng, stage và điều khiển
├── style.css          # Hệ thống thiết kế, bảng màu, typography, CSS animation & responsive
├── script.js          # Dữ liệu 13 công trình, bộ máy chuyển cảnh Web Animations API & điều khiển
├── assets/
│   ├── fonts/         # Toàn bộ font offline (Be Vietnam Pro, Playfair Display)
│   │   ├── BeVietnamPro-400.ttf
│   │   ├── BeVietnamPro-500.ttf
│   │   ├── BeVietnamPro-700.ttf
│   │   ├── BeVietnamPro-800.ttf
│   │   └── PlayfairDisplay-Italic.ttf
│   └── img/           # Hình ảnh trích xuất từ DOCX gốc (chất lượng cao 1600x900)
│       ├── thumb/     # Ảnh thu nhỏ phục vụ nạp nhanh cho mục lục và timeline
│       ├── pegasus.jpg
│       ├── vincom-out.jpg, vincom-in.jpg
│       ├── aqua-map.jpg, aqua-real.jpg
│       ├── thanhbinh-out.jpg, thanhbinh-in.jpg
│       ├── ubnd.jpg
│       ├── mira.jpg, sonadezi.jpg, topaz.jpg, bv.jpg, go.jpg, bcons.jpg
│       └── tan-lan.jpg, chua-ong.jpg
├── gddp.docx          # File tài liệu DOCX gốc
└── README.md          # Tài liệu hướng dẫn sử dụng và báo cáo kỹ thuật
```

---

## III. HƯỚNG DẪN CHẠY VÀ SỬ DỤNG

### 1. Cách chạy website
- **Chạy trực tiếp:** Nhấp đúp chuột vào file `index.html` để mở bằng bất kỳ trình duyệt hiện đại nào (Google Chrome, Microsoft Edge, Cốc Cốc, Firefox, Safari). Website hoạt động hoàn toàn offline vì font chữ và ảnh đều được lưu cục bộ trong thư mục `assets/`.
- **Chạy qua Local Server (tùy chọn):** Nếu dùng VS Code, có thể nhấn chuột phải chọn *Open with Live Server*, hoặc chạy lệnh:
  ```bash
  python -m http.server 8080
  ```
  sau đó truy cập `http://localhost:8080`.

### 2. Các phím tắt điều khiển

| Phím tắt | Chức năng |
| :--- | :--- |
| `→` / `Space` / `Page Down` | Chuyển sang slide tiếp theo |
| `←` / `Page Up` | Quay lại slide trước |
| `Home` | Về slide đầu tiên (Trang bìa) |
| `End` | Đến slide cuối cùng (Kết luận) |
| `F` | Bật / tắt chế độ **Toàn màn hình** (Fullscreen) |
| `T` | Mở / đóng **Mục lục trực quan** (Table of Contents) |
| `N` | Bật / tắt **Bảng lời dẫn thuyết trình** (Notes / Teleprompter) |
| `P` | Mở **Cửa sổ người thuyết trình** (Presenter View màn hình phụ) |
| `M` | Bật / tắt **Chế độ giảm chuyển động** (Reduced Motion) |
| `?` hoặc `H` | Mở bảng hướng dẫn phím tắt |
| `Esc` | Đóng các bảng popup (Mục lục, Hướng dẫn) |

### 3. Thao tác trên thiết bị di động / Màn hình cảm ứng
- **Vuốt sang trái:** Slide tiếp theo.
- **Vuốt sang phải:** Slide trước.
- **Thanh điều hướng:** Tự động co giãn theo giao diện mobile nhỏ gọn, tối ưu trải nghiệm chạm lướt.

---

## IV. TÍNH NĂNG ĐẶC BIỆT DÀNH CHO BÀI THUYẾT TRÌNH

1. **Bảng lời dẫn thuyết trình (Teleprompter - Phím N):**
   - Mỗi slide đều có sẵn: **Lời mở đầu tự nhiên**, **Các ý chính cần nhấn mạnh** (dựa trên dữ liệu thực tế) và **Câu dẫn chuyển tiếp** sang slide kế tiếp.
   - Giúp học sinh tự tin thuyết trình trôi chảy trước lớp mà không sợ quên ý.

2. **Cửa sổ người thuyết trình độc lập (Presenter View - Phím P):**
   - Mở một cửa sổ riêng dành cho laptop cá nhân khi cắm máy chiếu (Projector). Màn hình máy chiếu chiếu slide chính, còn màn hình phụ hiển thị đồng hồ bấm giờ, lời dẫn, ghi chú và xem trước slide tiếp theo. Có thể điều khiển slide chính từ xa ngay trên cửa sổ này.

3. **Chế độ toàn màn hình thông minh (Fullscreen Auto-Hide - Phím F):**
   - Khi ở chế độ toàn màn hình, thanh điều hướng phía trên và thanh công cụ phía dưới sẽ tự động ẩn mượt mà sau 2.6 giây không di chuột, trả lại 100% diện tích màn chiếu cho hình ảnh và kiến trúc. Khi rê chuột lại, các thanh điều khiển lập tức xuất hiện trở lại.

4. **Bộ máy chuyển cảnh Web Animations API:**
   - Không bị giật khung hình hay nhấp nháy trắng. Hỗ trợ Directional Slide (trượt theo hướng điều hướng), Cinematic Zoom, Mask Reveal và Smooth Fade.
   - Tự động tải trước (preload) hình ảnh của các slide kế tiếp để chuyển cảnh tức thì không độ trễ.

---

## V. HƯỚNG DẪN CHỈNH SỬA VÀ THAY ĐỔI DỮ LIỆU

1. **Thay đổi thông tin thành viên / môn học:**
   - Mở file `script.js`, tìm dòng:
     ```javascript
     const MEMBERS = 'M.Na · B.Phương · K.Phụng · Yến · Đ.Thắng · H.Châu · Đ.Phong · Q.Nguyên';
     ```
     sửa lại danh sách theo ý muốn và lưu file.
2. **Thay thế hoặc cập nhật hình ảnh:**
   - Hình ảnh nằm trong thư mục `assets/img/`. Nếu có ảnh chụp thực tế mới đẹp hơn, chỉ cần đặt ảnh mới vào với cùng tên file (ví dụ: `pegasus.jpg`, `ubnd.jpg`, `chua-ong.jpg`,...).
3. **Chỉnh sửa nội dung các công trình:**
   - Mở `script.js`, tìm đối tượng `const B = { ... }`. Mỗi công trình được quản lý trong một key riêng (`pegasus`, `vincom`, `aqua`, `ubnd`, `tanlan`, `chuaong`,...) với các trường văn bản rõ ràng, dễ đọc và dễ biên tập.
