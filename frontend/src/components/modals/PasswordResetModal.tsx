'use client'

import { useState } from 'react'
import InputLegend from '@/src/components/InputLegend'
import PasswordInput from '@/src/components/form/PasswordInput'

type Props = {
  isOpen: boolean
  onClose: () => void
  username: string
  companyName: string
  onConfirm: (password: string) => void
}

export default function PasswordResetModal({
  isOpen,
  onClose,
  username,
  companyName,
  onConfirm,
}: Props) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' })

  if (!isOpen) return null

  const validate = () => {
    let valid = true
    const nextErrors = { password: '', confirmPassword: '' }

    if (!password) {
      nextErrors.password = 'Mật khẩu mới là bắt buộc'
      valid = false
    } else if (password.length < 6) {
      nextErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
      valid = false
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
      valid = false
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
      valid = false
    }

    setErrors(nextErrors)
    return valid
  }

  const handleConfirm = () => {
    if (validate()) {
      onConfirm(password)
      resetAndClose()
    }
  }

  const resetAndClose = () => {
    setPassword('')
    setConfirmPassword('')
    setErrors({ password: '', confirmPassword: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50">
      <div className="w-[450px] bg-white rounded-xl shadow-2xl overflow-hidden animate-[fadeInScale_0.25s_ease-out]">
        {/* Header */}
        <div className="bg-primary px-6 py-4 text-center">
          <h3 className="text-white font-bold text-lg">Đặt lại mật khẩu</h3>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-6">
          <p className="text-sm text-gray-600 text-center">
            Đang đặt lại mật khẩu cho doanh nghiệp:<br />
            <span className="font-bold text-gray-800">{companyName}</span>
          </p>

          <InputLegend
            label="Tên đăng nhập"
            input={{
              type: 'text',
              value: username,
              disabled: true,
            }}
          />

          <PasswordInput
            label="Mật khẩu mới"
            required
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors(prev => ({ ...prev, password: '' }))
            }}
            error={errors.password}
          />

          <PasswordInput
            label="Nhập lại mật khẩu"
            required
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setErrors(prev => ({ ...prev, confirmPassword: '' }))
            }}
            error={errors.confirmPassword}
          />
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={resetAndClose}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}
