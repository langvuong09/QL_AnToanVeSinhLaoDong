INSERT INTO doets (
    id, 
    name, 
    "taxCode", 
    "issuedDate", 
    "businessTypeId", 
    "industryId", 
    "createdAt", 
    "updatedAt"
) VALUES 
(1, 'Sở Thương binh và Lao động TPHCM', 'TAX001', '2026-01-01', 1, 1, NOW(), NOW()),
(2, 'Phòng TBLĐ Quận 1', 'TAX002', '2026-01-01', 1, 1, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    "taxCode" = EXCLUDED."taxCode",
    "updatedAt" = NOW();