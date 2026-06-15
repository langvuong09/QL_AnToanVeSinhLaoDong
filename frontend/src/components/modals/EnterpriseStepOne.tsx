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

type AddressOption = Province | Ward

type AddressPickerProps<T extends AddressOption> = {
  label: string
  placeholder: string
  value: string
  errorMess?: string
  disabled?: boolean
  required?: boolean
  options: T[]
  loading?: boolean
  onSelect: (option: T) => void
  onClear: () => void
  getKey: (option: T) => number
}

function AddressPicker<T extends AddressOption>({
  label,
  placeholder,
  value,
  errorMess,
  disabled,
  required,
  options,
  loading,
  onSelect,
  onClear,
  getKey,
}: AddressPickerProps<T>) {
  const [search, setSearch] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return options
    return options.filter((item) => item.name.toLowerCase().includes(keyword))
  }, [options, search])

  useEffect(() => {
    if (!open) setSearch(value)
  }, [open, value])

  return (
    <div className="relative flex-1" ref={ref}>
      <InputLegend
        label={label}
        require={required}
        input={{
          type: 'text',
          placeholder,
          value: search,
          disabled,
          onFocus: () => !disabled && setOpen(true),
          onBlur: () => setTimeout(() => setOpen(false), 150),
          onChange: (event) => {
            const next = event.target.value
            setSearch(next)
            setOpen(true)
            if (!next) onClear()
          },
        }}
        errorMess={errorMess}
      />

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto text-sm">
          {loading ? (
            <div className="px-3 py-2 text-gray-400">Đang tải...</div>
          ) : filtered.length > 0 ? (
            filtered.map((option) => (
              <button
                key={getKey(option)}
                type="button"
                className="block w-full text-left px-3 py-2 hover:bg-blue-50"
                onMouseDown={(event) => {
                  event.preventDefault()
                  setSearch(option.name)
                  onSelect(option)
                  setOpen(false)
                }}
              >
                {option.name}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400">Không tìm thấy kết quả</div>
          )}
        </div>
      )}
    </div>
  )
}

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
  form,
  errors,
  attachmentGroups,
  businessTypes,
  industries,
  provinces,
  wards,
  businessWards,
  addressLoading = false,
  onChange,
  onSelectGpkdProvince,
  onSelectGpkdWard,
  onSelectBusinessProvince,
  onSelectBusinessWard,
  onClearGpkdProvince,
  onClearGpkdWard,
  onClearBusinessProvince,
  onClearBusinessWard,
  onAddFiles,
  onRemoveFile,
  mode = 'create',
  userRole = '',
}: Props) {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)

  const isViewMode = mode === 'view'
  const isEditMode = mode === 'edit'
  const isTaxCodeDisabled = isViewMode || isEditMode
  const isEmailDisabled = isViewMode || (isEditMode && userRole !== 'SỞ')

  const level4Industries = useMemo(() => industries.filter((industry) => industry.level === 4), [industries])

  const handleTaxCodeChange = (value: string) => {
    if (isTaxCodeDisabled) return
    onChange('taxCode', value.replace(/[^0-9-]/g, ''))
  }

  const handleBusinessTypeChange = (value: string) => {
    const id = Number(value)
    const selected = businessTypes.find((item) => item.id === id)
    onChange('businessTypeId', Number.isNaN(id) ? '' : id)
    onChange('businessType', selected ? selected.name : '')
  }

  const handleIndustryChange = (value: string) => {
    const id = Number(value)
    const selected = level4Industries.find((item) => item.id === id)
    onChange('industryId', Number.isNaN(id) ? '' : id)
    onChange('industry', selected ? `${selected.code} - ${selected.name}` : '')
  }

  const handleUploadClick = (groupIndex: number) => {
    if (!isViewMode) {
      const inputEl = fileInputRefs.current[groupIndex]
      if (inputEl) {
        inputEl.value = ''
        inputEl.click()
      }
    }
  }

  const handleFileChange = (groupIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      onAddFiles(groupIndex, event.target.files)
      // Reset input value to allow selecting the same file again
      event.target.value = ''
    }
  }

  const handlePreview = (file: UploadedFile) => {
    if ((file.file?.type || file.mimeType || '').startsWith('image/') && file.url) {
      setPreviewFile(file)
      return
    }
    if (file.url) window.open(file.url, '_blank')
  }

  const sectionTitle = mode === 'create'
    ? 'Thêm mới doanh nghiệp'
    : mode === 'edit'
      ? 'Chỉnh sửa doanh nghiệp'
      : 'Chi tiết doanh nghiệp'

  return (
    <>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-4">{sectionTitle}</h3>
          <div className="grid grid-cols-3 gap-4">
            <InputLegend
              label="Tên doanh nghiệp"
              require
              input={{
                type: 'text',
                placeholder: 'Nhập tên doanh nghiệp',
                value: form.companyName,
                maxLength: 255,
                onChange: (event) => onChange('companyName', event.target.value),
                disabled: isViewMode,
              }}
              errorMess={errors.companyName}
            />
            <InputLegend
              label="Mã số thuế"
              require
              input={{
                type: 'text',
                placeholder: 'VD: 0123456789 hoặc 0123456789-001',
                value: form.taxCode,
                onChange: (event) => handleTaxCodeChange(event.target.value),
                maxLength: 14,
                disabled: isTaxCodeDisabled,
              }}
              errorMess={errors.taxCode}
            />
            <SelectLegend
              label="Loại hình kinh doanh"
              require
              select={{
                value: form.businessTypeId,
                onChange: (event) => handleBusinessTypeChange(event.target.value),
                disabled: isViewMode,
              }}
              errorMess={errors.businessType}
            >
              <option value="">Chọn loại hình</option>
              {businessTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.code} - {type.name}
                </option>
              ))}
            </SelectLegend>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <SelectLegend
              label="Ngành nghề kinh doanh chính"
              require
              select={{
                value: form.industryId,
                onChange: (event) => handleIndustryChange(event.target.value),
                disabled: isViewMode,
              }}
              errorMess={errors.industry}
            >
              <option value="">Chọn ngành nghề cấp 4</option>
              {level4Industries.map((industry) => (
                <option key={industry.id} value={industry.id}>
                  {industry.code} - {industry.name}
                </option>
              ))}
            </SelectLegend>
            <DateLengend
              label="Ngày cấp GPKD"
              require
              value={form.gpkdDate}
              onChange={(value) => onChange('gpkdDate', value)}
              disabled={isViewMode}
              errorMess={errors.gpkdDate}
              errorInput="Ngày cấp GPKD không hợp lệ"
            />
            <AddressPicker
              label="Tỉnh/Thành phố ĐKKD"
              placeholder="Tìm tỉnh/thành phố"
              value={form.gpkdProvince}
              required
              disabled={isViewMode}
              loading={addressLoading}
              options={provinces}
              onSelect={onSelectGpkdProvince}
              onClear={onClearGpkdProvince}
              getKey={(option) => option.code}
              errorMess={errors.gpkdProvince}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <AddressPicker
              label="Phường/Xã ĐKKD"
              placeholder="Tìm phường/xã"
              value={form.gpkdWard}
              required
              disabled={isViewMode || !form.gpkdProvinceData.key}
              options={wards}
              onSelect={onSelectGpkdWard}
              onClear={onClearGpkdWard}
              getKey={(option) => option.code}
              errorMess={errors.gpkdWard}
            />
            <div className="col-span-2">
              <InputLegend
                label="Địa chỉ"
                input={{
                  type: 'text',
                  placeholder: 'Nhập địa chỉ',
                  value: form.address,
                  onChange: (event) => onChange('address', event.target.value),
                  disabled: isViewMode,
                }}
                errorMess={errors.address}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>
          <div className="grid grid-cols-3 gap-4">
            <InputLegend
              label="Tên viết bằng tiếng nước ngoài"
              input={{
                type: 'text',
                placeholder: 'Tên viết bằng tiếng nước ngoài',
                value: form.foreignName,
                maxLength: 255,
                onChange: (event) => onChange('foreignName', event.target.value),
                disabled: isViewMode,
              }}
            />
            <InputLegend
              label="Email"
              require
              input={{
                type: 'email',
                placeholder: 'Nhập email',
                value: form.email,
                onChange: (event) => onChange('email', event.target.value),
                disabled: isEmailDisabled,
              }}
              errorMess={errors.email}
            />
            <InputLegend
              label="Số điện thoại cơ quan"
              input={{
                type: 'text',
                placeholder: 'Số điện thoại cơ quan',
                value: form.phone,
                onChange: (event) => onChange('phone', event.target.value.replace(/[^0-9+]/g, '')),
                disabled: isViewMode,
              }}
              errorMess={errors.phone}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <AddressPicker
              label="Tỉnh/TP hoạt động KD"
              placeholder="Tìm tỉnh/thành phố"
              value={form.businessProvince}
              disabled={isViewMode}
              loading={addressLoading}
              options={provinces}
              onSelect={onSelectBusinessProvince}
              onClear={onClearBusinessProvince}
              getKey={(option) => option.code}
            />
            <AddressPicker
              label="Phường/Xã hoạt động KD"
              placeholder="Tìm phường/xã"
              value={form.businessWard}
              disabled={isViewMode || !form.businessProvinceData.key}
              options={businessWards}
              onSelect={onSelectBusinessWard}
              onClear={onClearBusinessWard}
              getKey={(option) => option.code}
            />
            <InputLegend
              label="Địa điểm kinh doanh"
              input={{
                type: 'text',
                placeholder: 'Địa điểm kinh doanh',
                value: form.businessAddress,
                onChange: (event) => onChange('businessAddress', event.target.value),
                disabled: isViewMode,
              }}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <InputLegend
              label="Người đứng đầu doanh nghiệp"
              input={{
                type: 'text',
                placeholder: 'Người đứng đầu doanh nghiệp',
                value: form.representative,
                onChange: (event) => onChange('representative', event.target.value),
                disabled: isViewMode,
              }}
              errorMess={errors.representative}
            />
            <InputLegend
              label="SĐT liên hệ người đứng đầu"
              input={{
                type: 'text',
                placeholder: 'SĐT liên hệ người đứng đầu',
                value: form.representativePhone,
                onChange: (event) => onChange('representativePhone', event.target.value.replace(/[^0-9+]/g, '')),
                disabled: isViewMode,
              }}
              errorMess={errors.representativePhone}
            />
            <div />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">File đính kèm</h3>
          {errors.attachments && <p className="text-red-600 text-xs mb-2">{errors.attachments}</p>}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_1fr_140px] bg-gray-50 text-xs font-medium text-gray-500 border-b border-gray-200">
              <div className="px-3 py-2.5 text-center">STT</div>
              <div className="px-4 py-2.5">Tên file</div>
              <div className="px-4 py-2.5">Thông tin file</div>
              <div className="px-4 py-2.5 text-center">Thao tác</div>
            </div>

            {attachmentGroups.map((group, groupIdx) => (
              <div key={group.groupName}>
                <div className="grid grid-cols-[40px_1fr_1fr_140px] bg-primary/5 border-b border-gray-200">
                  <div className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600">{groupIdx + 1}</div>
                  <div className="px-4 py-2.5 text-sm font-semibold text-gray-800 col-span-2">{group.groupName}</div>
                  <div className="px-4 py-2.5 flex items-center justify-center">
                    {!isViewMode && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUploadClick(groupIdx)}
                          className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 text-xs font-medium"
                          title="Upload file"
                        >
                          <i className="fa-solid fa-upload text-xs" />
                          <span>Upload</span>
                        </button>
                        <input
                          ref={(el) => { fileInputRefs.current[groupIdx] = el }}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(event) => handleFileChange(groupIdx, event)}
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                        />
                      </>
                    )}
                  </div>
                </div>

                {group.files.length === 0 ? (
                  <div className="px-4 py-4 text-center text-sm text-gray-400 italic border-b border-gray-100">
                    Chưa có file nào
                  </div>
                ) : (
                  group.files.map((file, fileIdx) => (
                    <div
                      key={file.id}
                      className="grid grid-cols-[40px_1fr_1fr_140px] text-sm text-gray-700 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="px-3 py-2.5 text-center text-xs text-gray-400">{groupIdx + 1}.{fileIdx + 1}</div>
                      <div className="px-4 py-2.5 flex items-center gap-2 min-w-0">
                        <i className="fa-solid fa-file-lines text-primary/60 text-xs" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div className={`px-4 py-2.5 ${file.error ? 'text-red-500' : 'text-gray-500'}`}>
                        {file.uploading ? 'Đang upload...' : file.error || file.size}
                      </div>
                      <div className="px-4 py-2.5 flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handlePreview(file)}
                          disabled={!file.url}
                          className="text-gray-400 hover:text-primary disabled:opacity-30 transition-colors"
                          title="Xem"
                        >
                          <i className="fa-solid fa-eye text-xs" />
                        </button>
                        {!isViewMode && (
                          <button
                            type="button"
                            onClick={() => onRemoveFile(groupIdx, file.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Xóa"
                          >
                            <i className="fa-solid fa-trash text-xs" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

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
              <button type="button" onClick={() => setPreviewFile(null)} className="px-4 py-2 text-sm text-primary hover:text-primary/80 font-medium transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
