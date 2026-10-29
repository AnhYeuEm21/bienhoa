/* ==========================================================================
   SẮC MÀU PHỐ THỊ — DÁNG HÌNH BIÊN HÒA HÔM NAY VÀ MAI SAU
   script.js — dữ liệu slide, bố cục, bộ máy chuyển cảnh và điều khiển.

   Cấu trúc file:
   1. Dữ liệu nội dung (lấy từ DOCX)         → GROUPS, B (công trình), TIMELINE
   2. Hàm dựng HTML cho từng kiểu bố cục       → split / dual / full / heritage ...
   3. Danh sách slide + lời dẫn                → DEFS
   4. Bộ máy chuyển cảnh (hàng đợi, WAAPI)     → request / pump / transition
   5. Giao diện điều khiển                     → UI, mục lục, lời dẫn, toàn màn hình, bàn phím
   ========================================================================== */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const pad = n => String(n).padStart(2, '0');
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ==========================================================================
   1. DỮ LIỆU — mọi thông tin thực tế đều lấy từ file DOCX "gddp.docx"
   ========================================================================== */
const GROUPS = {
  com : { name: 'Thương mại – dịch vụ',     color: '#2FC6AE', theme: 'm' },
  home: { name: 'Nhà ở – đô thị',           color: '#6DB8E8', theme: 'm' },
  off : { name: 'Văn phòng – hành chính',   color: '#E49A5C', theme: 'm' },
  her : { name: 'Di sản văn hóa – lịch sử', color: '#D5AE68', theme: 'h' }
};
const SECTIONS = {
  open: { name: 'Mở đầu',               color: '#B8C5C8' },
  sum : { name: 'Tổng hợp & kết luận',  color: '#D5AE68' },
  ...GROUPS
};

/* Thành viên: tên xuất hiện làm tiêu đề các phần trong DOCX. DOCX không nêu tên nhóm / giáo viên. */
const MEMBERS = 'M.Na · B.Phương · K.Phụng · Yến · Đ.Thắng · H.Châu · Đ.Phong · Q.Nguyên';

