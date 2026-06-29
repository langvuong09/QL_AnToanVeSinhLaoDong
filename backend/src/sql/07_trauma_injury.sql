-- ====================================================================================
-- 1. DỮ LIỆU MẪU CHO BẢNG: traumas (Yếu tố chấn thương / Nguyên nhân gây tai nạn)
-- ====================================================================================
INSERT INTO "traumas" ("id", "code", "name", "isActive", "deletedAt") VALUES
(1, '1', 'Yếu tố cơ khí (Kẹt, cán, cắt, đâm bởi máy móc, thiết bị, dụng cụ)', true, NULL),
(2, '2', 'Đổ sập vật liệu, công trình (Sập hầm, đổ tường, giàn giáo, đất đá sạt lở)', true, NULL),
(3, '3', 'Rơi từ trên cao (Ngã cao từ giàn giáo, sàn thao tác, mái nhà, thang)', true, NULL),
(4, '4', 'Vật rơi trúng (Dụng cụ, vật liệu từ trên cao rơi vào người)', true, NULL),
(5, '5', 'Điện giật (Tiếp xúc nguồn điện hở, rò rỉ điện, phóng điện cao áp)', true, NULL),
(6, '6', 'Bỏng nhiệt, hóa chất (Tiếp xúc lửa, nước sôi, kim loại nóng chảy, axit, kiềm)', true, NULL),
(7, '7', 'Nhiễm độc, ngạt khí (Khí độc trong không gian kín, hóa chất độc hại)', true, NULL),
(8, '8', 'Nổ vật lý, nổ hóa học (Nổ bình khí nén, nổ nồi hơi, nổ hóa chất, chất nổ)', true, NULL),
(9, '9', 'Tai nạn giao thông trong giờ làm việc (Di chuyển bằng xe máy, ô tô, xe nâng)', true, NULL),
(10,'10', 'Yếu tố khác (Động vật cắn, đuối nước, thiên tai tại nơi làm việc)', true, NULL)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code;
SELECT setval(pg_get_serial_sequence('traumas', 'id'), (SELECT MAX(id) FROM traumas));

-- ====================================================================================
-- 2. DỮ LIỆU MẪU CHO BẢNG: injury_types (Loại chấn thương)
-- Bao gồm phân cấp Cha (Nhóm chính) và Con (Chi tiết vị trí/loại tổn thương)
-- ====================================================================================

-- --- Nhóm 1: Chấn thương sọ não và hàm mặt ---
INSERT INTO "jobs" ("id", "code", "name", "isActive", "parentId", "deletedAt") VALUES
-- Cấp 1
(1, '1', 'Nhà lãnh đạo trong các ngành, các cấp và các đơn vị', true, NULL, NULL),

-- Cấp 2 (Con của 1)
(10, '11', 'Nhà lãnh đạo cơ quan Đảng Cộng sản Việt Nam cấp Trung ương và địa phương', true, 1, NULL),

-- Cấp 3 (Con của 11)
(20, '111', 'Nhà lãnh đạo cơ quan Đảng Cộng sản Việt Nam cấp Trung ương', true, 10, NULL),

-- Cấp 4 (Con của 111)
(30, '1111', 'Trưởng ban, Phó Trưởng ban và tương đương trở lên thuộc cấp Trung ương', true, 20, NULL)

ON CONFLICT (id) DO UPDATE SET 
    code = EXCLUDED.code,
    "parentId" = EXCLUDED."parentId",
    name = EXCLUDED.name;

-- Cập nhật lại sequence
SELECT setval(pg_get_serial_sequence('jobs', 'id'), (SELECT MAX(id) FROM jobs));

-- ====================================================================================
-- SEED DỮ LIỆU MẪU: injury_types (Loại chấn thương)
-- Cấu trúc: 
-- Cấp 1: Nhóm chính (Ví dụ: Chấn thương đầu, mặt, cổ)
-- Cấp 2: Loại tổn thương cụ thể (Ví dụ: Chấn thương sọ não)
-- Cấp 3: Chi tiết tổn thương (Ví dụ: Chấn động não)
-- ====================================================================================

INSERT INTO "injury_types" ("id", "code", "name", "isActive", "parentId", "deletedAt") VALUES
(1, '1', 'Đầu, mặt, cổ', true, NULL, NULL),
(2, '2', 'Ngực, bụng, cột sống', true, NULL, NULL),
(3, '3', 'Chi trên (Tay)', true, NULL, NULL),
(4, '4', 'Chi dưới (Chân)', true, NULL, NULL),
(11, '11', 'Các chấn thương sọ não hở hoặc kín', true, 1, NULL),
(12, '12', 'Tổn thương hàm mặt và răng', true, 1, NULL),
(110, '111', 'Bị thương vào cổ, tác hại đến thanh quản và thực quản', true, 11, NULL),
(111, '112', 'Chấn động não, giập não', true, 11, NULL),
(21, '21', 'Chấn thương cơ quan nội tạng', true, 2, NULL),
(22, '22', 'Gãy xương cột sống', true, 2, NULL),
(210, '211', 'Vỡ gan, vỡ lách', true, 21, NULL),
(211, '212', 'Thủng tạng rỗng (dạ dày, ruột)', true, 21, NULL),
(31, '31', 'Gãy xương chi trên', true, 3, NULL),
(32, '32', 'Đứt lìa ngón tay/bàn tay', true, 3, NULL),
(41, '41', 'Gãy xương chi dưới', true, 4, NULL),
(42, '42', 'Giập nát bàn chân', true, 4, NULL)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code;
SELECT setval(pg_get_serial_sequence('injury_types', 'id'), (SELECT MAX(id) FROM injury_types));


INSERT INTO "accident_causes" ("id", "code", "name", "type", "isActive", "deletedAt") VALUES
(1, '11', 'Thiết bị, máy móc không có bộ phận che chắn an toàn', 'EMPLOYER', true, NULL),
(2, '12', 'Thiếu phương tiện bảo vệ cá nhân (PPE) cho người lao động', 'EMPLOYER', true, NULL),
(3, '13', 'Môi trường làm việc không đảm bảo (Ánh sáng kém, thông gió yếu)', 'EMPLOYER', true, NULL),
(4, '14', 'Quy trình vận hành, biện pháp thi công không được phê duyệt', 'EMPLOYER', true, NULL),
(5, '15', 'Hệ thống điện không đảm bảo, không có tiếp địa', 'EMPLOYER', true, NULL),
(6, '21', 'Không sử dụng đúng, đủ phương tiện bảo vệ cá nhân', 'EMPLOYEE', true, NULL),
(7, '22', 'Vi phạm nội quy an toàn, quy trình vận hành máy', 'EMPLOYEE', true, NULL),
(8, '23', 'Làm việc trong tình trạng sức khỏe không đảm bảo (Say rượu, mệt mỏi)', 'EMPLOYEE', true, NULL),
(9, '24', 'Thao tác sai kỹ thuật, chủ quan khi làm việc', 'EMPLOYEE', true, NULL),
(10, '25', 'Đùa nghịch, làm việc riêng trong giờ làm', 'EMPLOYEE', true, NULL)
ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code;
SELECT setval(pg_get_serial_sequence('accident_causes', 'id'), (SELECT MAX(id) FROM accident_causes));