'use client'

import React from 'react'

type BulkDeleteBarProps = {
  selectedCount: number
  onDelete: () => void
  onClearSelection: () => void
  deleteLabel?: string
  selectionLabel?: string
  loading?: boolean
}

export default function BulkDeleteBar({
  selectedCount,
  onDelete,
  onClearSelection,
  deleteLabel = 'Xóa',
  selectionLabel = 'dữ liệu được chọn',
  loading = false,
}: BulkDeleteBarProps) {
  if (selectedCount <= 0) return null

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 px-4 py-2 flex items-center gap-4 animate-[slideInDown_0.3s_ease-out]">
      <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
        <span className="bg-primary text-white text-[12px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
          {selectedCount}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {selectionLabel}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin text-xs" />
          ) : (
            <i className="fa-solid fa-trash-can text-xs" />
          )}
          <span>{deleteLabel}</span>
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={onClearSelection}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <i className="fa-solid fa-xmark text-sm" />
        </button>
      </div>
    </div>
  )
}