const B = {
  pegasus: {
    n: 1, g: 'com', name: 'The Pegasus Plaza', short: 'The Pegasus Plaza', tag: 'Phức hợp thương mại – văn phòng – căn hộ',
    addr: 'Số 53 - 55 đường Võ Thị Sáu, phường Quyết Thắng, thành phố Biên Hòa, tỉnh Đồng Nai.',
    imgs: [{ k: 'pegasus', fp: '40% 50%', cap: 'Cổng trước The Pegasus Plaza (Hình 1.1)', tag: 'Cổng trước' }],
    dates: [{ d: '1/1/2011', t: 'Khởi công' }, { d: '11/12/2013', t: 'Chính thức khai trương' }],
    dev: 'Tòa nhà phát triển theo mô hình phức hợp gồm trung tâm thương mại, văn phòng và căn hộ cao cấp.',
    chips: ['Trung tâm thương mại', 'Văn phòng', 'Căn hộ cao cấp'],
    roles: ['Thúc đẩy hoạt động thương mại và dịch vụ', 'Tạo việc làm cho người dân', 'Cung cấp không gian mua sắm, ăn uống và giải trí'],
    meaning: 'Góp phần hiện đại hóa đô thị Biên Hòa, nâng cao chất lượng cuộc sống và thúc đẩy sự phát triển kinh tế địa phương.'
  },
  vincom: {
    n: 2, g: 'com', name: 'Vincom Plaza Biên Hòa', short: 'Vincom Plaza Biên Hòa', tag: 'Mua sắm, giải trí',
    addr: 'Số 1096 đường Phạm Văn Thuận, phường Tam Hiệp, tỉnh Đồng Nai.',
    imgs: [{ k: 'vincom-out', fp: '50% 55%', cap: 'Bên ngoài trung tâm thương mại Vincom (Hình 2.1)', tag: 'Bên ngoài' },
           { k: 'vincom-in',  fp: '50% 50%', cap: 'Bên trong trung tâm Vincom (Hình 2.2)', tag: 'Bên trong' }],
    dates: [{ d: '28/8/2015', t: 'Chính thức khai trương' }],
    hist: 'Thuộc Tập đoàn Vingroup, phục vụ nhu cầu mua sắm và giải trí của người dân.',
    dev: 'Ngày càng phát triển với nhiều cửa hàng, nhà hàng, siêu thị, rạp chiếu phim và khu vui chơi.',
    roles: ['Thúc đẩy kinh tế và thương mại', 'Tạo việc làm cho người dân', 'Phát triển dịch vụ mua sắm, vui chơi và giải trí'],
    meaning: 'Góp phần hiện đại hóa đô thị Biên Hòa, nâng cao chất lượng cuộc sống và thể hiện sự phát triển của tỉnh Đồng Nai.'
  },
  go: {
    n: 3, g: 'com', name: 'GO! Đồng Nai', short: 'GO! Đồng Nai', tag: 'Mua sắm, ăn uống, dịch vụ',
    addr: 'Khu vực Xa lộ Hà Nội, Long Hưng, Biên Hòa, Đồng Nai.',
    imgs: [{ k: 'go', fp: '62% 50%', cap: 'GO! Đồng Nai (Hình 11.1)', tag: 'Phối cảnh' }],
    hist: 'Được phát triển từ mô hình trung tâm mua sắm quy mô lớn tại khu vực Biên Hòa.',
    dev: 'Được cải tiến và phát triển thành tổ hợp mua sắm, ăn uống và dịch vụ.',
    roles: ['Đáp ứng nhu cầu mua sắm, vui chơi và giải trí của người dân', 'Góp phần phát triển thương mại địa phương'],
    meaning: 'Thể hiện sự phát triển của mô hình bán lẻ hiện đại và lối sống đô thị.',
    inside: 'Khu siêu thị, các gian hàng, khu ẩm thực và không gian dịch vụ.',
    outside: 'Công trình quy mô lớn, mặt tiền hiện đại và khu vực bãi đỗ xe.'
  },
  mira: {
    n: 4, g: 'com', name: 'The Mira Central Park', short: 'The Mira Central Park', tag: 'Khách sạn, hội nghị, sự kiện',
    addr: '128/16 đường Nguyễn Ái Quốc, khu vực Tam Hiệp, Biên Hòa, Đồng Nai.',
    imgs: [{ k: 'mira', fp: '36% 40%', cap: 'The Mira Central Park (Hình 7.1)', tag: 'Toàn cảnh' }],
    hist: 'Được xây dựng nhằm đáp ứng nhu cầu lưu trú, nghỉ dưỡng và tổ chức sự kiện tại Biên Hòa.',
    dev: 'Phát triển thành khách sạn hiện đại, phục vụ khách du lịch, doanh nhân và các sự kiện lớn.',
    roles: ['Góp phần phát triển dịch vụ lưu trú, du lịch và tổ chức hội nghị tại địa phương'],
    meaning: 'Thể hiện sự phát triển của ngành dịch vụ và diện mạo đô thị hiện đại ở Biên Hòa.',
    inside: 'Sảnh tiếp đón, phòng nghỉ, nhà hàng, phòng hội nghị và khu vực tổ chức sự kiện.',
    outside: 'Khối nhà cao tầng, mặt đứng hiện đại và hệ thống cửa kính.'
  },
  aqua: {
    n: 5, g: 'home', name: 'Khu đô thị sinh thái Aqua City', short: 'Aqua City', tag: 'Khu đô thị sinh thái',
    addr: 'Đường Hương Lộ 2, xã Long Hưng, thành phố Biên Hòa, tỉnh Đồng Nai (liền kề TP.HCM).',
    imgs: [{ k: 'aqua-map',  fp: '50% 50%', cap: 'Dự án Aqua City Novaland Đồng Nai (Hình 4.1)', tag: 'Sơ đồ dự án' },
           { k: 'aqua-real', fp: '45% 50%', cap: 'Hình ảnh thực tế dự án Aqua City Novaland (Hình 4.2)', tag: 'Hình ảnh thực tế' }],
    dates: [{ d: '2019', t: 'Khởi công' },
            { d: 'Cuối năm 2026', t: 'Dự án đang bứt tốc thi công mạnh mẽ', long: true }],
    stages: [
      { k: 'Từ năm 2019', p: 'Khởi công, chia thành nhiều phân khu (Đảo Phượng Hoàng, Sun Harbor...).' },
      { k: 'Đến cuối năm 2026', p: 'Sau giai đoạn tháo gỡ vướng mắc pháp lý, dự án đang bứt tốc thi công mạnh mẽ với dòng vốn lớn từ ngân hàng để hoàn thiện hạ tầng và bàn giao đồng loạt cho cư dân.' }
    ],
    stat: { big: '70%', label: 'diện tích là mảng xanh, mặt nước' },
    roleText: 'Trở thành tâm điểm đô thị hiện đại thúc đẩy kinh tế phía Đông; đồng thời là tổ hợp giải trí - dịch vụ cao cấp bậc nhất khu vực nhờ:',
    chips: ['Bến du thuyền', 'Trung tâm thương mại', 'Trường học', 'Bệnh viện quốc tế'],
    meaning: 'Tiên phong định hình xu hướng sống xanh chuẩn quốc tế (70% diện tích là mảng xanh, mặt nước) và góp phần giãn dân, giảm áp lực đô thị cho trung tâm TP.HCM.'
  },
  thanhbinh: {
    n: 6, g: 'home', name: 'Thanh Bình Plaza', short: 'Thanh Bình Plaza', tag: 'Nhà ở kết hợp thương mại',
    imgs: [{ k: 'thanhbinh-out', fp: '50% 40%', cap: 'Bên ngoài chung cư Thanh Bình (Hình 5.1)', tag: 'Bên ngoài' },
           { k: 'thanhbinh-in',  fp: '50% 60%', cap: 'Bên trong phòng của chung cư Thanh Bình (Hình 5.2)', tag: 'Bên trong' }],
    dates: [{ d: 'Tháng 10/2015', t: 'Khởi công' }, { d: 'Cuối năm 2017', t: 'Bàn giao' }],
    stat: { big: '11', label: 'tầng nổi + 1 tầng hầm' },
    stages: [
      { k: 'Đầu tư & xây dựng', p: 'Do Tổng công ty HUD (Bộ Xây dựng) đầu tư, khởi công tháng 10/2015 và bàn giao từ cuối năm 2017.' },
      { k: 'Quy mô & chức năng', p: 'Dự án gồm 11 tầng nổi, 1 tầng hầm, cung cấp không gian ở kết hợp dịch vụ thương mại ổn định từ đó đến nay.' },
      { k: 'Vai trò', p: 'Là điểm kết nối giao thông - hành chính chiến lược (gần chợ Biên Hòa, bờ sông và các cơ quan hành chính) và cung cấp tiện ích sống "tất cả trong một" tiện lợi cho cư dân.' },
      { k: 'Ý nghĩa', p: 'Hiện đại hóa bộ mặt đô thị lõi của Biên Hòa, giải quyết nhu cầu nhà ở chất lượng cao và nâng cao chất lượng sống cho người dân.' }
    ]
  },
  topaz: {
    n: 7, g: 'home', name: 'Topaz Twins Biên Hòa', short: 'Topaz Twins Biên Hòa', tag: 'Hai khối tháp căn hộ',
    addr: 'Khu vực đường số 1, gần đường Võ Thị Sáu, trung tâm Biên Hòa.',
    imgs: [{ k: 'topaz', fp: '50% 45%', cap: 'Topaz Twins Biên Hòa (Hình 9.1)', tag: 'Hai khối tháp' }],
    hist: 'Là dự án căn hộ cao tầng được phát triển nhằm đáp ứng nhu cầu nhà ở tại đô thị.',
    dev: 'Hình thành tổ hợp hai khối tháp căn hộ với các tiện ích phục vụ cư dân.',
    roles: ['Bổ sung nguồn cung nhà ở và góp phần thay đổi cảnh quan đô thị'],
    meaning: 'Thể hiện xu hướng phát triển nhà ở cao tầng và hiện đại hóa không gian sống.',
    inside: 'Các căn hộ, sảnh đón, hành lang và khu vực tiện ích chung.',
    outside: 'Hai khối tháp cao tầng, ban công và mặt đứng hiện đại.'
  },
  bcons: {
    n: 8, g: 'home', name: 'Bcons Central Park', short: 'Bcons Central Park', tag: 'Căn hộ cao tầng',
    addr: 'Khu vực hẻm 238 đường Phan Trung, Tam Hiệp, Biên Hòa, Đồng Nai.',
    imgs: [{ k: 'bcons', fp: '38% 45%', cap: 'Bcons Central Park (Hình 12.1)', tag: 'Phối cảnh' }],
    hist: 'Là dự án phát triển nhà ở theo mô hình căn hộ cao tầng.',
    dev: 'Được định hướng thành khu căn hộ với các tiện ích phục vụ đời sống cư dân.',
    roles: ['Góp phần phát triển nhà ở đô thị và đáp ứng nhu cầu sinh sống của người dân'],
    meaning: 'Thể hiện xu hướng xây dựng khu dân cư hiện đại, sử dụng không gian đô thị theo chiều cao.',
    inside: 'Các căn hộ, sảnh chung và những không gian tiện ích theo thiết kế dự án.',
    outside: 'Các khối nhà cao tầng, ban công và mặt đứng kiến trúc hiện đại.'
  },
  sonadezi: {
    n: 9, g: 'off', name: 'Sonadezi Building', short: 'Sonadezi Building', tag: 'Văn phòng và dịch vụ',
    addr: 'Đường số 1, Khu công nghiệp Biên Hòa 1, Đồng Nai.',
    imgs: [{ k: 'sonadezi', fp: '34% 50%', cap: 'Sonadezi Building (Hình 8.1)', tag: 'Bên ngoài' }],
    hist: 'Được xây dựng phục vụ hoạt động quản lý, điều hành và kinh doanh của doanh nghiệp.',
    dev: 'Trở thành địa điểm văn phòng và dịch vụ phục vụ các hoạt động kinh tế trong khu vực.',
    roles: ['Hỗ trợ hoạt động doanh nghiệp, góp phần thúc đẩy phát triển kinh tế và dịch vụ'],
    meaning: 'Thể hiện quá trình công nghiệp hóa và hiện đại hóa của Đồng Nai.',
    inside: 'Không gian văn phòng, khu vực làm việc và phòng họp.',
    outside: 'Khối nhà văn phòng nhiều tầng, mặt đứng hiện đại và hệ thống cửa kính.'
  },
  bv: {
    n: 10, g: 'off', name: 'BV Building', short: 'BV Building', tag: 'Văn phòng, kinh doanh',
    addr: '197 đường Hà Huy Giáp, Biên Hòa, Đồng Nai.',
    imgs: [{ k: 'bv', fp: '70% 45%', cap: 'BV Building (Hình 10.1)', tag: 'Mặt tiền' }],
    hist: 'Được xây dựng để phục vụ nhu cầu văn phòng và hoạt động kinh doanh.',
    dev: 'Trở thành địa điểm làm việc của các doanh nghiệp và đơn vị dịch vụ.',
    roles: ['Cung cấp không gian làm việc, hỗ trợ các hoạt động kinh tế và thương mại'],
    meaning: 'Góp phần thể hiện diện mạo đô thị năng động và hiện đại của Biên Hòa.',
    inside: 'Khu vực văn phòng, sảnh tiếp khách và không gian làm việc.',
    outside: 'Mặt tiền hiện đại, các tầng chức năng và hệ thống cửa kính.'
  },
  ubnd: {
    n: 11, g: 'off', name: 'Trụ sở UBND tỉnh Đồng Nai', short: 'Trụ sở UBND tỉnh Đồng Nai', tag: 'Cơ quan hành chính cấp tỉnh',
    addr: 'Số 02, đường Nguyễn Văn Trị, Phường Thanh Bình, Thành phố Biên Hòa, tỉnh Đồng Nai.',
    imgs: [{ k: 'ubnd', fp: '50% 35%', cap: 'Mặt trước văn phòng UBND tỉnh Đồng Nai (Hình 6.1)', tag: 'Mặt trước' }],
    dates: [{ d: 'Thời Pháp', t: 'Tiền thân là Tòa hành chính tỉnh Biên Hòa', long: true },
            { d: 'Tháng 2/1976', t: 'Ủy ban Nhân dân tỉnh chính thức thành lập sau khi hợp nhất các tỉnh Biên Hòa, Bà Rịa và Long Khánh' }],
    dev: 'Từ bộ máy quản lý thời chiến, cơ quan đã cải tổ qua nhiều thời kỳ Hiến pháp, liên tục nâng cấp trụ sở và số hóa để quản lý một tỉnh công nghiệp trọng điểm.',
    meaning: 'Là trung tâm đưa ra các quyết sách phát triển kinh tế - xã hội cao nhất của tỉnh, đồng thời là biểu tượng quyền lực nhà nước mang tính phục vụ nhân dân.',
    roleLine: 'Cơ quan hành chính nhà nước cao nhất ở địa phương, thực hiện hai chức năng chính:',
    fns: [
      { h: 'Quản lý và điều hành', p: 'Thực thi Hiến pháp, pháp luật và quản lý toàn diện các lĩnh vực kinh tế, văn hóa, an ninh, quốc phòng trên địa bàn toàn tỉnh.' },
      { h: 'Tổ chức thực hiện', p: 'Cụ thể hóa các nghị quyết của Tỉnh ủy, Hội đồng Nhân dân tỉnh và chỉ đạo của Chính phủ thành các kế hoạch, chính sách phát triển thực tế.' }
    ]
  },
  tanlan: {
    n: 12, g: 'her', name: 'Đình Tân Lân', short: 'Đình Tân Lân', tag: 'Di tích cấp quốc gia (1991)',
    imgs: [{ k: 'tan-lan', fp: '50% 30%', cap: 'Cổng trước Đình Tân Lân (Hình 13.1)', tag: '' }],
    dates: [{ d: 'Thời vua Minh Mạng', t: 'Đình có từ thời kỳ này, thờ Trần Thượng Xuyên', long: true },
            { d: '1991', t: 'Được công nhận là di tích cấp quốc gia' }],
    seal: ['Di tích cấp quốc gia', '1991'],
    hist: 'Có từ thời vua Minh Mạng, thờ Trần Thượng Xuyên, người có công khai phá vùng đất Đồng Nai.',
    dev: 'Đình được xây dựng, tu sửa nhiều lần và được công nhận là di tích cấp quốc gia năm 1991.',
    roles: ['Là nơi sinh hoạt tín ngưỡng và lưu giữ lịch sử địa phương'],
    meaning: 'Thể hiện lòng biết ơn người có công với quê hương.'
  },
  chuaong: {
    n: 13, g: 'her', name: 'Chùa Ông (Thất Phủ Cổ Miếu)', short: 'Chùa Ông (Thất Phủ Cổ Miếu)', tag: 'Di tích cấp quốc gia (2001)',
    imgs: [{ k: 'chua-ong', fp: '50% 48%', cap: 'Cổng chùa Ông Thất Phủ Cổ Miếu (Hình 14.1)', tag: '' }],
    dates: [{ d: '1684', t: 'Xây dựng bởi cộng đồng người Hoa ở Cù Lao Phố' },
            { d: '2001', t: 'Được công nhận là di tích cấp quốc gia' }],
    seal: ['Di tích cấp quốc gia', '2001'],
    dev: 'Được tu bổ qua nhiều thời kỳ, công nhận là di tích cấp quốc gia năm 2001.',
    roles: ['Là nơi thờ tự, sinh hoạt văn hóa và thu hút khách tham quan'],
    meaning: 'Thể hiện sự giao thoa văn hóa Hoa – Việt.'
  }
};
const TOTAL_BUILDINGS = Object.keys(B).length;

/* Các mốc thời gian xuất hiện trong DOCX, sắp theo trình tự lịch sử (id → slide tương ứng) */
const TIMELINE = [
  { d: '1684',               t: 'Xây dựng Chùa Ông (Thất Phủ Cổ Miếu) tại Cù Lao Phố', id: 'chuaong', g: 'her' },
  { d: 'Thời Minh Mạng',     t: 'Đình Tân Lân có từ thời vua Minh Mạng', id: 'tanlan', g: 'her', sm: 1 },
  { d: 'Thời Pháp',          t: 'Tòa hành chính tỉnh Biên Hòa, tiền thân của trụ sở UBND tỉnh', id: 'ubnd', g: 'off', sm: 1 },
  { d: '2/1976',             t: 'UBND tỉnh Đồng Nai thành lập sau khi hợp nhất Biên Hòa, Bà Rịa, Long Khánh', id: 'ubnd', g: 'off' },
  { d: '1991',               t: 'Đình Tân Lân là di tích cấp quốc gia', id: 'tanlan', g: 'her' },
  { d: '2001',               t: 'Chùa Ông là di tích cấp quốc gia', id: 'chuaong', g: 'her' },
  { d: '1/1/2011',           t: 'Khởi công The Pegasus Plaza', id: 'pegasus', g: 'com' },
  { d: '11/12/2013',         t: 'Khai trương The Pegasus Plaza', id: 'pegasus', g: 'com' },
  { d: '28/8/2015',          t: 'Khai trương Vincom Plaza Biên Hòa', id: 'vincom', g: 'com' },
  { d: 'Tháng 10/2015',      t: 'Khởi công Thanh Bình Plaza', id: 'thanhbinh', g: 'home', sm: 1 },
  { d: 'Cuối năm 2017',      t: 'Bàn giao Thanh Bình Plaza', id: 'thanhbinh', g: 'home', sm: 1 },
  { d: '2019',               t: 'Khởi công Aqua City', id: 'aqua', g: 'home' },
  { d: 'Cuối năm 2026',      t: 'Aqua City bứt tốc thi công, hướng tới bàn giao đồng loạt', id: 'aqua2', g: 'home', sm: 1 }
];

