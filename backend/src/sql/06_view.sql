INSERT INTO views (id, name, url, icon, "parentId", "order") VALUES 
(1, 'Quản trị phần mềm', '#', 'setting-icon', null, 1),
(5, 'Tai nạn lao động', '#', 'hazard-icon', null, 2),
(8, 'Hệ thống', '#', 'setting-icon', null, 3),

(2, 'Quản lý người dùng', '/users', 'user-icon', 1, 1),
(3, 'Quản lý doanh nghiệp', '/doets', 'briefcase-icon', 1, 2),
(4, 'Kỳ báo cáo', '/report-periods', 'calendar-icon', 1, 3),

(6, 'Danh mục chung', '/categories', 'list-icon', 5, 1),
(7, 'TNLĐ theo HĐLĐ', '/tnld-hdld', 'file-text-icon', 5, 2),

(9, 'Thông tin doanh nghiệp', '/business-info', 'building-icon', 8, 1)

ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, 
    url = EXCLUDED.url, 
    "parentId" = EXCLUDED."parentId", 
    "order" = EXCLUDED."order",
    icon = EXCLUDED.icon;


--- =======================================================================
--- 4. LIÊN KẾT VIEW VÀ QUYỀN TRUY CẬP TRÊN GIAO DIỆN (Bảng view_permissions)
--- =======================================================================

-- 🟢 VIEW 2: Quản lý người dùng (Có FULL quyền về USER)
INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 2, id FROM permissions 
WHERE code IN ('USER_VIEW', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE')
ON CONFLICT DO NOTHING;


-- 🟢 VIEW 3: Quản lý doanh nghiệp (Có FULL quyền về DOET, INDUSTRY, BUSINESS_TYPE)
INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 3, id FROM permissions 
WHERE code IN (
    'DOET_VIEW', 'DOET_CREATE', 'DOET_UPDATE', 'DOET_DELETE',
    'INDUSTRY_VIEW', 'INDUSTRY_CREATE', 'INDUSTRY_UPDATE', 'INDUSTRY_DELETE',
    'BUSINESS_TYPE_VIEW', 'BUSINESS_TYPE_CREATE', 'BUSINESS_TYPE_UPDATE', 'BUSINESS_TYPE_DELETE'
)
ON CONFLICT DO NOTHING;


-- 🟢 VIEW 4: Kỳ báo cáo (Có các quyền về REPORT_TYPE)
INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 4, id FROM permissions 
WHERE code IN ('REPORT_TYPE_VIEW', 'REPORT_TYPE_CREATE', 'REPORT_TYPE_UPDATE', 'REPORT_TYPE_DELETE')
ON CONFLICT DO NOTHING;


-- 🟢 VIEW 6: Danh mục chung (Có các quyền về TRAUMA, INJURY, DOET, BUSINESS_TYPE)
INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 6, id FROM permissions 
WHERE code IN (
    'TRAUMA_FACTOR_VIEW', 'TRAUMA_FACTOR_CREATE', 'TRAUMA_FACTOR_UPDATE', 'TRAUMA_FACTOR_DELETE',
    'INJURY_TYPE_VIEW', 'INJURY_TYPE_CREATE', 'INJURY_TYPE_UPDATE', 'INJURY_TYPE_DELETE',
    'DOET_VIEW', 'BUSINESS_TYPE_VIEW'
)
ON CONFLICT DO NOTHING;


-- 🟢 VIEW 7: TNLĐ theo HĐLĐ (Có các quyền về DOET, REPORT, REPORT_TYPE, INJURY, TRAUMA, INDUSTRY, BUSINESS_TYPE)
INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 7, id FROM permissions 
WHERE code IN (
    'DOET_VIEW', 'DOET_CREATE', 'DOET_UPDATE', 'DOET_DELETE',
    'REPORT_VIEW', 'REPORT_CREATE', 'REPORT_UPDATE', 'REPORT_DELETE', 'REPORT_CHANGE_STATUS',
    'REPORT_TYPE_VIEW',
    'INJURY_TYPE_VIEW',
    'TRAUMA_FACTOR_VIEW',
    'INDUSTRY_VIEW',
    'BUSINESS_TYPE_VIEW'
)
ON CONFLICT DO NOTHING;


-- 🟢 VIEW 9: Thông tin doanh nghiệp (Doanh nghiệp tự xem/sửa hồ sơ của mình qua JWT)
INSERT INTO view_permissions ("viewId", "permissionId")
SELECT 9, id FROM permissions 
WHERE code IN ('DOET_VIEW', 'DOET_UPDATE')
ON CONFLICT DO NOTHING;


--- =======================================================================
--- 5. CẤP FULL QUYỀN CHO CÁC VAI TRÒ NỘI BỘ (Roles: 1, 2, 3, 4)
--- Bao gồm: Nhân viên, Chuyên viên, Lãnh đạo và Quản trị viên hệ thống
--- =======================================================================
WITH all_permissions AS (
    SELECT id AS permission_id FROM permissions
),
target_roles AS (
    SELECT unnest(ARRAY[1, 2, 3, 4]) AS role_id
)
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT target_roles.role_id, all_permissions.permission_id 
FROM target_roles, all_permissions
ON CONFLICT ("roleId", "permissionId") DO NOTHING;


--- =======================================================================
--- 6. PHÂN QUYỀN GIỚI HẠN & ĐẶC THÙ CHO DOANH NGHIỆP (Role 5 - business)
--- Đầy đủ thao tác với DOET, REPORT và chỉ được XEM (VIEW) các danh mục phục vụ điền Form
--- =======================================================================
WITH business_allowed_permissions AS (
    SELECT id AS permission_id 
    FROM permissions 
    WHERE code IN (
        -- Quyền xử lý hồ sơ doanh nghiệp của chính họ
        'DOET_VIEW', 'DOET_CREATE', 'DOET_UPDATE', 'DOET_DELETE',
        
        -- Quyền tương tác, tạo nháp, cập nhật, gửi và duyệt quy trình trạng thái báo cáo
        'REPORT_VIEW', 'REPORT_CREATE', 'REPORT_UPDATE', 'REPORT_DELETE', 'REPORT_CHANGE_STATUS',
        
        -- Chỉ cấu hình quyền VIEW (XEM) danh mục cấu hình để load dữ liệu dropdown select khi khai báo form
        'BUSINESS_TYPE_VIEW',
        'INDUSTRY_VIEW',
        'TRAUMA_FACTOR_VIEW',
        'INJURY_TYPE_VIEW',
        'REPORT_TYPE_VIEW'
    )
)
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 5, permission_id 
FROM business_allowed_permissions
ON CONFLICT ("roleId", "permissionId") DO NOTHING;