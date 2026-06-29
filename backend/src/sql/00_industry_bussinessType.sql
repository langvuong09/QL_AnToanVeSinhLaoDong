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
(1, 'SẢN XUẤT & CÔNG NGHIỆP', '1', NULL, true),
(2, 'THƯƠNG MẠI & DỊCH VỤ', '2', NULL, true),
(3, 'CÔNG NGHỆ & TRUYỀN THÔNG', '3', NULL, true),
(4, 'XÂY DỰNG & BẤT ĐỘNG SẢN', '4', NULL, true),
-- Cấp 2
(10, 'Chế biến thực phẩm & nông sản', '11', 1, true),
(11, 'Cơ khí & Luyện kim', '12', 1, true),
(12, 'Hóa chất & Nhựa', '13', 1, true),
(13, 'Bán buôn & bán lẻ', '21', 2, true),
(14, 'Dịch vụ lưu trú & ăn uống', '22', 2, true),
(15, 'Vận tải & Logistics', '23', 2, true),
(16, 'Công nghệ thông tin', '31', 3, true),
(17, 'Truyền thông & quảng cáo', '32', 3, true),
(18, 'Xây dựng dân dụng', '41', 4, true),
(19, 'Kinh doanh bất động sản', '42', 4, true),
-- Cấp 3
(20, 'Chế biến thực phẩm', '111', 10, true),
(21, 'Chế biến nông sản', '112', 10, true),
(22, 'Cơ khí chế tạo', '121', 11, true),
(23, 'Sản xuất sản phẩm nhựa', '131', 12, true),
(24, 'Siêu thị & Cửa hàng tiện lợi', '211', 13, true),
(25, 'Nhà hàng & Café', '221', 14, true),
(26, 'Phát triển phần mềm', '311', 16, true),
(27, 'Xây dựng nhà ở', '411', 18, true),
(28, 'Môi giới bất động sản', '421', 19, true),
-- Cấp 4
(30, 'Sản xuất thực phẩm đóng gói', '1111', 20, true),
(31, 'Sản xuất đồ uống', '1112', 20, true),
(32, 'Chế biến rau củ quả', '1121', 21, true),
(33, 'Sản xuất thép & kim loại', '1211', 22, true),
(34, 'Sản xuất bao bì nhựa', '1311', 23, true),
(35, 'Bán lẻ trực tuyến', '2111', 24, true),
(36, 'Chuỗi nhà hàng thức ăn nhanh', '2211', 25, true),
(37, 'Dịch vụ tư vấn phần mềm', '3111', 26, true),
(38, 'Xây dựng biệt thự & chung cư', '4111', 27, true),
(39, 'Sàn giao dịch bất động sản', '4211', 28, true)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code;
SELECT setval(pg_get_serial_sequence('industries', 'id'), coalesce(max(id), 1)) FROM industries;