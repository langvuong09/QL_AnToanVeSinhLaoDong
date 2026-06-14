INSERT INTO permissions (name, code, "groupPermissionId") VALUES 
-- Nhóm 1: Quản lý người dùng (Users)
('Xem danh sách người dùng', 'USER_VIEW', 1),
('Tạo mới người dùng', 'USER_CREATE', 1),
('Cập nhật thông tin người dùng', 'USER_UPDATE', 1),
('Xóa tài khoản người dùng', 'USER_DELETE', 1),

-- Nhóm 2: Quản lý hồ sơ doanh nghiệp (Doets)
('Xem danh sách doanh nghiệp', 'DOET_VIEW', 2),
('Đăng ký doanh nghiệp mới', 'DOET_CREATE', 2),
('Cập nhật hồ sơ doanh nghiệp', 'DOET_UPDATE', 2),
('Xóa dữ liệu doanh nghiệp', 'DOET_DELETE', 2),

-- Nhóm 3: Quản lý cấu hình danh mục & biểu mẫu chung
('Xem danh sách loại hình DN', 'BUSINESS_TYPE_VIEW', 3),
('Tạo mới loại hình DN', 'BUSINESS_TYPE_CREATE', 3),
('Cập nhật loại hình DN', 'BUSINESS_TYPE_UPDATE', 3),
('Xóa loại hình kinh doanh', 'BUSINESS_TYPE_DELETE', 3),

('Xem danh mục ngành nghề', 'INDUSTRY_VIEW', 3),
('Tạo mới ngành nghề', 'INDUSTRY_CREATE', 3),
('Cập nhật ngành nghề', 'INDUSTRY_UPDATE', 3),
('Xóa ngành nghề kinh doanh', 'INDUSTRY_DELETE', 3),

('Xem danh sách yếu tố chấn thương', 'TRAUMA_FACTOR_VIEW', 3),
('Tạo mới yếu tố chấn thương', 'TRAUMA_FACTOR_CREATE', 3),
('Cập nhật yếu tố chấn thương', 'TRAUMA_FACTOR_UPDATE', 3),
('Xóa yếu tố chấn thương', 'TRAUMA_FACTOR_DELETE', 3),

('Xem danh sách loại vết thương', 'INJURY_TYPE_VIEW', 3),
('Tạo mới loại vết thương', 'INJURY_TYPE_CREATE', 3),
('Cập nhật loại vết thương', 'INJURY_TYPE_UPDATE', 3),
('Xóa loại vết thương', 'INJURY_TYPE_DELETE', 3),

('Xem cấu hình kỳ báo cáo', 'REPORT_TYPE_VIEW', 3),
('Tạo mới cấu hình kỳ báo cáo', 'REPORT_TYPE_CREATE', 3),
('Cập nhật cấu hình kỳ báo cáo', 'REPORT_TYPE_UPDATE', 3),
('Xóa cấu hình kỳ báo cáo', 'REPORT_TYPE_DELETE', 3),

-- Nhóm 4: Quản lý tờ khai báo cáo Tai nạn lao động (Reports)
('Xem danh sách tờ khai báo cáo', 'REPORT_VIEW', 4),
('Khởi tạo tờ khai báo cáo mới', 'REPORT_CREATE', 4),
('Cập nhật dữ liệu tờ khai', 'REPORT_UPDATE', 4),
('Xóa tờ khai báo cáo', 'REPORT_DELETE', 4),
('Điều chuyển trạng thái duyệt báo cáo', 'REPORT_CHANGE_STATUS', 4)

ON CONFLICT (code) 
DO UPDATE SET 
    name = EXCLUDED.name, 
    "groupPermissionId" = EXCLUDED."groupPermissionId";