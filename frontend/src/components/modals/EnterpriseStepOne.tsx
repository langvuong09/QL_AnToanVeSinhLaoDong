'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import DateLengend from '@/src/components/DateLengend'
import InputLegend from '@/src/components/InputLegend'
import SelectLegend from '@/src/components/SelectLegend'
import type { IBusinessType } from '@/src/api/BusinessType'
import type { IIndustry } from '@/src/api/Industry'
import type { ElementAddress } from '@/src/api/User'
import type { Province, Ward } from '@/src/services/open-address'

export type EnterpriseFormMode = 'create' | 'edit' | 'view'

export type EnterpriseFormData = {
  companyName: string
  taxCode: string
  businessType: string
  businessTypeId: number | ''
  industry: string
  industryId: number | ''
  gpkdDate: string
  gpkdProvince: string
  gpkdProvinceData: ElementAddress
  gpkdWard: string
  gpkdWardData: ElementAddress
  address: string
  foreignName: string
  email: string
  phone: string
  businessProvince: string
  businessProvinceData: ElementAddress
  businessWard: string
  businessWardData: ElementAddress
  businessAddress: string
  representative: string
  representativePhone: string
}

export type EnterpriseFormErrors = Partial<Record<keyof EnterpriseFormData | 'attachments', string>>

export type UploadedFile = {
  id: number | string
  name: string
  size: string
  file?: File
  url?: string
  mimeType?: string
  fileType?: 'GPKD' | 'OTHER'
  uploading?: boolean
  error?: string
}

export type AttachmentGroup = {
  groupName: string
  fileType: 'GPKD' | 'OTHER'
  files: UploadedFile[]
}

// ── Helpers ──────────────────────────────────────────────────────────

function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

// ── SelectLegend-style searchable dropdown ───────────────────────────
// Renders with the same floating-label-on-border + chevron look as SelectLegend,
// but uses a text input internally so the user can type to filter.

type SearchableSelectLegendProps<T> = {
  label: string
  placeholder?: string
  value: string
  errorMess?: string
  disabled?: boolean
  require?: boolean
  options: T[]
  onSelect: (option: T) => void
  onClear: () => void
  getKey: (option: T) => number | string
  getDisplayString: (option: T) => string
  getSearchString: (option: T) => string
}

function SearchableSelectLegend<T>({
  label,
  placeholder = '',
  value,
  errorMess,
  disabled,
  require,
  options,
  onSelect,
  onClear,
  getKey,
  getDisplayString,
  getSearchString,
}: SearchableSelectLegendProps<T>) {
  const [search, setSearch] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const keyword = removeVietnameseTones(search.trim().toLowerCase())
    if (!keyword) return options
    return options.filter((item) => {
      const s = removeVietnameseTones(getSearchString(item).toLowerCase())
      return s.includes(keyword)
    })
  }, [options, search, getSearchString])

  useEffect(() => {
    if (!open) setSearch(value)
  }, [open, value])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const ringClass = disabled
    ? 'bg-gray-100 border border-gray-400 text-gray-600'
    : `ring ${errorMess ? 'ring-red-600' : 'ring-gray-400 focus-within:ring-blue-500 focus-within:ring-2'}`

  return (
    <div className="flex flex-col gap-2 flex-1" ref={ref}>
      <div className={`relative ${ringClass} px-2.5 pb-2 pt-2.5 rounded-sm`}>
        {label && (
          <label className="absolute bg-white bottom-full translate-y-1/2 text-sm text-gray-500 px-1">
            {label}
            {require && <span className="text-red-600">*</span>}
          </label>
        )}
        <div className="flex items-center">
          <input
            type="text"
            className="outline-none w-full bg-transparent"
            placeholder={placeholder}
            value={search}
            disabled={disabled}
            onFocus={() => !disabled && setOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value)
              setOpen(true)
              if (!e.target.value) onClear()
            }}
          />
          <button
            type="button"
            className="shrink-0 ml-1 text-gray-400"
            tabIndex={-1}
            onClick={() => !disabled && setOpen((v) => !v)}
          >
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {open && !disabled && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto text-sm">
            {filtered.length > 0 ? (
              filtered.map((option) => (
                <button
                  key={getKey(option)}
                  type="button"
                  className="block w-full text-left px-3 py-2 hover:bg-blue-50"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setSearch(getDisplayString(option))
                    onSelect(option)
                    setOpen(false)
                  }}
                >
                  {getDisplayString(option)}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-400">Không tìm thấy kết quả</div>
            )}
          </div>
        )}
      </div>
      {errorMess && <p className="text-red-600 text-xs">{errorMess}</p>}
    </div>
  )
}

