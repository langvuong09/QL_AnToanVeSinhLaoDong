-- =============================================
-- 1. SEED ROLES
-- =============================================
INSERT INTO roles (id, name, code) VALUES 
(1, 'Nhân viên', 'employee'),
(2, 'Chuyên viên', 'expert'),
(3, 'Lãnh đạo', 'leader'),
(4, 'Quản trị viên', 'admin'),
(5, 'Doanh nghiệp', 'business')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code;

-- =============================================
-- 2. SEED VIEWS (SIDEBAR)
-- =============================================
INSERT INTO views (id, name, url, icon, "parentId", "order") VALUES 
(1, 'Quản trị phần mềm',        '#',                        'fa-solid fa-gear',     null,   1),
(2, 'Tai nạn lao động',         '#',                        'fa-solid fa-gear',     null,   2),
(3, 'Hệ thống',                 '#',                        'fa-solid fa-gear',     null,   3),
(4, 'Quản lý người dùng',       '/accounts',                'fa-solid fa-circle',   1,      1),
(5, 'Loại hình doanh nghiệp',   '/business-types',          'fa-solid fa-circle',   1,      2),
(6, 'Ngành nghề kinh doanh',    '/business-industries',     'fa-solid fa-circle',   1,      3),
(7, 'Quản lý doanh nghiệp',     '/business-managements',    'fa-solid fa-circle',   1,      4),
(8, 'Kỳ báo cáo',               '/report-periods',          'fa-solid fa-circle',   1,      5),
(9, 'Danh mục chung',           '/categories',              'fa-solid fa-circle',   2,      1),
(10, 'TNLĐ theo HĐLĐ',          '/tnld-theo-hdld',          'fa-solid fa-circle',   2,      2),
(11, 'Thông tin doanh nghiệp',  '/business-info',           'fa-solid fa-circle',   3,      1)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, url = EXCLUDED.url, "parentId" = EXCLUDED."parentId", "order" = EXCLUDED."order", icon = EXCLUDED.icon;

-- =============================================
-- 3. MAPPING VIEW - PERMISSIONS
-- =============================================
INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 4, id FROM permissions WHERE code IN ('USER_VIEW', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE') ON CONFLICT DO NOTHING;

INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 5, id FROM permissions WHERE code IN ('BUSINESS_TYPE_VIEW', 'BUSINESS_TYPE_CREATE', 'BUSINESS_TYPE_UPDATE', 'BUSINESS_TYPE_DELETE') ON CONFLICT DO NOTHING;

INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 6, id FROM permissions WHERE code IN ('INDUSTRY_VIEW', 'INDUSTRY_CREATE', 'INDUSTRY_UPDATE', 'INDUSTRY_DELETE') ON CONFLICT DO NOTHING;

INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 7, id FROM permissions WHERE code IN ('DOET_VIEW', 'DOET_CREATE', 'DOET_UPDATE', 'DOET_DELETE', 'BUSINESS_TYPE_VIEW', 'INDUSTRY_VIEW') ON CONFLICT DO NOTHING;

INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 8, id FROM permissions WHERE code IN ('REPORT_TYPE_VIEW', 'REPORT_TYPE_CREATE', 'REPORT_TYPE_UPDATE', 'REPORT_TYPE_DELETE') ON CONFLICT DO NOTHING;

INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 9, id FROM permissions WHERE code IN ('TRAUMA_FACTOR_VIEW', 'TRAUMA_FACTOR_CREATE', 'TRAUMA_FACTOR_UPDATE', 'TRAUMA_FACTOR_DELETE', 'INJURY_TYPE_VIEW', 'INJURY_TYPE_CREATE', 'INJURY_TYPE_UPDATE', 'INJURY_TYPE_DELETE', 'ACCIDENT_CAUSE_VIEW', 'JOB_VIEW') ON CONFLICT DO NOTHING;

INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 10, id FROM permissions WHERE code IN ('REPORT_VIEW', 'REPORT_CREATE', 'REPORT_UPDATE', 'REPORT_DELETE', 'REPORT_CHANGE_STATUS') ON CONFLICT DO NOTHING;

INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 11, id FROM permissions WHERE code IN ('DOET_VIEW', 'DOET_UPDATE') ON CONFLICT DO NOTHING;

-- =============================================
-- 4. MAPPING ROLE - PERMISSIONS (CẤP QUYỀN SIDEBAR)
-- =============================================

-- Làm sạch bảng mapping trước khi nạp lại để tránh sót quyền cũ
DELETE FROM role_permissions;

-- Role 4: Admin — Toàn quyền hệ thống
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 4, id FROM permissions ON CONFLICT DO NOTHING;

-- Role 3: Lãnh đạo — Xem + duyệt (Đã sửa lỗi thiếu dấu phẩy)
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 3, id FROM permissions
WHERE code IN (
    'USER_VIEW', 'DOET_VIEW', 'REPORT_VIEW', 'BUSINESS_TYPE_VIEW', 
    'INDUSTRY_VIEW', 'TRAUMA_FACTOR_VIEW', 'INJURY_TYPE_VIEW', 'REPORT_TYPE_VIEW'
) ON CONFLICT DO NOTHING;

-- Role 2: Chuyên viên — Xử lý hồ sơ (ĐÃ BỎ USER_VIEW VÀ USER_UPDATE)
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 2, id FROM permissions
WHERE code IN (
    'DOET_VIEW', 'DOET_UPDATE',
    'REPORT_VIEW', 'REPORT_UPDATE',
    'BUSINESS_TYPE_VIEW', 'INDUSTRY_VIEW', 'TRAUMA_FACTOR_VIEW', 'INJURY_TYPE_VIEW', 'JOB_VIEW', 'ACCIDENT_CAUSE_VIEW'
) ON CONFLICT DO NOTHING;

-- Role 1: Nhân viên — Chỉ xem dữ liệu cơ bản
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 1, id FROM permissions
WHERE code IN ('DOET_VIEW') ON CONFLICT DO NOTHING;

-- Role 5: Doanh nghiệp — Quản lý hồ sơ & báo cáo nội bộ
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 5, id FROM permissions 
WHERE code IN (
    'DOET_VIEW', 'DOET_UPDATE',
    'REPORT_VIEW', 'REPORT_CREATE', 'REPORT_UPDATE', 'REPORT_DELETE',
    'BUSINESS_TYPE_VIEW', 'INDUSTRY_VIEW', 'TRAUMA_FACTOR_VIEW', 'INJURY_TYPE_VIEW', 'REPORT_TYPE_VIEW'
) ON CONFLICT DO NOTHING;