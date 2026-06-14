'use client'

import { useState, useMemo, useEffect, useContext } from 'react'
import TopHero from '@/src/components/TopHero'
import ToggleSwitch from '@/src/components/ToggleSwitch'
import BusinessIndustryModal from '@/src/components/modals/BusinessIndustryModal'
import BulkDeleteBar from '@/src/components/common/BulkDeleteBar'
import DeleteConfirmModal from '@/src/components/common/DeleteConfirmModal'
import { IndustryApi, type IIndustry } from '@/src/api/Industry'
import { NotificateContext } from '@/src/contexts/notificate/notificate'

const GRID_COLS = 'grid-cols-[40px_70px_120px_1fr_120px_140px]'

type IndustryLevel = 1 | 2 | 3 | 4

function flattenTree<T extends { children?: T[] }>(items: T[]): T[] {
  const result: T[] = []
  function recurse(list: T[]) {
    for (const item of list) {
      const { children, ...rest } = item
      result.push(rest as T)
      if (children && children.length > 0) {
        recurse(children)
      }
    }
  }
  recurse(items)
  return result
}

function getLevelPrefix(level: IndustryLevel) {
  const map: Record<IndustryLevel, string> = {
    1: '',
    2: '– ',
    3: '— ',
    4: '—— ',
  }
  return map[level] || ''
}

function getLevelLabel(level: IndustryLevel) {
  return `Cấp ${level}`
}

