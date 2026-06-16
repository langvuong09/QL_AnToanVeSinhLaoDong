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

-- Seed industry hierarchy
-- LEVEL 1 (Sectors)
INSERT INTO industries (id, name, code, "parentId", "isActive") VALUES
(1, 'Nông nghiệp, lâm nghiệp và thuỷ sản', 'A', NULL, true),
(2, 'Công nghiệp chế biến, chế tạo', 'C', NULL, true),
(3, 'Xây dựng', 'F', NULL, true),
(4, 'Bán buôn và bán lẻ, sửa chữa ô tô, mô tô, xe máy', 'G', NULL, true),
(5, 'Vận tải kho bãi', 'H', NULL, true),
(6, 'Dịch vụ lưu trú và ăn uống', 'I', NULL, true),
(7, 'Thông tin và truyền thông', 'J', NULL, true),
(8, 'Hoạt động tài chính, ngân hàng và bảo hiểm', 'K', NULL, true),
(9, 'Hoạt động kinh doanh bất động sản', 'L', NULL, true),
(10, 'Hoạt động chuyên môn, khoa học và công nghệ', 'M', NULL, true),
(11, 'Hoạt động hành chính và dịch vụ hỗ trợ', 'N', NULL, true),
(12, 'Giáo dục và đào tạo', 'P', NULL, true),
(13, 'Y tế và hoạt động trợ giúp xã hội', 'Q', NULL, true),
(14, 'Sản xuất và phân phối điện, khí đốt, nước nóng, hơi nước', 'D', NULL, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code, "parentId" = EXCLUDED."parentId", "isActive" = EXCLUDED."isActive";

-- LEVEL 2 (Divisions)
INSERT INTO industries (id, name, code, "parentId", "isActive") VALUES
(20, 'Nông nghiệp và hoạt động dịch vụ có liên quan', '01', 1, true),
(21, 'Sản xuất chế biến thực phẩm', '10', 2, true),
(22, 'Sản xuất trang phục', '14', 2, true),
(23, 'Xây dựng nhà các loại', '41', 3, true),
(24, 'Hoạt động xây dựng chuyên dụng', '43', 3, true),
(25, 'Bán buôn (trừ ô tô, mô tô, xe máy và xe có động cơ khác)', '46', 4, true),
(26, 'Bán lẻ (trừ ô tô, mô tô, xe máy và xe có động cơ khác)', '47', 4, true),
(27, 'Vận tải đường bộ và vận tải đường ống', '49', 5, true),
(28, 'Kho bãi và các hoạt động hỗ trợ cho vận tải', '52', 5, true),
(29, 'Dịch vụ lưu trú', '55', 6, true),
(30, 'Dịch vụ ăn uống', '56', 6, true),
(31, 'Lập trình máy vi tính, dịch vụ tư vấn và liên quan', '62', 7, true),
(32, 'Hoạt động tài chính khác', '66', 8, true),
(33, 'Hoạt động kinh doanh bất động sản', '68', 9, true),
(34, 'Hoạt động của trụ sở chính - tư vấn quản lý', '70', 10, true),
(35, 'Quảng cáo và nghiên cứu thị trường', '73', 10, true),
(36, 'Hoạt động dịch vụ lao động và việc làm', '78', 11, true),
(37, 'Hoạt động điều tra, bảo đảm an toàn', '80', 11, true),
(38, 'Dịch vụ vệ sinh nhà cửa, công trình và cảnh quan', '81', 11, true),
(39, 'Giáo dục và đào tạo', '85', 12, true),
(40, 'Hoạt động y tế', '86', 13, true),
(41, 'In ấn và sao chép bản ghi', '18', 2, true),
(42, 'Sản xuất và phân phối điện', '35', 14, true),
(43, 'Hoạt động pháp luật, kế toán và kiểm toán', '69', 10, true),
(44, 'Đại lý du lịch, kinh doanh tua du lịch', '79', 11, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code, "parentId" = EXCLUDED."parentId", "isActive" = EXCLUDED."isActive";

-- LEVEL 3 (Groups)
INSERT INTO industries (id, name, code, "parentId", "isActive") VALUES
(50, 'Trồng cây hàng năm', '011', 20, true),
(51, 'Chế biến, bảo quản thực phẩm', '101', 21, true),
(52, 'Sản xuất trang phục', '141', 22, true),
(53, 'Xây dựng nhà các loại', '410', 23, true),
(54, 'Lắp đặt hệ thống điện, cấp thoát nước', '432', 24, true),
(55, 'Bán buôn thiết bị và linh kiện điện tử', '465', 25, true),
(56, 'Bán lẻ không phải trong cửa hàng', '479', 26, true),
(57, 'Vận tải đường bộ khác', '493', 27, true),
(58, 'Kho bãi và lưu giữ hàng hóa', '521', 28, true),
(59, 'Dịch vụ lưu trú ngắn ngày', '551', 29, true),
(60, 'Dịch vụ ăn uống', '561', 30, true),
(61, 'Lập trình máy vi tính và tư vấn liên quan', '620', 31, true),
(62, 'Hoạt động dịch vụ tài chính', '661', 32, true),
(63, 'Kinh doanh bất động sản', '680', 33, true),
(64, 'Hoạt động tư vấn quản lý', '702', 34, true),
(65, 'Quảng cáo', '731', 35, true),
(66, 'Môi giới lao động, việc làm', '781', 36, true),
(67, 'Dịch vụ bảo vệ tư nhân', '801', 37, true),
(68, 'Dịch vụ vệ sinh công nghiệp', '812', 38, true),
(69, 'Giáo dục khác chưa phân vào đâu', '855', 39, true),
(70, 'Hoạt động của các bệnh viện', '861', 40, true),
(71, 'Hoạt động y khoa, nha khoa', '862', 40, true),
(72, 'In ấn', '181', 41, true),
(73, 'Sản xuất điện', '351', 42, true),
(74, 'Đại lý, môi giới, đấu giá hàng hóa', '461', 25, true),
(75, 'Kế toán, kiểm toán và tư vấn thuế', '692', 43, true),
(76, 'Đại lý du lịch, kinh doanh tua du lịch', '791', 44, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code, "parentId" = EXCLUDED."parentId", "isActive" = EXCLUDED."isActive";

-- LEVEL 4 (Classes) - Displays as selectable business industries
INSERT INTO industries (id, name, code, "parentId", "isActive") VALUES
(100, 'Trồng lúa (Nông nghiệp công nghệ cao)', '0111', 50, true),
(101, 'Chế biến nông sản và thực phẩm', '1010', 51, true),
(102, 'Sản xuất may mặc', '1410', 52, true),
(103, 'Xây dựng công trình dân dụng', '4100', 53, true),
(104, 'Thi công cơ điện', '4321', 54, true),
(105, 'Bán buôn thiết bị điện tử', '4651', 55, true),
(106, 'Thương mại điện tử', '4791', 56, true),
(107, 'Vận tải hàng hóa bằng đường bộ', '4933', 57, true),
(108, 'Logistics và kho bãi', '5210', 58, true),
(109, 'Khách sạn và lưu trú', '5510', 59, true),
(110, 'Nhà hàng và dịch vụ ăn uống', '5610', 60, true),
(111, 'Lập trình máy vi tính', '6201', 61, true),
(112, 'Tư vấn công nghệ thông tin', '6202', 61, true),
(113, 'Tài chính và hỗ trợ đầu tư', '6619', 62, true),
(114, 'Kinh doanh bất động sản', '6800', 63, true),
(115, 'Tư vấn quản lý doanh nghiệp', '7020', 64, true),
(116, 'Marketing và quảng cáo', '7310', 65, true),
(117, 'Dịch vụ nhân sự', '7810', 66, true),
(118, 'Dịch vụ bảo vệ', '8010', 67, true),
(119, 'Vệ sinh công nghiệp', '8121', 68, true),
(120, 'Giáo dục và đào tạo (Trung tâm ngoại ngữ)', '8559', 69, true),
(121, 'Y tế tư nhân', '8610', 70, true),
(122, 'Phòng khám đa khoa', '8620', 71, true),
(123, 'Trồng cây ăn quả', '0121', 50, true),
(124, 'Chế biến rau quả (nông sản)', '1030', 51, true),
(125, 'In ấn và thiết kế', '1811', 72, true),
(126, 'Sản xuất điện (Năng lượng tái tạo)', '3511', 73, true),
(127, 'Hoạt động xuất nhập khẩu', '4610', 74, true),
(128, 'Kế toán và kiểm toán', '6920', 75, true),
(129, 'Du lịch lữ hành', '7911', 76, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code, "parentId" = EXCLUDED."parentId", "isActive" = EXCLUDED."isActive";

SELECT setval(pg_get_serial_sequence('industries', 'id'), coalesce(max(id), 1)) FROM industries;