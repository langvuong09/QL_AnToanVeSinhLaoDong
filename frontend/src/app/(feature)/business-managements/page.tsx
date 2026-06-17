'use client'

import { useCallback, useContext, useEffect, useState } from 'react'
import TopHero from '@/src/components/TopHero'
import ToggleSwitch from '@/src/components/ToggleSwitch'
import EnterpriseModal from '@/src/components/modals/EnterpriseModal'
import EnterpriseImportModal from '@/src/components/modals/EnterpriseImportModal'
import PasswordResetModal from '@/src/components/modals/PasswordResetModal'
import BulkDeleteBar from '@/src/components/common/BulkDeleteBar'
import DeleteConfirmModal from '@/src/components/common/DeleteConfirmModal'
import { User } from '@/src/api/User'
import { DoetApi, type DoetPayload, type IDoetUser } from '@/src/api/Doet'
import { BusinessTypeApi, type IBusinessType } from '@/src/api/BusinessType'
import { IndustryApi, type IIndustry } from '@/src/api/Industry'
import { Media } from '@/src/api/Media'
import type { Enterprise, AttachmentGroupMock } from '@/src/mocks/enterprises'
import type { EnterpriseFormData, EnterpriseFormMode, AttachmentGroup } from '@/src/components/modals/EnterpriseStepOne'
import { parseAccessToken } from '@/src/utils/jwt-parser'
import { NotificateContext } from '@/src/contexts/notificate/notificate'

const GRID_COLS = 'grid-cols-[40px_100px_1fr_120px_160px_180px_140px_100px]'

function formatFileSizeFromUrl(file: { width?: number; height?: number; format?: string }) {
  const meta = [file.format?.toUpperCase(), file.width && file.height ? `${file.width}x${file.height}` : ''].filter(Boolean)
  return meta.join(' - ') || 'Đã upload'
}

function mapDoetUserToEnterprise(item: IDoetUser): Enterprise {
  const doet = item.doet
  const files = doet.files || []
  const groups: AttachmentGroupMock[] = [
    {
      groupName: 'Giấy phép kinh doanh',
      fileType: 'GPKD',
      files: files
        .filter((file) => file.fileType === 'GPKD')
        .map((file) => ({
          id: file.id,
          name: file.originalFilename,
          size: formatFileSizeFromUrl(file),
          url: file.secureUrl || file.url,
        })),
    },
    {
      groupName: 'Giấy tờ khác',
      fileType: 'OTHER',
      files: files
        .filter((file) => file.fileType !== 'GPKD')
        .map((file) => ({
          id: file.id,
          name: file.originalFilename,
          size: formatFileSizeFromUrl(file),
          url: file.secureUrl || file.url,
        })),
    },
  ]

  return {
    id: doet.id,
    userId: item.id,
    companyName: doet.name || '',
    taxCode: doet.taxCode || '',
    businessType: doet.businessType?.name || '',
    businessTypeId: doet.businessTypeId,
    industry: doet.industry ? `${doet.industry.code} - ${doet.industry.name}` : '',
    industryId: doet.industryId,
    ward: doet.ward?.value || '',
    status: doet.status,
    foreignName: doet.foreignName || '',
    email: item.email || '',
    phone: doet.phone || '',
    gpkdDate: doet.issuedDate ? String(doet.issuedDate).slice(0, 10) : '',
    gpkdProvince: doet.province?.value || item.province?.value || '',
    gpkdProvinceData: doet.province || item.province || { key: 0, value: '' },
    gpkdWard: doet.ward?.value || item.ward?.value || '',
    gpkdWardData: doet.ward || item.ward || { key: 0, value: '' },
    address: doet.address || item.address || '',
    businessProvince: doet.province?.value || item.province?.value || '',
    businessProvinceData: doet.province || item.province || { key: 0, value: '' },
    businessWard: doet.ward?.value || item.ward?.value || '',
    businessWardData: doet.ward || item.ward || { key: 0, value: '' },
    businessAddress: doet.address || item.address || '',
    representative: doet.representative || '',
    representativePhone: doet.repPhone || '',
    attachments: groups,
  }
}

