'use client'

import { useMemo } from 'react'
import type { IIndustry } from '@/src/api/Industry'
import InputLegend from '@/src/components/InputLegend'
import SelectLegend from '@/src/components/SelectLegend'
import SearchableSelect from '@/src/components/SearchableSelect'

type BusinessIndustryModalProps = {
  isOpen: boolean
  editingItem: IIndustry | null
  allIndustries: IIndustry[]
  form: { code: string; name: string; parentId: string; status: string }
  errors: { code: string; name: string; parentId?: string }
  isLoading?: boolean
  loadingParents?: boolean
  onClose: () => void
  onSave: () => void
  onChange: (field: string, value: string) => void
}

export default function BusinessIndustryModal({
  isOpen,
  editingItem,
  allIndustries,
  form,
  errors,
  isLoading = false,
  loadingParents = false,
  onClose,
  onSave,
  onChange,
}: BusinessIndustryModalProps) {
  const codeVal = form.code.trim()
  const codeLength = codeVal.length

  const requiredParentLevel = useMemo(() => {
    if (codeLength === 2) return 1
    if (codeLength === 3) return 2
    if (codeLength === 4) return 3
    return null
  }, [codeLength])

  const parentOptions = useMemo(() => {
    let filtered = allIndustries.filter((i) =>
      editingItem ? i.id !== editingItem.id : true
    )

    if (requiredParentLevel !== null) {
      filtered = filtered.filter(
        (i) => i.level === requiredParentLevel && (i.isActive || String(i.id) === form.parentId)
      )
    } else {
      filtered = []
    }
    return filtered
  }, [allIndustries, editingItem, requiredParentLevel, form.parentId])

  const isParentSelectDisabled = useMemo(() => {
    if (isLoading) return true
    if (codeLength === 1) return true
    if (codeLength === 0) return true
    return codeLength < 2 || codeLength > 4
  }, [isLoading, codeLength])

  const parentSelectPlaceholder = useMemo(() => {
    if (codeLength === 0) return 'Vui lòng nhập mã ngành để chọn ngành cha'
    if (codeLength === 1) return 'Cấp 1 không yêu cầu chọn ngành cha'
    if (codeLength > 4) return 'Mã ngành không hợp lệ'
    return `Chọn nhóm ngành cha cấp ${codeLength - 1}`
  }, [codeLength])

  const fallbackParent = useMemo(() => {
    if (editingItem && editingItem.parent) {
      const parentObj = editingItem.parent
      const calculatedLevel = parentObj.level || (editingItem.level ? editingItem.level - 1 : 1)
      return {
        ...parentObj,
        level: calculatedLevel,
      } as IIndustry
    }
    return null
  }, [editingItem])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="bg-primary px-6 py-4">
          <h2 className="text-white text-base font-semibold">
            {editingItem ? 'Cập nhật ngành nghề kinh doanh' : 'Thêm mới ngành nghề kinh doanh'}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 gap-5">
            <InputLegend
              label="Mã ngành"
              require={true}
              input={{
                type: 'text',
                placeholder: 'Nhập mã ngành',
                value: form.code,
                onChange: (e) => onChange('code', (e.target as HTMLInputElement).value),
                disabled: isLoading || !!editingItem,
              }}
              errorMess={errors.code}
            />

            <InputLegend
              label="Tên ngành nghề"
              require={true}
              input={{
                type: 'text',
                placeholder: 'Nhập tên ngành nghề',
                value: form.name,
                onChange: (e) => onChange('name', (e.target as HTMLInputElement).value),
                disabled: isLoading,
              }}
              errorMess={errors.name}
            />

            <SearchableSelect
              label="Nhóm ngành cha"
              require={codeLength >= 2 && codeLength <= 4}
              value={form.parentId}
              options={parentOptions}
              disabled={isParentSelectDisabled}
              loading={loadingParents}
              placeholder={parentSelectPlaceholder}
              errorMess={errors.parentId}
              fallbackSelectedOption={fallbackParent}
              onChange={(val) => onChange('parentId', val)}
            />

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
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin text-xs" />
            ) : (
              <i className="fa-solid fa-floppy-disk text-xs" />
            )}
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}

