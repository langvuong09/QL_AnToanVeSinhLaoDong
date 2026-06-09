insert into users (username, "fullName", password, "realRole", "roleId", status, email)
values ('nhanvien', 'Nhân viên', '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o', 'Nhân viên bảo vệ', 1, true, 'nhanvien@example.com')
ON CONFLICT (username) DO UPDATE SET "fullName" = EXCLUDED."fullName", password = EXCLUDED.password, "realRole" = EXCLUDED."realRole", "roleId" = EXCLUDED."roleId", status = EXCLUDED.status, email = EXCLUDED.email;

insert into users (username, "fullName", password, "realRole", "roleId", status, email)
values ('chuyenvien', 'Chuyên viên', '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o', 'Chuyên viên kiki', 2, true, 'chuyenvien@example.com')
ON CONFLICT (username) DO UPDATE SET "fullName" = EXCLUDED."fullName", password = EXCLUDED.password, "realRole" = EXCLUDED."realRole", "roleId" = EXCLUDED."roleId", status = EXCLUDED.status, email = EXCLUDED.email;

insert into users (username, "fullName", password, "realRole", "roleId", status, email)
values ('lanhdao', 'Lãnh đạo', '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o', null, 3, true, 'lanhdao@example.com')
ON CONFLICT (username) DO UPDATE SET "fullName" = EXCLUDED."fullName", password = EXCLUDED.password, "realRole" = EXCLUDED."realRole", "roleId" = EXCLUDED."roleId", status = EXCLUDED.status, email = EXCLUDED.email;

insert into users (username, "fullName", password, "realRole", "roleId", status, email)
values ('superadmin', 'Quản trị viên', '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o', null, 4, true, 'superadmin@example.com')
ON CONFLICT (username) DO UPDATE SET "fullName" = EXCLUDED."fullName", password = EXCLUDED.password, "realRole" = EXCLUDED."realRole", "roleId" = EXCLUDED."roleId", status = EXCLUDED.status, email = EXCLUDED.email;
