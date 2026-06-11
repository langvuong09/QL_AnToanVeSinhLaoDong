'use client'

import { useMemo, useState } from 'react'
import TopHero from '@/src/components/TopHero'
import InputLegend from '@/src/components/InputLegend'
import SelectLegend from '@/src/components/SelectLegend'

type IndustryLevel = 1 | 2 | 3 | 4

type BusinessIndustry = {
  id: number
  code: string
  name: string
  level: IndustryLevel
  parentId: number | null
  status: boolean // true = Sử dụng
}

const initialData: BusinessIndustry[] = [
  { id: 1, code: 'A', name: 'NÔNG NGHIỆP LÂM NGHIỆP VÀ THUỶ SẢN', level: 1, parentId: null, status: true },
  { id: 2, code: '01', name: 'Nông nghiệp và hoạt động dịch vụ có liên quan', level: 2, parentId: 1, status: true },
  { id: 3, code: '011', name: 'Trồng cây hàng năm', level: 3, parentId: 2, status: true },
  { id: 4, code: '0111', name: 'Trồng lúa', level: 4, parentId: 3, status: true },
  { id: 5, code: 'B', name: 'KHAI KHOÁNG', level: 1, parentId: null, status: true },
  { id: 6, code: '05', name: 'Khai thác than cứng và than non', level: 2, parentId: 5, status: true },
  { id: 7, code: '122', name: 'Khai thác đá', level: 3, parentId: 6, status: true },
]

// Level indent styles
function getLevelIndent(level: IndustryLevel) {
  const map: Record<IndustryLevel, string> = {
    1: '',
    2: 'pl-6',
    3: 'pl-12',
    4: 'pl-18',
  }
  return map[level]
}

function getLevelPrefix(level: IndustryLevel) {
  const map: Record<IndustryLevel, string> = {
    1: '',
    2: '– ',
    3: '– ',
    4: '– ',
  }
  return map[level]
}

function getLevelLabel(level: IndustryLevel) {
  return `Cấp ${level}`
}

