'use client'

import { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react'
import TopHero from '@/src/components/TopHero'
import EnterpriseStepOne, { type EnterpriseFormData, type EnterpriseFormErrors, type AttachmentGroup } from '@/src/components/modals/EnterpriseStepOne'
import EnterpriseStepConfirm from '@/src/components/modals/EnterpriseStepConfirm'
import ChangeEmail from '@/src/components/ChangeEmail'
import Loading from '@/src/components/Loading'
import { AuthenticateContext } from '@/src/contexts/authenticate/authenticate'
import { NotificateContext } from '@/src/contexts/notificate/notificate'
import { DoetApi, type IDoetUser, type DoetPayload } from '@/src/api/Doet'
import { User } from '@/src/api/User'
import { BusinessTypeApi, type IBusinessType } from '@/src/api/BusinessType'
import { IndustryApi, type IIndustry } from '@/src/api/Industry'
import { Media } from '@/src/api/Media'
import { useFileAttachment } from '@/src/hooks/useFileAttachment'
import { OpenAdress, type Province } from '@/src/services/open-address'
import type { ElementAddress } from '@/src/api/User'

import { type Enterprise, type AttachmentGroupMock } from '@/src/mocks/enterprises'

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

function cloneEmptyForm(): EnterpriseFormData {
  return {
    ...emptyForm,
    gpkdProvinceData: { ...emptyAddress },
    gpkdWardData: { ...emptyAddress },
    businessProvinceData: { ...emptyAddress },
    businessWardData: { ...emptyAddress },
  }
}

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
          url: file.secureUrl || file.url || '',
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
          url: file.secureUrl || file.url || '',
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

function buildDoetPayload(form: EnterpriseFormData): Omit<DoetPayload, 'taxCode'> {
  return {
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
}

export default function BusinessInfoPage() {
  const notificate = useContext(NotificateContext)
  const notificateRef = useRef(notificate)
  notificateRef.current = notificate

  const authenticate = useContext(AuthenticateContext)

  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<EnterpriseFormData>(cloneEmptyForm())
  const [errors, setErrors] = useState<EnterpriseFormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [enterpriseData, setEnterpriseData] = useState<Enterprise | null>(null)
  const isLoadedRef = useRef(false)

  const [isChangeEmail, setIsChangeEmail] = useState(false)

  const {
    attachmentGroups,
    addFiles,
    removeFile,
    resetAttachments,
    initFromServer,
    hasErrors: hasFileErrors,
  } = useFileAttachment()

  const [provinces, setProvinces] = useState<Province[]>([])
  const [businessTypes, setBusinessTypes] = useState<IBusinessType[]>([])
  const [industries, setIndustries] = useState<IIndustry[]>([])

  const wards = useMemo(() => {
    if (!form.gpkdProvinceData.key) return []
    return new OpenAdress().filterWards(Number(form.gpkdProvinceData.key))
  }, [form.gpkdProvinceData.key])

  const businessWards = useMemo(() => {
    if (!form.businessProvinceData.key) return []
    return new OpenAdress().filterWards(Number(form.businessProvinceData.key))
  }, [form.businessProvinceData.key])

  const fetchEnterpriseData = useCallback(async () => {
    if (!authenticate?.state?.doetId) {
      setLoading(false)
      return
    }
    if (!isLoadedRef.current) {
      setLoading(true)
    }
    try {
      const doetId = Number(authenticate.state.doetId)
      const [doetResult, businessTypeResult, industryResult] = await Promise.all([
        new DoetApi().getDetail(doetId),
        new BusinessTypeApi().getAllForBusiness({ page: 1, pageSize: 1000 }),
        new IndustryApi().getAllForBusiness({ page: 1, pageSize: 1000, level: 4 }),
      ])

      setProvinces(new OpenAdress().provinces)

      if (businessTypeResult.success) {
        setBusinessTypes(businessTypeResult.data?.items.filter((item) => item.isActive) || [])
      }
      if (industryResult.success) {
        setIndustries((industryResult.data?.items || []).filter((item) => item.level === 4 && item.isActive))
      }

      if (doetResult.success && doetResult.data) {
        const enterprise = mapDoetUserToEnterprise(doetResult.data)
        setEnterpriseData(enterprise)
        setForm(enterpriseToForm(enterprise))
        initFromServer(enterprise.attachments)
        isLoadedRef.current = true
      } else {
        notificateRef.current?.showNotification({ type: 'error', message: doetResult.message })
      }
    } catch (err: any) {
      notificateRef.current?.showNotification({ type: 'error', message: err.message || 'Lỗi khi lấy dữ liệu' })
    } finally {
      setLoading(false)
    }
  }, [authenticate?.state?.doetId, initFromServer])

  useEffect(() => {
    if (!authenticate?.isFetch) {
      fetchEnterpriseData()
    }
  }, [authenticate?.isFetch, fetchEnterpriseData])

  const handleChange = (field: keyof EnterpriseFormData, value: string | number | ElementAddress) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value }
      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors }

        const checkEmpty = (f: keyof EnterpriseFormData, message: string) => {
          const val = newForm[f]
          if (typeof val === 'string' ? !val.trim() : !val) {
            nextErrors[f] = message
          } else {
            nextErrors[f] = ''
          }
        }

        if (field === 'companyName') {
          const valStr = String(value).trim()
          if (!valStr) {
            nextErrors.companyName = 'Tên doanh nghiệp là bắt buộc'
          } else if (valStr.length > 255) {
            nextErrors.companyName = 'Tên doanh nghiệp không được vượt quá 255 ký tự'
          } else {
            nextErrors.companyName = ''
          }
        } else if (field === 'businessTypeId' || field === 'businessType') {
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
        } else if (field === 'gpkdProvince') {
          checkEmpty('gpkdProvince', 'Tỉnh/Thành phố ĐKKD là bắt buộc')
        } else if (field === 'gpkdWard') {
          checkEmpty('gpkdWard', 'Phường/Xã ĐKKD là bắt buộc')
        } else if (field === 'email') {
          const valStr = String(value).trim()
          if (!valStr) {
            nextErrors.email = 'Email là bắt buộc'
          } else if (!EMAIL_REGEX.test(valStr)) {
            nextErrors.email = 'Email không đúng định dạng'
          } else {
            nextErrors.email = ''
          }
        } else if (field === 'phone') {
          const valStr = String(value).trim()
          if (valStr && !VN_PHONE_REGEX.test(valStr)) {
            nextErrors.phone = 'Số điện thoại cơ quan phải có 10 chữ số (hoặc 11 số với máy bàn) và bắt đầu bằng 0, 84 hoặc +84'
          } else {
            nextErrors.phone = ''
          }
        } else if (field === 'representativePhone') {
          const valStr = String(value).trim()
          if (valStr && !VN_PHONE_REGEX.test(valStr)) {
            nextErrors.representativePhone = 'Số điện thoại người đại diện phải gồm 10 chữ số di động và bắt đầu bằng 0, 84 hoặc +84'
          } else {
            nextErrors.representativePhone = ''
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
      next.phone = 'Số điện thoại cơ quan phải có 10 chữ số (hoặc 11 số với máy bàn) và bắt đầu bằng 0, 84 hoặc +84'
      valid = false
    }
    if (form.representativePhone.trim() && !VN_PHONE_REGEX.test(form.representativePhone.trim())) {
      next.representativePhone = 'Số điện thoại người đại diện phải gồm 10 chữ số di động và bắt đầu bằng 0, 84 hoặc +84'
      valid = false
    }

    if (hasFileErrors) {
      next.attachments = 'Vui lòng xóa các file không hợp lệ trước khi tiếp tục'
      valid = false
    }

    setErrors(next)
    if (!valid) notificate?.showNotification({ type: 'error', message: 'Vui lòng kiểm tra lại thông tin' })
    return valid
  }

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(2)
    }
  }

  const handleCancel = () => {
    if (enterpriseData) {
      setForm(enterpriseToForm(enterpriseData))
      initFromServer(enterpriseData.attachments)
      setErrors({})
      setCurrentStep(1)
    }
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

  const handleConfirm = async () => {
    if (!validate() || !enterpriseData) return
    setSubmitting(true)

    const api = new DoetApi()
    const payload = buildDoetPayload(form)

    const result = await api.update(enterpriseData.id, payload)

    if (!result.success || !result.data) {
      notificate?.showNotification({ type: 'error', message: result.message })
      setSubmitting(false)
      return
    }

    try {
      await handleUploadPendingFiles(result.data.id, attachmentGroups)
      notificate?.showNotification({ type: 'success', message: 'Cập nhật thông tin doanh nghiệp thành công' })
      await authenticate?.refreshAuth()
      await fetchEnterpriseData()
      setCurrentStep(1)
    } catch (err: any) {
      notificate?.showNotification({
        type: 'error',
        message: err.message || 'Lỗi khi upload tài liệu đính kèm',
      })
      await fetchEnterpriseData()
      setCurrentStep(1)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEmailChangeClick = () => {
    if (!form.email) return
    const cls = new User()
    cls.SendChangeEmailRequest(form.email)
    notificate?.showNotification({ type: 'success', message: 'Đã gửi thành công email vui lòng điền OTP' })
    setIsChangeEmail(true)
  }

  const steps = [
    { number: 1, label: 'Thông tin doanh nghiệp' },
    { number: 2, label: 'Xác nhận chỉnh sửa' },
  ]

  if (loading) {
    return <Loading />
  }

  if (!authenticate?.state?.doetId) {
    return (
      <main className="h-screen flex items-center justify-center">
        <div className="text-gray-500 font-semibold text-lg">Không tìm thấy doanh nghiệp liên kết với tài khoản này.</div>
      </main>
    )
  }

  return (
    <main className="h-screen flex flex-col py-2">
      {isChangeEmail && (
        <ChangeEmail
          email={form.email}
          onClose={() => setIsChangeEmail(false)}
          onResend={(v, onFunc) => {
            if (v > 0) {
              notificate?.showNotification({ type: 'error', message: 'Vui lòng chờ thêm ' + v + ' giây' })
              return
            }
            const cls = new User()
            cls.SendChangeEmailRequest(form.email)
            notificate?.showNotification({ type: 'success', message: 'Đã gửi thành công email vui lòng điền OTP' })
            onFunc?.()
          }}
          onSuccess={(newEmail) => {
            setForm((prev) => ({ ...prev, email: newEmail }))
            setIsChangeEmail(false)
            setCurrentStep(2)
          }}
        />
      )}

      <TopHero
        title="Thông tin doanh nghiệp"
        actions={
          <div className="flex gap-2">
            {currentStep === 1 ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span>Tiếp tục</span>
                  <i className="fa-solid fa-chevron-right text-xs" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                >
                  Trở về
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-semibold bg-primary text-white rounded hover:opacity-90 disabled:opacity-60 transition-opacity flex items-center gap-2"
                >
                  <i className="fa-solid fa-check text-xs" />
                  <span>{submitting ? 'Đang lưu...' : 'Xác nhận'}</span>
                </button>
              </>
            )}
          </div>
        }
        className="shrink-0"
      />

      <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">
        <div className="shrink-0 px-8 pt-6 pb-4 border-b border-gray-100 bg-white">
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

        <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
          {currentStep === 1 ? (
            <EnterpriseStepOne
              form={form}
              errors={errors}
              attachmentGroups={attachmentGroups}
              businessTypes={businessTypes}
              industries={industries}
              provinces={provinces}
              wards={wards}
              businessWards={businessWards}
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
              onAddFiles={async (groupIndex, files) => {
                const res = await addFiles(groupIndex, files)
                setErrors((prev) => ({ ...prev, attachments: '' }))
                if (res.error) {
                  notificate?.showNotification({ type: 'error', message: res.error })
                }
              }}
              onRemoveFile={async (groupIndex, fileId) => {
                const res = await removeFile(groupIndex, fileId)
                if (!res.success && res.message) {
                  notificate?.showNotification({ type: 'error', message: res.message })
                }
              }}
              mode="edit"
              userRole="business"
              onChangeEmailClick={handleEmailChangeClick}
            />
          ) : (
            <EnterpriseStepConfirm form={form} attachmentGroups={attachmentGroups} />
          )}
        </div>
      </div>
    </main>
  )
}
