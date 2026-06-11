'use client'

import type { BusinessType } from '@/src/mocks/business-types'

type BusinessTypeModalProps = {
  isOpen: boolean
  editingItem: BusinessType | null
  form: { code: string; name: string; status: string }
  errors: { code: string; name: string }
  onClose: () => void
  onSave: () => void
  onChange: (field: string, value: string) => void
}

export default function BusinessTypeModal({
  isOpen,
  editingItem,
  form,
  errors,
  onClose,
  onSave,
  onChange,
}: BusinessTypeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="bg-[#5B2DE1] px-6 py-4">
          <h2 className="text-white text-base font-semibold">
            {editingItem ? 'Cập nhật loại hình kinh doanh' : 'Thêm mới loại hình kinh doanh'}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Mã loại hình <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => onChange('code', e.target.value)}
              placeholder="Nhập mã loại hình"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#5B2DE1] transition-colors ${
                errors.code ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Tên loại hình kinh doanh <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Nhập tên loại hình"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#5B2DE1] transition-colors ${
                errors.name ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Trạng thái</label>
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => onChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#5B2DE1] appearance-none bg-white transition-colors"
              >
                <option value="true">Sử dụng</option>
                <option value="false">Ngừng sử dụng</option>
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="px-6 pb-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-5 py-2 bg-[#5B2DE1] text-white rounded-lg text-sm font-medium hover:bg-[#4a22b8] transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-floppy-disk text-xs" />
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}
