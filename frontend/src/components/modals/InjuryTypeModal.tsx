'use client'

import { useMemo } from 'react'
import type { IInjuryType } from '@/src/api/InjuryType'
import InputLegend from '@/src/components/InputLegend'
import SelectLegend from '@/src/components/SelectLegend'
import SearchableSelect from '@/src/components/SearchableSelect'
import Loading from '@/src/components/Loading'

function getInjuryLevel(code: string): number {
  const clean = code.trim().toUpperCase().replace(/^INJ_/, '')
  if (!clean) return 0
  const parts = clean.split('_')
  if (parts.some((p) => !/^\d+$/.test(p))) return 0
  if (parts.length > 3) return 0
  return parts.length
}

type InjuryTypeModalProps = {
  isOpen: boolean
  editingItem: IInjuryType | null
  allInjuries: IInjuryType[]
  form: { code: string; name: string; parentId: string; status: string }
  errors: { code: string; name: string; parentId?: string }
  isLoading?: boolean
  loadingParents?: boolean
  onClose: () => void
  onSave: () => void
  onChange: (field: string, value: string) => void
}

export default function InjuryTypeModal({
  isOpen,
  editingItem,
  allInjuries,
  form,
  errors,
  isLoading = false,
  loadingParents = false,
  onClose,
  onSave,
  onChange,
}: InjuryTypeModalProps) {
  const codeVal = form.code.trim()
  const injuryLevel = useMemo(() => getInjuryLevel(codeVal), [codeVal])

  const requiredParentLevel = useMemo(() => {
    if (injuryLevel === 2) return 1
    if (injuryLevel === 3) return 2
    return null
  }, [injuryLevel])

  const parentOptions = useMemo(() => {
    let filtered = allInjuries.filter((i) =>
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
  }, [allInjuries, editingItem, requiredParentLevel, form.parentId])

  const isParentSelectDisabled = useMemo(() => {
    if (isLoading) return true
    if (injuryLevel === 1) return true
    if (injuryLevel === 0) return true
    return injuryLevel < 2 || injuryLevel > 3
  }, [isLoading, injuryLevel])

  const parentSelectPlaceholder = useMemo(() => {
    if (injuryLevel === 0) return 'Vui lòng nhập mã số để chọn chấn thương cha'
    if (injuryLevel === 1) return 'Cấp 1 không yêu cầu chọn chấn thương cha'
    if (injuryLevel > 3) return 'Mã số không hợp lệ'
    return `Chọn loại chấn thương cha cấp ${injuryLevel - 1}`
  }, [injuryLevel])

  const fallbackParent = useMemo(() => {
    if (editingItem && editingItem.parent) {
      const parentObj = editingItem.parent
      const calculatedLevel = parentObj.level || (editingItem.level ? editingItem.level - 1 : 1)
      return {
        ...parentObj,
        level: calculatedLevel,
      } as IInjuryType
    }
    return null
  }, [editingItem])

  if (!isOpen) return null

  return (
    <>
      {isLoading && <Loading />}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
        <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h2 className="text-white text-base font-semibold">
              {editingItem ? 'Cập nhật loại chấn thương' : 'Thêm mới loại chấn thương'}
            </h2>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 gap-5">
              <InputLegend
                label="Mã số"
                require={true}
                input={{
                  type: 'text',
                  placeholder: 'Nhập mã số chấn thương',
                  value: form.code,
                  onChange: (e) => onChange('code', (e.target as HTMLInputElement).value),
                  disabled: isLoading || !!editingItem,
                }}
                errorMess={errors.code}
              />

              <InputLegend
                label="Tên loại chấn thương"
                require={true}
                input={{
                  type: 'text',
                  placeholder: 'Nhập tên loại chấn thương',
                  value: form.name,
                  onChange: (e) => onChange('name', (e.target as HTMLInputElement).value),
                  disabled: isLoading,
                }}
                errorMess={errors.name}
              />

              <SearchableSelect
                label="Loại chấn thương cha"
                require={injuryLevel >= 2 && injuryLevel <= 3}
                value={form.parentId}
                options={parentOptions}
                disabled={isParentSelectDisabled}
                loading={loadingParents}
                placeholder={parentSelectPlaceholder}
                errorMess={errors.parentId}
                fallbackSelectedOption={fallbackParent}
                onChange={(val) => onChange('parentId', val)}
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
