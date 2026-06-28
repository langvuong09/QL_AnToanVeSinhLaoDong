-- =============================================
-- MAPPING industryId cũ → mới (gần nhất)
-- 100 Nông nghiệp CN cao  → 30 (Sản xuất thực phẩm đóng gói)
-- 101 Chế biến nông sản   → 31 (Chế biến rau củ quả)
-- 102 May mặc             → 32 (Sản xuất thép & kim loại - gần nhất L4 A)
-- 103 Xây dựng dân dụng   → 33 (Xây dựng nhà ở)
-- 106 Thương mại điện tử  → 23 (Bán lẻ trực tuyến)
-- 108 Logistics           → 34 (Xây dựng cầu đường → gộp vào D)
--     thực ra logistics    → 24 (Bán buôn hàng hóa - gần hơn)
-- 111 Lập trình           → 14 (Lập trình & phần mềm - L2)
-- 112 Tư vấn CNTT         → 15 (Truyền thông & quảng cáo - L2)
-- 115 Tư vấn quản lý      → 35 (Sàn giao dịch BĐS - gần nhất L4 D)
-- 119 Vệ sinh CN          → 24 (Bán buôn hàng hóa - gần nhất B)
-- 120 Giáo dục            → 25 (Nhà hàng & café → không hợp)
--     giáo dục            → 26 (Khách sạn → không hợp)
--     giáo dục gộp vào    → 12 (Bán buôn & bán lẻ → sector B gần nhất)
-- 122 Phòng khám          → 12 (sector B - dịch vụ)
-- 126 Năng lượng tái tạo  → 10 (Chế biến thực phẩm L2 → sector A gần nhất)
-- 129 Du lịch             → 13 (Dịch vụ lưu trú & ăn uống L2)
-- =============================================

