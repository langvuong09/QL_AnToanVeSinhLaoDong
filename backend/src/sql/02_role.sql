INSERT INTO roles (id, name, code) VALUES 
(1, 'Nhân viên', 'employee'),
(2, 'Chuyên viên', 'expert'),
(3, 'Lãnh đạo', 'leader'),
(4, 'Quản trị viên', 'admin'),
(5, 'Doanh nghiệp', 'business')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, code = EXCLUDED.code;