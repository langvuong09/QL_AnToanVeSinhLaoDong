'use client'

import { useEffect, useMemo, useState } from 'react'
import type { IBusinessType } from '@/src/api/BusinessType'
import type { IIndustry } from '@/src/api/Industry'
import type { ElementAddress } from '@/src/api/User'
import { OpenAdress, type Province } from '@/src/services/open-address'
import { useFileAttachment } from '@/src/hooks/useFileAttachment'
import EnterpriseStepOne from './EnterpriseStepOne'
import EnterpriseStepConfirm from './EnterpriseStepConfirm'
import AccountInfoPopup from './AccountInfoPopup'
import type { EnterpriseFormData, EnterpriseFormErrors, EnterpriseFormMode, AttachmentGroup } from './EnterpriseStepOne'
import type { Enterprise } from '@/src/mocks/enterprises'

type SaveResult = {
  success: boolean
  message: string
  savedId?: number
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (form: EnterpriseFormData, attachments: AttachmentGroup[]) => Promise<SaveResult>
  mode?: EnterpriseFormMode
  initialData?: Enterprise | null
  userRole?: string
  businessTypes: IBusinessType[]
  industries: IIndustry[]
}

const emptyAddress: ElementAddress = { key: 0, value: '' }

const emptyForm: EnterpriseFormData = {
  companyName: '',
  taxCode: '',
  businessType: '',
  businessTypeId: '',
  industry: '',
  industryId: '',
  gpkdDate: '',
  gpkdProvince: '',
  gpkdProvinceData: emptyAddress,
  gpkdWard: '',
  gpkdWardData: emptyAddress,
  address: '',
  foreignName: '',
  email: '',
  phone: '',
  businessProvince: '',
  businessProvinceData: emptyAddress,
  businessWard: '',
  businessWardData: emptyAddress,
  businessAddress: '',
  representative: '',
  representativePhone: '',
}

const TAX_CODE_REGEX = /^(?:\d{10}|\d{10}-\d{3}|\d{13})$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VN_PHONE_REGEX = /^(?:\+84|84|0)(?:[35789]\d{8}|2\d{9})$/

function generateAccountInfo(taxCode: string, resultData?: any) {
  return {
    accountNumber: taxCode.replace(/-/g, '') || '0000000000',
    password: resultData?.password || resultData?.defaultPassword || 'Doet@123456',
  }
}

function cloneEmptyForm(): EnterpriseFormData {
  return {
    ...emptyForm,
    gpkdProvinceData: { ...emptyAddress },
    gpkdWardData: { ...emptyAddress },
    businessProvinceData: { ...emptyAddress },
    businessWardData: { ...emptyAddress },
  }
}

function enterpriseToForm(enterprise: Enterprise): EnterpriseFormData {
  return {
    ...cloneEmptyForm(),
    companyName: enterprise.companyName,
    taxCode: enterprise.taxCode,
    businessType: enterprise.businessType,
    businessTypeId: enterprise.businessTypeId || '',
    industry: enterprise.industry,
    industryId: enterprise.industryId || '',
    gpkdDate: enterprise.gpkdDate,
    gpkdProvince: enterprise.gpkdProvince,
    gpkdProvinceData: enterprise.gpkdProvinceData || { key: 0, value: enterprise.gpkdProvince },
    gpkdWard: enterprise.gpkdWard,
    gpkdWardData: enterprise.gpkdWardData || { key: 0, value: enterprise.gpkdWard },
    address: enterprise.address,
    foreignName: enterprise.foreignName,
    email: enterprise.email,
    phone: enterprise.phone,
    businessProvince: enterprise.businessProvince,
    businessProvinceData: enterprise.businessProvinceData || { key: 0, value: enterprise.businessProvince },
    businessWard: enterprise.businessWard,
    businessWardData: enterprise.businessWardData || { key: 0, value: enterprise.businessWard },
    businessAddress: enterprise.businessAddress,
    representative: enterprise.representative,
    representativePhone: enterprise.representativePhone,
  }
}

