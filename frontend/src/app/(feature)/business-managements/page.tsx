'use client'

import { useState, useMemo } from 'react'
import TopHero from '@/src/components/TopHero'
import ToggleSwitch from '@/src/components/ToggleSwitch'
import EnterpriseModal from '@/src/components/modals/EnterpriseModal'
import { Enterprise, enterprisesMock } from '@/src/mocks/enterprises'
import type { EnterpriseFormData } from '@/src/components/modals/EnterpriseStepOne'

const GRID_COLS = 'grid-cols-[40px_100px_1fr_120px_160px_180px_140px_80px]'

export default function BusinessManagementsPage() {
  const [data, setData] = useState<Enterprise[]>(enterprisesMock)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Filter states
  const [filterName, setFilterName] = useState('')
  const [filterTaxCode, setFilterTaxCode] = useState('')
  const [filterBusinessType, setFilterBusinessType] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('')
  const [filterWard, setFilterWard] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Pagination
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const openNew = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleSave = (form: EnterpriseFormData) => {
    const nextItem: Enterprise = {
      id: Math.max(0, ...data.map((item) => item.id)) + 1,
      companyName: form.companyName,
      taxCode: form.taxCode,
      businessType: form.businessType,
      industry: form.industry,
      ward: form.gpkdWard,
      status: true,
      foreignName: form.foreignName,
      email: form.email,
      phone: form.phone,
      gpkdDate: form.gpkdDate,
      gpkdProvince: form.gpkdProvince,
      gpkdWard: form.gpkdWard,
      address: form.address,
      businessProvince: form.businessProvince,
      businessWard: form.businessWard,
      businessAddress: form.businessAddress,
      representative: form.representative,
      representativePhone: form.representativePhone,
    }
    setData((prev) => [nextItem, ...prev])
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
    setSelectedIds(checked ? paginatedRows.map((r) => r.id) : [])
  }

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const filteredRows = useMemo(() => {
    return data.filter((item) => {
      const matchName = filterName ? item.companyName.toLowerCase().includes(filterName.toLowerCase()) : true
      const matchTax = filterTaxCode ? item.taxCode.includes(filterTaxCode) : true
      const matchType = filterBusinessType ? item.businessType === filterBusinessType : true
      const matchIndustry = filterIndustry ? item.industry.toLowerCase().includes(filterIndustry.toLowerCase()) : true
      const matchWard = filterWard ? item.ward.toLowerCase().includes(filterWard.toLowerCase()) : true
      const matchStatus =
        filterStatus === '' ? true :
          filterStatus === 'active' ? item.status :
            filterStatus === 'inactive' ? !item.status : true
      return matchName && matchTax && matchType && matchIndustry && matchWard && matchStatus
    })
  }, [data, filterName, filterTaxCode, filterBusinessType, filterIndustry, filterWard, filterStatus])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const allSelected = paginatedRows.length > 0 && paginatedRows.every((r) => selectedIds.includes(r.id))

  // Unique values for dropdowns
  const uniqueBusinessTypes = [...new Set(data.map((d) => d.businessType))]
  const uniqueIndustries = [...new Set(data.map((d) => d.industry))]

  return (
    <main className="h-screen flex flex-col py-2">
      {/* TopHero */}
      <TopHero
        title="Danh sách doanh nghiệp"
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
            >
              <i className="fa-solid fa-upload text-xs text-primary" />
              <span>Thêm từ file</span>
            </button>
            <button
              type="button"
              onClick={openNew}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:opacity-90 transition-opacity"
            >
              <i className="fa-solid fa-plus text-xs" />
              <span>Thêm mới</span>
            </button>
          </div>
        }
        className="shrink-0"
      />

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">

        {/* Table Header + Filter */}
        <div className="shrink-0 border-b border-gray-200">
          {/* Column titles */}
          <div className={`grid ${GRID_COLS} text-xs text-gray-500 font-medium`}>
            <div />
            <div className="px-2 py-2">Thao tác</div>
            <div className="px-3 py-2">Tên doanh nghiệp</div>
            <div className="px-3 py-2">Mã số thuế</div>
            <div className="px-3 py-2">Loại hình kinh doanh</div>
            <div className="px-3 py-2">Ngành nghề kinh doanh</div>
            <div className="px-3 py-2">Phường/xã</div>
            <div className="px-3 py-2 text-center">Trạng thái</div>
          </div>

          {/* Filter inputs */}
          <div className={`grid ${GRID_COLS} pb-2`}>
            <div />
            <div />
            <div className="px-3">
              <input
                type="text"
                value={filterName}
                onChange={(e) => { setFilterName(e.target.value); setCurrentPage(1) }}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="px-3">
              <input
                type="text"
                value={filterTaxCode}
                onChange={(e) => { setFilterTaxCode(e.target.value); setCurrentPage(1) }}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="px-3">
              <select
                value={filterBusinessType}
                onChange={(e) => { setFilterBusinessType(e.target.value); setCurrentPage(1) }}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              >
                <option value="">Tất cả</option>
                {uniqueBusinessTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="px-3">
              <select
                value={filterIndustry}
                onChange={(e) => { setFilterIndustry(e.target.value); setCurrentPage(1) }}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              >
                <option value="">Tất cả</option>
                {uniqueIndustries.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="px-3">
              <input
                type="text"
                value={filterWard}
                onChange={(e) => { setFilterWard(e.target.value); setCurrentPage(1) }}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="px-3">
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1) }}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              >
                <option value="">Tất cả</option>
                <option value="active">Sử dụng</option>
                <option value="inactive">Ngừng sử dụng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Body - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {paginatedRows.map((item) => (
            <div
              key={item.id}
              className={`grid ${GRID_COLS} border-b border-gray-100 hover:bg-blue-50/40 transition-colors text-sm text-gray-700`}
            >
              {/* Checkbox */}
              <div className="flex items-center justify-center py-2.5">
                <input
                  type="checkbox"
                  className={`w-3.5 h-3.5 accent-primary cursor-pointer`}
                  checked={selectedIds.includes(item.id)}
                  onChange={() => handleSelectOne(item.id)}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 px-2 py-2.5">
                <button
                  type="button"
                  className="text-gray-400 hover:text-primary transition-colors"
                  title="Xem chi tiết"
                >
                  <i className="fa-solid fa-eye text-xs" />
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-primary transition-colors"
                  title="Chỉnh sửa"
                >
                  <i className="fa-solid fa-pen text-xs" />
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-primary transition-colors"
                  title="Đính kèm file"
                >
                  <i className="fa-solid fa-paperclip text-xs" />
                </button>
              </div>

              {/* Company Name */}
              <div className="flex items-center px-3 py-2.5 truncate">
                {item.companyName}
              </div>

              {/* Tax Code */}
              <div className="flex items-center px-3 py-2.5">
                {item.taxCode}
              </div>

              {/* Business Type */}
              <div className="flex items-center px-3 py-2.5 truncate">
                {item.businessType}
              </div>

              {/* Industry */}
              <div className="flex items-center px-3 py-2.5 truncate">
                {item.industry}
              </div>

              {/* Ward */}
              <div className="flex items-center px-3 py-2.5 truncate">
                {item.ward}
              </div>

              {/* Toggle Status */}
              <div className="flex items-center justify-center py-2.5">
                <ToggleSwitch
                  checked={item.status}
                  onChange={() => handleToggleStatus(item.id)}
                />
              </div>
            </div>
          ))}

          {/* Empty state */}
          {paginatedRows.length === 0 && (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">
              Không có dữ liệu
            </div>
          )}
        </div>

        {/* Pagination - Fixed at bottom */}
        <div className="shrink-0 flex items-center justify-end gap-4 px-5 py-3 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
              className="border border-gray-300 rounded px-2 py-1 text-sm outline-none cursor-pointer bg-white hover:border-gray-400 transition-colors"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <span className="text-gray-500 tabular-nums">
            {filteredRows.length === 0
              ? '0'
              : `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, filteredRows.length)}`
            } of {filteredRows.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Enterprise Modal */}
      <EnterpriseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
      />
    </main>
  )
}
