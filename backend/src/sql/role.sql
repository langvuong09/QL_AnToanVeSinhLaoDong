insert into roles (id, role, name, type, status)
values (1, 'employee', 'Nhân viên', 'DEFAULT', true)
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, name = EXCLUDED.name, type = EXCLUDED.type, status = EXCLUDED.status;

insert into roles (id, role, name, type, status)
values (2, 'expert', 'Chuyên viên', 'DEFAULT', true)
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, name = EXCLUDED.name, type = EXCLUDED.type, status = EXCLUDED.status;

insert into roles (id, role, name, type, status)
values (3, 'leader', 'Lãnh đạo', 'DEFAULT', true)
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, name = EXCLUDED.name, type = EXCLUDED.type, status = EXCLUDED.status;

insert into roles (id, role, name, type, status)
values (4, 'superAdmin', 'Quản trị viên', 'SYSTEM', true)
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, name = EXCLUDED.name, type = EXCLUDED.type, status = EXCLUDED.status;