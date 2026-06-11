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
]
