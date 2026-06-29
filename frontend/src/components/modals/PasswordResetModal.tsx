'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import InputLegend from '@/src/components/InputLegend'

type Props = {
  isOpen: boolean
  onClose: () => void
  username: string
  targetName: string
  onConfirm: (password: string) => void
}

export default function PasswordResetModal({
  isOpen,
  onClose,
  username,
  targetName,
  onConfirm,
}: Props) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      setPassword('')
      setError('')
    }
  }, [isOpen])

  if (!isOpen) return null
  if (!mounted) return null

  const handleConfirm = () => {
    if (!password.trim()) {
      setError('Mật khẩu mới không được để trống')
      return
    }
    onConfirm(password)
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="w-[450px] bg-white rounded-xl shadow-2xl overflow-hidden animate-[fadeInScale_0.25s_ease-out]">
        {/* Header */}
        <div className="bg-primary px-6 py-4 text-center">
          <h3 className="text-white font-bold text-lg">Xác nhận</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          <p className="text-sm text-gray-700">
            Khởi tạo mật khẩu cho tài khoản <span className="font-bold text-gray-900">{username}</span>
          </p>

          <InputLegend
            input={{
              type: 'password',
              placeholder: 'Nhập mật khẩu mới mong muốn',
              value: password,
              onChange: (e) => {
                setPassword(e.target.value)
                setError('')
              },
            }}
            errorMess={error}
          />

          {/* Footer Buttons */}
          <div className="flex justify-end items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Huỷ bỏ
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all shadow-md shadow-primary/10"
            >
              <i className="fa-solid fa-floppy-disk text-xs" />
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

