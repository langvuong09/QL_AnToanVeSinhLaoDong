'use client'

import { useState } from 'react'
import TopHero from '@/src/components/TopHero'
import ToggleSwitch from '@/src/components/ToggleSwitch'
import BusinessTypeModal from '@/src/components/BusinessTypeModal'
import { BusinessType, businessTypesMock } from '@/src/mocks/business-types'

export default function BusinessTypesPage() {
  const [data, setData] = useState<BusinessType[]>(businessTypesMock)
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

  const filteredRows = data.filter((item) => {
    const matchCode = filterCode ? item.code.toLowerCase().includes(filterCode.toLowerCase()) : true
    const matchName = filterName ? item.name.toLowerCase().includes(filterName.toLowerCase()) : true
    const matchStatus =
      filterStatus === '' ? true :
      filterStatus === 'active' ? item.status :
      filterStatus === 'inactive' ? !item.status : true
    return matchCode && matchName && matchStatus
  })

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
