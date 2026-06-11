export type BusinessType = {
  id: number
  code: string
  name: string
  status: boolean
}

export const businessTypesMock: BusinessType[] = [
  { id: 1, code: '150', name: 'Doanh nghiệp tư nhân', status: true },
  { id: 2, code: '120', name: 'Công ty TNHH', status: true },
  { id: 3, code: '140', name: 'Công ty hợp danh', status: false },
  { id: 4, code: '110', name: 'Doanh nghiệp nhà nước', status: true },
  { id: 5, code: '160', name: 'Công ty cổ phần', status: true },
  { id: 6, code: '170', name: 'Hợp tác xã', status: true },
  { id: 7, code: '180', name: 'Liên hiệp hợp tác xã', status: false },
  { id: 8, code: '190', name: 'Doanh nghiệp liên doanh', status: true },
  { id: 9, code: '200', name: 'Doanh nghiệp 100% vốn nước ngoài', status: true },
  { id: 10, code: '210', name: 'Hộ kinh doanh cá thể', status: false },
  { id: 11, code: '220', name: 'Tổ hợp tác', status: true },
  { id: 12, code: '230', name: 'Doanh nghiệp xã hội', status: true },
  { id: 13, code: '240', name: 'Chi nhánh công ty nước ngoài', status: false },
  { id: 14, code: '250', name: 'Văn phòng đại diện', status: true },
  { id: 15, code: '260', name: 'Công ty TNHH một thành viên', status: true },
  { id: 16, code: '270', name: 'Công ty TNHH hai thành viên trở lên', status: true },
  { id: 17, code: '280', name: 'Doanh nghiệp tư nhân nước ngoài', status: false },
  { id: 18, code: '290', name: 'Doanh nghiệp BOT', status: true },
  { id: 19, code: '300', name: 'Doanh nghiệp BT', status: true },
  { id: 20, code: '310', name: 'Doanh nghiệp BTO', status: false },
  ...Array.from({ length: 81 }, (_, i) => ({
    id: 21 + i,
    code: String(320 + i * 10),
    name: `Loại hình kinh doanh ${21 + i}`,
    status: i % 3 !== 0,
  })),
]