export default function BusinessIndustriesPage() {
  const notificate = useContext(NotificateContext)
  const api = useMemo(() => new IndustryApi(), [])

  // Table & Pagination states
  const [data, setData] = useState<IIndustry[]>([])
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Full parent industries list for dropdown select (bypasses pagination limit)
  const [parentIndustries, setParentIndustries] = useState<IIndustry[]>([])
  const [loadingParents, setLoadingParents] = useState(false)

  // Selection state
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<IIndustry | null>(null)
  const [form, setForm] = useState({ code: '', name: '', parentId: '', status: 'true' })
  const [errors, setErrors] = useState({ code: '', name: '' })
  const [isSaving, setIsSaving] = useState(false)

  // Delete states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter states
  const [filterCode, setFilterCode] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Local paginated slice of the flattened items
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }, [data, currentPage, pageSize])

  // Load parent options (all active industries up to 1000 items)
  const fetchParentIndustries = async () => {
    setLoadingParents(true)
    try {
      const result = await api.getAllForAdmin({ page: 1, pageSize: 1000 })
      if (result.success && result.data) {
        const flattened = flattenTree(result.data.items)
        setParentIndustries(flattened)
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách ngành cha:', error)
    } finally {
      setLoadingParents(false)
    }
  }

  // Fetch data from NestJS API (fetch all matching data to paginate locally)
  const fetchData = async () => {
    setLoading(true)
    try {
      const levelNum = filterLevel ? Number(filterLevel) : undefined
      const isActive =
        filterStatus === 'active'
          ? true
          : filterStatus === 'inactive'
          ? false
          : undefined

      const result = await api.getAllForAdmin({
        page: 1,
        pageSize: 1000,
        code: filterCode.trim() || undefined,
        name: filterName.trim() || undefined,
        level: levelNum,
        isActive
      })

      if (result.success && result.data) {
        const flattened = flattenTree(result.data.items)
        setData(flattened)
        setTotalItems(flattened.length)
      } else {
        notificate?.showNotification({
          type: 'error',
          message: result.message || 'Không thể lấy danh sách ngành nghề kinh doanh.'
        })
      }
    } catch (error) {
      console.error(error)
      notificate?.showNotification({
        type: 'error',
        message: 'Lỗi kết nối tới hệ thống. Vui lòng thử lại sau.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Reload lists on mount
  useEffect(() => {
    fetchParentIndustries()
  }, [])

  // Refetch table data when filters change
  useEffect(() => {
    fetchData()
  }, [filterCode, filterName, filterLevel, filterStatus])

  // Filter handlers
  const handleFilterChange = (field: string, value: string) => {
    if (field === 'code') setFilterCode(value)
    if (field === 'name') setFilterName(value)
    if (field === 'level') setFilterLevel(value)
    if (field === 'status') setFilterStatus(value)
    setCurrentPage(1)
  }

  const openNew = () => {
    setEditingItem(null)
    setForm({ code: '', name: '', parentId: '', status: 'true' })
    setErrors({ code: '', name: '' })
    setIsModalOpen(true)
  }

  const openEdit = async (item: IIndustry) => {
    setForm({
      code: item.code,
      name: item.name,
      parentId: item.parentId !== null && item.parentId !== undefined ? String(item.parentId) : '',
      status: item.isActive ? 'true' : 'false',
    })
    setErrors({ code: '', name: '' })
    setEditingItem(item)
    setIsModalOpen(true)

    // Asynchronously fetch item details to get full parent object
    try {
      const result = await api.getDetail(item.id)
      if (result.success && result.data) {
        setEditingItem(result.data)
        const parentIdVal = result.data.parentId !== null && result.data.parentId !== undefined 
          ? String(result.data.parentId) 
          : ''
        setForm((prev) => ({
          ...prev,
          parentId: parentIdVal,
        }))
      }
    } catch (err) {
      console.error('Lỗi khi tải chi tiết ngành nghề:', err)
    }
  }

  const closeModal = () => {
    if (!isSaving) {
      setIsModalOpen(false)
    }
  }

  const validate = () => {
    const nextErrors = { code: '', name: '' }
    if (!form.code.trim()) nextErrors.code = 'Mã ngành là bắt buộc'
    if (!form.name.trim()) nextErrors.name = 'Tên ngành là bắt buộc'
    setErrors(nextErrors)
    return !nextErrors.code && !nextErrors.name
  }

  const handleSave = async () => {
    if (!validate()) return

    setIsSaving(true)
    try {
      const parentId = form.parentId ? Number(form.parentId) : null

      if (editingItem) {
        // Edit flow
        const updatePromises: Promise<any>[] = [
          api.update(editingItem.id, { name: form.name, parentId })
        ]

        const nextActive = form.status === 'true'
        if (editingItem.isActive !== nextActive) {
          updatePromises.push(api.toggleActive(editingItem.id, nextActive))
        }

        const [updateResult] = await Promise.all(updatePromises)
        if (updateResult.success) {
          notificate?.showNotification({
            type: 'success',
            message: 'Cập nhật ngành nghề kinh doanh thành công.'
          })
          setIsModalOpen(false)
          fetchParentIndustries()
          fetchData()
        } else {
          notificate?.showNotification({
            type: 'error',
            message: updateResult.message || 'Không thể cập nhật ngành nghề kinh doanh.'
          })
        }
      } else {
        // Create flow
        const result = await api.create({
          code: form.code,
          name: form.name,
          parentId,
          isActive: form.status === 'true'
        })

        if (result.success) {
          notificate?.showNotification({
            type: 'success',
            message: 'Thêm mới ngành nghề kinh doanh thành công.'
          })
          setIsModalOpen(false)
          setCurrentPage(1)
          fetchParentIndustries()
          fetchData()
        } else {
          notificate?.showNotification({
            type: 'error',
            message: result.message || 'Không thể thêm mới ngành nghề kinh doanh.'
          })
        }
      }
    } catch (error) {
      console.error(error)
      notificate?.showNotification({
        type: 'error',
        message: 'Lỗi khi lưu dữ liệu. Vui lòng thử lại sau.'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleStatus = async (item: IIndustry) => {
    const nextStatus = !item.isActive
    // Optimistic UI update
    setData((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, isActive: nextStatus } : x))
    )

    try {
      const result = await api.toggleActive(item.id, nextStatus)
      if (!result.success) {
        // Rollback
        setData((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, isActive: !nextStatus } : x))
        )
        notificate?.showNotification({
          type: 'error',
          message: result.message || 'Thay đổi trạng thái thất bại.'
        })
      } else {
        notificate?.showNotification({
          type: 'success',
          message: `Thay đổi trạng thái của ngành "${item.name}" thành công.`
        })
        fetchParentIndustries() // reload dropdown list values
      }
    } catch (error) {
      console.error(error)
      // Rollback
      setData((prev) =>
        prev.map((x) => (x.id === item.id ? { ...x, isActive: !nextStatus } : x))
      )
      notificate?.showNotification({
        type: 'error',
        message: 'Lỗi hệ thống khi thay đổi trạng thái.'
      })
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedData.map((r) => r.id) : [])
  }

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await api.bulkDelete(selectedIds)
      if (result.success) {
        notificate?.showNotification({
          type: 'success',
          message:
            selectedIds.length === 1
              ? 'Xóa ngành nghề kinh doanh thành công.'
              : `Đã xóa thành công ${selectedIds.length} ngành nghề kinh doanh.`
        })
        setSelectedIds([])
        setCurrentPage(1)
        fetchParentIndustries()
        fetchData()
      } else {
        notificate?.showNotification({
          type: 'error',
          message: result.message || 'Không thể xóa các ngành nghề đã chọn.'
        })
      }
    } catch (error) {
      console.error(error)
      notificate?.showNotification({
        type: 'error',
        message: 'Lỗi hệ thống khi xóa dữ liệu.'
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const allSelected = paginatedData.length > 0 && paginatedData.every((r) => selectedIds.includes(r.id))

  return (
    <main className="h-screen flex flex-col py-2">
      {/* TopHero */}
      <TopHero
        title="Danh sách ngành nghề kinh doanh"
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
        {/* Table Search / Filter Header */}
        <div className="shrink-0 border-b border-gray-200">
          {/* Column titles */}
          <div className={`grid ${GRID_COLS} text-xs text-gray-500 font-medium bg-gray-50/50`}>
            <div className="flex items-center justify-center py-2">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 accent-primary cursor-pointer"
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </div>
            <div className="px-2 py-2 text-center">Thao tác</div>
            <div className="px-3 py-2">Mã ngành</div>
            <div className="px-3 py-2">Tên ngành nghề</div>
            <div className="px-3 py-2">Cấp</div>
            <div className="px-3 py-2 text-center">Trạng thái</div>
          </div>

          {/* Filter inputs */}
          <div className={`grid ${GRID_COLS} pb-2 pt-2 bg-gray-50/20`}>
            <div />
            <div />
            <div className="px-3">
              <input
                type="text"
                placeholder="Tìm mã..."
                value={filterCode}
                onChange={(e) => handleFilterChange('code', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              />
            </div>
            <div className="px-3">
              <input
                type="text"
                placeholder="Tìm tên ngành..."
                value={filterName}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              />
            </div>
            <div className="px-3">
              <select
                value={filterLevel}
                onChange={(e) => handleFilterChange('level', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              >
                <option value="">Tất cả cấp</option>
                <option value="1">Cấp 1</option>
                <option value="2">Cấp 2</option>
                <option value="3">Cấp 3</option>
                <option value="4">Cấp 4</option>
              </select>
            </div>
            <div className="px-3">
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange('status', e.target.value)}
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <i className="fa-solid fa-spinner fa-spin text-xl text-primary" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">
              Không có dữ liệu
            </div>
          ) : (
            paginatedData.map((item) => (
              <div
                key={item.id}
                className={`grid ${GRID_COLS} border-b border-gray-100 hover:bg-blue-50/40 transition-colors text-sm text-gray-700`}
              >
                {/* Checkbox */}
                <div className="flex items-center justify-center py-2.5">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-primary cursor-pointer"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelectOne(item.id)}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center py-2.5">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="text-gray-400 hover:text-primary transition-colors"
                    title="Chỉnh sửa"
                  >
                    <i className="fa-solid fa-pen text-xs" />
                  </button>
                </div>

                {/* Code */}
                <div className="flex items-center px-3 py-2.5 font-medium text-gray-900">
                  {item.code}
                </div>

                {/* Name */}
                <div className="flex items-center px-3 py-2.5">
                  <span>
                    {getLevelPrefix(item.level as IndustryLevel)}
                    {item.level === 1 ? (
                      <span className="font-semibold uppercase">{item.name}</span>
                    ) : (
                      item.name
                    )}
                  </span>
                </div>

                {/* Level */}
                <div className="flex items-center px-3 py-2.5">
                  {getLevelLabel(item.level as IndustryLevel)}
                </div>

                {/* Toggle Status */}
                <div className="flex items-center justify-center py-2.5">
                  <ToggleSwitch
                    checked={item.isActive}
                    onChange={() => handleToggleStatus(item)}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination - Fixed at bottom */}
        <div className="shrink-0 flex items-center justify-end gap-4 px-5 py-3 border-t border-gray-200 text-sm text-gray-500">
          {/* Page size selector */}
          <div className="flex items-center gap-1.5">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="border border-gray-300 rounded px-2 py-1 text-sm outline-none cursor-pointer bg-white hover:border-gray-400 transition-colors"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page info */}
          <span className="text-gray-500 tabular-nums">
            {totalItems === 0
              ? '0'
              : `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                  currentPage * pageSize,
                  totalItems
                )}`}{' '}
            of {totalItems}
          </span>

          {/* Navigation buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1 || loading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <BusinessIndustryModal
        isOpen={isModalOpen}
        editingItem={editingItem}
        allIndustries={parentIndustries}
        form={form}
        errors={errors}
        isLoading={isSaving}
        loadingParents={loadingParents}
        onClose={closeModal}
        onSave={handleSave}
        onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
      />

      {/* Floating Bulk Action Bar */}
      <BulkDeleteBar
        selectedCount={selectedIds.length}
        onDelete={() => setShowDeleteConfirm(true)}
        onClearSelection={() => setSelectedIds([])}
        loading={isDeleting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={showDeleteConfirm}
        count={selectedIds.length}
        title="Xác nhận xóa ngành nghề kinh doanh"
        description={
          selectedIds.length === 1
            ? 'Bạn có chắc chắn muốn xóa ngành nghề kinh doanh đã chọn?\nDữ liệu sau khi xóa sẽ không thể khôi phục.'
            : `Bạn có chắc chắn muốn xóa ${selectedIds.length} ngành nghề kinh doanh đã chọn?\nDữ liệu sau khi xóa sẽ không thể khôi phục.`
        }
        onConfirm={handleDelete}
        onCancel={() => {
          if (!isDeleting) {
            setShowDeleteConfirm(false)
          }
        }}
        loading={isDeleting}
      />
    </main>
  )
}