/* ==========================================================================
   2. HÀM DỰNG HTML
   ========================================================================== */
const A = (type, delay = 0) => `data-a="${type}" style="--d:${delay}ms"`;
const PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/></svg>';
const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

function photo(img, o = {}) {
  const src = `assets/img/${o.thumb ? 'thumb/' : ''}${img.k}.jpg`;
  const cap = o.cap === false ? '' : (o.cap || img.cap || '');
  const tag = o.tag === false ? '' : (o.tag ?? img.tag ?? '');
  return `<figure class="ph ${o.cls || ''}" ${o.a || ''}>
    <img alt="${img.cap || img.k}" data-src="${src}" style="--fp:${img.fp || '50% 50%'}" decoding="async" draggable="false">
    <div class="ph-fb"><b>Ảnh cần bổ sung</b><span>${img.cap || img.k} · assets/img/${img.k}.jpg</span></div>
    ${tag ? `<span class="ph-tag">${tag}</span>` : ''}${cap ? `<figcaption>${cap}</figcaption>` : ''}${o.extra || ''}
  </figure>`;
}
const eyebrow = (b, a) => `<div class="eyebrow" ${a}><span class="idx">${pad(b.n)}</span><span>${GROUPS[b.g].name}</span><i></i><span>${b.n}/${TOTAL_BUILDINGS}</span></div>`;
const titleH = (b, a, cls = '') => `<h2 class="title ${cls}" ${a}>${b.name}</h2>`;
const addrH = (b, a) => b.addr ? `<p class="addr" ${a}>${PIN}<span>${b.addr}</span></p>` : '';
const datesH = (b, base) => b.dates ? `<div class="dates"><i class="dline" ${A('line', base)}></i>${b.dates.map((x, i) =>
  `<div class="date ${x.long ? 'long' : ''}" ${A('rise-sm', base + 250 + i * 220)}><b>${x.d}</b><span>${x.t}</span></div>`).join('')}</div>` : '';
const card = (k, p, a) => `<div class="card" ${a}><h4>${k}</h4><p>${p}</p></div>`;
const meaningH = (b, a) => `<div class="meaning" ${a}><div><div class="k">Ý nghĩa</div><p>${b.meaning}</p></div></div>`;
const rolesH = b => b.roles ? (b.roles.length > 1 ? `<ul class="uli">${b.roles.map(r => `<li>${r}</li>`).join('')}</ul>` : `<p>${b.roles[0]}</p>`) : '';

/* Danh sách "bước" (lịch sử, phát triển, vai trò) dựng từ các trường có trong dữ liệu */
function stepsOf(b) {
  if (b.stages) return b.stages.map(s => ({ k: s.k, h: `<p>${s.p}</p>` }));
  const s = [];
  if (b.hist) s.push({ k: 'Lịch sử hình thành', h: `<p>${b.hist}</p>` });
  if (b.dev)  s.push({ k: 'Quá trình phát triển', h: `<p>${b.dev}</p>` + (b.chips ? `<div class="chips" style="margin-top:1rem">${b.chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>` : '') });
  if (b.roles) s.push({ k: 'Vai trò đối với đời sống', h: rolesH(b) });
  return s;
}
const railH = (steps, base) => `<div class="rail">${steps.map((s, i) => `<div class="step" ${A('rise-sm', base + i * 130)}><h4>${s.k}</h4>${s.h}</div>`).join('')}</div>`;
const colsH = (steps, base) => `<div class="cols">${steps.map((s, i) => `<div class="step" ${A('rise-sm', base + i * 120)}><h4>${s.k}</h4>${s.h}</div>`).join('')}</div>`;
const ioH = (b, base, side) => b.inside ? `<div class="io">
    <div class="card ${side ? 'glass' : ''}" ${A('rise-sm', base)}><h4>Kiến trúc bên ngoài</h4><p>${b.outside}</p></div>
    <div class="card ${side ? 'glass' : ''}" ${A('rise-sm', base + 120)}><h4>Kiến trúc bên trong</h4><p>${b.inside}</p></div></div>` : '';

/* Bố cục 1: ảnh lớn bên cạnh cột thông tin (có thể đảo trái/phải) */
function split(b, o = {}) {
  const hasIO = !!b.inside;
  return { cls: 'l-split-slide', html: `
  <div class="l-split ${o.flip ? 'flip' : ''}">
    <div class="visual">
      ${photo(b.imgs[0], { cls: 'main kb', a: A('mask', 0) })}
      ${ioH(b, 900)}
    </div>
    <div class="info">
      <div class="head">${eyebrow(b, A('fade', 120))}${titleH(b, A('rise', 200))}${addrH(b, A('rise-sm', 320))}</div>
      ${datesH(b, 420)}
      ${railH(stepsOf(b), 520)}
      ${meaningH(b, A('rise-sm', 520 + stepsOf(b).length * 130 + 80))}
    </div>
  </div>` };
}

/* Bố cục 2: hai ảnh đối chiếu + hàng thông tin phía dưới */
function dual(b, o = {}) {
  const right = b.dates ? datesH(b, 380) : '';
  const stepsArr = stepsOf(b);
  if (!b.stages) stepsArr.push({ k: 'Ý nghĩa', h: `<p>${b.meaning}</p>` });
  const badge = o.badge ? `<div class="badge" ${A('pop', 900)}><b>${b.stat.big}</b><span>${b.stat.label}</span></div>` : '';
  return { cls: 'l-dual-slide', html: `
  <div class="l-dual">
    <div class="dual-head">
      <div class="head">${eyebrow(b, A('fade', 100))}${titleH(b, A('rise', 180), 'sm')}${addrH(b, A('rise-sm', 300))}</div>
      ${right}
    </div>
    <div class="dual-photos">
      ${photo(b.imgs[0], { cls: 'kb', a: A('mask', 0), extra: badge })}
      ${photo(b.imgs[1], { cls: 'kb', a: A('mask', 160) })}
    </div>
    ${colsH(stepsArr, 600)}
  </div>` };
}

/* Bố cục 3: ảnh toàn khung làm nền + bảng thông tin */
function full(b, o = {}) {
  const steps = o.steps || stepsOf(b);
  return { cls: 'l-full', html: `
  ${photo(b.imgs[0], { cls: 'bgphoto kb-slow', a: A('fade', 0), cap: false, tag: false })}
  <div class="full-grid">
    <div class="full-main">
      <div class="head">${eyebrow(b, A('fade', 120))}${titleH(b, A('rise', 200))}${addrH(b, A('rise-sm', 320))}</div>
      ${o.dates !== false ? datesH(b, 420) : ''}
      ${railH(steps, 520)}
      ${o.noMeaning ? '' : meaningH(b, A('rise-sm', 520 + steps.length * 130 + 80))}
    </div>
    <div class="full-side">
      ${ioH(b, 900, true)}
      <span class="credit" ${A('fade', 1000)}>${b.imgs[0].cap}</span>
    </div>
  </div>` };
}

/* Bố cục 4: di sản — nền giấy ngà, khung vòm, chuyển động chậm */
function heritage(b) {
  const steps = stepsOf(b);
  return { cls: 'l-her-slide', html: `
  <div class="l-her">
    <div class="arch">
      ${photo(b.imgs[0], { cls: 'kb-slow', a: A('mask-up', 0), cap: false, tag: false })}
      <div class="seal" ${A('pop', 1000)}><small>${b.seal[0]}</small><b>${b.seal[1]}</b></div>
    </div>
    <div class="her-info">
      <div class="head">${eyebrow(b, A('fade', 160))}${titleH(b, A('rise', 260))}</div>
      ${datesH(b, 480)}
      ${railH(steps, 640)}
      <p class="quote" ${A('rise-sm', 1250)}>“${b.meaning}”</p>
    </div>
  </div>` };
}

/* ==========================================================================
   3. DANH SÁCH SLIDE + LỜI DẪN
   tr: kiểu chuyển cảnh khi VÀO slide này (slide | zoom | mask | fade)
   ========================================================================== */
let IDX = {};            // id → chỉ số slide

