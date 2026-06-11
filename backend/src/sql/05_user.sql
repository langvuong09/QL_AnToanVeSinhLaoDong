INSERT INTO users (id, username, "fullName", password, "roleId", "doetId", status) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'superadmin', 'Quản trị viên', '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o', 4, 1, true),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'lanhdao', 'Lãnh đạo Sở', '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o', 3, null, true)
ON CONFLICT (id) DO UPDATE SET "roleId" = EXCLUDED."roleId", "fullName" = EXCLUDED."fullName";