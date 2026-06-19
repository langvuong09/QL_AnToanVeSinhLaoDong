'use client'

import { useEffect, useState } from 'react'
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
  const [password, setPassword] = useState('A12345678')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setPassword('A12345678')
      setCopied(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm(password)
    onClose()
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
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
            Bạn có chắc chắn muốn đặt lại mật khẩu cho:<br />
            <span className="font-bold text-gray-800">{targetName}</span>
          </p>

          <InputLegend
            label="Tên đăng nhập"
            input={{
              type: 'text',
              value: username,
              disabled: true,
            }}
          />

          <div className="relative">
            <InputLegend
              label="Mật khẩu khởi tạo"
              input={{
                type: 'text',
                value: password,
                disabled: true,
                className: 'bg-gray-50 font-mono text-center font-bold text-gray-900 border-dashed pr-20',
              }}
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-3 bottom-2 text-primary hover:text-primary/80 text-xs font-semibold transition-colors"
            >
              {copied ? 'Đã chép!' : 'Sao chép'}
            </button>
          </div>
          <p className="text-xs text-gray-500 italic text-center">
            * Mật khẩu khởi tạo được tự động tạo theo cơ chế hệ thống.
          </p>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}