const DEFS = [
 { id: 'cover', title: 'Trang bìa', sec: 'open', tr: 'fade', thumb: null, label: 'Bìa',
   build: () => {
     const sl = [
       { k: 'chua-ong', fp: '50% 50%', cap: 'Chùa Ông', h: 58, d: 560 },
       { k: 'mira',     fp: '34% 40%', cap: 'The Mira', h: 80, d: 460 },
       { k: 'pegasus',  fp: '41% 50%', cap: 'Pegasus',  h: 100, d: 360 },
       { k: 'ubnd',     fp: '50% 30%', cap: 'UBND tỉnh', h: 72, d: 460 },
       { k: 'tan-lan',  fp: '50% 55%', cap: 'Tân Lân',  h: 64, d: 560 }
     ];
     return { cls: 's-cover', html: `
     <div class="bp" ${A('fade', 0)}></div>
     <div class="slices">${sl.map(s => `<div class="slice" style="--h:${s.h}%">${photo({ k: s.k, fp: s.fp, cap: s.cap }, { cls: 'kb', a: A('mask-up', s.d), cap: false, tag: false })}<figcaption>${s.cap}</figcaption></div>`).join('')}</div>
     <div class="cover-ground" ${A('line', 700)}></div>
     <div class="cover-text">
       <div class="eyebrow" ${A('fade', 200)}><span>Giáo dục địa phương</span><i></i><span>Chuyên đề kiến trúc</span></div>
       <h1><span class="l1" ${A('rise', 300)}>SẮC MÀU PHỐ THỊ</span><span class="l2" ${A('rise', 460)}>— DÁNG HÌNH BIÊN HÒA HÔM NAY VÀ MAI SAU</span></h1>
       <p class="sub" ${A('rise-sm', 640)}>Tổng hòa kiến trúc thương mại, dịch vụ, nhà ở và di tích lịch sử trung tâm.</p>
       <div class="cover-meta" ${A('rise-sm', 780)}>
         <div><small>Môn học</small><span>Giáo dục địa phương</span></div>
         <div><small>Chủ đề</small><span>Kiến trúc các phường ở trung tâm<br>TP. Biên Hòa, tỉnh Đồng Nai</span></div>
         <div><small>Thành viên</small><span>${MEMBERS}</span></div>
       </div>
       <button class="cta" type="button" data-go="1" ${A('rise-sm', 920)}>BẮT ĐẦU KHÁM PHÁ ${ARROW}</button>
     </div>
     <div class="cover-loc" ${A('fade', 1100)}>Biên Hòa · Đồng Nai</div>` };
   },
   notes: { open: 'Xin chào thầy cô và các bạn. Hôm nay nhóm xin giới thiệu chuyên đề “Sắc màu phố thị: Dáng hình Biên Hòa hôm nay và mai sau”, tổng hòa kiến trúc thương mại, dịch vụ, nhà ở và di tích lịch sử tại trung tâm thành phố Biên Hòa, tỉnh Đồng Nai.',
     points: ['Môn học: Giáo dục địa phương.', 'Thành viên thực hiện: M.Na, B.Phương, K.Phụng, Yến, Đ.Thắng, H.Châu, Đ.Phong, Q.Nguyên.', 'Mỗi công trình là một câu chuyện về diện mạo đô thị và giá trị văn hóa địa phương.'],
     next: 'Trước tiên, mời cả lớp nhìn qua tổng quan hành trình hôm nay.' } },

 { id: 'overview', title: 'Tổng quan hành trình', sec: 'open', tr: 'zoom', thumb: null, label: 'Tổng quan',
   build: () => {
     const cols = Object.entries(GROUPS).map(([g, G], ci) => {
       const items = Object.entries(B).filter(([, b]) => b.g === g);
       const desc = {
         com : 'Thúc đẩy thương mại, dịch vụ; tạo việc làm; không gian mua sắm, giải trí, lưu trú.',
         home: 'Căn hộ cao tầng và khu đô thị đáp ứng nhu cầu nhà ở, thay đổi cảnh quan đô thị.',
         off : 'Không gian làm việc của doanh nghiệp và cơ quan hành chính cấp tỉnh.',
         her : 'Đình, chùa là di tích cấp quốc gia, lưu giữ lịch sử và văn hóa địa phương.'
       }[g];
       return `<section class="ov-col" style="--gc:${G.color}" ${A('rise', 260 + ci * 130)}>
         <header><b>Nhóm ${ci + 1} · ${items.length} công trình</b><h3>${G.name}</h3><p>${desc}</p></header>
         <div class="ov-list">${items.map(([id, b]) => `<button class="ov-item" type="button" data-go="${IDX[id]}"><span class="th"><img alt="" data-src="assets/img/thumb/${b.imgs[0].k}.jpg"></span><span>${b.short}<small>${b.tag}</small></span></button>`).join('')}</div>
       </section>`;
     }).join('');
     return { cls: 's-overview', html: `
       <div class="ov-top">
         <div class="head"><div class="eyebrow" ${A('fade', 100)}><span class="idx">02</span><span>Tổng quan</span><i></i><span>${TOTAL_BUILDINGS} công trình · 4 nhóm</span></div>
           <h2 class="title" ${A('rise', 160)}>Hành trình qua ${TOTAL_BUILDINGS} công trình<br>của trung tâm Biên Hòa</h2></div>
         <p class="lead" ${A('rise-sm', 300)}>Từ trung tâm thương mại, khu căn hộ, tòa nhà văn phòng đến đình, chùa là di tích cấp quốc gia. Bấm vào một công trình để đi thẳng tới slide của nó.</p>
       </div>
       <div class="ov-grid">${cols}</div>` };
   },
   notes: { open: 'Bài thuyết trình đi qua 13 công trình trong tài liệu, chia thành bốn nhóm theo chức năng.',
     points: ['Nhóm 1 — Thương mại, dịch vụ: The Pegasus Plaza, Vincom Plaza Biên Hòa, GO! Đồng Nai, The Mira Central Park.', 'Nhóm 2 — Nhà ở, đô thị: Aqua City, Thanh Bình Plaza, Topaz Twins Biên Hòa, Bcons Central Park.', 'Nhóm 3 — Văn phòng, hành chính: Sonadezi Building, BV Building, trụ sở UBND tỉnh Đồng Nai.', 'Nhóm 4 — Di sản: Đình Tân Lân và Chùa Ông (Thất Phủ Cổ Miếu).'],
     next: 'Chúng ta bắt đầu với nhóm thương mại – dịch vụ, mở đầu là The Pegasus Plaza.' } },

 { id: 'pegasus', title: 'The Pegasus Plaza', sec: 'com', tr: 'mask', thumb: 'pegasus', build: () => split(B.pegasus),
   notes: { open: 'Công trình đầu tiên là The Pegasus Plaza, ở số 53 - 55 đường Võ Thị Sáu, phường Quyết Thắng.',
     points: ['Khởi công ngày 1/1/2011 và chính thức khai trương ngày 11/12/2013.', 'Phát triển theo mô hình phức hợp: trung tâm thương mại, văn phòng và căn hộ cao cấp.', 'Vai trò: thúc đẩy thương mại, dịch vụ; tạo việc làm; cung cấp không gian mua sắm, ăn uống, giải trí.', 'Ý nghĩa: góp phần hiện đại hóa đô thị Biên Hòa.'],
     next: 'Cũng là một trung tâm thương mại, Vincom Plaza Biên Hòa có câu chuyện riêng.' } },
 { id: 'vincom', title: 'Vincom Plaza Biên Hòa', sec: 'com', tr: 'slide', thumb: 'vincom-out', build: () => dual(B.vincom),
   notes: { open: 'Vincom Plaza Biên Hòa nằm ở số 1096 đường Phạm Văn Thuận, phường Tam Hiệp, thuộc Tập đoàn Vingroup.',
     points: ['Chính thức khai trương ngày 28/8/2015, phục vụ nhu cầu mua sắm và giải trí.', 'Ngày càng phát triển với cửa hàng, nhà hàng, siêu thị, rạp chiếu phim và khu vui chơi.', 'Vai trò: thúc đẩy kinh tế, thương mại; tạo việc làm; phát triển dịch vụ mua sắm, vui chơi, giải trí.'],
     next: 'Tiếp theo là một mô hình bán lẻ quy mô lớn khác: GO! Đồng Nai.' } },
 { id: 'go', title: 'GO! Đồng Nai', sec: 'com', tr: 'slide', thumb: 'go', build: () => full(B.go, { dates: false }),
   notes: { open: 'GO! Đồng Nai nằm ở khu vực Xa lộ Hà Nội, Long Hưng, Biên Hòa.',
     points: ['Phát triển từ mô hình trung tâm mua sắm quy mô lớn.', 'Được cải tiến thành tổ hợp mua sắm, ăn uống và dịch vụ.', 'Bên ngoài: công trình quy mô lớn, mặt tiền hiện đại, có khu vực bãi đỗ xe. Bên trong: khu siêu thị, gian hàng, khu ẩm thực, không gian dịch vụ.', 'Ý nghĩa: thể hiện sự phát triển của mô hình bán lẻ hiện đại và lối sống đô thị.'],
     next: 'Cuối nhóm này là một công trình dịch vụ lưu trú: The Mira Central Park.' } },
 { id: 'mira', title: 'The Mira Central Park', sec: 'com', tr: 'slide', thumb: 'mira', build: () => split(B.mira, { flip: true }),
   notes: { open: 'The Mira Central Park ở 128/16 đường Nguyễn Ái Quốc, khu vực Tam Hiệp.',
     points: ['Được xây dựng để đáp ứng nhu cầu lưu trú, nghỉ dưỡng và tổ chức sự kiện.', 'Phát triển thành khách sạn hiện đại, phục vụ khách du lịch, doanh nhân và các sự kiện lớn.', 'Bên ngoài: khối nhà cao tầng, mặt đứng hiện đại, cửa kính. Bên trong: sảnh, phòng nghỉ, nhà hàng, phòng hội nghị.'],
     next: 'Chuyển sang nhóm nhà ở và đô thị, bắt đầu với khu đô thị sinh thái Aqua City.' } },

 { id: 'aqua', title: 'Aqua City — hình thành & phát triển', sec: 'home', tr: 'mask', thumb: 'aqua-real', build: () => dual(B.aqua),
   notes: { open: 'Aqua City là khu đô thị sinh thái ở đường Hương Lộ 2, xã Long Hưng, liền kề TP.HCM.',
     points: ['Khởi công từ năm 2019, chia thành nhiều phân khu như Đảo Phượng Hoàng, Sun Harbor.', 'Sau giai đoạn tháo gỡ vướng mắc pháp lý, đến cuối năm 2026 dự án đang bứt tốc thi công với dòng vốn lớn từ ngân hàng.', 'Mục tiêu: hoàn thiện hạ tầng và bàn giao đồng loạt cho cư dân.'],
     next: 'Vậy Aqua City có vai trò và ý nghĩa gì? Mời cả lớp xem slide tiếp theo.' } },
 { id: 'aqua2', title: 'Aqua City — vai trò & ý nghĩa', sec: 'home', tr: 'fade', thumb: 'aqua-real', build: () => {
     const b = B.aqua;
     return { cls: 'l-full', html: `
     ${photo(b.imgs[1], { cls: 'bgphoto kb-slow', a: A('fade', 0), cap: false, tag: false })}
     <div class="full-grid">
       <div class="full-main">
         <div class="head"><div class="eyebrow" ${A('fade', 120)}><span class="idx">${pad(b.n)}</span><span>${GROUPS.home.name}</span><i></i><span>Vai trò & ý nghĩa</span></div>
           <h2 class="title" ${A('rise', 200)}>Aqua City</h2></div>
         <div class="stat" ${A('rise', 340)}><b>${b.stat.big}</b><span>${b.stat.label}</span></div>
         <div class="rail">
           <div class="step" ${A('rise-sm', 520)}><h4>Vai trò</h4><p>${b.roleText}</p><div class="chips" style="margin-top:1rem">${b.chips.map(c => `<span class="chip">${c}</span>`).join('')}</div></div>
         </div>
         ${meaningH(b, A('rise-sm', 700))}
       </div>
       <div class="full-side"><span class="credit" ${A('fade', 900)}>${b.imgs[1].cap}</span></div>
     </div>` };
   },
   notes: { open: 'Về vai trò, Aqua City trở thành tâm điểm đô thị hiện đại, thúc đẩy kinh tế phía Đông.',
     points: ['Là tổ hợp giải trí - dịch vụ cao cấp nhờ bến du thuyền, trung tâm thương mại, trường học và bệnh viện quốc tế.', 'Ý nghĩa: tiên phong xu hướng sống xanh chuẩn quốc tế, 70% diện tích là mảng xanh, mặt nước.', 'Góp phần giãn dân, giảm áp lực đô thị cho trung tâm TP.HCM.'],
     next: 'Quay về trung tâm Biên Hòa với chung cư Thanh Bình Plaza.' } },
 { id: 'thanhbinh', title: 'Thanh Bình Plaza', sec: 'home', tr: 'slide', thumb: 'thanhbinh-out', build: () => dual(B.thanhbinh, { badge: true }),
   notes: { open: 'Thanh Bình Plaza do Tổng công ty HUD, thuộc Bộ Xây dựng, đầu tư.',
     points: ['Khởi công tháng 10/2015 và bàn giao từ cuối năm 2017.', 'Dự án gồm 11 tầng nổi, 1 tầng hầm; không gian ở kết hợp dịch vụ thương mại.', 'Vai trò: điểm kết nối giao thông - hành chính, gần chợ Biên Hòa, bờ sông và các cơ quan hành chính.', 'Ý nghĩa: hiện đại hóa bộ mặt đô thị lõi, giải quyết nhu cầu nhà ở chất lượng cao.'],
     next: 'Tiếp theo là một dự án căn hộ gồm hai khối tháp: Topaz Twins Biên Hòa.' } },
 { id: 'topaz', title: 'Topaz Twins Biên Hòa', sec: 'home', tr: 'slide', thumb: 'topaz', build: () => split(B.topaz),
   notes: { open: 'Topaz Twins Biên Hòa ở khu vực đường số 1, gần đường Võ Thị Sáu.',
     points: ['Là dự án căn hộ cao tầng nhằm đáp ứng nhu cầu nhà ở tại đô thị.', 'Hình thành tổ hợp hai khối tháp căn hộ cùng tiện ích cho cư dân.', 'Bổ sung nguồn cung nhà ở và góp phần thay đổi cảnh quan đô thị.'],
     next: 'Một dự án căn hộ cao tầng khác là Bcons Central Park.' } },
 { id: 'bcons', title: 'Bcons Central Park', sec: 'home', tr: 'slide', thumb: 'bcons', build: () => full(B.bcons, { dates: false }),
   notes: { open: 'Bcons Central Park nằm ở khu vực hẻm 238 đường Phan Trung, Tam Hiệp.',
     points: ['Là dự án phát triển nhà ở theo mô hình căn hộ cao tầng.', 'Được định hướng thành khu căn hộ có tiện ích phục vụ đời sống cư dân.', 'Ý nghĩa: xu hướng xây dựng khu dân cư hiện đại, sử dụng không gian đô thị theo chiều cao.'],
     next: 'Sang nhóm văn phòng và hành chính, bắt đầu với Sonadezi Building.' } },

 { id: 'sonadezi', title: 'Sonadezi Building', sec: 'off', tr: 'mask', thumb: 'sonadezi', build: () => split(B.sonadezi),
   notes: { open: 'Sonadezi Building ở Đường số 1, Khu công nghiệp Biên Hòa 1.',
     points: ['Được xây dựng để phục vụ hoạt động quản lý, điều hành và kinh doanh của doanh nghiệp.', 'Là địa điểm văn phòng và dịch vụ phục vụ hoạt động kinh tế trong khu vực.', 'Ý nghĩa: thể hiện quá trình công nghiệp hóa và hiện đại hóa của Đồng Nai.'],
     next: 'Một tòa nhà văn phòng khác là BV Building.' } },
 { id: 'bv', title: 'BV Building', sec: 'off', tr: 'slide', thumb: 'bv', build: () => split(B.bv, { flip: true }),
   notes: { open: 'BV Building nằm ở số 197 đường Hà Huy Giáp.',
     points: ['Được xây dựng để phục vụ nhu cầu văn phòng và hoạt động kinh doanh.', 'Là nơi làm việc của các doanh nghiệp và đơn vị dịch vụ.', 'Ý nghĩa: góp phần thể hiện diện mạo đô thị năng động và hiện đại của Biên Hòa.'],
     next: 'Cuối cùng của nhóm này là trụ sở hành chính cao nhất của tỉnh.' } },
 { id: 'ubnd', title: 'Trụ sở UBND tỉnh — lịch sử', sec: 'off', tr: 'slide', thumb: 'ubnd', build: () => full(B.ubnd, { noMeaning: true }),
   notes: { open: 'Trụ sở UBND tỉnh Đồng Nai ở số 02 đường Nguyễn Văn Trị, phường Thanh Bình.',
     points: ['Tiền thân là Tòa hành chính tỉnh Biên Hòa thời Pháp.', 'Tháng 2/1976, UBND tỉnh chính thức thành lập sau khi hợp nhất các tỉnh Biên Hòa, Bà Rịa và Long Khánh.', 'Từ bộ máy quản lý thời chiến, cơ quan đã cải tổ qua nhiều thời kỳ Hiến pháp, nâng cấp trụ sở và số hóa.'],
     next: 'Vậy cơ quan này đảm nhiệm vai trò gì? Mời cả lớp xem tiếp.' } },
 { id: 'ubnd2', title: 'Trụ sở UBND tỉnh — vai trò', sec: 'off', tr: 'slide', thumb: 'ubnd', build: () => {
     const b = B.ubnd;
     return { cls: 'l-roles-slide', html: `
     <div class="l-roles">
       <div class="roles-left">
         <div class="head"><div class="eyebrow" ${A('fade', 100)}><span class="idx">${pad(b.n)}</span><span>${GROUPS.off.name}</span><i></i><span>Vai trò & ý nghĩa</span></div>
           <h2 class="title sm" ${A('rise', 180)}>Trụ sở UBND tỉnh<br>Đồng Nai</h2></div>
         ${photo({ k: 'ubnd', fp: '50% 22%', cap: b.imgs[0].cap }, { cls: 'kb', a: A('mask', 260), tag: false })}
         <p class="quote" ${A('rise-sm', 700)}>“${b.meaning}”</p>
       </div>
       <div class="fn-list">
         <p class="role-line" ${A('rise-sm', 360)}><b>Vai trò:</b> ${b.roleLine}</p>
         ${b.fns.map((f, i) => `<div class="fn-card" ${A('rise-sm', 480 + i * 200)}><em>${pad(i + 1)}</em><div><h4>${f.h}</h4><p>${f.p}</p></div></div>`).join('')}
       </div>
     </div>` };
   },
   notes: { open: 'UBND tỉnh là cơ quan hành chính nhà nước cao nhất ở địa phương, thực hiện hai chức năng chính.',
     points: ['Quản lý và điều hành: thực thi Hiến pháp, pháp luật, quản lý các lĩnh vực kinh tế, văn hóa, an ninh, quốc phòng trên địa bàn tỉnh.', 'Tổ chức thực hiện: cụ thể hóa nghị quyết của Tỉnh ủy, Hội đồng nhân dân tỉnh và chỉ đạo của Chính phủ thành kế hoạch, chính sách.', 'Ý nghĩa: trung tâm đưa ra các quyết sách phát triển kinh tế - xã hội cao nhất của tỉnh, mang tính phục vụ nhân dân.'],
     next: 'Từ những công trình hiện đại, chúng ta đi đến nhóm di sản văn hóa – lịch sử.' } },

 { id: 'tanlan', title: 'Đình Tân Lân', sec: 'her', tr: 'fade', thumb: 'tan-lan', build: () => heritage(B.tanlan),
   notes: { open: 'Đình Tân Lân là công trình di sản đầu tiên.',
     points: ['Có từ thời vua Minh Mạng, thờ Trần Thượng Xuyên, người có công khai phá vùng đất Đồng Nai.', 'Được xây dựng, tu sửa nhiều lần và được công nhận là di tích cấp quốc gia năm 1991.', 'Là nơi sinh hoạt tín ngưỡng và lưu giữ lịch sử địa phương; thể hiện lòng biết ơn người có công với quê hương.'],
     next: 'Một di tích khác gắn với cộng đồng người Hoa là Chùa Ông.' } },
 { id: 'chuaong', title: 'Chùa Ông (Thất Phủ Cổ Miếu)', sec: 'her', tr: 'slide', thumb: 'chua-ong', build: () => heritage(B.chuaong),
   notes: { open: 'Chùa Ông, tên khác là Thất Phủ Cổ Miếu, được xây dựng năm 1684 bởi cộng đồng người Hoa ở Cù Lao Phố.',
     points: ['Được tu bổ qua nhiều thời kỳ, công nhận là di tích cấp quốc gia năm 2001.', 'Là nơi thờ tự, sinh hoạt văn hóa và thu hút khách tham quan.', 'Ý nghĩa: thể hiện sự giao thoa văn hóa Hoa – Việt.'],
     next: 'Bây giờ, hãy đặt tất cả các mốc thời gian lên một trục.' } },

 { id: 'timeline', title: 'Dòng thời gian các công trình', sec: 'sum', tr: 'zoom', thumb: null, label: 'Mốc',
   build: () => {
     const evs = TIMELINE.map((e, i) => `<button class="ev ${i % 2 ? 'down' : 'up'}" type="button" style="--gc:${GROUPS[e.g].color}" data-go="${IDX[e.id]}" aria-label="${e.d}: ${e.t}">
        <i class="stem" ${A('fade', 220 + i * 50)}></i><i class="dot" ${A('pop', 200 + i * 50)}></i>
        <span class="evc" ${A('rise-sm', 240 + i * 50)}><b class="${e.sm ? 'sm' : ''}">${e.d}</b><span>${e.t}</span></span></button>`).join('');
     return { cls: 's-timeline', html: `
     <div class="head"><div class="eyebrow" ${A('fade', 100)}><span class="idx">★</span><span>Tổng hợp</span><i></i><span>Các mốc trong tài liệu</span></div>
       <h2 class="title sm" ${A('rise', 160)}>Dòng thời gian của các công trình</h2></div>
     <div class="tl-wrap"><div class="tl"><i class="tl-axis" ${A('line', 400)}></i>${evs}</div>
       <div class="tl-legend" ${A('fade', 1800)}>${Object.values(GROUPS).map(G => `<span style="--gc:${G.color}"><i></i>${G.name}</span>`).join('')}<span>Bấm vào một mốc để đến công trình tương ứng.</span></div></div>` };
   },
   notes: { open: 'Đặt các mốc thời gian trong tài liệu lên một trục, ta thấy nhiều lớp lịch sử cùng tồn tại ở Biên Hòa.',
     points: ['Chùa Ông được xây dựng năm 1684; Đình Tân Lân có từ thời vua Minh Mạng; Tòa hành chính tỉnh Biên Hòa từ thời Pháp.', 'UBND tỉnh thành lập tháng 2/1976; Đình Tân Lân (1991) và Chùa Ông (2001) được công nhận là di tích cấp quốc gia.', 'Các công trình hiện đại: Pegasus Plaza (khởi công 2011, khai trương 2013), Vincom (khai trương 2015), Thanh Bình Plaza (khởi công 10/2015, bàn giao cuối 2017), Aqua City (khởi công 2019).'],
     next: 'Cuối cùng, ta so sánh bốn nhóm công trình.' } },

 { id: 'compare', title: 'So sánh các nhóm công trình', sec: 'sum', tr: 'slide', thumb: null, label: 'So sánh',
   build: () => {
     const rows = [
       { g: 'com', n: 'The Pegasus Plaza · Vincom Plaza Biên Hòa · GO! Đồng Nai · The Mira Central Park',
         f: 'Mua sắm, ăn uống, giải trí; lưu trú và tổ chức hội nghị (The Mira Central Park).',
         a: 'Khối nhà cao tầng, mặt đứng hiện đại, cửa kính; GO! là công trình quy mô lớn có bãi đỗ xe.',
         r: 'Thúc đẩy thương mại – dịch vụ, tạo việc làm, hiện đại hóa đô thị.' },
       { g: 'home', n: 'Aqua City · Thanh Bình Plaza · Topaz Twins Biên Hòa · Bcons Central Park',
         f: 'Nhà ở, căn hộ cao tầng và tiện ích phục vụ cư dân.',
         a: 'Khối nhà cao tầng, ban công, mặt đứng hiện đại; Aqua City có 70% diện tích là mảng xanh, mặt nước; Thanh Bình có 11 tầng nổi, 1 tầng hầm.',
         r: 'Bổ sung nguồn cung nhà ở, thay đổi cảnh quan, nâng cao chất lượng sống.' },
       { g: 'off', n: 'Sonadezi Building · BV Building · Trụ sở UBND tỉnh Đồng Nai',
         f: 'Không gian làm việc; UBND tỉnh quản lý, điều hành và tổ chức thực hiện chính sách.',
         a: 'Sonadezi, BV: khối văn phòng nhiều tầng, mặt đứng hiện đại, cửa kính. UBND tỉnh: tiền thân là Tòa hành chính thời Pháp.',
         r: 'Hỗ trợ doanh nghiệp, kinh tế – thương mại; trung tâm quyết sách của tỉnh.' },
       { g: 'her', n: 'Đình Tân Lân · Chùa Ông (Thất Phủ Cổ Miếu)',
         f: 'Thờ tự, sinh hoạt tín ngưỡng và văn hóa.',
         a: 'Đình có từ thời vua Minh Mạng, di tích cấp quốc gia năm 1991; Chùa Ông xây năm 1684, di tích cấp quốc gia năm 2001.',
         r: 'Lưu giữ lịch sử địa phương; thể hiện lòng biết ơn và sự giao thoa văn hóa Hoa – Việt.' }
     ];
     const first = { com: 'pegasus', home: 'aqua', off: 'sonadezi', her: 'tanlan' };
     return { cls: 's-compare', html: `
     <div class="head"><div class="eyebrow" ${A('fade', 100)}><span class="idx">★</span><span>Tổng hợp</span><i></i><span>So sánh 4 nhóm</span></div>
       <h2 class="title sm" ${A('rise', 160)}>Bốn nhóm công trình — bốn vai trò</h2></div>
     <div class="cmp">
       <div class="cmp-head" ${A('fade', 300)}><span>Nhóm</span><span>Chức năng</span><span>Đặc điểm nổi bật (theo tài liệu)</span><span>Vai trò – ý nghĩa</span></div>
       ${rows.map((r, i) => `<button class="cmp-row" type="button" style="--gc:${GROUPS[r.g].color}" data-go="${IDX[first[r.g]]}" ${A('rise-sm', 400 + i * 170)}>
         <div><h3>${GROUPS[r.g].name}<small>${Object.values(B).filter(b => b.g === r.g).length} công trình</small></h3><div class="nm">${r.n}</div></div>
         <p>${r.f}</p><p>${r.a}</p><p>${r.r}</p></button>`).join('')}
     </div>` };
   },
   notes: { open: 'Bốn nhóm công trình có chức năng khác nhau nhưng cùng góp phần làm nên diện mạo Biên Hòa.',
     points: ['Thương mại – dịch vụ: mua sắm, giải trí, lưu trú; tạo việc làm.', 'Nhà ở – đô thị: căn hộ cao tầng, khu đô thị; Aqua City có 70% diện tích là mảng xanh, mặt nước.', 'Văn phòng – hành chính: không gian làm việc và cơ quan hành chính cao nhất của tỉnh.', 'Di sản: Đình Tân Lân và Chùa Ông lưu giữ lịch sử và văn hóa.'],
     next: 'Từ đó, nhóm xin rút ra kết luận cho bài thuyết trình.' } },

 { id: 'end', title: 'Kết luận', sec: 'sum', tr: 'zoom', thumb: null, label: 'Kết',
   build: () => ({ cls: 's-end', html: `
     <div class="end-arches" aria-hidden="true">${[30, 52, 74, 100, 74, 52, 30].map((h, i) => `<i style="--h:${h}%" ${A('mask-up', 500 + i * 90)}></i>`).join('')}</div>
     <div class="end-wrap">
       <div class="eyebrow" ${A('fade', 100)}><span>Kết luận</span></div>
       <h2 class="title" ${A('rise', 180)}>SẮC MÀU PHỐ THỊ — DÁNG HÌNH BIÊN HÒA<br>HÔM NAY VÀ MAI SAU</h2>
       <div class="pillars">
         <div class="pillar" style="--bc:#2FC6AE" ${A('rise-sm', 400)}><b>Kiến trúc đa dạng</b><p>${TOTAL_BUILDINGS} công trình, 4 nhóm: thương mại – dịch vụ, nhà ở – đô thị, văn phòng – hành chính và di sản.</p></div>
         <div class="pillar" style="--bc:#6DB8E8" ${A('rise-sm', 540)}><b>Gắn với đời sống</b><p>Tạo việc làm, không gian mua sắm – giải trí, nhà ở chất lượng cao, quản lý hành chính và sinh hoạt tín ngưỡng.</p></div>
         <div class="pillar" style="--bc:#D5AE68" ${A('rise-sm', 680)}><b>Giữ gìn giá trị</b><p>Đình Tân Lân (1991) và Chùa Ông (2001) là di tích cấp quốc gia: lưu giữ lịch sử, thể hiện lòng biết ơn và sự giao thoa văn hóa Hoa – Việt.</p></div>
       </div>
       <p class="end-quote" ${A('fade', 900)}>Tìm hiểu để trân trọng, trân trọng để gìn giữ.</p>
       <p class="thanks" ${A('rise', 1050)}>CẢM ƠN THẦY CÔ VÀ CÁC BẠN ĐÃ LẮNG NGHE!</p>
     </div>` }),
   notes: { open: 'Qua 13 công trình, nhóm thấy được trọn vẹn sắc màu phố thị và dáng hình Biên Hòa hôm nay và mai sau.',
     points: ['Kiến trúc đa dạng: thương mại, nhà ở, văn phòng, hành chính và di sản.', 'Mỗi công trình đều có vai trò với đời sống địa phương: việc làm, mua sắm, nhà ở, quản lý hành chính, sinh hoạt tín ngưỡng.', 'Tìm hiểu và gìn giữ các di tích như Đình Tân Lân, Chùa Ông là cách thể hiện lòng biết ơn và trân trọng văn hóa, lịch sử.'],
     next: 'Xin cảm ơn thầy cô và các bạn đã lắng nghe! Nhóm sẵn sàng trả lời câu hỏi.' } }
];

