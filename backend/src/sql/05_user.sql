INSERT INTO users (
  id,
  username,
  "fullName",
  password,
  "roleId",
  "doetId",
  status,
  email,
  position
) VALUES 
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'superadmin',
  'Quản trị viên',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  4,
  NULL,
  true,
  'superadmin@gmail.com',
  'Quản trị hệ thống'
),
(
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  'lanhdao',
  'Tran Cao Lanh',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  3,
  NULL,
  true,
  'cuongcaotien9a@gmail.com',
  'Lãnh đạo Sở'
),
(
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  'chuyenvien',
  'Nguyễn Văn A',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  2,
  NULL,
  true,
  'chuyenvien@gmail.com',
  'Chuyên viên'
),
(
  'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
  'nhanvien',
  'Trần Thị B',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  1,
  NULL,
  true,
  'nhanvien@gmail.com',
  'Nhân viên'
)
ON CONFLICT (id)
DO UPDATE SET
  "roleId" = EXCLUDED."roleId",
  "fullName" = EXCLUDED."fullName",
  "email" = EXCLUDED."email",
  "position" = EXCLUDED."position",
  "doetId" = EXCLUDED."doetId",
  "status" = EXCLUDED."status";