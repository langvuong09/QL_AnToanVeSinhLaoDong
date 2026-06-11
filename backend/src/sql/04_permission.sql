INSERT INTO permissions (id, name, code, "groupPermissionId") VALUES 
(1, 'Xem danh sách người dùng', 'USER_VIEW', 1),
(2, 'Quản lý doanh nghiệp', 'DOET_MANAGE', 1)
ON CONFLICT (id) DO NOTHING;