DEFS.forEach((d, i) => { IDX[d.id] = i; });
const SLIDES = DEFS.map(d => ({ ...d }));
const N = SLIDES.length;
const REDUCE_MQ = matchMedia('(prefers-reduced-motion: reduce)');

/* Dựng DOM */
const stage = $('#stage');
SLIDES.forEach((s, i) => {
  const out = s.build();
  const g = GROUPS[s.sec];
  const theme = g ? g.theme : 'm';
  const el = document.createElement('section');
  el.className = `slide theme-${theme} ${out.cls || ''}`;
  el.dataset.i = i;
  el.dataset.id = s.id;
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('aria-label', `Slide ${i + 1}: ${s.title}`);
  if (theme === 'm' && g) el.style.setProperty('--ac', g.color);
  el.innerHTML = out.html + (i > 0 && s.id !== 'end' ? `<span class="ghost" aria-hidden="true">${pad(i + 1)}</span>` : '');
  stage.appendChild(el);
  s.el = el;
  s.color = SECTIONS[s.sec].color;
});

/* ==========================================================================
   4. BỘ MÁY CHUYỂN CẢNH
   - Một "ý định" duy nhất (want). Mọi thao tác chỉ cập nhật want.
   - pump() chạy từng chuyển cảnh một, đợi Animation.finished (không dùng timeout cố định).
   - Thao tác nhanh: want thay đổi giữa chừng → sau khi chuyển cảnh hiện tại xong, đi tiếp thẳng tới want.
   ========================================================================== */