// Add/Edit Modal Component
function IndustryModal({
  isOpen,
  editingItem,
  allIndustries,
  form,
  errors,
  onClose,
  onSave,
  onChange,
}: {
  isOpen: boolean
  editingItem: BusinessIndustry | null
  allIndustries: BusinessIndustry[]
  form: { code: string; name: string; parentId: string; status: string }
  errors: { code: string; name: string }
  onClose: () => void
  onSave: () => void
  onChange: (field: string, value: string) => void
}) {
  if (!isOpen) return null

  const parentOptions = allIndustries.filter((i) =>
    editingItem ? i.id !== editingItem.id : true
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Purple Header */}
        <div className="bg-[#5B2DE1] px-6 py-4">
          <h2 className="text-white text-base font-semibold">
            {editingItem ? 'Cập nhật nghề kinh doanh' : 'Thêm mới ngành nghề kinh doanh'}
          </h2>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <InputLegend
              label="Mã ngành"
              require={true}
              input={{
                type: 'text',
                placeholder: 'Nhập mã ngành',
                value: form.code,
                onChange: (e) => onChange('code', (e.target as HTMLInputElement).value),
              }}
              errorMess={errors.code}
            />

            <InputLegend
              label="Tên ngành"
              require={true}
              input={{
                type: 'text',
                placeholder: 'Nhập tên ngành',
                value: form.name,
                onChange: (e) => onChange('name', (e.target as HTMLInputElement).value),
              }}
              errorMess={errors.name}
            />

            <SelectLegend
              label="Nhóm ngành cha"
              select={{
                value: form.parentId,
                onChange: (e) => onChange('parentId', (e.target as HTMLSelectElement).value),
              }}
            >
              <option value="">-- Không có (Cấp 1) --</option>
              {parentOptions.map((opt) => (
                <option key={opt.id} value={String(opt.id)}>
                  {opt.code} - {opt.name}
                </option>
              ))}
            </SelectLegend>

            <SelectLegend
              label="Trạng thái"
              select={{
                value: form.status,
                onChange: (e) => onChange('status', (e.target as HTMLSelectElement).value),
              }}
            >
              <option value="true">Sử dụng</option>
              <option value="false">Ngừng sử dụng</option>
            </SelectLegend>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2 bg-[#5B2DE1] text-white rounded-lg text-sm font-medium hover:bg-[#4a22b8] transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-floppy-disk text-xs" />
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BusinessIndustriesPage() {
  const [data, setData] = useState<BusinessIndustry[]>(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BusinessIndustry | null>(null)
  const [form, setForm] = useState({ code: '', name: '', parentId: '', status: 'true' })
  const [errors, setErrors] = useState({ code: '', name: '' })
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Filter states
  const [filterCode, setFilterCode] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterLevel, setFilterLevel] = useState('')

  // Pagination
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const openNew = () => {
    setEditingItem(null)
    setForm({ code: '', name: '', parentId: '', status: 'true' })
    setErrors({ code: '', name: '' })
    setIsModalOpen(true)
  }

  const openEdit = (item: BusinessIndustry) => {
    setEditingItem(item)
    setForm({
      code: item.code,
      name: item.name,
      parentId: item.parentId !== null ? String(item.parentId) : '',
      status: item.status ? 'true' : 'false',
    })
    setErrors({ code: '', name: '' })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const validate = () => {
    const nextErrors = { code: '', name: '' }
    if (!form.code.trim()) nextErrors.code = 'Mã ngành là bắt buộc'
    if (!form.name.trim()) nextErrors.name = 'Tên ngành là bắt buộc'
    setErrors(nextErrors)
    return !nextErrors.code && !nextErrors.name
  }

  const handleSave = () => {
    if (!validate()) return

    const parentId = form.parentId ? Number(form.parentId) : null
    let level: IndustryLevel = 1
    if (parentId !== null) {
      const parent = data.find((d) => d.id === parentId)
      if (parent) {
        level = Math.min(4, parent.level + 1) as IndustryLevel
      }
    }

    if (editingItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, code: form.code, name: form.name, parentId, level, status: form.status === 'true' }
            : item
        )
      )
    } else {
      const nextItem: BusinessIndustry = {
        id: Math.max(0, ...data.map((item) => item.id)) + 1,
        code: form.code,
        name: form.name,
        level,
        parentId,
        status: form.status === 'true',
      }
      setData((prev) => [...prev, nextItem])
    }

    closeModal()
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredRows.map((r) => r.id) : [])
  }

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const filteredRows = useMemo(() => {
    return data.filter((item) => {
      const matchCode = filterCode ? item.code.toLowerCase().includes(filterCode.toLowerCase()) : true
      const matchName = filterName ? item.name.toLowerCase().includes(filterName.toLowerCase()) : true
      const matchLevel = filterLevel ? item.level === Number(filterLevel) : true
      return matchCode && matchName && matchLevel
    })
  }, [data, filterCode, filterName, filterLevel])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <main className="space-y-5">
      <TopHero
        lable="Danh sách ngành nghề kinh doanh"
        component={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-primary hover:bg-gray-50 transition-colors"
            >
              <i className="fa-solid fa-upload text-xs" />
              <span>Thêm từ file</span>
            </button>
            <button
              type="button"
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 bg-[#5B2DE1] text-white rounded text-sm font-medium hover:bg-[#4a22b8] transition-colors"
            >
              <i className="fa-solid fa-plus text-xs" />
              <span>Thêm mới</span>
            </button>
          </div>
        }
      />

      <div>
        <div className="bg-[#F4F6F8] py-3 px-3">
          <div className="flex font-semibold gap-3 pb-6">
            <div className="flex-1" />
            <div className="w-10" />
            <div className="flex-1">Mã ngành</div>
            <div className="flex-4">Tên ngành nghề</div>
            <div className="flex-1">Cấp</div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1" />
            <div className="w-10" />
            <div className="flex-1">
              <InputLegend
                input={{
                  type: 'text',
                  placeholder: 'Mã ngành',
                  value: filterCode,
                  onChange: (e) => setFilterCode((e.target as HTMLInputElement).value),
                }}
              />
            </div>
            <div className="flex-4">
              <InputLegend
                input={{
                  type: 'text',
                  placeholder: 'Tên ngành nghề',
                  value: filterName,
                  onChange: (e) => setFilterName((e.target as HTMLInputElement).value),
                }}
              />
            </div>
            <div className="flex-1">
              <SelectLegend
                select={{
                  value: filterLevel,
                  onChange: (e) => setFilterLevel((e.target as HTMLSelectElement).value),
                }}
              >
                <option value="">Tất cả</option>
                <option value="1">Cấp 1</option>
                <option value="2">Cấp 2</option>
                <option value="3">Cấp 3</option>
                <option value="4">Cấp 4</option>
              </SelectLegend>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="grid grid-cols-[auto_auto_120px_1fr_120px] gap-0 text-sm font-semibold text-gray-600 border-b border-gray-200">
            <div className="px-4 py-3 border-r border-gray-100" />
            <div className="px-3 py-3 border-r border-gray-100 w-10" />
            <div className="px-3 py-3 border-r border-gray-100">Mã ngành</div>
            <div className="px-3 py-3 border-r border-gray-100">Tên ngành nghề</div>
            <div className="px-3 py-3">Cấp</div>
          </div>

          {/* Data Rows */}
          {paginatedRows.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[auto_auto_120px_1fr_120px] gap-0 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center px-4 py-3 border-r border-gray-100">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => handleSelectOne(item.id)}
                />
              </div>
              <div className="flex items-center px-3 py-3 border-r border-gray-100 w-10">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="text-blue-400 hover:text-blue-600 transition-colors"
                  title="Chỉnh sửa"
                >
                  <i className="fa-solid fa-pen text-xs" />
                </button>
              </div>
              <div className="flex items-center px-3 py-3 border-r border-gray-100 text-sm text-gray-700">
                {item.code}
              </div>
              <div className={`flex items-center px-3 py-3 border-r border-gray-100 text-sm text-gray-700 ${getLevelIndent(item.level)}`}>
                <span>
                  {getLevelPrefix(item.level)}
                  {item.level === 1 ? (
                    <span className="font-bold uppercase">{item.name}</span>
                  ) : (
                    item.name
                  )}
                </span>
              </div>
              <div className="flex items-center px-3 py-3 text-sm text-gray-700">
                {getLevelLabel(item.level)}
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-end gap-3 px-4 py-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
                className="border border-gray-300 rounded px-2 py-1 text-sm outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <span>
              {filteredRows.length === 0 ? '0' : `${(currentPage - 1) * pageSize + 1}`} - {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100 transition-colors"
              >
                <i className="fa-solid fa-chevron-left text-xs" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded disabled:opacity-40 hover:bg-gray-100 transition-colors"
              >
                <i className="fa-solid fa-chevron-right text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        <IndustryModal
          isOpen={isModalOpen}
          editingItem={editingItem}
          allIndustries={data}
          form={form}
          errors={errors}
          onClose={closeModal}
          onSave={handleSave}
          onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
        />
      </div>
    </main>
  )
}