INSERT INTO doets (
    id,
    name,
    "taxCode",
    "issuedDate",
    "businessTypeId",
    "industryId",
    phone,
    address,
    representative,
    "repPhone",
    status,
    ward,
    district,
    province,
    "createdAt",
    "updatedAt"
) VALUES
-- id=1  Nông nghiệp CN cao (100→30)
(1,  'Sở Thương binh và Lao động TPHCM',           'TAX001',     '2026-01-01', 1, 30, '02839393939', '159 Pasteur, Võ Thị Sáu, Quận 3',                     'Nguyễn Văn An',    '0901234567', true, '{"key":"26815","value":"Phường Võ Thị Sáu"}'::jsonb, '{"key":"770","value":"Quận 3"}'::jsonb,                    '{"key":"79","value":"Thành phố Hồ Chí Minh"}'::jsonb, NOW(), NOW()),
-- id=2  Nông nghiệp CN cao (100→30)
(2,  'Phòng TBLĐ Quận 1',                          'TAX002',     '2026-01-01', 1, 30, '02838291000', '47 Lê Duẩn, Bến Nghé, Quận 1',                         'Trần Minh Tâm',    '0912345678', true, '{"key":"26734","value":"Phường Bến Nghé"}'::jsonb,   '{"key":"760","value":"Quận 1"}'::jsonb,                    '{"key":"79","value":"Thành phố Hồ Chí Minh"}'::jsonb, NOW(), NOW()),
-- id=10 Lập trình (111→14)
(10, 'Công ty Cổ phần Công nghệ Sao Việt',         '0312345678', '2015-06-12', 3, 14, '02838445566', 'Tòa nhà Landmark 81, Phường 22, Bình Thạnh',            'Phạm Minh Trí',    '0987654321', true, '{"key":"27082","value":"Phường 22"}'::jsonb,         '{"key":"772","value":"Quận Bình Thạnh"}'::jsonb,           '{"key":"79","value":"Thành phố Hồ Chí Minh"}'::jsonb, NOW(), NOW()),
-- id=11 Tư vấn CNTT (112→15)
(11, 'Công ty TNHH Giải pháp Phần mềm Mekong',     '0323456789', '2018-09-20', 1, 15, '02923730000', 'Khu dân cư Hồng Phát, An Bình, Ninh Kiều',             'Lê Hoàng Nam',     '0977112233', true, '{"key":"29806","value":"Phường An Bình"}'::jsonb,    '{"key":"916","value":"Quận Ninh Kiều"}'::jsonb,            '{"key":"92","value":"Thành phố Cần Thơ"}'::jsonb,     NOW(), NOW()),
-- id=12 Xây dựng dân dụng (103→33)
(12, 'Công ty TNHH Xây dựng Minh Phát',            '0103456789', '2012-03-15', 2, 33, '02437890000', 'Số 12 Khu đô thị Mỹ Đình, Mỹ Đình 2, Nam Từ Liêm',     'Nguyễn Tiến Phát', '0903456789', true, '{"key":"00160","value":"Phường Mỹ Đình 2"}'::jsonb,  '{"key":"019","value":"Quận Nam Từ Liêm"}'::jsonb,          '{"key":"01","value":"Thành phố Hà Nội"}'::jsonb,      NOW(), NOW()),
-- id=13 Logistics (108→24)
(13, 'Công ty Cổ phần Logistics Đông Dương',        '0104567890', '2016-11-05', 3, 24, '02253888999', 'Số 5 Lê Thánh Tông, Máy Tơ, Ngô Quyền',               'Trần Đức Giang',   '0912888999', true, '{"key":"01036","value":"Phường Máy Tơ"}'::jsonb,     '{"key":"032","value":"Quận Ngô Quyền"}'::jsonb,            '{"key":"31","value":"Thành phố Hải Phòng"}'::jsonb,   NOW(), NOW()),
-- id=14 Giáo dục (120→13)
(14, 'Công ty TNHH Giáo dục Tri Thức Việt',        '0405678901', '2019-01-22', 1, 13, '02363999111', '120 Nguyễn Văn Linh, Nam Dương, Hải Châu',             'Vũ Thị Hồng',      '0945999111', true, '{"key":"20242","value":"Phường Nam Dương"}'::jsonb,  '{"key":"490","value":"Quận Hải Châu"}'::jsonb,             '{"key":"48","value":"Thành phố Đà Nẵng"}'::jsonb,     NOW(), NOW()),
-- id=15 Du lịch (129→13)
(15, 'Công ty Cổ phần Du lịch Biển Xanh',          '3706789012', '2014-07-30', 3, 13, '02583522333', '44 Trần Phú, Lộc Thọ',                                 'Đặng Quốc Bảo',    '0905522333', true, '{"key":"22849","value":"Phường Lộc Thọ"}'::jsonb,   '{"key":"568","value":"Thành phố Nha Trang"}'::jsonb,       '{"key":"56","value":"Tỉnh Khánh Hòa"}'::jsonb,        NOW(), NOW()),
-- id=16 Nông nghiệp CN cao (100→30)
(16, 'Công ty TNHH Nông nghiệp CN cao An Phú',     '3607890123', '2020-05-18', 1, 30, '02513822111', 'Đường số 3, KCN Amata, Long Bình',                     'Hoàng Văn Thắng',  '0938382111', true, '{"key":"26194","value":"Phường Long Bình"}'::jsonb,  '{"key":"731","value":"Thành phố Biên Hòa"}'::jsonb,       '{"key":"75","value":"Tỉnh Đồng Nai"}'::jsonb,         NOW(), NOW()),
-- id=17 Thương mại điện tử (106→23)
(17, 'Công ty TNHH Thương mại Thành Công',          '0308901234', '2017-08-11', 2, 23, '02743811222', 'Số 8 Đại lộ Bình Dương, Phú Hòa',                     'Bùi Hữu Nghĩa',    '0918112222', true, '{"key":"25726","value":"Phường Phú Hòa"}'::jsonb,   '{"key":"718","value":"Thành phố Thủ Dầu Một"}'::jsonb,    '{"key":"74","value":"Tỉnh Bình Dương"}'::jsonb,       NOW(), NOW()),
-- id=18 Phòng khám (122→13)
(18, 'Công ty Cổ phần Y tế Hòa Bình',              '0109012345', '2021-12-01', 3, 13, '02439998888', '74 Nguyễn Chí Thanh, Láng Hạ, Đống Đa',               'Nguyễn Thị Minh',  '0966999888', true, '{"key":"00226","value":"Phường Láng Hạ"}'::jsonb,   '{"key":"006","value":"Quận Đống Đa"}'::jsonb,              '{"key":"01","value":"Thành phố Hà Nội"}'::jsonb,      NOW(), NOW()),
-- id=19 Vệ sinh CN (119→24)
(19, 'Doanh nghiệp tư nhân Minh Tâm',              '3500123456', '2011-02-28', 5, 24, '02838999999', '215 Điện Biên Phủ, Võ Thị Sáu, Quận 3',               'Phan Minh Tâm',    '0909999999', true, '{"key":"26815","value":"Phường Võ Thị Sáu"}'::jsonb, '{"key":"770","value":"Quận 3"}'::jsonb,                   '{"key":"79","value":"Thành phố Hồ Chí Minh"}'::jsonb, NOW(), NOW()),
-- id=20 Tư vấn quản lý (115→35)
(20, 'Công ty Hợp danh Luật và Cộng sự Việt Nam',  '0101230001', '2023-04-10', 4, 35, '02435556666', '45 Lý Thường Kiệt, Trần Hưng Đạo, Hoàn Kiếm',         'Trần Hữu Pháp',    '0912555666', true, '{"key":"00028","value":"Phường Trần Hưng Đạo"}'::jsonb,'{"key":"001","value":"Quận Hoàn Kiếm"}'::jsonb,           '{"key":"01","value":"Thành phố Hà Nội"}'::jsonb,      NOW(), NOW()),
-- id=21 Năng lượng tái tạo (126→32)
(21, 'Công ty Cổ phần Năng lượng xanh Ban Mai',    '0301230002', '2022-02-14', 3, 32, '02837778888', 'Khu công nghệ cao TPHCM, Tân Phú, Quận 9',             'Nguyễn Thái Dương', '0988777888', true, '{"key":"26860","value":"Phường Tân Phú"}'::jsonb,   '{"key":"769","value":"Quận 9"}'::jsonb,                    '{"key":"79","value":"Thành phố Hồ Chí Minh"}'::jsonb, NOW(), NOW()),
-- id=22 Chế biến nông sản (101→31)
(22, 'Công ty TNHH Thực phẩm và Nông sản Việt',   '0201230003', '2016-03-24', 1, 31, '02253555222', '12 Chùa Vẽ, Đông Hải 1, Hải An',                      'Phạm Văn Thực',    '0904555222', true, '{"key":"01123","value":"Phường Đông Hải 1"}'::jsonb, '{"key":"035","value":"Quận Hải An"}'::jsonb,               '{"key":"31","value":"Thành phố Hải Phòng"}'::jsonb,   NOW(), NOW()),
-- id=23 May mặc (102→32)
(23, 'Công ty TNHH May mặc Hùng Cường',            '0301230004', '2013-10-09', 2, 32, '02743555111', 'Đường D1, KCN Mỹ Phước 1, Mỹ Phước, Bến Cát',         'Đỗ Hùng Cường',    '0913555111', true, '{"key":"25786","value":"Phường Mỹ Phước"}'::jsonb,  '{"key":"721","value":"Thị xã Bến Cát"}'::jsonb,           '{"key":"74","value":"Tỉnh Bình Dương"}'::jsonb,       NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name            = EXCLUDED.name,
    "taxCode"       = EXCLUDED."taxCode",
    "issuedDate"    = EXCLUDED."issuedDate",
    "businessTypeId"= EXCLUDED."businessTypeId",
    "industryId"    = EXCLUDED."industryId",
    phone           = EXCLUDED.phone,
    address         = EXCLUDED.address,
    representative  = EXCLUDED.representative,
    "repPhone"      = EXCLUDED."repPhone",
    status          = EXCLUDED.status,
    ward            = EXCLUDED.ward,
    district        = EXCLUDED.district,
    province        = EXCLUDED.province,
    "updatedAt"     = NOW();

SELECT setval(pg_get_serial_sequence('doets', 'id'), (SELECT MAX(id) FROM doets));