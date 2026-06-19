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
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white shadow-lg flex items-center justify-between gap-4 animate-[slideInDown_0.3s_ease-out] rounded overflow-hidden w-sm">
      <div className="flex items-center gap-3">
        <span className="bg-primary text-white text-[14px] font-bold flex items-center justify-center px-4 py-2.5">
          {selectedCount}
        </span>

        <span className="text-sm font-medium text-gray-700">
          {selectionLabel}
        </span>
      </div>
      <div className="flex items-center gap-2 py-1">

        <button
          type="button"
          disabled={loading}
          onClick={onDelete}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <i className="fa-solid fa-xmark text-sm font-semibold" />
        </button>
      </div>
    </div>
  )
}
