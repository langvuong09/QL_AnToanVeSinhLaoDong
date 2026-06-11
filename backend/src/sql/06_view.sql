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

INSERT INTO role_permissions ("roleId", "permissionId") VALUES (4, 1), (4, 2)
ON CONFLICT DO NOTHING;