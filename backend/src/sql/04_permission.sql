--- =======================================================================
--- 1. CHÈN TOÀN BỘ DANH SÁCH QUYỀN TỪ ENUM (Bảng permissions)
--- =======================================================================
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

-- Nhóm 3: Quản lý Loại hình kinh doanh (Business Types)
('Xem danh sách loại hình DN', 'BUSINESS_TYPE_VIEW', 3),
('Tạo mới loại hình DN', 'BUSINESS_TYPE_CREATE', 3),
('Cập nhật loại hình DN', 'BUSINESS_TYPE_UPDATE', 3),
('Xóa loại hình kinh doanh', 'BUSINESS_TYPE_DELETE', 3),

-- Nhóm 3: Quản lý Danh mục Ngành nghề (Industries)
('Xem danh mục ngành nghề', 'INDUSTRY_VIEW', 3),
('Tạo mới ngành nghề', 'INDUSTRY_CREATE', 3),
('Cập nhật ngành nghề', 'INDUSTRY_UPDATE', 3),
('Xóa ngành nghề kinh doanh', 'INDUSTRY_DELETE', 3)

ON CONFLICT (code) 
DO UPDATE SET 
    name = EXCLUDED.name, 
    "groupPermissionId" = EXCLUDED."groupPermissionId";