let cur = -1, want = 0, running = false, activeAnims = [];
let RM = REDUCE_MQ.matches;
document.documentElement.classList.toggle('rm', RM);

const EASE = { out: 'cubic-bezier(.22,.8,.24,1)', io: 'cubic-bezier(.65,0,.35,1)', soft: 'cubic-bezier(.3,.7,.2,1)' };
/* Kiểu chuyển cảnh. Chỉ dùng transform / opacity (và clip-path cho mask reveal). */
const FX = {
  slide: dir => ({ dur: 640, ease: EASE.out,
    inK:  [{ opacity: 0, transform: `translate3d(${dir * 8}%,0,0) scale(.985)` }, { opacity: 1, offset: .55 }, { opacity: 1, transform: 'none' }],
    outK: [{ opacity: 1, transform: 'none' }, { opacity: 1, offset: .55 }, { opacity: 0, transform: `translate3d(${-dir * 5}%,0,0) scale(.99)` }] }),
  zoom: dir => ({ dur: 900, ease: EASE.io,   // Cinematic zoom
    inK:  [{ opacity: 0, transform: `scale(${dir > 0 ? .94 : 1.07})` }, { opacity: 1, offset: .6 }, { opacity: 1, transform: 'none' }],
    outK: [{ opacity: 1, transform: 'none' }, { opacity: 1, offset: .5 }, { opacity: 0, transform: `scale(${dir > 0 ? 1.1 : .93})` }] }),
  mask: dir => ({ dur: 850, ease: EASE.io,   // Mask reveal: màn mở rộng theo hướng điều hướng
    inK:  [{ clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
    outK: [{ opacity: 1, transform: 'none' }, { opacity: .55, transform: `translate3d(${-dir * 9}%,0,0)` }] }),
  fade: dir => ({ dur: 900, ease: EASE.soft,
    inK:  [{ opacity: 0, transform: 'scale(1.025)' }, { opacity: 1, offset: .65 }, { opacity: 1, transform: 'none' }],
    outK: [{ opacity: 1, transform: 'none' }, { opacity: 1, offset: .55 }, { opacity: 0, transform: 'scale(.992)' }] })
};
const FX_RM = () => ({ dur: 240, ease: 'ease-out', inK: [{ opacity: 0 }, { opacity: 1 }], outK: [{ opacity: 1 }, { opacity: 1, offset: .7 }, { opacity: 0 }] });

function pickKind(from, to) {
  if (from < 0) return null;
  const adj = Math.abs(to - from) === 1;
  if (!adj) return 'fade';
  return to > from ? SLIDES[to].tr : SLIDES[from].tr;   // quay lại = đảo ngược chuyển cảnh đã dùng để vào
}

/* Nạp ảnh trước khi hiển thị slide để không nhảy bố cục / nháy trắng */
function hydrate(i) {
  const s = SLIDES[i]; if (!s) return Promise.resolve();
  if (s._p) return s._p;
  const imgs = $$('img[data-src]', s.el);
  s._p = Promise.all(imgs.map(img => new Promise(res => {
    const ok = () => { (img.decode ? img.decode() : Promise.resolve()).catch(() => {}).then(() => { img.classList.add('ready'); res(); }); };
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', () => res(), { once: true });
    img.src = img.dataset.src;
    if (img.complete && img.naturalWidth) ok();
  })));
  return s._p;
}
const withTimeout = (p, ms) => Promise.race([p, wait(ms)]);
const idle = fn => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1200 }) : setTimeout(fn, 300));

