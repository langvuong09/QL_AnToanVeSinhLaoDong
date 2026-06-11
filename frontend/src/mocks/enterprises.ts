export type Enterprise = {
  id: number
  companyName: string
  taxCode: string
  businessType: string
  industry: string
  ward: string
  status: boolean
  foreignName: string
  email: string
  phone: string
  gpkdDate: string
  gpkdProvince: string
  gpkdWard: string
  address: string
  businessProvince: string
  businessWard: string
  businessAddress: string
  representative: string
  representativePhone: string
}

export type AttachmentFile = {
  id: number
  fileName: string
  fileInfo: string
}

export const enterprisesMock: Enterprise[] = [
  {
    id: 1,
    companyName: 'Công ty TNHH Dệt An Lạc Tây',
    taxCode: '7689972839',
    businessType: 'Doanh nghiệp tư nhân',
    industry: 'Trồng cây thuốc lá, thuốc lào',
    ward: 'Phường Bình Thọ',
    status: true,
    foreignName: 'An Lac Tay Textile Co., Ltd',
    email: 'anlactay@gmail.com',
    phone: '0281234567',
    gpkdDate: '15/03/2018',
    gpkdProvince: 'Thành phố Hồ Chí Minh',
    gpkdWard: 'Phường Bình Thọ',
    address: '123 Đường Kha Vạn Cân, Thủ Đức',
    businessProvince: 'Thành phố Hồ Chí Minh',
    businessWard: 'Phường Bình Thọ',
    businessAddress: '123 Đường Kha Vạn Cân, Thủ Đức',
    representative: 'Nguyễn Văn An',
    representativePhone: '0932768093',
  },
  {
    id: 2,
    companyName: 'Công ty TNHH Dệt An Lạc Tây',
    taxCode: '7689972839',
    businessType: 'Doanh nghiệp tư nhân',
    industry: 'Trồng cây thuốc lá, thuốc lào',
    ward: 'Phường Bình Thọ',
    status: true,
    foreignName: 'An Lac Tay Textile Co., Ltd',
    email: 'anlactay2@gmail.com',
    phone: '0281234568',
    gpkdDate: '20/05/2019',
    gpkdProvince: 'Thành phố Hồ Chí Minh',
    gpkdWard: 'Phường Bình Thọ',
    address: '456 Đường Võ Văn Ngân, Thủ Đức',
    businessProvince: 'Thành phố Hồ Chí Minh',
    businessWard: 'Phường Bình Thọ',
    businessAddress: '456 Đường Võ Văn Ngân, Thủ Đức',
    representative: 'Trần Thị Bình',
    representativePhone: '0912345678',
  },
  {
    id: 3,
    companyName: 'Công ty TNHH Dệt An Lạc Tây',
    taxCode: '7689972839',
    businessType: 'Doanh nghiệp tư nhân',
    industry: 'Trồng cây thuốc lá, thuốc lào',
    ward: 'Phường Bình Thọ',
    status: false,
    foreignName: 'An Lac Tay Group',
    email: 'group@anlactay.vn',
    phone: '0281234569',
    gpkdDate: '10/01/2020',
    gpkdProvince: 'Thành phố Hồ Chí Minh',
    gpkdWard: 'Phường Tân Định',
    address: '789 Đường Điện Biên Phủ, Quận 3',
    businessProvince: 'Thành phố Hồ Chí Minh',
    businessWard: 'Phường Tân Định',
    businessAddress: '789 Đường Điện Biên Phủ, Quận 3',
    representative: 'Lê Văn Cường',
    representativePhone: '0987654321',
  },
  {
    id: 4,
    companyName: 'Công ty TNHH Dệt An Lạc Tây',
    taxCode: '7689972839',
    businessType: 'Doanh nghiệp tư nhân',
    industry: 'Trồng cây thuốc lá, thuốc lào',
    ward: 'Phường Bình Thọ',
    status: true,
    foreignName: 'An Lac Tay Trading',
    email: 'trading@anlactay.vn',
    phone: '0281234570',
    gpkdDate: '05/07/2017',
    gpkdProvince: 'Thành phố Hồ Chí Minh',
    gpkdWard: 'Phường Hiệp Bình Phước',
    address: '162 đường số 2, khu đô thị Vạn Phúc',
    businessProvince: 'Thành phố Hồ Chí Minh',
    businessWard: 'Phường Hiệp Bình Phước',
    businessAddress: '162 đường số 2, khu đô thị Vạn Phúc',
    representative: 'Phạm Thị Dung',
    representativePhone: '0909123456',
  },
  {
    id: 5,
    companyName: 'Công ty TNHH Dệt An Lạc Tây',
    taxCode: '7689972839',
    businessType: 'Doanh nghiệp tư nhân',
    industry: 'Trồng cây thuốc lá, thuốc lào',
    ward: 'Phường Bình Thọ',
    status: true,
    foreignName: 'An Lac Tay Export',
    email: 'export@anlactay.vn',
    phone: '0281234571',
    gpkdDate: '12/09/2021',
    gpkdProvince: 'Thành phố Hồ Chí Minh',
    gpkdWard: 'Phường Bình Thọ',
    address: '55 Đường Phạm Văn Đồng, Thủ Đức',
    businessProvince: 'Thành phố Hồ Chí Minh',
    businessWard: 'Phường Bình Thọ',
    businessAddress: '55 Đường Phạm Văn Đồng, Thủ Đức',
    representative: 'Hoàng Văn Em',
    representativePhone: '0933456789',
  },
  {
    id: 6,
    companyName: 'Công ty TNHH Dệt An Lạc Tây',
    taxCode: '7689972839',
    businessType: 'Doanh nghiệp tư nhân',
    industry: 'Trồng cây thuốc lá, thuốc lào',
    ward: 'Phường Bình Thọ',
    status: true,
    foreignName: 'An Lac Tay Logistics',
    email: 'logistics@anlactay.vn',
    phone: '0281234572',
    gpkdDate: '01/11/2022',
    gpkdProvince: 'Thành phố Hồ Chí Minh',
    gpkdWard: 'Phường Bình Thọ',
    address: '88 Đường Lê Văn Việt, Quận 9',
    businessProvince: 'Thành phố Hồ Chí Minh',
    businessWard: 'Phường Bình Thọ',
    businessAddress: '88 Đường Lê Văn Việt, Quận 9',
    representative: 'Vũ Thị Phương',
    representativePhone: '0911222333',
  },
  ...Array.from({ length: 44 }, (_, i) => ({
    id: 7 + i,
    companyName: `Công ty ${['TNHH', 'Cổ phần', 'Hợp danh'][i % 3]} ${['Thành Đạt', 'Phú Quý', 'An Khang', 'Hưng Thịnh', 'Minh Phát'][i % 5]} ${i + 7}`,
    taxCode: `${3100000000 + i * 1111}`,
    businessType: ['Doanh nghiệp tư nhân', 'Công ty TNHH', 'Công ty cổ phần', 'Hợp tác xã'][i % 4],
    industry: ['Trồng cây thuốc lá, thuốc lào', 'Khai thác than cứng', 'Sản xuất chế biến thực phẩm', 'Xây dựng nhà các loại', 'Vận tải đường bộ'][i % 5],
    ward: ['Phường Bình Thọ', 'Phường Tân Định', 'Phường Hiệp Bình Phước', 'Phường Linh Trung', 'Phường Tam Bình'][i % 5],
    status: i % 4 !== 0,
    foreignName: `Company ${i + 7}`,
    email: `company${i + 7}@example.com`,
    phone: `028${1000000 + i}`,
    gpkdDate: `${String((i % 28) + 1).padStart(2, '0')}/${String((i % 12) + 1).padStart(2, '0')}/20${18 + (i % 6)}`,
    gpkdProvince: 'Thành phố Hồ Chí Minh',
    gpkdWard: ['Phường Bình Thọ', 'Phường Tân Định', 'Phường Hiệp Bình Phước'][i % 3],
    address: `${100 + i} Đường ABC, Quận ${(i % 12) + 1}`,
    businessProvince: 'Thành phố Hồ Chí Minh',
    businessWard: ['Phường Bình Thọ', 'Phường Tân Định', 'Phường Hiệp Bình Phước'][i % 3],
    businessAddress: `${100 + i} Đường ABC, Quận ${(i % 12) + 1}`,
    representative: `Người đại diện ${i + 7}`,
    representativePhone: `09${10000000 + i * 111}`,
  })),
]
