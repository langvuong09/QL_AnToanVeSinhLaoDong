'use client'

import type { ITrauma } from '@/src/api/Trauma'
import InputLegend from '@/src/components/InputLegend'
import SelectLegend from '@/src/components/SelectLegend'
import Loading from '@/src/components/Loading'

type TraumaModalProps = {
  isOpen: boolean
  editingItem: ITrauma | null
  form: { code: string; name: string; status: string }
  errors: { code: string; name: string }
  isLoading?: boolean
  onClose: () => void
  onSave: () => void
  onChange: (field: string, value: string) => void
}

export default function TraumaModal({
  isOpen,
  editingItem,
  form,
  errors,
  isLoading = false,
  onClose,
  onSave,
  onChange,
}: TraumaModalProps) {
  if (!isOpen) return null

  return (
    <>
      {isLoading && <Loading />}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
        <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h2 className="text-white text-base font-semibold">
              {editingItem ? 'Cập nhật yếu tố gây chấn thương' : 'Thêm mới yếu tố gây chấn thương'}
            </h2>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 gap-5">
              <InputLegend
                label="Mã yếu tố"
                require={true}
                input={{
                  type: 'text',
                  placeholder: 'Nhập mã yếu tố',
                  value: form.code,
                  onChange: (e) => onChange('code', (e.target as HTMLInputElement).value),
                  disabled: isLoading || !!editingItem,
                }}
                errorMess={errors.code}
              />

              <InputLegend
                label="Tên yếu tố"
                require={true}
                input={{
                  type: 'text',
                  placeholder: 'Nhập tên yếu tố gây chấn thương',
                  value: form.name,
                  onChange: (e) => onChange('name', (e.target as HTMLInputElement).value),
                  disabled: isLoading,
                }}
                errorMess={errors.name}
              />

              {editingItem && (
                <SelectLegend
                  label="Trạng thái"
                  select={{
                    value: form.status,
                    onChange: (e) => onChange('status', (e.target as HTMLSelectElement).value),
                    disabled: isLoading,
                  }}
                >
                  <option value="true">Sử dụng</option>
                  <option value="false">Ngừng sử dụng</option>
                </SelectLegend>
              )}
            </div>
          </div>

          <div className="px-6 pb-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={isLoading}
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#4a22b8] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-floppy-disk text-xs" />
              Lưu
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
