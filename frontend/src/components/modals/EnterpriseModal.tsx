'use client'

import { useState } from 'react'
import EnterpriseStepOne from './EnterpriseStepOne'
import EnterpriseStepConfirm from './EnterpriseStepConfirm'
import type { EnterpriseFormData, EnterpriseFormErrors } from './EnterpriseStepOne'
import type { AttachmentFile } from '@/src/mocks/enterprises'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (form: EnterpriseFormData) => void
}

const emptyForm: EnterpriseFormData = {
  companyName: '',
  taxCode: '',
  businessType: '',
  industry: '',
  gpkdDate: '',
  gpkdProvince: '',
  gpkdWard: '',
  address: '',
  foreignName: '',
  email: '',
  phone: '',
  businessProvince: '',
  businessWard: '',
  businessAddress: '',
  representative: '',
  representativePhone: '',
}

const emptyErrors: EnterpriseFormErrors = {
  companyName: '',
  taxCode: '',
  businessType: '',
  industry: '',
  gpkdProvince: '',
  gpkdWard: '',
  email: '',
}

const defaultAttachments: AttachmentFile[] = [
  { id: 1, fileName: 'Giấy phép kinh doanh', fileInfo: 'GPKD.pdf' },
  { id: 2, fileName: 'Giấy tờ khác', fileInfo: 'GTK1.pdf' },
]

export default function EnterpriseModal({ isOpen, onClose, onSave }: Props) {
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<EnterpriseFormData>({ ...emptyForm })
  const [errors, setErrors] = useState<EnterpriseFormErrors>({ ...emptyErrors })
  const [attachments, setAttachments] = useState<AttachmentFile[]>(defaultAttachments)

  if (!isOpen) return null

  const handleChange = (field: keyof EnterpriseFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear error on change
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = (): boolean => {
    const next: EnterpriseFormErrors = { ...emptyErrors }
    let valid = true

    if (!form.companyName.trim()) { next.companyName = 'Tên doanh nghiệp là bắt buộc'; valid = false }
    if (!form.taxCode.trim()) { next.taxCode = 'Mã số thuế là bắt buộc'; valid = false }
    if (!form.businessType) { next.businessType = 'Loại hình kinh doanh là bắt buộc'; valid = false }
    if (!form.industry) { next.industry = 'Ngành nghề là bắt buộc'; valid = false }
    if (!form.gpkdProvince) { next.gpkdProvince = 'Tỉnh/TP ĐKKD là bắt buộc'; valid = false }
    if (!form.gpkdWard) { next.gpkdWard = 'Phường/Xã ĐKKD là bắt buộc'; valid = false }
    if (!form.email.trim()) { next.email = 'Email là bắt buộc'; valid = false }

    setErrors(next)
    return valid
  }

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(2)
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const handleConfirm = () => {
    onSave(form)
    // Reset
    setForm({ ...emptyForm })
    setErrors({ ...emptyErrors })
    setAttachments(defaultAttachments)
    setCurrentStep(1)
  }

  const handleCancel = () => {
    setForm({ ...emptyForm })
    setErrors({ ...emptyErrors })
    setAttachments(defaultAttachments)
    setCurrentStep(1)
    onClose()
  }

  const handleAddAttachment = () => {
    const nextId = Math.max(0, ...attachments.map((a) => a.id)) + 1
    setAttachments((prev) => [...prev, { id: nextId, fileName: `File mới ${nextId}`, fileInfo: `file_${nextId}.pdf` }])
  }

  const handleRemoveAttachment = (id: number) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }

  const steps = [
    { number: 1, label: 'Thông tin doanh nghiệp' },
    { number: 2, label: 'Xác nhận đăng ký' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[95%] max-w-[1200px] max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">

        {/* Stepper */}
        <div className="shrink-0 px-8 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-center gap-0">
            {steps.map((step, idx) => (
              <div key={step.number} className="flex items-center">
                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      currentStep > step.number
                        ? 'bg-primary text-white'
                        : currentStep === step.number
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <i className="fa-solid fa-check text-xs" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-sm whitespace-nowrap ${
                      currentStep >= step.number ? 'text-gray-800 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`w-32 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0">
          {currentStep === 1 && (
            <EnterpriseStepOne
              form={form}
              errors={errors}
              attachments={attachments}
              onChange={handleChange}
              onAddAttachment={handleAddAttachment}
              onRemoveAttachment={handleRemoveAttachment}
            />
          )}
          {currentStep === 2 && (
            <EnterpriseStepConfirm
              form={form}
              attachments={attachments}
            />
          )}
        </div>

        {/* Footer buttons */}
        <div className="shrink-0 px-8 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          {currentStep === 1 && (
            <>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <i className="fa-solid fa-chevron-right text-xs" />
                Tiếp tục
              </button>
            </>
          )}
          {currentStep === 2 && (
            <>
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Trở về
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <i className="fa-solid fa-check text-xs" />
                Xác nhận
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
