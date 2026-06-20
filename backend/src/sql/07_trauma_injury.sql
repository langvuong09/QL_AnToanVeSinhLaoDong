-- ====================================================================================
-- 1. DỮ LIỆU MẪU CHO BẢNG: traumas (Yếu tố chấn thương / Nguyên nhân gây tai nạn)
-- ====================================================================================
INSERT INTO "traumas" ("code", "name", "isActive", "deletedAt") VALUES
('TRAUMA_01', 'Yếu tố cơ khí (Kẹt, cán, cắt, đâm bởi máy móc, thiết bị, dụng cụ)', true, NULL),
('TRAUMA_02', 'Đổ sập vật liệu, công trình (Sập hầm, đổ tường, giàn giáo, đất đá sạt lở)', true, NULL),
('TRAUMA_03', 'Rơi từ trên cao (Ngã cao từ giàn giáo, sàn thao tác, mái nhà, thang)', true, NULL),
('TRAUMA_04', 'Vật rơi trúng (Dụng cụ, vật liệu từ trên cao rơi vào người)', true, NULL),
('TRAUMA_05', 'Điện giật (Tiếp xúc nguồn điện hở, rò rỉ điện, phóng điện cao áp)', true, NULL),
('TRAUMA_06', 'Bỏng nhiệt, hóa chất (Tiếp xúc lửa, nước sôi, kim loại nóng chảy, axit, kiềm)', true, NULL),
('TRAUMA_07', 'Nhiễm độc, ngạt khí (Khí độc trong không gian kín, hóa chất độc hại)', true, NULL),
('TRAUMA_08', 'Nổ vật lý, nổ hóa học (Nổ bình khí nén, nổ nồi hơi, nổ hóa chất, chất nổ)', true, NULL),
('TRAUMA_09', 'Tai nạn giao thông trong giờ làm việc (Di chuyển bằng xe máy, ô tô, xe nâng)', true, NULL),
('TRAUMA_10', 'Yếu tố khác (Động vật cắn, đuối nước, thiên tai tại nơi làm việc)', true, NULL);


-- ====================================================================================
-- 2. DỮ LIỆU MẪU CHO BẢNG: injury_types (Loại chấn thương)
-- Bao gồm phân cấp Cha (Nhóm chính) và Con (Chi tiết vị trí/loại tổn thương)
-- ====================================================================================

-- --- Nhóm 1: Chấn thương sọ não và hàm mặt ---
INSERT INTO "injury_types" ("id", "code", "name", "isActive", "parentId", "deletedAt") VALUES
(1, 'INJ_01', 'Chấn thương sọ não và hàm mặt', true, NULL, NULL);

INSERT INTO "injury_types" ("code", "name", "isActive", "parentId", "deletedAt") VALUES
('INJ_01_01', 'Chấn thương sọ não kín (Chấn động não, giập não)', true, 1, NULL),
('INJ_01_02', 'Vỡ xương sọ / Hàm mặt', true, 1, NULL),
('INJ_01_03', 'Vết thương phần mềm vùng đầu, mặt', true, 1, NULL);


-- --- Nhóm 2: Chấn thương hệ xương khớp và chi ---
INSERT INTO "injury_types" ("id", "code", "name", "isActive", "parentId", "deletedAt") VALUES
(2, 'INJ_02', 'Chấn thương hệ xương khớp và cơ chi', true, NULL, NULL);

INSERT INTO "injury_types" ("code", "name", "isActive", "parentId", "deletedAt") VALUES
('INJ_02_01', 'Gãy xương chi trên (Xương đòn, cánh tay, cẳng tay, bàn tay)', true, 2, NULL),
('INJ_02_02', 'Gãy xương chi dưới (Xương đùi, cẳng chân, cổ chân, bàn chân)', true, 2, NULL),
('INJ_02_03', 'Trật khớp / Giập nát chi', true, 2, NULL),
('INJ_02_04', 'Đứt lìa chi (Ngón tay, bàn tay, ngón chân, bàn chân)', true, 2, NULL);


-- --- Nhóm 3: Chấn thương ngực, bụng và cột sống ---
INSERT INTO "injury_types" ("id", "code", "name", "isActive", "parentId", "deletedAt") VALUES
(3, 'INJ_03', 'Chấn thương ngực, bụng và cột sống', true, NULL, NULL);

INSERT INTO "injury_types" ("code", "name", "isActive", "parentId", "deletedAt") VALUES
('INJ_03_01', 'Chấn thương ngực kín (Gãy xương sườn, giập phổi, tràn máu màng phổi)', true, 3, NULL),
('INJ_03_02', 'Chấn thương bụng kín (Vỡ gan, vỡ lách, thủng tạng rỗng)', true, 3, NULL),
('INJ_03_03', 'Chấn thương cột sống, tủy sống', true, 3, NULL);


-- --- Nhóm 4: Bỏng và tổn thương bề mặt ---
INSERT INTO "injury_types" ("id", "code", "name", "isActive", "parentId", "deletedAt") VALUES
(4, 'INJ_04', 'Bỏng và tổn thương bề mặt da', true, NULL, NULL);

INSERT INTO "injury_types" ("code", "name", "isActive", "parentId", "deletedAt") VALUES
('INJ_04_01', 'Bỏng nhiệt độ (Do lửa, chất lỏng sôi, kim loại nóng)', true, 4, NULL),
('INJ_04_02', 'Bỏng hóa chất (Axit, kiềm công nghiệp)', true, 4, NULL),
('INJ_04_03', 'Bỏng điện (Hồ quang điện, dòng điện đi qua cơ thể)', true, 4, NULL);


-- --- Nhóm 5: Ngộ độc và ngạt khí độc ---
INSERT INTO "injury_types" ("id", "code", "name", "isActive", "parentId", "deletedAt") VALUES
(5, 'INJ_05', 'Nhiễm độc và ngạt khí cấp tính', true, NULL, NULL);

INSERT INTO "injury_types" ("code", "name", "isActive", "parentId", "deletedAt") VALUES
('INJ_05_01', 'Ngạt khí cấp tính trong không gian kín (Thiếu Oxy, khí CO, H2S)', true, 5, NULL),
('INJ_05_02', 'Nhiễm độc hóa chất, dung môi công nghiệp qua da/đường hô hấp', true, 5, NULL);


-- --- Nhóm 6: Tổn thương các giác quan độc lập ---
INSERT INTO "injury_types" ("id", "code", "name", "isActive", "parentId", "deletedAt") VALUES
(6, 'INJ_06', 'Tổn thương cơ quan thị giác và thính giác', true, NULL, NULL);

INSERT INTO "injury_types" ("code", "name", "isActive", "parentId", "deletedAt") VALUES
('INJ_06_01', 'Tổn thương mắt (Dị vật đâm thủng, hóa chất bắn vào mắt, mù lòa)', true, 6, NULL),
('INJ_06_02', 'Điếc nghề nghiệp / Chấn thương áp lực tai (Thủng màng nhĩ do tiếng nổ)', true, 6, NULL);


-- Cập nhật lại chuỗi SEQUENCE của PostgreSQL để tránh lỗi trùng ID khi chèn dữ liệu tự động sau này
SELECT setval(pg_get_serial_sequence('"injury_types"', 'id'), coalesce(max("id"), 1)) FROM "injury_types";