function buildDoetPayload(form: EnterpriseFormData, includeTaxCode: boolean): DoetPayload {
  const payload: DoetPayload = {
    name: form.companyName.trim(),
    issuedDate: form.gpkdDate,
    businessTypeId: Number(form.businessTypeId),
    industryId: Number(form.industryId),
    foreignName: form.foreignName.trim() || undefined,
    representative: form.representative.trim() || undefined,
    repPhone: form.representativePhone.trim() || undefined,
    phone: form.phone.trim() || undefined,
    email: form.email.trim() || undefined,
    address: form.address.trim() || undefined,
    province: form.gpkdProvinceData,
    district: { key: 0, value: '' },
    ward: form.gpkdWardData,
  }

  if (includeTaxCode) payload.taxCode = form.taxCode.trim()
  return payload
}

export default function BusinessManagementsPage() {
  const notificate = useContext(NotificateContext)
  const [data, setData] = useState<Enterprise[]>([])
  const [viewMode, setViewMode] = useState<EnterpriseFormMode | 'list'>('list')
  const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [userRole, setUserRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetTarget, setResetTarget] = useState<Enterprise | null>(null)
  const [businessTypes, setBusinessTypes] = useState<IBusinessType[]>([])
  const [industries, setIndustries] = useState<IIndustry[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isImportOpen, setIsImportOpen] = useState(false)

  const [filterName, setFilterName] = useState('')
  const [filterTaxCode, setFilterTaxCode] = useState('')
  const [filterBusinessType, setFilterBusinessType] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('')
  const [filterWard, setFilterWard] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')
    if (accessToken) {
      const parsed = parseAccessToken(accessToken)
      if (parsed?.role?.name) setUserRole(parsed.role.name)
    }
  }, [])

  useEffect(() => {
    const loadOptions = async () => {
      const [businessTypeResult, industryResult] = await Promise.all([
        new BusinessTypeApi().getAllForBusiness({ page: 1, pageSize: 1000 }),
        new IndustryApi().getAllForBusiness({ page: 1, pageSize: 1000, level: 4 }),
      ])

      if (businessTypeResult.success) setBusinessTypes(businessTypeResult.data?.items.filter((item) => item.isActive) || [])
      if (industryResult.success) setIndustries((industryResult.data?.items || []).filter((item) => item.level === 4 && item.isActive))
    }

    loadOptions()
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    const result = await new DoetApi().getAll({
      page: currentPage,
      pageSize,
      name: filterName || undefined,
      taxCode: filterTaxCode || undefined,
      businessTypeId: filterBusinessType ? Number(filterBusinessType) : undefined,
      industryId: filterIndustry ? Number(filterIndustry) : undefined,
      ward: filterWard || undefined,
      status: filterStatus || undefined,
    })
    setLoading(false)

    if (!result.success) {
      notificate?.showNotification({ type: 'error', message: result.message })
      return
    }

    setData((result.data?.items || []).map(mapDoetUserToEnterprise))
    setTotalItems(result.data?.count || 0)
    setSelectedIds([])
  }, [currentPage, pageSize, filterName, filterTaxCode, filterBusinessType, filterIndustry, filterWard, filterStatus, notificate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const paginatedRows = data
  const allSelected = paginatedRows.length > 0 && paginatedRows.every((row) => selectedIds.includes(row.id))

  const openNew = () => {
    setSelectedEnterprise(null)
    setViewMode('create')
  }

  const openDetail = async (item: Enterprise, mode: 'edit' | 'view') => {
    const result = await new DoetApi().getDetail(item.id)
    if (!result.success || !result.data) {
      notificate?.showNotification({ type: 'error', message: result.message })
      return
    }
    setSelectedEnterprise(mapDoetUserToEnterprise(result.data))
    setViewMode(mode)
  }

  const handleUploadPendingFiles = async (doetId: number, attachments: AttachmentGroup[]) => {
    const media = new Media()
    const failedFiles: string[] = []

    for (const group of attachments) {
      for (const file of group.files) {
        if (!file.file) continue
        const formData = new FormData()
        formData.append('fileType', group.fileType)
        formData.append('doetId', String(doetId))
        formData.append('file', file.file)
        
        try {
          const res = await media.UploadImage(formData)
          if (!res.success) failedFiles.push(file.name)
        } catch {
          failedFiles.push(file.name)
        }
      }
    }

    if (failedFiles.length > 0) {
      throw new Error(`Upload thất bại: ${failedFiles.join(', ')}`)
    }
  }

  const handleSave = async (form: EnterpriseFormData, attachments: AttachmentGroup[]) => {
    const api = new DoetApi()
    const isEdit = viewMode === 'edit' && selectedEnterprise
    const payload = buildDoetPayload(form, !isEdit)

    const result = isEdit
      ? await api.update(selectedEnterprise.id, payload)
      : await api.create(payload)

    if (!result.success || !result.data) {
      return { success: false, message: result.message }
    }

    try {
      await handleUploadPendingFiles(result.data.id, attachments)
      await fetchData()
      return {
        success: true,
        message: isEdit ? 'Cập nhật doanh nghiệp thành công' : 'Khai báo doanh nghiệp thành công',
        savedId: result.data.id,
        rawResult: result.data,
      }
    } catch {
      await fetchData()
      return {
        success: false,
        message: 'Doanh nghiệp đã được lưu nhưng upload tài liệu thất bại. Vui lòng mở chỉnh sửa và tải lại tài liệu.',
        savedId: result.data.id,
        rawResult: result.data,
      }
    }
  }

  const handleToggleStatus = async (item: Enterprise) => {
    const result = await new DoetApi().toggleStatus(item.id, !item.status)
    if (!result.success) {
      notificate?.showNotification({ type: 'error', message: result.message })
      return
    }
    setData((prev) => prev.map((row) => row.id === item.id ? { ...row, status: !row.status } : row))
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await new DoetApi().bulkDelete(selectedIds)
    setIsDeleting(false)
    setShowDeleteConfirm(false)

    if (!result.success) {
      notificate?.showNotification({ type: 'error', message: result.message })
      return
    }

    notificate?.showNotification({
      type: 'success',
      message: selectedIds.length === 1 ? 'Xóa doanh nghiệp thành công.' : `Đã xóa thành công ${selectedIds.length} doanh nghiệp.`,
    })
    setSelectedIds([])
    fetchData()
  }

  const resetFilters = (setter: (value: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }

  if (viewMode !== 'list') {
    return (
      <EnterpriseModal
        isOpen
        onClose={() => {
          setViewMode('list')
          setSelectedEnterprise(null)
        }}
        onSave={handleSave}
        mode={viewMode}
        initialData={selectedEnterprise}
        userRole={userRole}
        businessTypes={businessTypes}
        industries={industries}
      />
    )
  }

  return (
    <main className="h-screen flex flex-col py-2">
      <TopHero
        title="Danh sách doanh nghiệp"
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsImportOpen(true)}
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

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">
        <div className="shrink-0 border-b border-gray-200">
          <div className={`grid ${GRID_COLS} text-xs text-gray-500 font-medium bg-gray-50/50`}>
            <div className="flex items-center justify-center py-2">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 accent-primary cursor-pointer"
                checked={allSelected}
                onChange={(event) => setSelectedIds(event.target.checked ? paginatedRows.map((row) => row.id) : [])}
              />
            </div>
            <div className="px-2 py-2">Thao tác</div>
            <div className="px-3 py-2">Tên doanh nghiệp</div>
            <div className="px-3 py-2">Mã số thuế</div>
            <div className="px-3 py-2">Loại hình kinh doanh</div>
            <div className="px-3 py-2">Ngành nghề kinh doanh</div>
            <div className="px-3 py-2">Phường/xã</div>
            <div className="px-3 py-2 text-center">Trạng thái</div>
          </div>

          <div className={`grid ${GRID_COLS} pb-2`}>
            <div />
            <div />
            <div className="px-3">
              <input type="text" value={filterName} onChange={(event) => resetFilters(setFilterName, event.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div className="px-3">
              <input type="text" value={filterTaxCode} onChange={(event) => resetFilters(setFilterTaxCode, event.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div className="px-3">
              <select value={filterBusinessType} onChange={(event) => resetFilters(setFilterBusinessType, event.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white">
                <option value="">Tất cả</option>
                {businessTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
              </select>
            </div>
            <div className="px-3">
              <select value={filterIndustry} onChange={(event) => resetFilters(setFilterIndustry, event.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white">
                <option value="">Tất cả</option>
                {industries.map((industry) => <option key={industry.id} value={industry.id}>{industry.code} - {industry.name}</option>)}
              </select>
            </div>
            <div className="px-3">
              <input type="text" value={filterWard} onChange={(event) => resetFilters(setFilterWard, event.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div className="px-3">
              <select value={filterStatus} onChange={(event) => resetFilters(setFilterStatus, event.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary transition-colors bg-white">
                <option value="">Tất cả</option>
                <option value="true">Sử dụng</option>
                <option value="false">Ngừng sử dụng</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">Đang tải dữ liệu...</div>
          ) : paginatedRows.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">Không có dữ liệu</div>
          ) : (
            paginatedRows.map((item) => (
              <div key={item.id} className={`grid ${GRID_COLS} border-b border-gray-100 hover:bg-blue-50/40 transition-colors text-sm text-gray-700`}>
                <div className="flex items-center justify-center py-2.5">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-primary cursor-pointer"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => setSelectedIds((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])}
                  />
                </div>
                <div className="flex items-center gap-2 px-2 py-2.5">
                  <button type="button" onClick={() => openDetail(item, 'view')} className="text-gray-400 hover:text-primary transition-colors" title="Xem chi tiết">
                    <i className="fa-solid fa-eye text-xs" />
                  </button>
                  <button type="button" onClick={() => openDetail(item, 'edit')} className="text-gray-400 hover:text-primary transition-colors" title="Chỉnh sửa">
                    <i className="fa-solid fa-pen text-xs" />
                  </button>
                  <button type="button" onClick={() => { setResetTarget(item); setShowResetPassword(true) }} className="text-gray-400 hover:text-primary transition-colors" title="Reset mật khẩu">
                    <i className="fa-solid fa-key text-xs" />
                  </button>
                </div>
                <div className="flex items-center px-3 py-2.5 truncate">{item.companyName}</div>
                <div className="flex items-center px-3 py-2.5">{item.taxCode}</div>
                <div className="flex items-center px-3 py-2.5 truncate">{item.businessType}</div>
                <div className="flex items-center px-3 py-2.5 truncate">{item.industry}</div>
                <div className="flex items-center px-3 py-2.5 truncate">{item.ward}</div>
                <div className="flex items-center justify-center py-2.5">
                  <ToggleSwitch checked={item.status} onChange={() => handleToggleStatus(item)} />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="shrink-0 flex items-center justify-end gap-4 px-5 py-3 border-t border-gray-200 text-sm text-gray-500">
          <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1) }} className="border border-gray-300 rounded px-2 py-1 text-sm outline-none cursor-pointer bg-white hover:border-gray-400 transition-colors">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-500 tabular-nums">
            {totalItems === 0 ? '0' : `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalItems)}`} of {totalItems}
          </span>
          <div className="flex items-center gap-1">
            <button type="button" disabled={currentPage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <button type="button" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>
        </div>
      </div>

      {resetTarget && (
        <PasswordResetModal
          isOpen={showResetPassword}
          onClose={() => { setShowResetPassword(false); setResetTarget(null) }}
          username={resetTarget.taxCode.replace(/-/g, '')}
          companyName={resetTarget.companyName}
          onConfirm={async (password) => {
            if (!resetTarget.userId) {
              notificate?.showNotification({ type: 'error', message: 'Không tìm thấy tài khoản liên kết với doanh nghiệp này.' })
              return
            }
            const res = await new User().SetPassword(resetTarget.userId, password)
            if (res.success) {
              notificate?.showNotification({ type: 'success', message: `Đặt lại mật khẩu cho doanh nghiệp ${resetTarget.companyName} thành công.` })
              setShowResetPassword(false)
              setResetTarget(null)
            } else {
              notificate?.showNotification({ type: 'error', message: res.message || 'Có lỗi xảy ra khi đặt lại mật khẩu.' })
            }
          }}
        />
      )}

      <BulkDeleteBar selectedCount={selectedIds.length} onDelete={() => setShowDeleteConfirm(true)} onClearSelection={() => setSelectedIds([])} loading={isDeleting} />

      <DeleteConfirmModal
        open={showDeleteConfirm}
        count={selectedIds.length}
        title="Xác nhận xóa doanh nghiệp"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        loading={isDeleting}
      />

      {isImportOpen && (
        <EnterpriseImportModal
          isOpen
          onClose={() => setIsImportOpen(false)}
          businessTypes={businessTypes}
          industries={industries}
          onSuccess={() => {
            fetchData()
          }}
        />
      )}
    </main>
  )
}
