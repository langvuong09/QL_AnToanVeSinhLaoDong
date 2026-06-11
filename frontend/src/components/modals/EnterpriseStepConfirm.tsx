'use client'

import type { EnterpriseFormData } from './EnterpriseStepOne'
import type { AttachmentFile } from '@/src/mocks/enterprises'

type Props = {
  form: EnterpriseFormData
  attachments: AttachmentFile[]
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[280px_1fr] py-2">
      <span className="text-sm font-semibold text-gray-800">{label}</span>
      <span className="text-sm text-gray-700">{value || '—'}</span>
    </div>
  )
}

export default function EnterpriseStepConfirm({ form, attachments }: Props) {
  // Build address string
  const gpkdAddress = [form.address, form.gpkdWard, form.gpkdProvince].filter(Boolean).join(', ')
  const businessAddr = [form.businessAddress, form.businessWard, form.businessProvince].filter(Boolean).join(', ')

  return (
    <div className="space-y-6">
      {/* Section: Thông tin về hồ sơ */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-4">Thông tin về hồ sơ</h3>
        <div className="space-y-0">
          <InfoRow label="Mã số thuế :" value={form.taxCode} />
          <InfoRow label="Tên doanh nghiệp :" value={form.companyName} />
          <InfoRow label="Tên viết bằng tiếng nước ngoài :" value={form.foreignName} />
          <InfoRow label="Ngày cấp GPKD:" value={form.gpkdDate} />
          <InfoRow label="Email:" value={form.email} />
          <InfoRow label="Loại hình kinh doanh:" value={form.businessType} />
          <InfoRow label="Ngành nghề kinh doanh" value={form.industry} />
          <InfoRow label="Địa chỉ đăng kí giấy phép kinh doanh :" value={gpkdAddress} />
          <InfoRow label="Địa điểm kinh doanh :" value={businessAddr} />
          <InfoRow label="Người đứng đầu doanh nghiệp" value={form.representative} />
          <InfoRow label="SĐT người đứng đầu" value={form.representativePhone} />
        </div>
      </div>

      {/* Section: File đính kèm */}
      <div>
        <div className="border-t border-gray-200 pt-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_1fr_100px] bg-gray-50 text-xs font-medium text-gray-500 border-b border-gray-200">
              <div className="px-4 py-2.5">Tên file</div>
              <div className="px-4 py-2.5">Thông tin file</div>
              <div className="px-4 py-2.5 text-center">Thao tác</div>
            </div>

            {/* Table rows */}
            {attachments.map((file) => (
              <div
                key={file.id}
                className="grid grid-cols-[1fr_1fr_100px] text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
              >
                <div className="px-4 py-2.5">{file.fileName}</div>
                <div className="px-4 py-2.5">{file.fileInfo}</div>
                <div className="px-4 py-2.5 flex items-center justify-center">
                  <button type="button" className="text-gray-400 hover:text-primary transition-colors" title="Xem">
                    <i className="fa-solid fa-eye text-xs" />
                  </button>
                </div>
              </div>
            ))}

            {attachments.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                Không có file đính kèm
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
