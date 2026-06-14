INSERT INTO group_permissions (id, name, code) VALUES 
(1, 'Quản lý hệ thống & Người dùng', 'SYSTEM_USER'),
(2, 'Quản lý hồ sơ doanh nghiệp', 'DOET_MANAGEMENT'),
(3, 'Quản lý danh mục & Biểu mẫu', 'CATEGORY_CONFIG'),
(4, 'Quản lý tờ khai & Báo cáo', 'REPORT_WORKFLOW')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code;