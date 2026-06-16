'use client'

import { useState, useMemo, useRef } from 'react'
import * as XLSX from 'xlsx'
import { DoetApi, type DoetPayload } from '@/src/api/Doet'
import type { IBusinessType } from '@/src/api/BusinessType'
import type { IIndustry } from '@/src/api/Industry'
import { OpenAdress } from '@/src/services/open-address'

type Props = {
  isOpen: boolean
  onClose: () => void
  businessTypes: IBusinessType[]
  industries: IIndustry[]
  onSuccess: () => void
}

type ParsedRow = {
  id: string // Client-side unique id for deleting/updating rows
  companyName: string
  taxCode: string
  businessTypeStr: string
  businessTypeId: number | null
  industryStr: string
  industryId: number | null
  gpkdDate: string
  gpkdProvinceStr: string
  gpkdProvinceData: { key: number; value: string } | null
  gpkdWardStr: string
  gpkdWardData: { key: number; value: string } | null
  address: string
  foreignName: string
  email: string
  phone: string
  representative: string
  representativePhone: string
  statusStr: string
  status: boolean
  errors: string[]
  isValid: boolean
}

type ImportResult = {
  total: number
  valid: number
  successCount: number
  failedCount: number
  errors: string[]
}

const TAX_CODE_REGEX = /^(?:\d{10}|\d{10}-\d{3}|\d{13})$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VN_PHONE_REGEX = /^(?:\+84|84|0)(?:[35789]\d{8}|2\d{9})$/

function normalizeName(name: string): string {
  if (!name) return ''
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/^(tinh|thanh pho|phuong|xa|quan|huyen|thi xa|thi tran)\s+/g, '') // Remove prefix
    .trim()
}

