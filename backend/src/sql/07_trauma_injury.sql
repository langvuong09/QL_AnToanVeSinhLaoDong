-- ====================================================================================
-- 1. DỮ LIỆU MẪU CHO BẢNG: traumas (Yếu tố chấn thương / Nguyên nhân gây tai nạn)
-- ====================================================================================
INSERT INTO "traumas" ("id", "code", "name", "isActive", "deletedAt") VALUES
(1, 'TRAUMA_01', 'Yếu tố cơ khí (Kẹt, cán, cắt, đâm bởi máy móc, thiết bị, dụng cụ)',               true, NULL),
(2, 'TRAUMA_02', 'Đổ sập vật liệu, công trình (Sập hầm, đổ tường, giàn giáo, đất đá sạt lở)',       true, NULL),
(3, 'TRAUMA_03', 'Rơi từ trên cao (Ngã cao từ giàn giáo, sàn thao tác, mái nhà, thang)',            true, NULL),
(4, 'TRAUMA_04', 'Vật rơi trúng (Dụng cụ, vật liệu từ trên cao rơi vào người)',                     true, NULL),
(5, 'TRAUMA_05', 'Điện giật (Tiếp xúc nguồn điện hở, rò rỉ điện, phóng điện cao áp)',               true, NULL),
(6, 'TRAUMA_06', 'Bỏng nhiệt, hóa chất (Tiếp xúc lửa, nước sôi, kim loại nóng chảy, axit, kiềm)',   true, NULL),
(7, 'TRAUMA_07', 'Nhiễm độc, ngạt khí (Khí độc trong không gian kín, hóa chất độc hại)',            true, NULL),
(8, 'TRAUMA_08', 'Nổ vật lý, nổ hóa học (Nổ bình khí nén, nổ nồi hơi, nổ hóa chất, chất nổ)',       true, NULL),
(9, 'TRAUMA_09', 'Tai nạn giao thông trong giờ làm việc (Di chuyển bằng xe máy, ô tô, xe nâng)',    true, NULL),
(10,'TRAUMA_10', 'Yếu tố khác (Động vật cắn, đuối nước, thiên tai tại nơi làm việc)',               true, NULL);
SELECT setval(pg_get_serial_sequence('traumas', 'id'), (SELECT MAX(id) FROM traumas));

-- ====================================================================================
-- 2. DỮ LIỆU MẪU CHO BẢNG: injury_types (Loại chấn thương)
-- Bao gồm phân cấp Cha (Nhóm chính) và Con (Chi tiết vị trí/loại tổn thương)
-- ====================================================================================

-- --- Nhóm 1: Chấn thương sọ não và hàm mặt ---
INSERT INTO "jobs" ("id", "code", "name", "isActive", "parentId", "deletedAt") VALUES
-- Cấp 1
(1, 'JOB_01', 'Nhà lãnh đạo trong các ngành, các cấp và các đơn vị', true, NULL, NULL),

-- Cấp 2
(2, 'JOB_11', 'Nhà lãnh đạo cơ quan Đảng Cộng sản Việt Nam cấp Trung ương và địa phương', true, 1, NULL),

-- Cấp 3
(3, 'JOB_111', 'Nhà lãnh đạo cơ quan Đảng Cộng sản Việt Nam cấp Trung ương', true, 2, NULL),

-- Cấp 4
(4, 'JOB_1111', 'Trưởng ban, Phó Trưởng ban và tương đương trở lên thuộc cấp Trung ương', true, 3, NULL);
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    "parentId" = EXCLUDED."parentId",
    "isActive" = EXCLUDED."isActive";
SELECT setval(pg_get_serial_sequence('jobs', 'id'), (SELECT MAX(id) FROM jobs));

-- ====================================================================================
-- SEED DỮ LIỆU MẪU: injury_types (Loại chấn thương)
-- Cấu trúc: 
-- Cấp 1: Nhóm chính (Ví dụ: Chấn thương đầu, mặt, cổ)
-- Cấp 2: Loại tổn thương cụ thể (Ví dụ: Chấn thương sọ não)
-- Cấp 3: Chi tiết tổn thương (Ví dụ: Chấn động não)
-- ====================================================================================

