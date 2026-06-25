'use client'

import { useEffect, useMemo, useState } from 'react'
import type { IBusinessType } from '@/src/api/BusinessType'
import type { IIndustry } from '@/src/api/Industry'
import { User as UserApi, type ElementAddress } from '@/src/api/User'
import { OpenAdress, type Province } from '@/src/services/open-address'
import { useFileAttachment } from '@/src/hooks/useFileAttachment'
import EnterpriseStepOne from './EnterpriseStepOne'
import EnterpriseStepConfirm from './EnterpriseStepConfirm'
import AccountInfoPopup from './AccountInfoPopup'
import OtpVerificationModal from './OtpVerificationModal'
import { Auth } from '@/src/api/Auth'
import type { EnterpriseFormData, EnterpriseFormErrors, EnterpriseFormMode, AttachmentGroup } from './EnterpriseStepOne'
import type { Enterprise } from '@/src/mocks/enterprises'
import axios from 'axios'
import { DoetApi } from '@/src/api/Doet'

type SaveResult = {
  success: boolean
  message: string
  savedId?: number
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (form: EnterpriseFormData, attachments: AttachmentGroup[], registerToken?: string) => Promise<SaveResult>
  mode?: EnterpriseFormMode
  initialData?: Enterprise | null
  userRole?: string
  businessTypes: IBusinessType[]
  industries: IIndustry[]
  isRegister?: boolean
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

async function checkTaxCodeExists(taxCode: string, isRegister: boolean): Promise<boolean> {
  const cleanTaxCode = taxCode.trim()
  if (!cleanTaxCode) return false

  // If logged in (not registering), use DoetApi to check
  if (!isRegister) {
    try {
      const doetApi = new DoetApi()
      const res = await doetApi.getAll({ taxCode: cleanTaxCode })
      if (res.success && res.data && res.data.items) {
        const exactMatch = res.data.items.some(item => 
          item.doet?.taxCode?.trim() === cleanTaxCode
        )
        return exactMatch
      }
    } catch (e) {
      console.error('Error checking tax code via DoetApi:', e)
    }
  }

  // Fallback for public registration (guest) using the /auth/login strategy
  try {
    const endpoint = (process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3010').replace(/\/$/, '') + '/api/v1/auth/login'
    await axios.post(endpoint, {
      username: cleanTaxCode,
      password: 'checking_tax_code_existence_dummy_pass'
    })
    return true
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data
      if (status === 404) {
        return false
      }
      if (status === 401) {
        return true
      }
      const msg = data?.message || ''
      if (String(msg).toLowerCase().includes('not found') || data?.code === 3033) {
        return false
      }
    }
    return false
  }
}

async function checkEmailExists(email: string, isRegister: boolean): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail) return false

  // If logged in (admin/manager), check both normal users and enterprise users
  if (!isRegister) {
    try {
      // 1. Check normal users (where doetId is null)
      const userApi = new UserApi()
      const resUser = await userApi.getAll({ email: cleanEmail })
      if (resUser.success && resUser.data && resUser.data.items) {
        const exactMatch = resUser.data.items.some(item => 
          item.email?.trim().toLowerCase() === cleanEmail
        )
        if (exactMatch) return true
      }

      // 2. Check enterprise users (where doetId is not null)
      const doetApi = new DoetApi()
      const resDoet = await doetApi.getAll({ pageSize: 10000 })
      if (resDoet.success && resDoet.data && resDoet.data.items) {
        const exactMatch = resDoet.data.items.some(item => 
          item.email?.trim().toLowerCase() === cleanEmail
        )
        if (exactMatch) return true
      }
    } catch (e) {
      console.error('Error checking email existence:', e)
    }
  }

  // For public register (guest), the backend SendRegisterOtp handles the check.
  return false
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
  isRegister = false,
}: Props) {
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<EnterpriseFormData>(cloneEmptyForm())
  const [errors, setErrors] = useState<EnterpriseFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [registerToken, setRegisterToken] = useState<string>('')
  const [verifiedEmail, setVerifiedEmail] = useState<string>('')

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
    setForm((prev) => {
      const newForm = { ...prev, [field]: value }
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors }
        
        if (field === 'businessTypeId' || field === 'businessType') {
          const hasVal = typeof newForm.businessTypeId === 'number' ? true : !!newForm.businessTypeId
          if (hasVal) {
            nextErrors.businessTypeId = ''
            nextErrors.businessType = ''
          } else {
            nextErrors.businessTypeId = 'Loại hình kinh doanh là bắt buộc'
            nextErrors.businessType = 'Loại hình kinh doanh là bắt buộc'
          }
        } else if (field === 'industryId' || field === 'industry') {
          const hasVal = typeof newForm.industryId === 'number' ? true : !!newForm.industryId
          if (hasVal) {
            nextErrors.industryId = ''
            nextErrors.industry = ''
          } else {
            nextErrors.industryId = 'Ngành nghề kinh doanh cấp 4 là bắt buộc'
            nextErrors.industry = 'Ngành nghề kinh doanh cấp 4 là bắt buộc'
          }
        } else if (field === 'gpkdDate') {
          const valStr = String(value).trim()
          if (!valStr) {
            nextErrors.gpkdDate = 'Ngày cấp GPKD là bắt buộc'
          } else if (isFutureDate(valStr)) {
            nextErrors.gpkdDate = 'Ngày cấp GPKD không được lớn hơn ngày hiện tại'
          } else {
            nextErrors.gpkdDate = ''
          }
        } else {
          nextErrors[field] = ''
        }
        
        return nextErrors
      })
      return newForm
    })
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
      const taxCodeTrim = form.taxCode.trim()
      if (!taxCodeTrim) {
        next.taxCode = 'Mã số thuế là bắt buộc'
        valid = false
      } else if (!TAX_CODE_REGEX.test(taxCodeTrim)) {
        next.taxCode = 'Mã số thuế không đúng định dạng quy định (phải gồm 10 số hoặc 13 số)'
        valid = false
      }
    }

    requireField('businessTypeId', 'Loại hình kinh doanh là bắt buộc')
    if (next.businessTypeId) {
      next.businessType = 'Loại hình kinh doanh là bắt buộc'
    }
    requireField('industryId', 'Ngành nghề kinh doanh cấp 4 là bắt buộc')
    if (next.industryId) {
      next.industry = 'Ngành nghề kinh doanh cấp 4 là bắt buộc'
    }
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
      next.phone = 'Số điện thoại cơ quan phải có 10 chữ số (hoặc 11 số với máy bàn) và bắt đầu bằng 0, 84 hoặc +84'
      valid = false
    }
    if (form.representativePhone.trim() && !VN_PHONE_REGEX.test(form.representativePhone.trim())) {
      next.representativePhone = 'Số điện thoại người đại diện phải gồm 10 chữ số di động và bắt đầu bằng 0, 84 hoặc +84'
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

  const handleNext = async () => {
    if (!validate()) return

    if (mode === 'create' || mode === 'edit') {
      setSubmitting(true)
      try {
        // 1. Check duplicate Tax Code (only if creating)
        if (mode === 'create') {
          const taxCodeExists = await checkTaxCodeExists(form.taxCode, isRegister)
          if (taxCodeExists) {
            setErrors(prev => ({
              ...prev,
              taxCode: 'Mã số thuế này đã tồn tại trên hệ thống!'
            }))
            showToast('error', 'Mã số thuế này đã tồn tại trên hệ thống!')
            setSubmitting(false)
            return
          }
        }

        // 2. Check duplicate Email
        let emailChanged = true
        if (mode === 'edit' && initialData) {
          emailChanged = form.email.trim().toLowerCase() !== initialData.email?.trim().toLowerCase()
        }

        if (emailChanged && !isRegister) {
          const emailExists = await checkEmailExists(form.email, isRegister)
          if (emailExists) {
            setErrors(prev => ({
              ...prev,
              email: 'Email này đã tồn tại trên hệ thống!'
            }))
            showToast('error', 'Email này đã tồn tại trên hệ thống!')
            setSubmitting(false)
            return
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setSubmitting(false)
      }
    }

    if (isRegister) {
      if (registerToken && form.email.trim().toLowerCase() === verifiedEmail.trim().toLowerCase()) {
        setCurrentStep(2)
        return
      }

      setSubmitting(true)
      const auth = new Auth()
      try {
        const result = await auth.SendRegisterOtp(form.email)
        if (result.success) {
          showToast('success', 'Mã OTP đã được gửi đến email của bạn')
          setShowOtpModal(true)
        } else {
          if (result.message?.includes('Email này đã tồn tại') || result.message?.toLowerCase().includes('email')) {
            setErrors(prev => ({
              ...prev,
              email: 'Email này đã tồn tại trên hệ thống!'
            }))
            showToast('error', 'Email này đã tồn tại trên hệ thống!')
          } else {
            showToast('error', result.message || 'Không thể gửi mã OTP. Vui lòng thử lại.')
          }
        }
      } catch (err: any) {
        showToast('error', err?.message || 'Có lỗi xảy ra khi gửi mã OTP')
      } finally {
        setSubmitting(false)
      }
    } else {
      setCurrentStep(2)
    }
  }

  const resetAndClose = () => {
    setForm(cloneEmptyForm())
    setErrors({})
    resetAttachments()
    setCurrentStep(1)
    setRegisterToken('')
    setVerifiedEmail('')
    onClose()
  }

  const handleConfirm = async () => {
    if (!validate()) return
    setSubmitting(true)
    const result = await onSave(form, attachmentGroups, registerToken)
    setSubmitting(false)

    if (!result.success) {
      let friendlyMessage = result.message
      if (result.message.includes('IDX_78ca3a129ee713cf4082cb89fd') || result.message.includes('unique constraint')) {
        friendlyMessage = 'Email này đã tồn tại trên hệ thống!'
      }
      showToast('error', friendlyMessage)
      
      const newErrors: EnterpriseFormErrors = {}
      let hasFieldError = false

      if (result.message.includes('Mã số thuế') || result.message.toLowerCase().includes('taxcode') || result.message.toLowerCase().includes('tax code')) {
        newErrors.taxCode = result.message
        hasFieldError = true
      }
      if (
        result.message.includes('Email') || 
        result.message.toLowerCase().includes('email') ||
        result.message.includes('IDX_78ca3a129ee713cf4082cb89fd') ||
        result.message.includes('unique constraint')
      ) {
        newErrors.email = 'Email này đã tồn tại trên hệ thống!'
        hasFieldError = true
      }

      if (hasFieldError) {
        setErrors(newErrors)
        setCurrentStep(1)
      }
      return
    }

    if (mode === 'create' || isRegister) {
      setAccountInfo(generateAccountInfo(form.taxCode, (result as any).rawResult))
      showToast('success', result.message || 'Khai báo thành công')
      setShowAccountPopup(true)
      return
    }


    showToast('success', result.message || 'Cập nhật doanh nghiệp thành công')
    setTimeout(resetAndClose, 800)
  }

  // ── File handlers (delegate sang hook) ─────────────────────────────
  const handleAddFiles = async (groupIndex: number, files: FileList) => {
    const result = await addFiles(groupIndex, files)
    setErrors((prev) => ({ ...prev, attachments: '' }))

    if (result.error) {
      showToast('error', result.error)
    }
  }

  const handleRemoveFile = async (groupIndex: number, fileId: number | string) => {
    const result = await removeFile(groupIndex, fileId)
    if (!result.success && result.message) {
      showToast('error', result.message)
    }
  }

  const isViewMode = mode === 'view'
  const pageTitle = isRegister
    ? 'Đăng ký doanh nghiệp'
    : mode === 'create'
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
          {/* <button
            type="button"
            onClick={resetAndClose}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            <span>{isRegister ? 'Quay lại đăng nhập' : 'Quay lại danh sách'}</span>
          </button> */}
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
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={submitting}
                  className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center gap-2"
                >
                  <i className="fa-solid fa-chevron-right text-xs" />
                  {submitting ? 'Đang xử lý...' : 'Tiếp tục'}
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

      {(mode === 'create' || isRegister) && (
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

      {isRegister && (
        <OtpVerificationModal
          isOpen={showOtpModal}
          email={form.email}
          onClose={() => setShowOtpModal(false)}
          onVerify={async (otp) => {
            const auth = new Auth()
            try {
              const result = await auth.VerifyRegisterOtp(form.email, otp)
              if (result.success && result.registerToken) {
                setRegisterToken(result.registerToken)
                setVerifiedEmail(form.email)
                showToast('success', 'Xác thực email thành công!')
                setShowOtpModal(false)
                setCurrentStep(2)
                return { success: true }
              }
              return { success: false, message: result.message || 'Mã OTP không đúng hoặc đã hết hạn' }
            } catch (err: any) {
              return { success: false, message: err?.message || 'Có lỗi xảy ra khi xác thực OTP' }
            }
          }}
          onResend={async () => {
            const auth = new Auth()
            try {
              const result = await auth.SendRegisterOtp(form.email)
              if (result.success) {
                showToast('success', 'Đã gửi lại mã OTP thành công!')
                return { success: true }
              }
              return { success: false, message: result.message }
            } catch (err: any) {
              return { success: false, message: err?.message || 'Có lỗi xảy ra khi gửi lại mã OTP' }
            }
          }}
        />
      )}
    </>
  )
}