async function transition(from, to) {
  const next = SLIDES[to].el, prev = from >= 0 ? SLIDES[from].el : null;
  await withTimeout(hydrate(to), 1400);

  next.scrollTop = 0;
  next.style.zIndex = 2; if (prev) prev.style.zIndex = 1;
  next.classList.remove('enter');
  next.classList.add('is-active');
  next.removeAttribute('aria-hidden');
  void next.offsetWidth;                                  // chốt trạng thái ban đầu trước khi chạy hoạt ảnh

  const kind = pickKind(from, to);
  if (!prev || !kind || document.hidden) {                // lần đầu / tab ẩn: không chạy hoạt ảnh container
    next.classList.add('enter');
    if (prev) hideSlide(prev);
    next.style.zIndex = '';
    return;
  }
  const dir = to > from ? 1 : -1;
  const fx = RM ? FX_RM() : FX[kind](dir);
  next.classList.add('is-moving'); prev.classList.add('is-moving');
  const optsIn  = { duration: fx.dur, easing: fx.ease, fill: 'both' };
  const optsOut = { duration: fx.dur, easing: fx.ease, fill: 'both' };
  const aIn  = next.animate(fx.inK, optsIn);
  const aOut = prev.animate(fx.outK, optsOut);
  activeAnims = [aIn, aOut];
  next.classList.add('enter');                            // hoạt ảnh thành phần chạy cùng lúc, có độ trễ riêng
  await Promise.all(activeAnims.map(a => a.finished.catch(() => {})));

  hideSlide(prev);
  next.classList.remove('is-moving');
  next.style.zIndex = '';
  activeAnims.forEach(a => a.cancel());
  activeAnims = [];
}
function hideSlide(el) {
  el.classList.remove('is-active', 'enter', 'is-moving');
  el.setAttribute('aria-hidden', 'true');
  el.style.zIndex = '';
}

async function pump() {
  running = true;
  try {
    while (cur !== want) {
      const to = want;
      await transition(cur, to);
      cur = to;
      announce(cur);
      idle(() => { hydrate(cur + 1); hydrate(cur - 1); hydrate(cur + 2); });
      if (presenter.win) updatePresenter();
    }
  } catch (err) {
    console.error('Lỗi chuyển cảnh, khôi phục trạng thái:', err);
    recover();
  } finally { running = false; }
}
/* Khôi phục an toàn nếu có lỗi bất ngờ: chỉ slide hiện hành được hiển thị */
function recover() {
  activeAnims.forEach(a => { try { a.cancel(); } catch (e) {} }); activeAnims = [];
  const t = clamp(want, 0, N - 1);
  SLIDES.forEach((s, i) => { if (i !== t) hideSlide(s.el); });
  const el = SLIDES[t].el; el.style.zIndex = ''; el.classList.add('is-active', 'enter'); el.removeAttribute('aria-hidden'); cur = t;
}

function request(i) {
  i = clamp(i, 0, N - 1);
  want = i;
  updateUI();
  if (!running) pump();
}
const next = () => request(want + 1);
const prev = () => request(want - 1);

/* Tab ẩn rồi quay lại: hoàn tất ngay hoạt ảnh đang dở để không lệch trạng thái */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) activeAnims.forEach(a => { try { a.finish(); } catch (e) {} });
});

/* ==========================================================================
   5. GIAO DIỆN ĐIỀU KHIỂN
   ========================================================================== */
$$('[data-total]').forEach(e => e.textContent = N);
$('#progress').setAttribute('aria-valuemax', N);

/* Chấm tiến trình (bấm để chuyển) */
const ticksEl = $('#ticks');
ticksEl.innerHTML = SLIDES.map((s, i) => `<button class="tick" type="button" style="--tc:${s.color}" data-go="${i}" data-title="${pad(i + 1)} · ${s.title}" aria-label="Chuyển tới slide ${i + 1}: ${s.title}"></button>`).join('');
const tickEls = $$('.tick', ticksEl);

/* Mục lục */
(function buildToc() {
  let html = '', last = null;
  SLIDES.forEach((s, i) => {
    if (s.sec !== last) { last = s.sec; const S = SECTIONS[s.sec]; html += `${i ? '</div>' : ''}<div class="toc-group" style="--gc:${S.color}"><h5>${S.name}</h5>`; }
    const th = s.thumb ? `<span class="th"><img alt="" loading="lazy" decoding="async" src="assets/img/thumb/${s.thumb}.jpg"></span>` : `<span class="th empty">${s.label}</span>`;
    html += `<button class="toc-item" type="button" data-go="${i}" style="--gc:${s.color}"><span class="n">${pad(i + 1)}</span>${th}<span>${s.title}</span></button>`;
  });
  $('#tocBody').innerHTML = html + '</div>';
})();
const tocItems = $$('.toc-item');

const notesBody = $('#notesBody'), notesSlide = $('#notesSlide');
const live = document.createElement('div');
live.className = 'sr-only'; live.setAttribute('aria-live', 'polite');
live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
document.body.appendChild(live);
function announce(i) { live.textContent = `Slide ${i + 1} trên ${N}: ${SLIDES[i].title}`; }

function updateUI() {
  const i = want, s = SLIDES[i];
  $$('[data-cur]').forEach(e => e.textContent = pad(i + 1));
  $('#progFill').style.transform = `scaleX(${N > 1 ? i / (N - 1) : 1})`;
  $('#progress').setAttribute('aria-valuenow', i + 1);
  document.documentElement.style.setProperty('--chrome-ac', s.color);
  tickEls.forEach((t, k) => { t.classList.toggle('on', k === i); t.classList.toggle('done', k < i); if (k === i) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
  tocItems.forEach((t, k) => t.classList.toggle('on', k === i));
  $('#btnPrev').setAttribute('aria-disabled', i === 0);
  $('#btnNext').setAttribute('aria-disabled', i === N - 1);
  document.title = `${pad(i + 1)}/${N} · ${s.title} — SẮC MÀU PHỐ THỊ: DÁNG HÌNH BIÊN HÒA`;
  const n = s.notes;
  notesSlide.textContent = `Slide ${i + 1}/${N} · ${s.title}`;
  notesBody.innerHTML = `<div><h6>Lời mở đầu</h6><p>${n.open}</p></div>
    <div><h6>Ý chính cần nhấn mạnh</h6><ul>${n.points.map(p => `<li>${p}</li>`).join('')}</ul></div>
    <div><h6>Câu chuyển tiếp</h6><p>${n.next}</p></div>`;
  notesBody.scrollTop = 0;
  try { history.replaceState(null, '', '#' + (i + 1)); } catch (e) { /* file:// có thể chặn */ }
  if (presenter.win) updatePresenter();
}

/* Điều hướng bằng data-go (nút, mục lục, thẻ trong slide) */
document.addEventListener('click', e => {
  const go = e.target.closest('[data-go]');
  if (go) { closeOverlays(); request(parseInt(go.dataset.go, 10)); if (go.matches('.btn,.tick,.cta')) go.blur(); return; }
  const cl = e.target.closest('[data-close]');
  if (cl) closeOverlays();
});
$('#btnPrev').addEventListener('click', e => { prev(); e.currentTarget.blur(); });
$('#btnNext').addEventListener('click', e => { next(); e.currentTarget.blur(); });

/* Mục lục / hướng dẫn */
const tocOv = $('#tocOverlay'), helpOv = $('#helpOverlay');
function openToc() { closeOverlays(); tocOv.hidden = false; const on = $('.toc-item.on'); on && on.scrollIntoView({ block: 'center' }); (on || $('.toc-item')).focus({ preventScroll: true }); }
function openHelp() { closeOverlays(); helpOv.hidden = false; $('button', helpOv).focus(); }
function closeOverlays() { const had = !tocOv.hidden || !helpOv.hidden; tocOv.hidden = true; helpOv.hidden = true; return had; }
$('#btnToc').addEventListener('click', openToc);
$('#btnHelp').addEventListener('click', openHelp);

/* Lời dẫn */
function setNotes(open) {
  document.body.classList.toggle('notes-open', open);
  $('#btnNotes').setAttribute('aria-pressed', open);
  $('#notes').setAttribute('aria-hidden', !open);
}
const toggleNotes = () => setNotes(!document.body.classList.contains('notes-open'));
$('#btnNotes').addEventListener('click', toggleNotes);
$('#notesClose').addEventListener('click', () => setNotes(false));

/* Toàn màn hình */
function toggleFs() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => toast('Trình duyệt không cho phép toàn màn hình.'));
  else toast('Trình duyệt không hỗ trợ toàn màn hình.');
}
$('#btnFs').addEventListener('click', e => { toggleFs(); e.currentTarget.blur(); });
if (!document.fullscreenEnabled) $('#btnFs').style.display = 'none';
document.addEventListener('fullscreenchange', () => {
  document.body.classList.toggle('fs', !!document.fullscreenElement);
  document.body.classList.remove('idle');
  wake();
});

