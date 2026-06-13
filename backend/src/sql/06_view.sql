INSERT INTO views (id, name, url, icon, "parentId", "order") VALUES 
(1, 'Quản trị phần mềm', '#', 'setting-icon', null, 1),
(5, 'Tai nạn lao động', '#', 'hazard-icon', null, 2),
(2, 'Quản lý người dùng', '/users', 'user-icon', 1, 1),
(3, 'Quản lý doanh nghiệp', '/doets', 'briefcase-icon', 1, 2),
(4, 'Kỳ báo cáo', '/report-periods', 'calendar-icon', 1, 3),
(6, 'Danh mục chung', '/categories', 'list-icon', 5, 1),
(7, 'TNLĐ theo HĐLĐ', '/tnld-hdld', 'file-text-icon', 5, 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, url = EXCLUDED.url, "parentId" = EXCLUDED."parentId", "order" = EXCLUDED."order";

INSERT INTO view_permissions ("viewId", "permissionId") VALUES (2, 1), (3, 2)
ON CONFLICT DO NOTHING;

WITH all_current_permissions AS (
    SELECT id AS permission_id 
    FROM permissions 
    WHERE code IN (
        'USER_VIEW', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE',
        'DOET_VIEW', 'DOET_CREATE', 'DOET_UPDATE', 'DOET_DELETE',
        'BUSINESS_TYPE_VIEW', 'BUSINESS_TYPE_CREATE', 'BUSINESS_TYPE_UPDATE', 'BUSINESS_TYPE_DELETE',
        'INDUSTRY_VIEW', 'INDUSTRY_CREATE', 'INDUSTRY_UPDATE', 'INDUSTRY_DELETE'
    )
)
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 4, permission_id 
FROM all_current_permissions
ON CONFLICT ("roleId", "permissionId") DO NOTHING;