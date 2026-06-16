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
),
-- Business enterprise users mapping to seeded doets
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380010',
  '0312345678',
  'Công ty Cổ phần Công nghệ Sao Việt',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  10,
  true,
  'contact@saoviet.com.vn',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380011',
  '0323456789',
  'Công ty TNHH Giải pháp Phần mềm Mekong',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  11,
  true,
  'info@mekongsoft.vn',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380012',
  '0103456789',
  'Công ty TNHH Xây dựng Minh Phát',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  12,
  true,
  'contact@minhphatcon.com',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380013',
  '0104567890',
  'Công ty Cổ phần Logistics Đông Dương',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  13,
  true,
  'hello@indochinalogistics.vn',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380014',
  '0405678901',
  'Công ty TNHH Giáo dục Tri Thức Việt',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  14,
  true,
  'tuyensinh@trithucviet.edu.vn',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380015',
  '3706789012',
  'Công ty Cổ phần Du lịch Biển Xanh',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  15,
  true,
  'booking@bluesea.vn',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380016',
  '3607890123',
  'Công ty TNHH Nông nghiệp Công nghệ cao An Phú',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  16,
  true,
  'farm@anphuhitech.com',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380017',
  '0308901234',
  'Công ty TNHH Thương mại Thành Công',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  17,
  true,
  'sales@thanhcongtrade.com',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380018',
  '0109012345',
  'Công ty Cổ phần Y tế Hòa Bình',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  18,
  true,
  'contact@hoabinhmed.vn',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380019',
  '3500123456',
  'Doanh nghiệp tư nhân Minh Tâm',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  19,
  true,
  'minhtamco@gmail.com',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380020',
  '0101230001',
  'Công ty Hợp danh Luật và Cộng sự Việt Nam',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  20,
  true,
  'lawyers@vietnamassociates.vn',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380021',
  '0301230002',
  'Công ty Cổ phần Năng lượng xanh Ban Mai',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  21,
  true,
  'solars@banmaigreen.com',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380022',
  '0201230003',
  'Công ty TNHH Thực phẩm và Nông sản Việt',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  22,
  true,
  'factory@vietagrifoods.com.vn',
  'Doanh nghiệp'
),
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380023',
  '0301230004',
  'Công ty TNHH May mặc Hùng Cường',
  '$argon2id$v=19$m=65536,t=3,p=4$jcZYnh86gnd3u3ZhsFDjDQ$j/JnxLj/3q9b88n0jYMzaDOKJL+sm7ssw2/LRxz4h9o',
  5,
  23,
  true,
  'garment@hungcuongtextile.com',
  'Doanh nghiệp'
)
ON CONFLICT (id)
DO UPDATE SET
  "roleId" = EXCLUDED."roleId",
  "fullName" = EXCLUDED."fullName",
  "email" = EXCLUDED."email",
  "position" = EXCLUDED."position",
  "doetId" = EXCLUDED."doetId",
  "status" = EXCLUDED."status";