// ── Props & Main Component ───────────────────────────────────────────

type Props = {
  form: EnterpriseFormData
  errors: EnterpriseFormErrors
  attachmentGroups: AttachmentGroup[]
  businessTypes: IBusinessType[]
  industries: IIndustry[]
  provinces: Province[]
  wards: Ward[]
  businessWards: Ward[]
  addressLoading?: boolean
  onChange: (field: keyof EnterpriseFormData, value: string | number | ElementAddress) => void
  onSelectGpkdProvince: (province: Province) => void
  onSelectGpkdWard: (ward: Ward) => void
  onSelectBusinessProvince: (province: Province) => void
  onSelectBusinessWard: (ward: Ward) => void
  onClearGpkdProvince: () => void
  onClearGpkdWard: () => void
  onClearBusinessProvince: () => void
  onClearBusinessWard: () => void
  onAddFiles: (groupIndex: number, files: FileList) => void
  onRemoveFile: (groupIndex: number, fileId: number | string) => void
  mode?: EnterpriseFormMode
  userRole?: string
}

export default function EnterpriseStepOne({
  form, errors, attachmentGroups, businessTypes, industries,
  provinces, wards, businessWards, addressLoading = false,
  onChange,
  onSelectGpkdProvince, onSelectGpkdWard,
  onSelectBusinessProvince, onSelectBusinessWard,
  onClearGpkdProvince, onClearGpkdWard,
  onClearBusinessProvince, onClearBusinessWard,
  onAddFiles, onRemoveFile,
  mode = 'create', userRole = '',
}: Props) {
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)

  const isViewMode = mode === 'view'
  const isEditMode = mode === 'edit'
  const isTaxCodeDisabled = isViewMode || isEditMode
  const isEmailDisabled = isViewMode

  const level4Industries = useMemo(() => industries.filter((i) => i.level === 4), [industries])

  const handleTaxCodeChange = (value: string) => {
    if (isTaxCodeDisabled) return
    onChange('taxCode', value.replace(/[^0-9-]/g, ''))
  }

  const handleBusinessTypeSelect = (t: IBusinessType) => {
    onChange('businessTypeId', t.id)
    onChange('businessType', t.name)
  }
  const handleBusinessTypeClear = () => { onChange('businessTypeId', ''); onChange('businessType', '') }

  const handleIndustrySelect = (i: IIndustry) => {
    onChange('industryId', i.id)
    onChange('industry', `${i.code} - ${i.name}`)
  }
  const handleIndustryClear = () => { onChange('industryId', ''); onChange('industry', '') }

  const handleFileChange = (groupIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) { onAddFiles(groupIndex, event.target.files); event.target.value = '' }
  }

  const handlePreview = (file: UploadedFile) => {
    if ((file.file?.type || file.mimeType || '').startsWith('image/') && file.url) { setPreviewFile(file); return }
    if (file.url) window.open(file.url, '_blank')
  }

  const sectionTitle = mode === 'create' ? 'Thêm mới doanh nghiệp' : mode === 'edit' ? 'Chỉnh sửa doanh nghiệp' : 'Chi tiết doanh nghiệp'

  return (
    <>
      <div className="space-y-6">
        {/* ── Section 1: Thông tin doanh nghiệp ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-4">{sectionTitle}</h3>

          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-4">
            <InputLegend
              label="Tên doanh nghiệp" require
              input={{ type: 'text', value: form.companyName, maxLength: 255, onChange: (e) => onChange('companyName', e.target.value), disabled: isViewMode }}
              errorMess={errors.companyName}
            />
            <InputLegend
              label="Mã số thuế" require
              input={{ type: 'text', value: form.taxCode, onChange: (e) => handleTaxCodeChange(e.target.value), maxLength: 15, disabled: isTaxCodeDisabled }}
              errorMess={errors.taxCode}
            />
            <SearchableSelectLegend
              label="Loại hình kinh doanh" require
              placeholder="Chọn loại hình" value={form.businessType} disabled={isViewMode}
              options={businessTypes}
              onSelect={handleBusinessTypeSelect} onClear={handleBusinessTypeClear}
              getKey={(o) => o.id} getDisplayString={(o) => `${o.code} - ${o.name}`} getSearchString={(o) => `${o.code} ${o.name}`}
              errorMess={errors.businessType}
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <SearchableSelectLegend
              label="Ngành nghề kinh doanh  chính" require
              placeholder="Chọn ngành nghề cấp 4" value={form.industry} disabled={isViewMode}
              options={level4Industries}
              onSelect={handleIndustrySelect} onClear={handleIndustryClear}
              getKey={(o) => o.id} getDisplayString={(o) => `${o.code} - ${o.name}`} getSearchString={(o) => `${o.code} ${o.name}`}
              errorMess={errors.industry}
            />
            <DateLengend
              label="Ngày cấp GPKD" require
              value={form.gpkdDate} onChange={(v) => onChange('gpkdDate', v)}
              disabled={isViewMode} errorMess={errors.gpkdDate} errorInput="Ngày cấp GPKD không hợp lệ"
            />
            <SelectLegend
              label="Tỉnh/Thành phố ĐKKD" require
              select={{ value: form.gpkdProvinceData.key || '', onChange: (e) => {
                const p = provinces.find((p) => p.code === Number(e.target.value))
                if (p) onSelectGpkdProvince(p); else onClearGpkdProvince()
              }, disabled: isViewMode }}
              errorMess={errors.gpkdProvince}
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
            </SelectLegend>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <SelectLegend
              label="Phường/Xã ĐKKD" require
              select={{ value: form.gpkdWardData.key || '', onChange: (e) => {
                const w = wards.find((w) => w.code === Number(e.target.value))
                if (w) onSelectGpkdWard(w); else onClearGpkdWard()
              }, disabled: isViewMode || !form.gpkdProvinceData.key }}
              errorMess={errors.gpkdWard}
            >
              <option value="">Chọn phường/xã</option>
              {wards.map((w) => <option key={w.code} value={w.code}>{w.name}</option>)}
            </SelectLegend>
            <div className="col-span-2">
              <InputLegend
                label="Địa chỉ"
                input={{ type: 'text', value: form.address, onChange: (e) => onChange('address', e.target.value), disabled: isViewMode }}
                errorMess={errors.address}
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Thông tin liên hệ ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>
          <div className="grid grid-cols-3 gap-4">
            <InputLegend label="Tên viết bằng tiếng nước ngoài"
              input={{ type: 'text', value: form.foreignName, maxLength: 255, onChange: (e) => onChange('foreignName', e.target.value), disabled: isViewMode }} />
            <InputLegend label="Email" require
              input={{ type: 'email', value: form.email, onChange: (e) => onChange('email', e.target.value), disabled: isEmailDisabled }}
              errorMess={errors.email} />
            <InputLegend label="Số điện thoại cơ quan"
              input={{ type: 'text', value: form.phone, onChange: (e) => onChange('phone', e.target.value.replace(/[^0-9+]/g, '')), disabled: isViewMode }}
              errorMess={errors.phone} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <SelectLegend label="Tỉnh/TP hoạt động KD"
              select={{ value: form.businessProvinceData.key || '', onChange: (e) => {
                const p = provinces.find((p) => p.code === Number(e.target.value))
                if (p) onSelectBusinessProvince(p); else onClearBusinessProvince()
              }, disabled: isViewMode }}>
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
            </SelectLegend>
            <SelectLegend label="Phường/Xã hoạt động KD"
              select={{ value: form.businessWardData.key || '', onChange: (e) => {
                const w = businessWards.find((w) => w.code === Number(e.target.value))
                if (w) onSelectBusinessWard(w); else onClearBusinessWard()
              }, disabled: isViewMode || !form.businessProvinceData.key }}>
              <option value="">Chọn phường/xã</option>
              {businessWards.map((w) => <option key={w.code} value={w.code}>{w.name}</option>)}
            </SelectLegend>
            <InputLegend label="Địa điểm kinh doanh"
              input={{ type: 'text', value: form.businessAddress, onChange: (e) => onChange('businessAddress', e.target.value), disabled: isViewMode }} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <InputLegend label="Người đứng đầu doanh nghiệp"
              input={{ type: 'text', value: form.representative, onChange: (e) => onChange('representative', e.target.value), disabled: isViewMode }}
              errorMess={errors.representative} />
            <InputLegend label="SĐT liên hệ người đứng đầu"
              input={{ type: 'text', value: form.representativePhone, onChange: (e) => onChange('representativePhone', e.target.value.replace(/[^0-9+]/g, '')), disabled: isViewMode }}
              errorMess={errors.representativePhone} />
            <div />
          </div>
        </div>

        {/* ── Section 3: File đính kèm ── */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">File đính kèm</h3>
          {errors.attachments && <p className="text-red-600 text-xs mb-2">{errors.attachments}</p>}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr_1fr_140px] bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-200 uppercase tracking-wider">
              <div className="px-6 py-3.5">Tên file</div>
              <div className="px-6 py-3.5">Thông tin file</div>
              <div className="px-6 py-3.5 text-center">Thao tác</div>
            </div>
            {attachmentGroups.map((group, groupIdx) => {
              const file = group.files[0]
              return (
                <div key={group.groupName} className="grid grid-cols-[1fr_1fr_140px] text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors items-center">
                  <div className="px-6 py-4 font-medium text-gray-900">{group.groupName}</div>
                  <div className="px-6 py-4">
                    {file ? (
                      <span className={`font-normal ${file.error ? 'text-red-500' : 'text-gray-800'}`}>
                        {file.uploading ? 'Đang upload...' : file.error || file.name}
                      </span>
                    ) : (<span className="text-gray-400 italic">Chưa tải</span>)}
                  </div>
                  <div className="px-6 py-4 flex items-center justify-center gap-4">
                    {file && (
                      <button type="button" onClick={() => handlePreview(file)} disabled={!file.url}
                        className="text-gray-400 hover:text-primary disabled:opacity-30 transition-colors" title="Xem trước">
                        <i className="fa-solid fa-eye text-base" />
                      </button>
                    )}
                    {!isViewMode && (
                      <>
                        <label htmlFor={`file-input-${groupIdx}`}
                          className="text-gray-400 hover:text-primary transition-colors cursor-pointer"
                          title={file ? 'Thay thế file' : 'Tải lên file'}>
                          <i className="fa-solid fa-upload text-base" />
                        </label>
                        <input id={`file-input-${groupIdx}`} type="file" className="hidden"
                          onChange={(e) => handleFileChange(groupIdx, e)} accept=".pdf,.jpg,.jpeg,.png,.webp" />
                      </>
                    )}
                    {file && !isViewMode && (
                      <button type="button" onClick={() => onRemoveFile(groupIdx, file.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors" title="Xóa file">
                        <i className="fa-solid fa-trash text-base" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {previewFile && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col overflow-hidden">
            <div className="bg-primary px-5 py-3 flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">Xem file</h3>
              <button type="button" onClick={() => setPreviewFile(null)} className="text-white/80 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <p className="font-semibold text-gray-800">{previewFile.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{previewFile.size}</p>
                </div>
                {previewFile.url && (
                  <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden max-w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewFile.url} alt={previewFile.name} className="max-w-full max-h-[400px] object-contain" />
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex justify-end">
              <button type="button" onClick={() => setPreviewFile(null)} className="px-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
