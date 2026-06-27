'use client'

import { useState, useMemo, useEffect, useContext } from 'react'
import ToggleSwitch from '@/src/components/ToggleSwitch'
import BulkDeleteBar from '@/src/components/common/BulkDeleteBar'
import DeleteConfirmModal from '@/src/components/common/DeleteConfirmModal'
import { JobApi, type IJob } from '@/src/api/Job'
import { InjuryTypeApi, type IInjuryType } from '@/src/api/InjuryType'
import { TraumaApi, type ITrauma } from '@/src/api/Trauma'
import { NotificateContext } from '@/src/contexts/notificate/notificate'
import { exportToExcel } from '@/src/utils/excel'

// Modals
import JobModal from '@/src/components/modals/JobModal'
import InjuryTypeModal from '@/src/components/modals/InjuryTypeModal'
import TraumaModal from '@/src/components/modals/TraumaModal'
import TopHero from '@/src/components/TopHero'
import { AuthenticateContext } from '@/src/contexts/authenticate/authenticate'
import NotFound from '@/src/components/NotFound'

type CategoryType = 'job' | 'trauma' | 'injury'

const GRID_COLS_HIERARCHY = 'grid-cols-[40px_70px_120px_1fr_120px_140px]'
const GRID_COLS_FLAT = 'grid-cols-[40px_70px_120px_1fr_140px]'

