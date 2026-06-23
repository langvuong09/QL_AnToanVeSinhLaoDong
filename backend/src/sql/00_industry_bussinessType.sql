-- Seed 5 specific business types according to Vietnam Enterprise Law
INSERT INTO business_types (id, name, code, "isActive") VALUES
(1, 'Công ty TNHH một thành viên', 'TNHH_1TV', true),
(2, 'Công ty TNHH hai thành viên trở lên', 'TNHH_2TV', true),
(3, 'Công ty cổ phần', 'CO_PHAN', true),
(4, 'Công ty hợp danh', 'HOP_DANH', true),
(5, 'Doanh nghiệp tư nhân', 'DN_TU_NHAN', true)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    code = EXCLUDED.code, 
    "isActive" = EXCLUDED."isActive";

SELECT setval(pg_get_serial_sequence('business_types', 'id'), coalesce(max(id), 1)) FROM business_types;


-- =============================================
-- LEVEL 1 — 4 Sectors
-- =============================================
INSERT INTO industries (id, name, code, "parentId", "isActive") VALUES
(1, 'Sản xuất & Công nghiệp',        'A', NULL, true),
(2, 'Thương mại & Dịch vụ',          'B', NULL, true),
(3, 'Công nghệ & Truyền thông',       'C', NULL, true),
(4, 'Xây dựng & Bất động sản',       'D', NULL, true)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name, code = EXCLUDED.code,
      "parentId" = EXCLUDED."parentId", "isActive" = EXCLUDED."isActive";


-- =============================================
-- LEVEL 2 — Divisions
-- A → 4 cấp, B → 3 cấp, C → 2 cấp, D → 4 cấp
-- =============================================
INSERT INTO industries (id, name, code, "parentId", "isActive") VALUES
-- A (4 cấp)
(10, 'Chế biến thực phẩm & nông sản', '01', 1, true),
(11, 'Sản xuất công nghiệp nặng',     '02', 1, true),
-- B (3 cấp)
(12, 'Bán buôn & bán lẻ',             '03', 2, true),
(13, 'Dịch vụ lưu trú & ăn uống',    '04', 2, true),
-- C (2 cấp — dừng ở đây)
(14, 'Lập trình & phần mềm',          '05', 3, true),
(15, 'Truyền thông & quảng cáo',      '06', 3, true),
-- D (4 cấp)
(16, 'Xây dựng công trình',           '07', 4, true),
(17, 'Kinh doanh bất động sản',       '08', 4, true)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name, code = EXCLUDED.code,
      "parentId" = EXCLUDED."parentId", "isActive" = EXCLUDED."isActive";


-- =============================================
-- LEVEL 3 — Groups
-- A(4 cấp), B(3 cấp — level cuối), D(4 cấp)
-- =============================================
INSERT INTO industries (id, name, code, "parentId", "isActive") VALUES
-- A (tiếp tục → 4 cấp)
(20, 'Chế biến thực phẩm',            '011', 10, true),
(21, 'Chế biến nông sản',             '012', 10, true),
(22, 'Cơ khí & luyện kim',            '021', 11, true),
-- B (level cuối)
(23, 'Bán lẻ trực tuyến',             '031', 12, true),
(24, 'Bán buôn hàng hóa',             '032', 12, true),
(25, 'Nhà hàng & café',               '041', 13, true),
(26, 'Khách sạn & lưu trú',           '042', 13, true),
-- D (tiếp tục → 4 cấp)
(27, 'Thi công dân dụng',             '071', 16, true),
(28, 'Thi công hạ tầng',              '072', 16, true),
(29, 'Môi giới bất động sản',         '081', 17, true)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name, code = EXCLUDED.code,
      "parentId" = EXCLUDED."parentId", "isActive" = EXCLUDED."isActive";


-- =============================================
-- LEVEL 4 — Classes (selectable)
-- Chỉ A và D
-- =============================================
INSERT INTO industries (id, name, code, "parentId", "isActive") VALUES
-- A
(30, 'Sản xuất thực phẩm đóng gói',   '0111', 20, true),
(31, 'Chế biến rau củ quả',           '0121', 21, true),
(32, 'Sản xuất thép & kim loại',      '0211', 22, true),
-- D
(33, 'Xây dựng nhà ở',                '0711', 27, true),
(34, 'Xây dựng cầu đường',            '0721', 28, true),
(35, 'Sàn giao dịch bất động sản',    '0811', 29, true)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name, code = EXCLUDED.code,
      "parentId" = EXCLUDED."parentId", "isActive" = EXCLUDED."isActive";


SELECT setval(pg_get_serial_sequence('industries', 'id'), coalesce(max(id), 1)) FROM industries;