function isFutureDate(value: string) {
  const date = new Date(value)
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return !Number.isNaN(date.getTime()) && date > today
}

export default function EnterpriseModal({
  isOpen,
  onClose,
  onSave,
  mode = 'create',
  initialData = null,
  userRole = '',
  businessTypes,
  industries,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<EnterpriseFormData>(cloneEmptyForm())
  const [errors, setErrors] = useState<EnterpriseFormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  // ── File attachment hook (thay thế state rời rạc cũ) ─────────────
  const {
    attachmentGroups,
    addFiles,
    removeFile,
    resetAttachments,
    initFromServer,
    hasErrors: hasFileErrors,
  } = useFileAttachment()

  const [showAccountPopup, setShowAccountPopup] = useState(false)
  const [accountInfo, setAccountInfo] = useState({ accountNumber: '', password: '' })
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({
    show: false,
    type: 'success',
    message: '',
  })

  const [provinces, setProvinces] = useState<Province[]>([])
  const [addressLoading, setAddressLoading] = useState(false)

  useEffect(() => {
    setAddressLoading(true)
    const openAddress = new OpenAdress()
    setProvinces(openAddress.provinces)
    setAddressLoading(false)
  }, [])

  const wards = useMemo(() => {
    if (!form.gpkdProvinceData.key) return []
    return new OpenAdress().filterWards(Number(form.gpkdProvinceData.key))
  }, [form.gpkdProvinceData.key])

  const businessWards = useMemo(() => {
    if (!form.businessProvinceData.key) return []
    return new OpenAdress().filterWards(Number(form.businessProvinceData.key))
  }, [form.businessProvinceData.key])

  useEffect(() => {
    if (initialData && (mode === 'edit' || mode === 'view')) {
      setForm(enterpriseToForm(initialData))
      initFromServer(initialData.attachments)
    } else if (mode === 'create') {
      setForm(cloneEmptyForm())
      resetAttachments()
    }
    setErrors({})
    setCurrentStep(1)
  }, [initialData, mode, initFromServer, resetAttachments])

  if (!isOpen) return null

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000)
  }

  const handleChange = (field: keyof EnterpriseFormData, value: string | number | ElementAddress) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = (): boolean => {
    const next: EnterpriseFormErrors = {}
    let valid = true

    const requireField = (field: keyof EnterpriseFormData, message: string) => {
      const value = form[field]
      if (typeof value === 'string' ? !value.trim() : !value) {
        next[field] = message
        valid = false
      }
    }

    requireField('companyName', 'Tên doanh nghiệp là bắt buộc')
    if (form.companyName.trim().length > 255) {
      next.companyName = 'Tên doanh nghiệp không được vượt quá 255 ký tự'
      valid = false
    }

    if (mode === 'create') {
      if (!form.taxCode.trim()) {
        next.taxCode = 'Mã số thuế là bắt buộc'
        valid = false
      } else if (!TAX_CODE_REGEX.test(form.taxCode.trim())) {
        next.taxCode = 'Mã số thuế gồm 10 số, 13 số hoặc 10 số-3 số'
        valid = false
      }
    }

    requireField('businessTypeId', 'Loại hình kinh doanh là bắt buộc')
    requireField('industryId', 'Ngành nghề kinh doanh cấp 4 là bắt buộc')
    requireField('gpkdDate', 'Ngày cấp GPKD là bắt buộc')
    if (form.gpkdDate && isFutureDate(form.gpkdDate)) {
      next.gpkdDate = 'Ngày cấp GPKD không được lớn hơn ngày hiện tại'
      valid = false
    }
    requireField('gpkdProvince', 'Tỉnh/Thành phố ĐKKD là bắt buộc')
    requireField('gpkdWard', 'Phường/Xã ĐKKD là bắt buộc')

    if (!form.email.trim()) {
      next.email = 'Email là bắt buộc'
      valid = false
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = 'Email không đúng định dạng'
      valid = false
    }
    if (form.phone.trim() && !VN_PHONE_REGEX.test(form.phone.trim())) {
      next.phone = 'Số điện thoại cơ quan không đúng định dạng Việt Nam'
      valid = false
    }
    if (form.representativePhone.trim() && !VN_PHONE_REGEX.test(form.representativePhone.trim())) {
      next.representativePhone = 'SĐT người đại diện không đúng định dạng Việt Nam'
      valid = false
    }

    // Kiểm tra file lỗi thông qua hook
    if (hasFileErrors) {
      next.attachments = 'Vui lòng xóa các file không hợp lệ trước khi tiếp tục'
      valid = false
    }

    setErrors(next)
    if (!valid) showToast('error', 'Vui lòng kiểm tra lại thông tin')
    return valid
  }

  const handleNext = () => {
    if (validate()) setCurrentStep(2)
  }

  const resetAndClose = () => {
    setForm(cloneEmptyForm())
    setErrors({})
    resetAttachments()
    setCurrentStep(1)
    onClose()
  }

  const handleConfirm = async () => {
    if (!validate()) return
    setSubmitting(true)
    const result = await onSave(form, attachmentGroups)
    setSubmitting(false)

    if (!result.success) {
      showToast('error', result.message)
      return
    }

    if (mode === 'create') {
      setAccountInfo(generateAccountInfo(form.taxCode, (result as any).rawResult))
      showToast('success', result.message || 'Khai báo thành công')
      setShowAccountPopup(true)
      return
    }

    showToast('success', result.message || 'Cập nhật doanh nghiệp thành công')
    setTimeout(resetAndClose, 800)
  }

  // ── File handlers (delegate sang hook) ─────────────────────────────
  const handleAddFiles = (groupIndex: number, files: FileList) => {
    const result = addFiles(groupIndex, files)
    setErrors((prev) => ({ ...prev, attachments: '' }))

    const messages: string[] = []
    if (result.duplicates.length > 0) {
      messages.push(`Bỏ qua ${result.duplicates.length} file trùng lặp: ${result.duplicates.join(', ')}`)
    }
    if (result.invalidFiles.length > 0) {
      messages.push(`Có ${result.invalidFiles.length} file lỗi: ${result.invalidFiles.map((f) => `${f.name} (${f.error})`).join(', ')}`)
    }

    if (messages.length > 0) {
      showToast('error', messages.join('\n'))
    }
  }

  const handleRemoveFile = async (groupIndex: number, fileId: number | string) => {
    const result = await removeFile(groupIndex, fileId)
    if (!result.success && result.message) {
      showToast('error', result.message)
    }
  }

  const isViewMode = mode === 'view'
  const pageTitle = mode === 'create'
    ? 'Thêm mới doanh nghiệp'
    : mode === 'edit'
      ? 'Chỉnh sửa doanh nghiệp'
      : 'Chi tiết doanh nghiệp'

  const steps = [
    { number: 1, label: 'Thông tin doanh nghiệp' },
    { number: 2, label: mode === 'edit' ? 'Xác nhận cập nhật' : 'Xác nhận đăng ký' },
  ]

  return (
    <>
      <div className="h-screen flex flex-col py-2">
        <div className="shrink-0 bg-white px-5 py-3 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
          <h1 className="text-base font-bold text-gray-800">{pageTitle}</h1>
          <button
            type="button"
            onClick={resetAndClose}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            <span>Quay lại danh sách</span>
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">
          {!isViewMode && (
            <div className="shrink-0 px-8 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-center gap-0">
                {steps.map((step, idx) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${
                          currentStep >= step.number ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {currentStep > step.number ? <i className="fa-solid fa-check text-xs" /> : step.number}
                      </div>
                      <span className={`text-sm whitespace-nowrap ${currentStep >= step.number ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>

                    {idx < steps.length - 1 && (
                      <div className={`w-32 h-0.5 mx-4 transition-colors ${currentStep > step.number ? 'bg-primary' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
            {isViewMode ? (
              <EnterpriseStepConfirm form={form} attachmentGroups={attachmentGroups} />
            ) : currentStep === 1 ? (
              <EnterpriseStepOne
                form={form}
                errors={errors}
                attachmentGroups={attachmentGroups}
                businessTypes={businessTypes}
                industries={industries}
                provinces={provinces}
                wards={wards}
                businessWards={businessWards}
                addressLoading={addressLoading}
                onChange={handleChange}
                onSelectGpkdProvince={(province) => {
                  handleChange('gpkdProvince', province.name)
                  handleChange('gpkdProvinceData', { key: province.code, value: province.name })
                  handleChange('gpkdWard', '')
                  handleChange('gpkdWardData', { ...emptyAddress })
                }}
                onSelectGpkdWard={(ward) => {
                  handleChange('gpkdWard', ward.name)
                  handleChange('gpkdWardData', { key: ward.code, value: ward.name })
                }}
                onSelectBusinessProvince={(province) => {
                  handleChange('businessProvince', province.name)
                  handleChange('businessProvinceData', { key: province.code, value: province.name })
                  handleChange('businessWard', '')
                  handleChange('businessWardData', { ...emptyAddress })
                }}
                onSelectBusinessWard={(ward) => {
                  handleChange('businessWard', ward.name)
                  handleChange('businessWardData', { key: ward.code, value: ward.name })
                }}
                onClearGpkdProvince={() => {
                  handleChange('gpkdProvince', '')
                  handleChange('gpkdProvinceData', { ...emptyAddress })
                  handleChange('gpkdWard', '')
                  handleChange('gpkdWardData', { ...emptyAddress })
                }}
                onClearGpkdWard={() => {
                  handleChange('gpkdWard', '')
                  handleChange('gpkdWardData', { ...emptyAddress })
                }}
                onClearBusinessProvince={() => {
                  handleChange('businessProvince', '')
                  handleChange('businessProvinceData', { ...emptyAddress })
                  handleChange('businessWard', '')
                  handleChange('businessWardData', { ...emptyAddress })
                }}
                onClearBusinessWard={() => {
                  handleChange('businessWard', '')
                  handleChange('businessWardData', { ...emptyAddress })
                }}
                onAddFiles={handleAddFiles}
                onRemoveFile={handleRemoveFile}
                mode={mode}
                userRole={userRole}
              />
            ) : (
              <EnterpriseStepConfirm form={form} attachmentGroups={attachmentGroups} />
            )}
          </div>

          <div className="shrink-0 px-8 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
            {isViewMode && (
              <button type="button" onClick={resetAndClose} className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                Quay lại
              </button>
            )}
            {!isViewMode && currentStep === 1 && (
              <>
                <button type="button" onClick={resetAndClose} className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  Hủy bỏ
                </button>
                <button type="button" onClick={handleNext} className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  <i className="fa-solid fa-chevron-right text-xs" />
                  Tiếp tục
                </button>
              </>
            )}
            {!isViewMode && currentStep === 2 && (
              <>
                <button type="button" onClick={() => setCurrentStep(1)} className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                  Trở về
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center gap-2"
                >
                  <i className="fa-solid fa-check text-xs" />
                  {submitting ? 'Đang lưu...' : 'Xác nhận'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {toast.show && (
        <div className="fixed top-4 right-4 z-[80] animate-[slideInRight_0.3s_ease-out]">
          <div className={`rounded-lg px-5 py-3 flex items-center gap-3 shadow-lg ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
              <i className={`fa-solid ${toast.type === 'success' ? 'fa-check' : 'fa-xmark'} text-white text-[10px]`} />
            </div>
            <span className={`text-sm font-medium whitespace-pre-line ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className={`${toast.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'} transition-colors ml-2`}
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>
        </div>
      )}

      {mode === 'create' && (
        <AccountInfoPopup
          isOpen={showAccountPopup}
          onClose={() => {
            setShowAccountPopup(false)
            resetAndClose()
          }}
          accountNumber={accountInfo.accountNumber}
          password={accountInfo.password}
        />
      )}
    </>
  )
}