export default function EnterpriseImportModal({
  isOpen,
  onClose,
  businessTypes,
  industries,
  onSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const level4Industries = useMemo(() => industries.filter((ind) => ind.level === 4), [industries])

  if (!isOpen) return null

  // --- Dynamic File Generator ---
  const downloadSampleValid = () => {
    const data = [
      {
        'Tên doanh nghiệp': 'Công ty Cổ phần Công nghệ Sao Việt',
        'Mã số thuế': '0312345678',
        'Loại hình doanh nghiệp': 'Công ty cổ phần',
        'Ngành nghề kinh doanh': 'Lập trình máy vi tính',
        'Ngày thành lập': '2015-06-12',
        'Tỉnh/Thành phố ĐKKD': 'Thành phố Hồ Chí Minh',
        'Phường/Xã ĐKKD': 'Phường Thủ Dầu Một',
        'Địa chỉ ĐKKD': 'Tòa nhà Landmark 81, Phường 22, Bình Thạnh',
        'Tên tiếng nước ngoài': 'Sao Viet Technology Joint Stock Company',
        'Email': 'contact@saoviet.com.vn',
        'Số điện thoại': '02838445566',
        'Người đại diện pháp luật': 'Phạm Minh Trí',
        'Số điện thoại người đại diện': '0987654321',
        'Trạng thái': 'Đang hoạt động',
      },
      {
        'Tên doanh nghiệp': 'Công ty TNHH Giải pháp Phần mềm Mekong',
        'Mã số thuế': '0323456789',
        'Loại hình doanh nghiệp': 'Công ty TNHH một thành viên',
        'Ngành nghề kinh doanh': '6202',
        'Ngày thành lập': '2018-09-20',
        'Tỉnh/Thành phố ĐKKD': 'Thành phố Cần Thơ',
        'Phường/Xã ĐKKD': 'Phường An Bình',
        'Địa chỉ ĐKKD': 'Khu dân cư Hồng Phát, An Bình, Ninh Kiều',
        'Tên tiếng nước ngoài': 'Mekong Software Solutions Company Limited',
        'Email': 'info@mekongsoft.vn',
        'Số điện thoại': '02923730000',
        'Người đại diện pháp luật': 'Lê Hoàng Nam',
        'Số điện thoại người đại diện': '0977112233',
        'Trạng thái': 'Đang hoạt động',
      },
      {
        'Tên doanh nghiệp': 'Doanh nghiệp tư nhân Minh Tâm',
        'Mã số thuế': '3500123456',
        'Loại hình doanh nghiệp': 'Doanh nghiệp tư nhân',
        'Ngành nghề kinh doanh': 'Vệ sinh công nghiệp',
        'Ngày thành lập': '2011-02-28',
        'Tỉnh/Thành phố ĐKKD': 'Thành phố Hồ Chí Minh',
        'Phường/Xã ĐKKD': 'Phường Võ Thị Sáu',
        'Địa chỉ ĐKKD': '215 Điện Biên Phủ, Võ Thị Sáu, Quận 3',
        'Tên tiếng nước ngoài': 'Minh Tam Private Enterprise',
        'Email': 'minhtamco@gmail.com',
        'Số điện thoại': '02838999999',
        'Người đại diện pháp luật': 'Phan Minh Tâm',
        'Số điện thoại người đại diện': '0909999999',
        'Trạng thái': 'Đang hoạt động',
      },
    ]
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Doanh nghiệp')
    XLSX.writeFile(workbook, 'import_doanh_nghiep_mau_hop_le.xlsx')
  }

  const downloadSampleInvalid = () => {
    const data = [
      {
        'Tên doanh nghiệp': '', // Lỗi: Thiếu tên doanh nghiệp
        'Mã số thuế': '12345', // Lỗi: Mã số thuế sai độ dài
        'Loại hình doanh nghiệp': 'Công ty cổ phần',
        'Ngành nghề kinh doanh': 'Lập trình máy vi tính',
        'Ngày thành lập': '2015-06-12',
        'Tỉnh/Thành phố ĐKKD': 'Thành phố Hồ Chí Minh',
        'Phường/Xã ĐKKD': 'Phường Võ Thị Sáu',
        'Địa chỉ ĐKKD': 'Địa chỉ test',
        'Tên tiếng nước ngoài': '',
        'Email': 'contact_saoviet.com', // Lỗi: Email sai định dạng
        'Số điện thoại': '0999', // Lỗi: SĐT không hợp lệ
        'Người đại diện pháp luật': 'Trần Văn A',
        'Số điện thoại người đại diện': '',
        'Trạng thái': 'Đang hoạt động',
      },
      {
        'Tên doanh nghiệp': 'Công ty Xây dựng Bình Minh',
        'Mã số thuế': '0312345678', // Lỗi: Trùng MST với doanh nghiệp khác trong file
        'Loại hình doanh nghiệp': 'Loại hình không tồn tại', // Lỗi: Loại hình không tồn tại
        'Ngành nghề kinh doanh': '9999', // Lỗi: Ngành nghề không tồn tại
        'Ngày thành lập': '2035-01-01', // Lỗi: Ngày thành lập ở tương lai
        'Tỉnh/Thành phố ĐKKD': 'Tỉnh không có thật', // Lỗi: Tỉnh không tồn tại
        'Phường/Xã ĐKKD': 'Phường không có thật', // Lỗi: Phường không tồn tại
        'Địa chỉ ĐKKD': 'Địa chỉ test 2',
        'Tên tiếng nước ngoài': '',
        'Email': 'contact@saoviet.com.vn', // Lỗi: Trùng Email với dòng trên
        'Số điện thoại': '0901234567',
        'Người đại diện pháp luật': 'Nguyễn Văn B',
        'Số điện thoại người đại diện': '0988888888',
        'Trạng thái': 'Đang hoạt động',
      },
    ]
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Doanh nghiệp')
    XLSX.writeFile(workbook, 'import_doanh_nghiep_mau_loi.xlsx')
  }

  // --- Parse & Validate ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) processFile(selectedFile)
  }

  const processFile = (selectedFile: File) => {
    setFile(selectedFile)
    setResult(null)
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const rawData = XLSX.utils.sheet_to_json<any>(worksheet)

      const addressService = new OpenAdress()
      const parsedRows: ParsedRow[] = []
      const seenTaxCodes = new Set<string>()
      const seenEmails = new Set<string>()

      rawData.forEach((row: any, index: number) => {
        const errors: string[] = []
        const companyName = String(row['Tên doanh nghiệp'] || '').trim()
        const taxCode = String(row['Mã số thuế'] || '').trim()
        const businessTypeStr = String(row['Loại hình doanh nghiệp'] || '').trim()
        const industryStr = String(row['Ngành nghề kinh doanh'] || '').trim()
        const gpkdDate = String(row['Ngày thành lập'] || '').trim()
        const gpkdProvinceStr = String(row['Tỉnh/Thành phố ĐKKD'] || '').trim()
        const gpkdWardStr = String(row['Phường/Xã ĐKKD'] || '').trim()
        const address = String(row['Địa chỉ ĐKKD'] || '').trim()
        const foreignName = String(row['Tên tiếng nước ngoài'] || '').trim()
        const email = String(row['Email'] || '').trim()
        const phone = String(row['Số điện thoại'] || '').trim()
        const representative = String(row['Người đại diện pháp luật'] || '').trim()
        const representativePhone = String(row['Số điện thoại người đại diện'] || '').trim()
        const statusStr = String(row['Trạng thái'] || 'Đang hoạt động').trim()

        // 1. Tên doanh nghiệp
        if (!companyName) {
          errors.push('Thiếu tên doanh nghiệp')
        }

        // 2. Mã số thuế
        if (!taxCode) {
          errors.push('Thiếu mã số thuế')
        } else if (!TAX_CODE_REGEX.test(taxCode)) {
          errors.push('Mã số thuế phải gồm 10 hoặc 13 chữ số')
        } else if (seenTaxCodes.has(taxCode)) {
          errors.push(`Trùng mã số thuế "${taxCode}" trong file`)
        } else {
          seenTaxCodes.add(taxCode)
        }

        // 3. Loại hình
        const bType = businessTypes.find(
          (t) => t.name.toLowerCase() === businessTypeStr.toLowerCase()
        )
        const businessTypeId = bType ? bType.id : null
        if (!businessTypeStr) {
          errors.push('Thiếu loại hình doanh nghiệp')
        } else if (!businessTypeId) {
          errors.push(`Loại hình "${businessTypeStr}" không tồn tại trên hệ thống`)
        }

        // 4. Ngành nghề
        const ind = level4Industries.find(
          (i) =>
            i.code === industryStr ||
            i.name.toLowerCase() === industryStr.toLowerCase()
        )
        const industryId = ind ? ind.id : null
        if (!industryStr) {
          errors.push('Thiếu ngành nghề kinh doanh')
        } else if (!industryId) {
          errors.push(`Ngành nghề "${industryStr}" không tồn tại hoặc không phải Cấp 4`)
        }

        // 5. Ngày thành lập
        if (!gpkdDate) {
          errors.push('Thiếu ngày thành lập')
        } else {
          const parsedDate = new Date(gpkdDate)
          const today = new Date()
          today.setHours(23, 59, 59, 999)
          if (Number.isNaN(parsedDate.getTime())) {
            errors.push('Ngày thành lập không đúng định dạng YYYY-MM-DD')
          } else if (parsedDate > today) {
            errors.push('Ngày thành lập không được lớn hơn ngày hiện tại')
          }
        }

        // 6. Tỉnh/Thành phố
        const prov = addressService.provinces.find(
          (p) => normalizeName(p.name) === normalizeName(gpkdProvinceStr)
        )
        const gpkdProvinceData = prov ? { key: prov.code, value: prov.name } : null
        if (!gpkdProvinceStr) {
          errors.push('Thiếu Tỉnh/Thành phố ĐKKD')
        } else if (!gpkdProvinceData) {
          errors.push(`Tỉnh/Thành phố "${gpkdProvinceStr}" không tồn tại`)
        }

        // 7. Phường/Xã
        let gpkdWardData: { key: number; value: string } | null = null
        if (prov && gpkdWardStr) {
          const wd = prov.wards.find(
            (w) => normalizeName(w.name) === normalizeName(gpkdWardStr)
          )
          if (wd) gpkdWardData = { key: wd.code, value: wd.name }
        }
        if (!gpkdWardStr) {
          errors.push('Thiếu Phường/Xã ĐKKD')
        } else if (prov && !gpkdWardData) {
          errors.push(`Phường/Xã "${gpkdWardStr}" không thuộc ${prov.name}`)
        }

        // 8. Email
        if (!email) {
          errors.push('Thiếu email')
        } else if (!EMAIL_REGEX.test(email)) {
          errors.push('Email không đúng định dạng')
        } else if (seenEmails.has(email)) {
          errors.push(`Trùng email "${email}" trong file`)
        } else {
          seenEmails.add(email)
        }

        // 9. Số điện thoại
        if (phone && !VN_PHONE_REGEX.test(phone)) {
          errors.push('SĐT cơ quan không đúng định dạng Việt Nam')
        }
        if (representativePhone && !VN_PHONE_REGEX.test(representativePhone)) {
          errors.push('SĐT người đại diện không đúng định dạng Việt Nam')
        }

        // 10. Trạng thái
        const status = statusStr.toLowerCase() === 'đang hoạt động'

        parsedRows.push({
          id: `${Date.now()}-${index}`,
          companyName,
          taxCode,
          businessTypeStr,
          businessTypeId,
          industryStr,
          industryId,
          gpkdDate,
          gpkdProvinceStr,
          gpkdProvinceData,
          gpkdWardStr,
          gpkdWardData,
          address,
          foreignName,
          email,
          phone,
          representative,
          representativePhone,
          statusStr,
          status,
          errors,
          isValid: errors.length === 0,
        })
      })

      setRows(parsedRows)
    }

    reader.readAsArrayBuffer(selectedFile)
  }

  // --- Drag & Drop ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.csv')) {
        processFile(droppedFile)
      } else {
        alert('Chỉ hỗ trợ file Excel (.xlsx) hoặc CSV (.csv)')
      }
    }
  }

  // --- Delete row from list ---
  const deleteRow = (rowId: string) => {
    setRows((prev) => prev.filter((r) => r.id !== rowId))
  }

  // --- Run Batch Import ---
  const startImport = async () => {
    const validRows = rows.filter((r) => r.isValid)
    if (validRows.length === 0) return

    setImporting(true)
    setProgress(0)

    const api = new DoetApi()
    let successCount = 0
    let failedCount = 0
    const errorsList: string[] = []

    const batchSize = 3 // process in parallel batches of 3
    for (let i = 0; i < validRows.length; i += batchSize) {
      const batch = validRows.slice(i, i + batchSize)
      
      const promises = batch.map(async (row) => {
        const payload: DoetPayload = {
          name: row.companyName,
          taxCode: row.taxCode,
          issuedDate: row.gpkdDate,
          businessTypeId: row.businessTypeId!,
          industryId: row.industryId!,
          foreignName: row.foreignName || undefined,
          representative: row.representative || undefined,
          repPhone: row.representativePhone || undefined,
          phone: row.phone || undefined,
          email: row.email || undefined,
          address: row.address || undefined,
          province: row.gpkdProvinceData!,
          district: { key: 0, value: '' },
          ward: row.gpkdWardData!,
        }

        try {
          const res = await api.create(payload)
          if (res.success) {
            successCount++
          } else {
            failedCount++
            errorsList.push(`MST ${row.taxCode} (${row.companyName}): ${res.message}`)
          }
        } catch (err: any) {
          failedCount++
          errorsList.push(`MST ${row.taxCode} (${row.companyName}): ${err.message || 'Lỗi kết nối'}`)
        }
      })

      await Promise.all(promises)
      setProgress(Math.round(((i + batch.length) / validRows.length) * 100))
    }

    setResult({
      total: rows.length,
      valid: validRows.length,
      successCount,
      failedCount,
      errors: errorsList,
    })
    setImporting(false)
    onSuccess()
  }

  const validRowsCount = rows.filter((r) => r.isValid).length
  const invalidRowsCount = rows.length - validRowsCount

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <i className="fa-solid fa-file-import text-lg"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Import Doanh Nghiệp Từ File</h2>
              <p className="text-xs text-gray-500">Hỗ trợ định dạng Excel (.xlsx) và CSV (.csv)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={importing}
            className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            <i className="fa-solid fa-times text-lg"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 min-h-0">
          {/* File Selection Area */}
          {!file && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-primary rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer bg-gray-50/50 hover:bg-primary/5 transition-all group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.csv"
                className="hidden"
              />
              <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-all">
                <i className="fa-solid fa-cloud-arrow-up text-2xl animate-bounce"></i>
              </div>
              <p className="text-sm font-medium text-gray-700">Kéo thả file vào đây hoặc click để chọn file</p>
              <p className="text-xs text-gray-400">Chỉ chấp nhận file .xlsx hoặc .csv dung lượng nhỏ hơn 10MB</p>
            </div>
          )}

          {file && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center font-bold">
                  <i className="fa-regular fa-file-excel text-lg"></i>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{file.name}</h4>
                  <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              {!importing && !result && (
                <button
                  onClick={() => {
                    setFile(null)
                    setRows([])
                  }}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  Thay đổi file
                </button>
              )}
            </div>
          )}

          {/* Quick Help & Templates */}
          {!result && (
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-info text-blue-500 mt-0.5 text-base"></i>
                <div>
                  <h5 className="text-sm font-semibold text-blue-800">Tải file mẫu để bắt đầu</h5>
                  <p className="text-xs text-blue-600">Đảm bảo cấu trúc cột và dữ liệu khớp chính xác danh sách trên hệ thống.</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={downloadSampleValid}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-download"></i>
                  <span>File Hợp Lệ Mẫu</span>
                </button>
                <button
                  onClick={downloadSampleInvalid}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 bg-white rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-download"></i>
                  <span>File Chứa Lỗi Mẫu</span>
                </button>
              </div>
            </div>
          )}

          {/* Statistics summary */}
          {rows.length > 0 && !result && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200/60 p-4 rounded-xl">
                <div className="text-xs text-gray-500 font-medium">Tổng số dòng</div>
                <div className="text-2xl font-bold text-gray-800 mt-1">{rows.length}</div>
              </div>
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                <div className="text-xs text-green-600 font-medium">Dòng hợp lệ (Sẵn sàng)</div>
                <div className="text-2xl font-bold text-green-700 mt-1">{validRowsCount}</div>
              </div>
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl">
                <div className="text-xs text-red-600 font-medium">Dòng lỗi (Cần sửa/xóa)</div>
                <div className="text-2xl font-bold text-red-700 mt-1">{invalidRowsCount}</div>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {rows.length > 0 && !result && (
            <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col max-h-[350px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-semibold sticky top-0 z-10 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-center w-[60px]">STT</th>
                      <th className="px-4 py-3">Tên doanh nghiệp</th>
                      <th className="px-4 py-3">Mã số thuế</th>
                      <th className="px-4 py-3">Loại hình</th>
                      <th className="px-4 py-3">Ngành nghề</th>
                      <th className="px-4 py-3">Trạng thái dữ liệu</th>
                      <th className="px-4 py-3 text-center w-[80px]">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((row, index) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-gray-50/50 transition-colors ${
                          row.isValid ? '' : 'bg-red-50/20'
                        }`}
                      >
                        <td className="px-4 py-3 text-center text-gray-500 font-medium">{index + 1}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{row.companyName || <span className="text-red-400 italic">Không có tên</span>}</td>
                        <td className="px-4 py-3 text-gray-600">{row.taxCode || <span className="text-red-400 italic">Trống</span>}</td>
                        <td className="px-4 py-3 text-gray-600">{row.businessTypeStr}</td>
                        <td className="px-4 py-3 text-gray-600">{row.industryStr}</td>
                        <td className="px-4 py-3">
                          {row.isValid ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                              <i className="fa-solid fa-check-circle"></i>
                              <span>Hợp lệ</span>
                            </span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {row.errors.map((err, errIdx) => (
                                <span key={errIdx} className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                                  <i className="fa-solid fa-warning text-[10px]"></i>
                                  <span>{err}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => deleteRow(row.id)}
                            disabled={importing}
                            className="text-gray-400 hover:text-red-500 transition-colors w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {importing && (
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                  <i className="fa-solid fa-spinner animate-spin text-primary"></i>
                  <span>Đang xử lý tải dữ liệu doanh nghiệp...</span>
                </span>
                <span className="font-bold text-primary">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-400">Hệ thống đang gọi API chèn dữ liệu theo nhóm song song 3 doanh nghiệp để tối ưu hiệu năng.</p>
            </div>
          )}

          {/* Results Summary */}
          {result && (
            <div className="space-y-6">
              <div className="bg-green-50/50 border border-green-200 p-6 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center text-xl shrink-0">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-green-800">Nhập Dữ Liệu Hoàn Tất!</h4>
                  <p className="text-sm text-green-600">Đã kiểm tra {result.total} dòng trong file. Nhập thành công {result.successCount} doanh nghiệp mới.</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center">
                  <div className="text-xs text-gray-500">Tổng số dòng</div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">{result.total}</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center">
                  <div className="text-xs text-blue-600">Dòng hợp lệ</div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">{result.valid}</div>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
                  <div className="text-xs text-green-600">Thành công (API)</div>
                  <div className="text-2xl font-bold text-green-700 mt-1">{result.successCount}</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
                  <div className="text-xs text-red-600">Thất bại (API)</div>
                  <div className="text-2xl font-bold text-red-700 mt-1">{result.failedCount}</div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="border border-red-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-red-50 text-red-800 font-semibold text-sm border-b border-red-200">
                    Chi Tiết Lỗi Trả Về Từ API
                  </div>
                  <div className="p-4 max-h-[200px] overflow-y-auto space-y-2 text-xs text-red-700 font-medium">
                    {result.errors.map((err, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <i className="fa-solid fa-circle-exclamation mt-0.5 shrink-0"></i>
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-between bg-gray-50/50">
          <div>
            {rows.length > 0 && !result && (
              <p className="text-xs text-gray-500 mt-2">
                * Chỉ những dòng được đánh dấu <span className="font-semibold text-green-600">Hợp lệ</span> mới được chọn để import.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {!result ? (
              <>
                <button
                  onClick={onClose}
                  disabled={importing}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={startImport}
                  disabled={importing || validRowsCount === 0}
                  className="px-5 py-2 bg-primary text-white rounded-lg hover:opacity-95 transition-opacity text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  {importing && <i className="fa-solid fa-spinner animate-spin"></i>}
                  <span>Bắt đầu import ({validRowsCount})</span>
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 bg-primary text-white rounded-lg hover:opacity-95 transition-opacity text-sm font-semibold"
              >
                Đóng lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