INSERT INTO "injury_types" ("id", "code", "name", "isActive", "parentId", "deletedAt") VALUES
-- CẤP 1
(1, 'INJ_01', 'Đầu, mặt, cổ', true, NULL, NULL),
(2, 'INJ_02', 'Ngực, bụng, cột sống', true, NULL, NULL),
(3, 'INJ_03', 'Chi trên (Tay)', true, NULL, NULL),
(4, 'INJ_04', 'Chi dưới (Chân)', true, NULL, NULL),

-- CẤP 2 (Thuộc Cấp 1)
(11, 'INJ_01_01', 'Các chấn thương sọ não hở hoặc kín', true, 1, NULL),
(12, 'INJ_01_02', 'Tổn thương hàm mặt và răng', true, 1, NULL),

-- CẤP 3 (Thuộc Cấp 2 - ID 11)
(110, 'INJ_01_01_01', 'Bị thương vào cổ, tác hại đến thanh quản và thực quản', true, 11, NULL),
(111, 'INJ_01_01_02', 'Chấn động não, giập não', true, 11, NULL),

-- CẤP 2 (Thuộc Cấp 2)
(21, 'INJ_02_01', 'Chấn thương cơ quan nội tạng', true, 2, NULL),
(22, 'INJ_02_02', 'Gãy xương cột sống', true, 2, NULL),

-- CẤP 3 (Thuộc Cấp 2 - ID 21)
(210, 'INJ_02_01_01', 'Vỡ gan, vỡ lách', true, 21, NULL),
(211, 'INJ_02_01_02', 'Thủng tạng rỗng (dạ dày, ruột)', true, 21, NULL),

-- CẤP 2 (Thuộc Cấp 3)
(31, 'INJ_03_01', 'Gãy xương chi trên', true, 3, NULL),
(32, 'INJ_03_02', 'Đứt lìa ngón tay/bàn tay', true, 3, NULL),

-- CẤP 2 (Thuộc Cấp 4)
(41, 'INJ_04_01', 'Gãy xương chi dưới', true, 4, NULL),
(42, 'INJ_04_02', 'Giập nát bàn chân', true, 4, NULL);
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    "parentId" = EXCLUDED."parentId",
    "isActive" = EXCLUDED."isActive";

-- Cập nhật SEQUENCE để tránh trùng lặp ID khi thêm mới từ hệ thống sau khi seed
SELECT setval(pg_get_serial_sequence('"injury_types"', 'id'), (SELECT MAX("id") FROM "injury_types"));


INSERT INTO "accident_causes" ("id", "code", "name", "type", "isActive", "deletedAt") VALUES
-- Do người sử dụng lao động (EMPLOYER)
(1, 'CAUSE_EMP_01', 'Thiết bị, máy móc không có bộ phận che chắn an toàn', 'EMPLOYER', true, NULL),
(2, 'CAUSE_EMP_02', 'Thiếu phương tiện bảo vệ cá nhân (PPE) cho người lao động', 'EMPLOYER', true, NULL),
(3, 'CAUSE_EMP_03', 'Môi trường làm việc không đảm bảo (Ánh sáng kém, thông gió yếu)', 'EMPLOYER', true, NULL),
(4, 'CAUSE_EMP_04', 'Quy trình vận hành, biện pháp thi công không được phê duyệt', 'EMPLOYER', true, NULL),
(5, 'CAUSE_EMP_05', 'Hệ thống điện không đảm bảo, không có tiếp địa', 'EMPLOYER', true, NULL),

-- Do người lao động (EMPLOYEE)
(6, 'CAUSE_WORKER_01', 'Không sử dụng đúng, đủ phương tiện bảo vệ cá nhân', 'EMPLOYEE', true, NULL),
(7, 'CAUSE_WORKER_02', 'Vi phạm nội quy an toàn, quy trình vận hành máy', 'EMPLOYEE', true, NULL),
(8, 'CAUSE_WORKER_03', 'Làm việc trong tình trạng sức khỏe không đảm bảo (Say rượu, mệt mỏi)', 'EMPLOYEE', true, NULL),
(9, 'CAUSE_WORKER_04', 'Thao tác sai kỹ thuật, chủ quan khi làm việc', 'EMPLOYEE', true, NULL),
(10, 'CAUSE_WORKER_05', 'Đùa nghịch, làm việc riêng trong giờ làm', 'EMPLOYEE', true, NULL);
SELECT setval(pg_get_serial_sequence('accident_causes', 'id'), (SELECT MAX(id) FROM accident_causes));