function flattenTree<T extends { children?: T[]; level?: number; levelText?: string }>(items: T[]): T[] {
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

function getLevelPrefix(level: number) {
  const map: Record<number, string> = {
    1: '',
    2: '– ',
    3: '— ',
    4: '—— ',
  }
  return map[level] || ''
}

export default function GeneralCategoriesPage() {
  const notificate = useContext(NotificateContext)
  const authenticate = useContext(AuthenticateContext)

  // API Instances
  const jobApi = useMemo(() => new JobApi(), [])
  const injuryApi = useMemo(() => new InjuryTypeApi(), [])
  const traumaApi = useMemo(() => new TraumaApi(), [])

  // Selected general category
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('job')

  // Data list & loading
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)

  // Pagination states
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Selected ids for bulk delete
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  // Filter inputs
  const [filterCode, setFilterCode] = useState('')
  const [filterName, setFilterName] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Parents lists for searchable select dropdowns in forms
  const [parentJobs, setParentJobs] = useState<IJob[]>([])
  const [parentInjuries, setParentInjuries] = useState<IInjuryType[]>([])
  const [loadingParents, setLoadingParents] = useState(false)

  // Modal States
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [isTraumaModalOpen, setIsTraumaModalOpen] = useState(false)
  const [isInjuryModalOpen, setIsInjuryModalOpen] = useState(false)

  // Edit / Form states
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form states per modal
  const [jobForm, setJobForm] = useState({ code: '', name: '', parentId: '', status: 'true' })
  const [jobErrors, setJobErrors] = useState({ code: '', name: '', parentId: '' })

  const [traumaForm, setTraumaForm] = useState({ code: '', name: '', status: 'true' })
  const [traumaErrors, setTraumaErrors] = useState({ code: '', name: '' })

  const [injuryForm, setInjuryForm] = useState({ code: '', name: '', parentId: '', status: 'true' })
  const [injuryErrors, setInjuryErrors] = useState({ code: '', name: '', parentId: '' })

  // Delete confirm modal states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Local paginated slice of flattened items
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return data.slice(startIndex, startIndex + pageSize)
  }, [data, currentPage, pageSize])

  // Sync / clear state when category changes
  useEffect(() => {
    setSelectedIds([])
    setCurrentPage(1)
    setFilterCode('')
    setFilterName('')
    setFilterLevel('')
    setFilterStatus('')
    fetchDataList()
    fetchParentOptions()
  }, [currentCategory])

  // Trigger list refetch when filter fields change
  useEffect(() => {
    fetchDataList()
  }, [filterCode, filterName, filterLevel, filterStatus])

  // Load parent choices for selects
  const fetchParentOptions = async () => {
    setLoadingParents(true)
    try {
      if (currentCategory === 'job') {
        const result = await jobApi.getAllForAdmin({ page: 1, pageSize: 1000 })
        if (result.success && result.data) {
          const flattened = flattenTree(result.data.items)
          setParentJobs(flattened)
        }
      } else if (currentCategory === 'injury') {
        const result = await injuryApi.getAllForAdmin({ page: 1, pageSize: 1000 })
        if (result.success && result.data) {
          const flattened = flattenTree(result.data.items)
          setParentInjuries(flattened)
        }
      }
    } catch (err) {
      console.error('Error fetching parent options:', err)
    } finally {
      setLoadingParents(false)
    }
  }

  // Load main table data
  const fetchDataList = async () => {
    setLoading(true)
    try {
      const levelNum = filterLevel ? Number(filterLevel) : undefined
      const isActive =
        filterStatus === 'active'
          ? true
          : filterStatus === 'inactive'
            ? false
            : undefined

      if (currentCategory === 'job') {
        const result = await jobApi.getAllForAdmin({
          page: 1,
          pageSize: 1000,
          code: filterCode.trim() || undefined,
          name: filterName.trim() || undefined,
          level: levelNum,
          isActive,
        })
        if (result.success && result.data) {
          const flattened = flattenTree(result.data.items)
          setData(flattened)
          setTotalItems(flattened.length)
        } else {
          setData([])
          setTotalItems(0)
          notificate?.showNotification({
            type: 'error',
            message: result.message || 'Không thể tải danh mục nghề nghiệp.',
          })
        }
      } else if (currentCategory === 'injury') {
        const result = await injuryApi.getAllForAdmin({
          page: 1,
          pageSize: 1000,
          code: filterCode.trim() || undefined,
          name: filterName.trim() || undefined,
          level: levelNum,
          isActive,
        })
        if (result.success && result.data) {
          const flattened = flattenTree(result.data.items)
          setData(flattened)
          setTotalItems(flattened.length)
        } else {
          setData([])
          setTotalItems(0)
          notificate?.showNotification({
            type: 'error',
            message: result.message || 'Không thể tải danh mục loại chấn thương.',
          })
        }
      } else if (currentCategory === 'trauma') {
        const result = await traumaApi.getAllForAdmin({
          page: 1,
          pageSize: 1000,
          code: filterCode.trim() || undefined,
          name: filterName.trim() || undefined,
          isActive,
        })
        if (result.success && result.data) {
          setData(result.data.items)
          setTotalItems(result.data.items.length)
        } else {
          setData([])
          setTotalItems(0)
          notificate?.showNotification({
            type: 'error',
            message: result.message || 'Không thể tải danh mục yếu tố gây chấn thương.',
          })
        }
      }
    } catch (error) {
      console.error(error)
      notificate?.showNotification({
        type: 'error',
        message: 'Lỗi kết nối hệ thống. Vui lòng thử lại sau.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter input change handler
  const handleFilterChange = (field: string, value: string) => {
    if (field === 'code') setFilterCode(value)
    if (field === 'name') setFilterName(value)
    if (field === 'level') setFilterLevel(value)
    if (field === 'status') setFilterStatus(value)
    setCurrentPage(1)
  }

  // Edit action
  const handleOpenEdit = async (item: any) => {
    setEditingItem(item)
    if (currentCategory === 'job') {
      setJobForm({
        code: item.code,
        name: item.name,
        parentId: item.parentId !== null && item.parentId !== undefined ? String(item.parentId) : '',
        status: item.isActive ? 'true' : 'false',
      })
      setJobErrors({ code: '', name: '', parentId: '' })
      setIsJobModalOpen(true)

      // Fetch detail to get rich relationships
      try {
        const result = await jobApi.getDetail(item.id)
        if (result.success && result.data) {
          setEditingItem(result.data)
          setJobForm((prev) => ({
            ...prev,
            parentId: result.data?.parentId !== null && result.data?.parentId !== undefined ? String(result.data.parentId) : '',
          }))
        }
      } catch (e) {
        console.error('Lỗi khi tải chi tiết nghề nghiệp', e)
      }
    } else if (currentCategory === 'injury') {
      setInjuryForm({
        code: item.code,
        name: item.name,
        parentId: item.parentId !== null && item.parentId !== undefined ? String(item.parentId) : '',
        status: item.isActive ? 'true' : 'false',
      })
      setInjuryErrors({ code: '', name: '', parentId: '' })
      setIsInjuryModalOpen(true)

      // Fetch detail to get rich relationships
      try {
        const result = await injuryApi.getDetail(item.id)
        if (result.success && result.data) {
          setEditingItem(result.data)
          setInjuryForm((prev) => ({
            ...prev,
            parentId: result.data?.parentId !== null && result.data?.parentId !== undefined ? String(result.data.parentId) : '',
          }))
        }
      } catch (e) {
        console.error('Lỗi khi tải chi tiết loại chấn thương', e)
      }
    } else if (currentCategory === 'trauma') {
      setTraumaForm({
        code: item.code,
        name: item.name,
        status: item.isActive ? 'true' : 'false',
      })
      setTraumaErrors({ code: '', name: '' })
      setIsTraumaModalOpen(true)
    }
  }

  // New item open dialog
  const handleOpenNew = () => {
    setEditingItem(null)
    if (currentCategory === 'job') {
      setJobForm({ code: '', name: '', parentId: '', status: 'true' })
      setJobErrors({ code: '', name: '', parentId: '' })
      setIsJobModalOpen(true)
    } else if (currentCategory === 'injury') {
      setInjuryForm({ code: '', name: '', parentId: '', status: 'true' })
      setInjuryErrors({ code: '', name: '', parentId: '' })
      setIsInjuryModalOpen(true)
    } else if (currentCategory === 'trauma') {
      setTraumaForm({ code: '', name: '', status: 'true' })
      setTraumaErrors({ code: '', name: '' })
      setIsTraumaModalOpen(true)
    }
  }

  // Toggle switch row item status
  const handleToggleStatus = async (item: any) => {
    const nextStatus = !item.isActive
    // Optimistic UI state update
    setData((prev) =>
      prev.map((x) => (x.id === item.id ? { ...x, isActive: nextStatus } : x))
    )

    try {
      let result
      if (currentCategory === 'job') {
        result = await jobApi.toggleActive(item.id, nextStatus)
      } else if (currentCategory === 'injury') {
        result = await injuryApi.toggleActive(item.id, nextStatus)
      } else {
        result = await traumaApi.toggleActive(item.id, nextStatus)
      }

      if (result.success) {
        notificate?.showNotification({
          type: 'success',
          message: `Đã thay đổi trạng thái của "${item.name}" thành công.`,
        })
        fetchParentOptions()
      } else {
        // Rollback
        setData((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, isActive: !nextStatus } : x))
        )
        notificate?.showNotification({
          type: 'error',
          message: result.message || 'Thay đổi trạng thái thất bại.',
        })
      }
    } catch (error) {
      console.error(error)
      // Rollback
      setData((prev) =>
        prev.map((x) => (x.id === item.id ? { ...x, isActive: !nextStatus } : x))
      )
      notificate?.showNotification({
        type: 'error',
        message: 'Lỗi hệ thống khi thay đổi trạng thái.',
      })
    }
  }

  // Save changes
  const handleSaveItem = async () => {
    if (currentCategory === 'job') {
      if (!jobForm.code.trim()) {
        setJobErrors((prev) => ({ ...prev, code: 'Mã ngành là bắt buộc' }))
        return
      }
      if (!jobForm.name.trim()) {
        setJobErrors((prev) => ({ ...prev, name: 'Tên ngành là bắt buộc' }))
        return
      }

      setIsSaving(true)
      try {
        const parentId = jobForm.parentId ? Number(jobForm.parentId) : null
        if (editingItem) {
          const updatePromises = [
            jobApi.update(editingItem.id, { name: jobForm.name, parentId }),
          ]
          const nextActive = jobForm.status === 'true'
          if (editingItem.isActive !== nextActive) {
            updatePromises.push(jobApi.toggleActive(editingItem.id, nextActive))
          }
          const [res] = await Promise.all(updatePromises)
          if (res.success) {
            notificate?.showNotification({ type: 'success', message: 'Cập nhật nghề nghiệp thành công.' })
            setIsJobModalOpen(false)
            fetchDataList()
            fetchParentOptions()
          } else {
            notificate?.showNotification({ type: 'error', message: res.message || 'Lỗi khi cập nhật nghề nghiệp.' })
          }
        } else {
          const res = await jobApi.create({
            code: jobForm.code,
            name: jobForm.name,
            parentId,
            isActive: jobForm.status === 'true',
          })
          if (res.success) {
            notificate?.showNotification({ type: 'success', message: 'Thêm mới nghề nghiệp thành công.' })
            setIsJobModalOpen(false)
            setCurrentPage(1)
            fetchDataList()
            fetchParentOptions()
          } else {
            notificate?.showNotification({ type: 'error', message: res.message || 'Lỗi khi tạo nghề nghiệp.' })
          }
        }
      } catch (err) {
        console.error(err)
        notificate?.showNotification({ type: 'error', message: 'Lỗi lưu trữ dữ liệu.' })
      } finally {
        setIsSaving(false)
      }
    } else if (currentCategory === 'injury') {
      if (!injuryForm.code.trim()) {
        setInjuryErrors((prev) => ({ ...prev, code: 'Mã số là bắt buộc' }))
        return
      }
      if (!injuryForm.name.trim()) {
        setInjuryErrors((prev) => ({ ...prev, name: 'Tên loại chấn thương là bắt buộc' }))
        return
      }

      setIsSaving(true)
      try {
        const parentId = injuryForm.parentId ? Number(injuryForm.parentId) : null
        if (editingItem) {
          const updatePromises = [
            injuryApi.update(editingItem.id, { name: injuryForm.name, parentId }),
          ]
          const nextActive = injuryForm.status === 'true'
          if (editingItem.isActive !== nextActive) {
            updatePromises.push(injuryApi.toggleActive(editingItem.id, nextActive))
          }
          const [res] = await Promise.all(updatePromises)
          if (res.success) {
            notificate?.showNotification({ type: 'success', message: 'Cập nhật loại chấn thương thành công.' })
            setIsInjuryModalOpen(false)
            fetchDataList()
            fetchParentOptions()
          } else {
            notificate?.showNotification({ type: 'error', message: res.message || 'Lỗi khi cập nhật loại chấn thương.' })
          }
        } else {
          const res = await injuryApi.create({
            code: injuryForm.code,
            name: injuryForm.name,
            parentId,
            isActive: injuryForm.status === 'true',
          })
          if (res.success) {
            notificate?.showNotification({ type: 'success', message: 'Thêm mới loại chấn thương thành công.' })
            setIsInjuryModalOpen(false)
            setCurrentPage(1)
            fetchDataList()
            fetchParentOptions()
          } else {
            notificate?.showNotification({ type: 'error', message: res.message || 'Lỗi khi tạo loại chấn thương.' })
          }
        }
      } catch (err) {
        console.error(err)
        notificate?.showNotification({ type: 'error', message: 'Lỗi lưu trữ dữ liệu.' })
      } finally {
        setIsSaving(false)
      }
    } else if (currentCategory === 'trauma') {
      if (!traumaForm.code.trim()) {
        setTraumaErrors((prev) => ({ ...prev, code: 'Mã yếu tố là bắt buộc' }))
        return
      }
      if (!traumaForm.name.trim()) {
        setTraumaErrors((prev) => ({ ...prev, name: 'Tên yếu tố là bắt buộc' }))
        return
      }

      setIsSaving(true)
      try {
        if (editingItem) {
          const updatePromises = [
            traumaApi.update(editingItem.id, { code: traumaForm.code, name: traumaForm.name }),
          ]
          const nextActive = traumaForm.status === 'true'
          if (editingItem.isActive !== nextActive) {
            updatePromises.push(traumaApi.toggleActive(editingItem.id, nextActive))
          }
          const [res] = await Promise.all(updatePromises)
          if (res.success) {
            notificate?.showNotification({ type: 'success', message: 'Cập nhật yếu tố chấn thương thành công.' })
            setIsTraumaModalOpen(false)
            fetchDataList()
          } else {
            notificate?.showNotification({ type: 'error', message: res.message || 'Lỗi khi cập nhật yếu tố.' })
          }
        } else {
          const res = await traumaApi.create({
            code: traumaForm.code,
            name: traumaForm.name,
            isActive: traumaForm.status === 'true',
          })
          if (res.success) {
            notificate?.showNotification({ type: 'success', message: 'Thêm mới yếu tố chấn thương thành công.' })
            setIsTraumaModalOpen(false)
            setCurrentPage(1)
            fetchDataList()
          } else {
            notificate?.showNotification({ type: 'error', message: res.message || 'Lỗi khi tạo yếu tố chấn thương.' })
          }
        }
      } catch (err) {
        console.error(err)
        notificate?.showNotification({ type: 'error', message: 'Lỗi lưu trữ dữ liệu.' })
      } finally {
        setIsSaving(false)
      }
    }
  }

  // Selection Checkboxes
  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? paginatedData.map((r) => r.id) : [])
  }

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  // Delete Action
  const handleDeleteItems = async () => {
    setIsDeleting(true)
    try {
      let result
      if (currentCategory === 'job') {
        result = await jobApi.bulkDelete(selectedIds)
      } else if (currentCategory === 'injury') {
        result = await injuryApi.bulkDelete(selectedIds)
      } else {
        result = await traumaApi.bulkDelete(selectedIds)
      }

      if (result.success) {
        notificate?.showNotification({
          type: 'success',
          message:
            selectedIds.length === 1
              ? 'Xóa bản ghi thành công.'
              : `Đã xóa thành công ${selectedIds.length} bản ghi.`,
        })
        setSelectedIds([])
        setCurrentPage(1)
        fetchParentOptions()
        fetchDataList()
      } else {
        notificate?.showNotification({
          type: 'error',
          message: result.message || 'Không thể xóa các bản ghi đã chọn.',
        })
      }
    } catch (error) {
      console.error(error)
      notificate?.showNotification({
        type: 'error',
        message: 'Lỗi hệ thống khi xóa dữ liệu.',
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  // Excel export
  const handleExportExcel = () => {
    if (currentCategory === 'job') {
      const exportData = data.map((item: any) => ({
        ...item,
        statusText: item.isActive ? 'Sử dụng' : 'Ngừng sử dụng',
      }))
      exportToExcel(
        exportData,
        [
          { key: 'code', label: 'Mã ngành' },
          { key: 'name', label: 'Tên ngành' },
          { key: 'levelText', label: 'Cấp' },
          { key: 'statusText', label: 'Trạng thái' },
        ],
        'Danh_muc_nghe_nghiep'
      )
    } else if (currentCategory === 'injury') {
      const exportData = data.map((item: any) => ({
        ...item,
        statusText: item.isActive ? 'Sử dụng' : 'Ngừng sử dụng',
      }))
      exportToExcel(
        exportData,
        [
          { key: 'code', label: 'Mã số' },
          { key: 'name', label: 'Tên loại chấn thương' },
          { key: 'levelText', label: 'Cấp' },
          { key: 'statusText', label: 'Trạng thái' },
        ],
        'Loai_chan_thuong'
      )
    } else if (currentCategory === 'trauma') {
      const exportData = data.map((item: any) => ({
        ...item,
        statusText: item.isActive ? 'Sử dụng' : 'Ngừng sử dụng',
      }))
      exportToExcel(
        exportData,
        [
          { key: 'code', label: 'Mã yếu tố' },
          { key: 'name', label: 'Tên yếu tố' },
          { key: 'statusText', label: 'Trạng thái' },
        ],
        'Yeu_to_gay_chan_thuong'
      )
    }
  }

  // Import from file mock
  const handleImportMock = () => {
    notificate?.showNotification({
      type: 'error',
      message: 'Tính năng import file đang được phát triển.',
    })
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const allSelected = paginatedData.length > 0 && paginatedData.every((r) => selectedIds.includes(r.id))

  const GRID_COLS = currentCategory === 'trauma' ? GRID_COLS_FLAT : GRID_COLS_HIERARCHY

  if (authenticate?.state?.role?.code === 'business') {
    return <NotFound />
  }

  return (
    <main className="h-screen flex flex-col py-2">
      {/* Top Header / Toolbar styled dynamically */}
      <div className="bg-white px-5 py-3 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-bold text-gray-800">Khai báo danh mục chung</h1>

        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            <i className="fa-solid fa-download text-xs text-primary" />
            <span>Xuất danh sách</span>
          </button>
          <button
            type="button"
            onClick={handleImportMock}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            <i className="fa-solid fa-upload text-xs text-primary" />
            <span>Thêm từ file</span>
          </button>
          <button
            type="button"
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:opacity-90 transition-opacity"
          >
            <i className="fa-solid fa-plus text-xs" />
            <span>Thêm mới</span>
          </button>
        </div>
      </div>


      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">
        {/* Table Search / Filter Header */}
        <div className="shrink-0 border-b border-gray-200">
          <select
            value={currentCategory}
            onChange={(e) => setCurrentCategory(e.target.value as CategoryType)}
            className="border border-gray-400 rounded-sm my-4 ml-2 pl-2 pr-10 py-2 font-medium text-sm outline-none focus:border-primary cursor-pointer bg-white"
          >
            <option value="job">Danh mục nghề nghiệp</option>
            <option value="trauma">Yếu tố gây chấn thương</option>
            <option value="injury">Loại chấn thương</option>
          </select>
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
            {currentCategory === 'job' && (
              <>
                <div className="px-3 py-2">Mã ngành</div>
                <div className="px-3 py-2">Tên ngành</div>
                <div className="px-3 py-2">Cấp</div>
              </>
            )}
            {currentCategory === 'injury' && (
              <>
                <div className="px-3 py-2">Mã số</div>
                <div className="px-3 py-2">Tên loại chấn thương</div>
                <div className="px-3 py-2">Cấp</div>
              </>
            )}
            {currentCategory === 'trauma' && (
              <>
                <div className="px-3 py-2">Mã yếu tố</div>
                <div className="px-3 py-2">Tên yếu tố gây chấn thương</div>
              </>
            )}
            <div className="px-3 py-2 text-center">Trạng thái</div>
          </div>

          {/* Filter inputs */}
          <div className={`grid ${GRID_COLS} pb-2 pt-2 bg-gray-50/20`}>
            <div />
            <div />
            <div className="px-3">
              <input
                type="text"
                placeholder={currentCategory === 'trauma' ? 'Tìm mã yếu tố...' : currentCategory === 'job' ? 'Tìm mã ngành...' : 'Tìm mã số...'}
                value={filterCode}
                onChange={(e) => handleFilterChange('code', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              />
            </div>
            <div className="px-3">
              <input
                type="text"
                placeholder={currentCategory === 'trauma' ? 'Tìm tên yếu tố...' : currentCategory === 'job' ? 'Tìm tên ngành...' : 'Tìm tên chấn thương...'}
                value={filterName}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white"
              />
            </div>
            {currentCategory !== 'trauma' && (
              <div className="px-3">
                <select
                  value={filterLevel}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white"
                >
                  <option value="">Tất cả</option>
                  <option value="1">Cấp 1</option>
                  <option value="2">Cấp 2</option>
                  <option value="3">Cấp 3</option>
                  {currentCategory === 'job' && <option value="4">Cấp 4</option>}
                </select>
              </div>
            )}
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
                    onClick={() => handleOpenEdit(item)}
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
                    {currentCategory !== 'trauma' && getLevelPrefix(item.level)}
                    {currentCategory !== 'trauma' && item.level === 1 ? (
                      <span className="font-semibold uppercase">{item.name}</span>
                    ) : (
                      item.name
                    )}
                  </span>
                </div>

                {/* Level (Hierarchy only) */}
                {currentCategory !== 'trauma' && (
                  <div className="flex items-center px-3 py-2.5">
                    {item.levelText || `Cấp ${item.level}`}
                  </div>
                )}

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
        title="Xác nhận xóa bản ghi danh mục"
        description={
          selectedIds.length === 1
            ? 'Bạn có chắc chắn muốn xóa bản ghi đã chọn?\nDữ liệu sau khi xóa sẽ không thể khôi phục.'
            : `Bạn có chắc chắn muốn xóa ${selectedIds.length} bản ghi đã chọn?\nDữ liệu sau khi xóa sẽ không thể khôi phục.`
        }
        onConfirm={handleDeleteItems}
        onCancel={() => {
          if (!isDeleting) {
            setShowDeleteConfirm(false)
          }
        }}
        loading={isDeleting}
      />

      {/* Job Form Modal */}
      <JobModal
        isOpen={isJobModalOpen}
        editingItem={editingItem}
        allJobs={parentJobs}
        form={jobForm}
        errors={jobErrors}
        isLoading={isSaving}
        loadingParents={loadingParents}
        onClose={() => setIsJobModalOpen(false)}
        onSave={handleSaveItem}
        onChange={(field, val) => setJobForm((prev) => ({ ...prev, [field]: val }))}
      />

      {/* Injury Type Form Modal */}
      <InjuryTypeModal
        isOpen={isInjuryModalOpen}
        editingItem={editingItem}
        allInjuries={parentInjuries}
        form={injuryForm}
        errors={injuryErrors}
        isLoading={isSaving}
        loadingParents={loadingParents}
        onClose={() => setIsInjuryModalOpen(false)}
        onSave={handleSaveItem}
        onChange={(field, val) => setInjuryForm((prev) => ({ ...prev, [field]: val }))}
      />

      {/* Trauma Form Modal */}
      <TraumaModal
        isOpen={isTraumaModalOpen}
        editingItem={editingItem}
        form={traumaForm}
        errors={traumaErrors}
        isLoading={isSaving}
        onClose={() => setIsTraumaModalOpen(false)}
        onSave={handleSaveItem}
        onChange={(field, val) => setTraumaForm((prev) => ({ ...prev, [field]: val }))}
      />
    </main>
  )
}
