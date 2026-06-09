insert into views (id, name, activities, url, icon, "parentId", doet_id, "order")
values (1, 'Dashboard', '[{"roleId": 1, "get": true}, {"roleId": 4, "get": true, "create": true, "update": true, "delete": true}]', '/dashboard', 'dashboard-icon', null, null, 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, activities = EXCLUDED.activities, url = EXCLUDED.url, icon = EXCLUDED.icon, "parentId" = EXCLUDED."parentId", doet_id = EXCLUDED.doet_id, "order" = EXCLUDED."order";

insert into views (id, name, activities, url, icon, "parentId", doet_id, "order")
values (2, 'Quản lý người dùng', '[{"roleId": 4, "get": true, "create": true, "update": true, "delete": true}]', '/users', 'user-icon', null, null, 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, activities = EXCLUDED.activities, url = EXCLUDED.url, icon = EXCLUDED.icon, "parentId" = EXCLUDED."parentId", doet_id = EXCLUDED.doet_id, "order" = EXCLUDED."order";

insert into views (id, name, activities, url, icon, "parentId", doet_id, "order")
values (3, 'Cấu hình hệ thống', '[{"roleId": 4, "get": true, "update": true}]', '/settings', 'setting-icon', null, null, 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, activities = EXCLUDED.activities, url = EXCLUDED.url, icon = EXCLUDED.icon, "parentId" = EXCLUDED."parentId", doet_id = EXCLUDED.doet_id, "order" = EXCLUDED."order";
