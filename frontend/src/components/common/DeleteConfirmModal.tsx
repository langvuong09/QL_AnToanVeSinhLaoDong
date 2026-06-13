'use client'

import React from 'react'
import ConfirmationModal from '../modals/ConfirmationModal'

type DeleteConfirmModalProps = {
  open: boolean
  count: number
  title?: string
  description?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({
  open,
  count,
  title = 'Xác nhận xóa',
  description,
  loading = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const defaultDescription = count === 1
    ? 'Bạn có chắc chắn muốn xóa dữ liệu đã chọn?\nDữ liệu sau khi xóa sẽ không thể khôi phục.'
    : `Bạn có chắc chắn muốn xóa ${count} dữ liệu đã chọn?\nDữ liệu sau khi xóa sẽ không thể khôi phục.`

  return (
    <ConfirmationModal
      isOpen={open}
      onClose={onCancel}
      onConfirm={onConfirm}
      title={title}
      message={description || defaultDescription}
      confirmText="Xác nhận xóa"
      cancelText="Hủy"
      isDangerous={true}
      isLoading={loading}
    />
  )
}
