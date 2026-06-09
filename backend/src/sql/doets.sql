insert into doets (id, name, "parentId", phone, address, quarter, ward, district, province, domain)
values (1, 'Sở Thương binh và Lao động TPHCM', null, '0988890989', '1234/1', 'tổ 9', '{"key": 7, "value": "Trung an"}', '{"key": 1, "value": "Củ chi"}', '{"key": 2, "value": "TPHCM"}', 'admin-dev.rcp.com.vn')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, "parentId" = EXCLUDED."parentId", phone = EXCLUDED.phone, address = EXCLUDED.address, quarter = EXCLUDED.quarter, ward = EXCLUDED.ward, district = EXCLUDED.district, province = EXCLUDED.province, domain = EXCLUDED.domain;

insert into doets (id, name, "parentId", phone, address, quarter, ward, district, province  )
values (2, 'Phòng Thương binh và Lao động Quận 1', 1, '0988890989', '1234/1', 'tổ 9', '{"key": 8, "value": "Phường 1"}', '{"key": 4, "value": "Quận 1"}', '{"key": 2, "value": "TPHCM"}')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, "parentId" = EXCLUDED."parentId", phone = EXCLUDED.phone, address = EXCLUDED.address, quarter = EXCLUDED.quarter, ward = EXCLUDED.ward, district = EXCLUDED.district, province = EXCLUDED.province;

insert into doets (id, name, "parentId", phone, address, quarter, ward, district, province  )
values (3, 'Phòng Thương binh và Lao động Quận 2', 1, '0988890989', '1234/1', 'tổ 9', '{"key": 9, "value": "Phường 2"}', '{"key": 5, "value": "Quận 2"}', '{"key": 2, "value": "TPHCM"}')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, "parentId" = EXCLUDED."parentId", phone = EXCLUDED.phone, address = EXCLUDED.address, quarter = EXCLUDED.quarter, ward = EXCLUDED.ward, district = EXCLUDED.district, province = EXCLUDED.province;

insert into doets (id, name, "parentId", phone, address, quarter, ward, district, province  )
values (4, 'Phòng Thương binh và Lao động Quận 3', 1, '0988890989', '1234/1', 'tổ 9', '{"key": 10, "value": "Phường 3"}',  '{"key": 6, "value": "Quận 3"}', '{"key": 2, "value": "TPHCM"}')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, "parentId" = EXCLUDED."parentId", phone = EXCLUDED.phone, address = EXCLUDED.address, quarter = EXCLUDED.quarter, ward = EXCLUDED.ward, district = EXCLUDED.district, province = EXCLUDED.province;

insert into doets (id, name, "parentId", phone, address, quarter, ward, district, province  )
values (5, 'Phòng Thương binh và Lao động Quận 4', 1, '0988890989', '1234/1', 'tổ 9', '{"key": 11, "value": "Phường 4"}', '{"key": 7, "value": "Quận 4"}', '{"key": 2, "value": "TPHCM"}' )
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, "parentId" = EXCLUDED."parentId", phone = EXCLUDED.phone, address = EXCLUDED.address, quarter = EXCLUDED.quarter, ward = EXCLUDED.ward, district = EXCLUDED.district, province = EXCLUDED.province;
