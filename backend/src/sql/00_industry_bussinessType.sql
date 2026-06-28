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


-- TRUNCATE industries RESTART IDENTITY CASCADE; 

INSERT INTO industries (id, name, code, "parentId", "isActive") VALUES
-- CẤP 1 (4 Ngành chính)
(1, 'SẢN XUẤT & CÔNG NGHIỆP', 'A', NULL, true),
(2, 'THƯƠNG MẠI & DỊCH VỤ', 'B', NULL, true),
(3, 'CÔNG NGHỆ & TRUYỀN THÔNG', 'C', NULL, true),
(4, 'XÂY DỰNG & BẤT ĐỘNG SẢN', 'D', NULL, true),

-- CẤP 2 (Con của Cấp 1)
(10, 'Chế biến thực phẩm & nông sản', 'A1', 1, true),
(11, 'Cơ khí & Luyện kim', 'A2', 1, true),
(12, 'Hóa chất & Nhựa', 'A3', 1, true),
(13, 'Bán buôn & bán lẻ', 'B1', 2, true),
(14, 'Dịch vụ lưu trú & ăn uống', 'B2', 2, true),
(15, 'Vận tải & Logistics', 'B3', 2, true),
(16, 'Công nghệ thông tin', 'C1', 3, true),
(17, 'Truyền thông & quảng cáo', 'C2', 3, true),
(18, 'Xây dựng dân dụng', 'D1', 4, true),
(19, 'Kinh doanh bất động sản', 'D2', 4, true),

-- CẤP 3 (Con của Cấp 2)
(20, 'Chế biến thực phẩm', 'A11', 10, true),
(21, 'Chế biến nông sản', 'A12', 10, true),
(22, 'Cơ khí chế tạo', 'A21', 11, true),
(23, 'Sản xuất sản phẩm nhựa', 'A31', 12, true),
(24, 'Siêu thị & Cửa hàng tiện lợi', 'B11', 13, true),
(25, 'Nhà hàng & Café', 'B21', 14, true),
(26, 'Phát triển phần mềm', 'C11', 16, true),
(27, 'Xây dựng nhà ở', 'D11', 18, true),
(28, 'Môi giới bất động sản', 'D21', 19, true),

-- CẤP 4 (Con của Cấp 3 - Cấp chọn được)
(30, 'Sản xuất thực phẩm đóng gói', 'A111', 20, true),
(31, 'Sản xuất đồ uống', 'A112', 20, true),
(32, 'Chế biến rau củ quả', 'A121', 21, true),
(33, 'Sản xuất thép & kim loại', 'A211', 22, true),
(34, 'Sản xuất bao bì nhựa', 'A311', 23, true),
(35, 'Bán lẻ trực tuyến', 'B111', 24, true),
(36, 'Chuỗi nhà hàng thức ăn nhanh', 'B211', 25, true),
(37, 'Dịch vụ tư vấn phần mềm', 'C111', 26, true),
(38, 'Xây dựng biệt thự & chung cư', 'D111', 27, true),
(39, 'Sàn giao dịch bất động sản', 'D211', 28, true)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    code = EXCLUDED.code, 
    "parentId" = EXCLUDED."parentId",
    "isActive" = EXCLUDED."isActive";

SELECT setval(pg_get_serial_sequence('industries', 'id'), (SELECT MAX(id) FROM industries));