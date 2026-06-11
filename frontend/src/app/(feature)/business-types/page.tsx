'use client'

import { useMemo, useState } from 'react'
import TopHero from '@/src/components/TopHero'

type BusinessType = {
  id: number
  code: string
  name: string
  status: boolean // true = Sử dụng, false = Ngừng sử dụng
}

const initialData: BusinessType[] = [
  { id: 1, code: '150', name: 'Doanh nghiệp tư nhân', status: true },
  { id: 2, code: '120', name: 'Công ty TNHH', status: true },
  { id: 3, code: '140', name: 'Công ty hợp danh', status: false },
  { id: 4, code: '110', name: 'Doanh nghiệp nhà nước', status: true },
]

// Toggle Switch Component
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`w-10 h-5 rounded-full transition-colors duration-200 ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  )
}

// Modal Component
function BusinessTypeModal({
  isOpen,
  editingItem,
  form,
  errors,
  onClose,
  onSave,
  onChange,
}: {
  isOpen: boolean
  editingItem: BusinessType | null
  form: { code: string; name: string; status: string }
  errors: { code: string; name: string }
  onClose: () => void
  onSave: () => void
  onChange: (field: string, value: string) => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Purple Header */}
        <div className="bg-[#5B2DE1] px-6 py-4">
          <h2 className="text-white text-base font-semibold">
            {editingItem ? 'Cập nhật loại hình kinh doanh' : 'Thêm mới loại hình kinh doanh'}
          </h2>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Mã loại hình <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => onChange('code', e.target.value)}
              placeholder="Nhập mã loại hình"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#5B2DE1] transition-colors ${
                errors.code ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Tên loại hình kinh doanh <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Nhập tên loại hình"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#5B2DE1] transition-colors ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Trạng thái</label>
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => onChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#5B2DE1] appearance-none bg-white transition-colors"
              >
                <option value="true">Sử dụng</option>
                <option value="false">Ngừng sử dụng</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
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

export default function BusinessTypesPage() {
  const [data, setData] = useState<BusinessType[]>(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BusinessType | null>(null)
  const [form, setForm] = useState({ code: '', name: '', status: 'true' })
  const [errors, setErrors] = useState({ code: '', name: '' })
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Filter states
  const [filterCode, setFilterCode] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Pagination
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const openNew = () => {
    setEditingItem(null)
    setForm({ code: '', name: '', status: 'true' })
    setErrors({ code: '', name: '' })
    setIsModalOpen(true)
  }

  const openEdit = (item: BusinessType) => {
    setEditingItem(item)
    setForm({ code: item.code, name: item.name, status: item.status ? 'true' : 'false' })
    setErrors({ code: '', name: '' })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const validate = () => {
    const nextErrors = { code: '', name: '' }
    if (!form.code.trim()) nextErrors.code = 'Mã loại hình là bắt buộc'
    if (!form.name.trim()) nextErrors.name = 'Tên loại hình là bắt buộc'
    setErrors(nextErrors)
    return !nextErrors.code && !nextErrors.name
  }

  const handleSave = () => {
    if (!validate()) return

    if (editingItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? { ...item, code: form.code, name: form.name, status: form.status === 'true' }
            : item
        )
      )
    } else {
      const nextItem: BusinessType = {
        id: Math.max(0, ...data.map((item) => item.id)) + 1,
        code: form.code,
        name: form.name,
        status: form.status === 'true',
      }
      setData((prev) => [nextItem, ...prev])
    }

    closeModal()
  }

  const handleToggleStatus = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: !item.status } : item
      )
    )
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
      const matchStatus =
        filterStatus === '' ? true :
        filterStatus === 'active' ? item.status :
        filterStatus === 'inactive' ? !item.status : true
      return matchCode && matchName && matchStatus
    })
  }, [data, filterCode, filterName, filterStatus])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <main className="space-y-0">
      <TopHero
        lable="Danh sách loại hình kinh doanh"
        component={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 transition-colors"
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

      <div className="bg-white">
        {/* Filter Row */}
        <div className="grid grid-cols-[auto_1fr_2fr_180px] gap-0 border-b border-gray-200">
          {/* Checkbox col header */}
          <div className="flex items-center px-4 py-3 border-r border-gray-200">
            <input
              type="checkbox"
              className="w-4 h-4 accent-blue-600 cursor-pointer"
              checked={selectedIds.length === filteredRows.length && filteredRows.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </div>
          {/* Edit icon col header placeholder */}
          <div className="flex items-center px-3 py-3 border-r border-gray-200 w-10" />
          {/* Code filter */}
          <div className="flex items-center px-3 py-3 border-r border-gray-200">
            <input
              type="text"
              placeholder="Mã loại hình"
              value={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              className="w-32 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex items-center px-3 py-3 border-r border-gray-200 flex-1">
            <input
              type="text"
              placeholder="Tên loại hình"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex items-center px-3 py-3">
            <div className="relative w-full">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none appearance-none bg-white"
              >
                <option value="">Tất cả</option>
                <option value="active">Sử dụng</option>
                <option value="inactive">Ngừng sử dụng</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-[auto_auto_140px_1fr_160px] gap-0 text-sm font-semibold text-gray-600 border-b border-gray-200">
          <div className="px-4 py-3 border-r border-gray-100" />
          <div className="px-3 py-3 border-r border-gray-100 w-10" />
          <div className="px-3 py-3 border-r border-gray-100">Mã loại hình</div>
          <div className="px-3 py-3 border-r border-gray-100">Tên loại hình</div>
          <div className="px-3 py-3 text-center">Trạng thái</div>
        </div>

        {/* Data Rows */}
        {paginatedRows.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[auto_auto_140px_1fr_160px] gap-0 border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
            <div className="flex items-center px-3 py-3 border-r border-gray-100 text-sm text-gray-700">
              {item.name}
            </div>
            <div className="flex items-center justify-center px-3 py-3">
              <ToggleSwitch
                checked={item.status}
                onChange={() => handleToggleStatus(item.id)}
              />
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
      <BusinessTypeModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        form={form}
        errors={errors}
        onClose={closeModal}
        onSave={handleSave}
        onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
      />
    </main>
  )
}