/* Xử lý thanh điều khiển ở chế độ toàn màn hình */
function handleFsMouse(e) {
  if (!document.body.classList.contains('fs')) {
    document.body.classList.remove('peek-top', 'peek-bottom');
    return;
  }
  const y = e.clientY;
  const h = window.innerHeight;
  // Khi chuột ở sát đỉnh (≤ 48px) hoặc sát đáy (≥ h - 56px) thì mở thanh tương ứng
  if (y <= 48) {
    document.body.classList.add('peek-top');
  } else if (!e.target.closest('.topbar')) {
    document.body.classList.remove('peek-top');
  }
  if (y >= h - 56) {
    document.body.classList.add('peek-bottom');
  } else if (!e.target.closest('.controls')) {
    document.body.classList.remove('peek-bottom');
  }
}
window.addEventListener('mousemove', handleFsMouse, { passive: true });
document.addEventListener('fullscreenchange', () => {
  const isFs = !!document.fullscreenElement;
  document.body.classList.toggle('fs', isFs);
  document.body.classList.remove('peek-top', 'peek-bottom');
});

/* Thông báo nhỏ */
let toastT = 0;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }

/* Giảm chuyển động */
function setRM(v, announceIt) {
  RM = v; document.documentElement.classList.toggle('rm', v);
  if (announceIt) toast(v ? 'Đã bật chế độ giảm chuyển động' : 'Đã tắt chế độ giảm chuyển động');
}
REDUCE_MQ.addEventListener('change', e => setRM(e.matches));

/* Bàn phím */
function typing(t) { return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }
document.addEventListener('keydown', e => {
  if (typing(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key;
  switch (k) {
    case 'ArrowRight': case 'PageDown': case ' ': case 'Spacebar':
      e.preventDefault(); if (!e.repeat) next(); break;
    case 'ArrowLeft': case 'PageUp':
      e.preventDefault(); if (!e.repeat) prev(); break;
    case 'Home': e.preventDefault(); request(0); break;
    case 'End':  e.preventDefault(); request(N - 1); break;
    case 'f': case 'F': e.preventDefault(); toggleFs(); break;
    case 't': case 'T': e.preventDefault(); tocOv.hidden ? openToc() : closeOverlays(); break;
    case 'n': case 'N': e.preventDefault(); toggleNotes(); break;
    case 'p': case 'P': e.preventDefault(); openPresenter(); break;
    case 'm': case 'M': e.preventDefault(); setRM(!RM, true); break;
    case '?': case 'h': case 'H': e.preventDefault(); helpOv.hidden ? openHelp() : closeOverlays(); break;
    case 'Escape': closeOverlays(); break;
  }
});
/* Space trên nút đang focus kích hoạt "click" khi nhả phím → chặn để không nhảy đúp slide */
document.addEventListener('keyup', e => { if ((e.key === ' ' || e.key === 'Spacebar') && !typing(e.target)) e.preventDefault(); });

/* Vuốt trên điện thoại */
(function swipe() {
  let x0 = 0, y0 = 0, t0 = 0, on = false;
  stage.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') return; on = true; x0 = e.clientX; y0 = e.clientY; t0 = Date.now(); }, { passive: true });
  stage.addEventListener('pointerup', e => {
    if (!on) return; on = false;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && Date.now() - t0 < 700) dx < 0 ? next() : prev();
  }, { passive: true });
  stage.addEventListener('pointercancel', () => { on = false; }, { passive: true });
})();

/* Màn hình điện thoại / dọc */
const MOBILE_MQ = matchMedia('(max-width: 820px), (max-aspect-ratio: 1/1)');
const applyM = () => document.documentElement.classList.toggle('m', MOBILE_MQ.matches);
applyM(); MOBILE_MQ.addEventListener('change', applyM);

/* Ảnh lỗi → khung giữ chỗ có ghi chú */
document.addEventListener('error', e => {
  const t = e.target;
  if (t && t.tagName === 'IMG') { const box = t.closest('.ph,.th'); if (box) box.classList.add('is-missing'); }
}, true);

/* ==========================================================================
   Cửa sổ người thuyết trình (màn hình phụ) — điều khiển được slide chính
   ========================================================================== */
const presenter = { win: null, timer: 0, t0: 0 };
function openPresenter() {
  if (presenter.win && !presenter.win.closed) { presenter.win.focus(); return; }
  const w = window.open('', 'bh-presenter', 'width=1180,height=760');
  if (!w) { toast('Trình duyệt đã chặn cửa sổ phụ — hãy cho phép pop-up.'); return; }
  presenter.win = w; presenter.t0 = Date.now();
  w.document.open();
  w.document.write(`<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>Người thuyết trình — Sắc màu phố thị Biên Hòa</title><style>
  *{box-sizing:border-box;margin:0}body{background:#071B25;color:#F4F3ED;font:20px/1.55 'Be Vietnam Pro','Segoe UI',Arial,sans-serif;padding:28px 36px;height:100vh;display:flex;flex-direction:column;gap:20px}
  header{display:flex;justify-content:space-between;align-items:center;gap:20px;border-bottom:1px solid #2a4552;padding-bottom:16px}
  small{display:block;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#D5AE68;font-weight:700;margin-bottom:6px}
  h1{font-size:30px;line-height:1.2}#pn{font-size:44px;font-weight:800;color:#2FC6AE;font-variant-numeric:tabular-nums}#tm{font-size:22px;color:#B8C5C8;font-variant-numeric:tabular-nums}
  main{flex:1;display:grid;grid-template-columns:1.3fr 1fr;gap:28px;overflow:auto}section{background:#0B2732;border:1px solid #2a4552;border-radius:8px;padding:20px 24px}
  p,li{font-size:22px}li{margin:8px 0 0 20px}#nx{font-size:24px;font-weight:700}
  footer{display:flex;gap:14px}button{font:inherit;font-weight:700;font-size:18px;padding:12px 28px;border-radius:6px;border:1px solid #2FC6AE;background:transparent;color:#F4F3ED;cursor:pointer}button:hover{background:#2FC6AE;color:#071B25}
  </style></head><body>
  <header><div><small id="pg"></small><h1 id="pt"></h1></div><div style="text-align:right"><div id="pn"></div><div id="tm"></div></div></header>
  <main><div style="display:flex;flex-direction:column;gap:20px"><section><small>Lời mở đầu</small><p id="po"></p></section><section><small>Ý chính cần nhấn mạnh</small><ul id="pp"></ul></section></div>
  <div style="display:flex;flex-direction:column;gap:20px"><section><small>Câu chuyển tiếp</small><p id="px"></p></section><section><small>Slide kế tiếp</small><p id="nx"></p></section></div></main>
  <footer><button onclick="opener.__deck.prev()">← Trước</button><button onclick="opener.__deck.next()">Tiếp theo →</button><span style="flex:1"></span><button onclick="opener.__deck.fs()">Toàn màn hình (slide chính)</button></footer>
  <script>addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();opener.__deck.next()}if(e.key==='ArrowLeft'){e.preventDefault();opener.__deck.prev()}})<\/script>
  </body></html>`);
  w.document.close();
  clearInterval(presenter.timer);
  presenter.timer = setInterval(() => {
    if (!presenter.win || presenter.win.closed) { clearInterval(presenter.timer); presenter.win = null; return; }
    const sec = Math.floor((Date.now() - presenter.t0) / 1000);
    const el = presenter.win.document.getElementById('tm'); if (el) el.textContent = `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;
  }, 1000);
  updatePresenter();
}
function updatePresenter() {
  const w = presenter.win; if (!w || w.closed) { presenter.win = null; return; }
  const d = w.document, s = SLIDES[want], n = s.notes, set = (id, v, html) => { const e = d.getElementById(id); if (e) html ? e.innerHTML = v : e.textContent = v; };
  set('pg', SECTIONS[s.sec].name); set('pt', s.title); set('pn', `${pad(want + 1)} / ${pad(N)}`);
  set('po', n.open); set('pp', n.points.map(p => `<li>${p}</li>`).join(''), true); set('px', n.next);
  set('nx', want < N - 1 ? `${pad(want + 2)} · ${SLIDES[want + 1].title}` : 'Đây là slide cuối');
}
window.addEventListener('beforeunload', () => { if (presenter.win && !presenter.win.closed) presenter.win.close(); });

/* API công khai (cửa sổ phụ & kiểm thử) */
window.__deck = { next, prev, go: request, fs: toggleFs, get state() { return { cur, want, running, n: N }; }, slides: SLIDES };

/* ==========================================================================
   Khởi động
   ========================================================================== */
(function init() {
  const h = parseInt((location.hash || '').slice(1), 10);
  const start = Number.isFinite(h) ? clamp(h - 1, 0, N - 1) : 0;
  want = start;
  cur = start;
  updateUI();

  // Kích hoạt slide ban đầu ngay lập tức, không chờ đợi
  const startEl = SLIDES[start].el;
  startEl.classList.add('is-active', 'enter');
  startEl.removeAttribute('aria-hidden');
  announce(cur);

  // Tải trước tài nguyên song song ở chế độ nền
  hydrate(start);
  idle(() => {
    hydrate(cur + 1);
    hydrate(cur + 2);
    hydrate(cur - 1);
  });
})();
window.addEventListener('hashchange', () => { const h = parseInt((location.hash || '').slice(1), 10); if (Number.isFinite(h) && h - 1 !== want) request(h - 1); });
})();
