'use client'

import InputLegend from '@/src/components/InputLegend'
import SelectLegend from '@/src/components/SelectLegend'
import type { AttachmentFile } from '@/src/mocks/enterprises'

export type EnterpriseFormData = {
  companyName: string
  taxCode: string
  businessType: string
  industry: string
  gpkdDate: string
  gpkdProvince: string
  gpkdWard: string
  address: string
  foreignName: string
  email: string
  phone: string
  businessProvince: string
  businessWard: string
  businessAddress: string
  representative: string
  representativePhone: string
}

export type EnterpriseFormErrors = {
  companyName: string
  taxCode: string
  businessType: string
  industry: string
  gpkdProvince: string
  gpkdWard: string
  email: string
}

type Props = {
  form: EnterpriseFormData
  errors: EnterpriseFormErrors
  attachments: AttachmentFile[]
  onChange: (field: keyof EnterpriseFormData, value: string) => void
  onAddAttachment: () => void
  onRemoveAttachment: (id: number) => void
}

export default function EnterpriseStepOne({
  form,
  errors,
  attachments,
  onChange,
  onAddAttachment,
  onRemoveAttachment,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Section: Thông tin doanh nghiệp */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-4">Thêm mới doanh nghiệp</h3>
        <div className="grid grid-cols-3 gap-4">
          <InputLegend
            label="Tên doanh nghiệp"
            require
            input={{
              type: 'text',
              placeholder: 'Nhập tên doanh nghiệp',
              value: form.companyName,
              onChange: (e) => onChange('companyName', (e.target as HTMLInputElement).value),
            }}
            errorMess={errors.companyName}
          />
          <InputLegend
            label="Mã số thuế"
            require
            input={{
              type: 'text',
              placeholder: 'Nhập mã số thuế',
              value: form.taxCode,
              onChange: (e) => onChange('taxCode', (e.target as HTMLInputElement).value),
            }}
            errorMess={errors.taxCode}
          />
          <SelectLegend
            label="Loại hình kinh doanh"
            require
            select={{
              value: form.businessType,
              onChange: (e) => onChange('businessType', (e.target as HTMLSelectElement).value),
            }}
            errorMess={errors.businessType}
          >
            <option value="">Chọn loại hình</option>
            <option value="Doanh nghiệp tư nhân">Doanh nghiệp tư nhân</option>
            <option value="Công ty TNHH">Công ty TNHH</option>
            <option value="Công ty TNHH 1 thành viên">Công ty TNHH 1 thành viên</option>
            <option value="Công ty cổ phần">Công ty cổ phần</option>
            <option value="Hợp tác xã">Hợp tác xã</option>
          </SelectLegend>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <SelectLegend
            label="Ngành nghề kinh doanh chính"
            require
            select={{
              value: form.industry,
              onChange: (e) => onChange('industry', (e.target as HTMLSelectElement).value),
            }}
            errorMess={errors.industry}
          >
            <option value="">Chọn ngành nghề</option>
            <option value="0111 - Trồng lúa">0111 - Trồng lúa</option>
            <option value="0112 - Trồng ngô">0112 - Trồng ngô</option>
            <option value="4669 - Bán buôn chuyên doanh khác chưa được phân vào đâu">4669 - Bán buôn chuyên doanh khác chưa...</option>
            <option value="Trồng cây thuốc lá, thuốc lào">Trồng cây thuốc lá, thuốc lào</option>
            <option value="Khai thác than cứng">Khai thác than cứng</option>
            <option value="Sản xuất chế biến thực phẩm">Sản xuất chế biến thực phẩm</option>
          </SelectLegend>
          <InputLegend
            label="Ngày cấp GPKD"
            input={{
              type: 'date',
              value: form.gpkdDate,
              onChange: (e) => onChange('gpkdDate', (e.target as HTMLInputElement).value),
            }}
          />
          <SelectLegend
            label="Tỉnh/Thành phố ĐKKD"
            require
            select={{
              value: form.gpkdProvince,
              onChange: (e) => onChange('gpkdProvince', (e.target as HTMLSelectElement).value),
            }}
            errorMess={errors.gpkdProvince}
          >
            <option value="">Chọn tỉnh/TP</option>
            <option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </SelectLegend>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <SelectLegend
            label="Phường/Xã ĐKKD"
            require
            select={{
              value: form.gpkdWard,
              onChange: (e) => onChange('gpkdWard', (e.target as HTMLSelectElement).value),
            }}
            errorMess={errors.gpkdWard}
          >
            <option value="">Chọn phường/xã</option>
            <option value="Phường Bình Thọ">Phường Bình Thọ</option>
            <option value="Phường Tân Định">Phường Tân Định</option>
            <option value="Phường Hiệp Bình Phước">Phường Hiệp Bình Phước</option>
            <option value="Phường Linh Trung">Phường Linh Trung</option>
          </SelectLegend>
          <div className="col-span-2">
            <InputLegend
              label="Địa chỉ"
              input={{
                type: 'text',
                placeholder: 'Nhập địa chỉ',
                value: form.address,
                onChange: (e) => onChange('address', (e.target as HTMLInputElement).value),
              }}
            />
          </div>
        </div>
      </div>

      {/* Section: Thông tin liên hệ */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>
        <div className="grid grid-cols-3 gap-4">
          <InputLegend
            label="Tên viết bằng tiếng nước ngoài"
            input={{
              type: 'text',
              placeholder: 'Tên viết bằng tiếng nước ngoài',
              value: form.foreignName,
              onChange: (e) => onChange('foreignName', (e.target as HTMLInputElement).value),
            }}
          />
          <InputLegend
            label="Email"
            require
            input={{
              type: 'email',
              placeholder: 'Nhập email',
              value: form.email,
              onChange: (e) => onChange('email', (e.target as HTMLInputElement).value),
            }}
            errorMess={errors.email}
          />
          <InputLegend
            label="Số điện thoại cơ quan"
            input={{
              type: 'text',
              placeholder: 'Số điện thoại cơ quan',
              value: form.phone,
              onChange: (e) => onChange('phone', (e.target as HTMLInputElement).value),
            }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <SelectLegend
            label="Tỉnh/TP hoạt động KD"
            select={{
              value: form.businessProvince,
              onChange: (e) => onChange('businessProvince', (e.target as HTMLSelectElement).value),
            }}
          >
            <option value="">Chọn tỉnh/TP</option>
            <option value="Thành phố Hồ Chí Minh">Thành phố Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </SelectLegend>
          <SelectLegend
            label="Phường/Xã hoạt động KD"
            select={{
              value: form.businessWard,
              onChange: (e) => onChange('businessWard', (e.target as HTMLSelectElement).value),
            }}
          >
            <option value="">Chọn phường/xã</option>
            <option value="Phường Bình Thọ">Phường Bình Thọ</option>
            <option value="Phường Tân Định">Phường Tân Định</option>
            <option value="Phường Hiệp Bình Phước">Phường Hiệp Bình Phước</option>
          </SelectLegend>
          <InputLegend
            label="Địa điểm kinh doanh"
            input={{
              type: 'text',
              placeholder: 'Địa điểm kinh doanh',
              value: form.businessAddress,
              onChange: (e) => onChange('businessAddress', (e.target as HTMLInputElement).value),
            }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <InputLegend
            label="Người đứng đầu doanh nghiệp"
            input={{
              type: 'text',
              placeholder: 'Người đứng đầu doanh nghiệp',
              value: form.representative,
              onChange: (e) => onChange('representative', (e.target as HTMLInputElement).value),
            }}
          />
          <InputLegend
            label="SĐT liên hệ người đứng đầu"
            input={{
              type: 'text',
              placeholder: 'SĐT liên hệ người đứng đầu',
              value: form.representativePhone,
              onChange: (e) => onChange('representativePhone', (e.target as HTMLInputElement).value),
            }}
          />
          <div />
        </div>
      </div>

      {/* Section: File đính kèm */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">File đính kèm</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_120px] bg-gray-50 text-xs font-medium text-gray-500 border-b border-gray-200">
            <div className="px-4 py-2.5">Tên file</div>
            <div className="px-4 py-2.5">Thông tin file</div>
            <div className="px-4 py-2.5 text-center">Thao tác</div>
          </div>

          {/* Table rows */}
          {attachments.map((file) => (
            <div
              key={file.id}
              className="grid grid-cols-[1fr_1fr_120px] text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
            >
              <div className="px-4 py-2.5">{file.fileName}</div>
              <div className="px-4 py-2.5">{file.fileInfo}</div>
              <div className="px-4 py-2.5 flex items-center justify-center gap-3">
                <button type="button" className="text-gray-400 hover:text-primary transition-colors" title="Xem">
                  <i className="fa-solid fa-eye text-xs" />
                </button>
                <button type="button" className="text-gray-400 hover:text-primary transition-colors" title="Upload">
                  <i className="fa-solid fa-upload text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(file.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Xóa"
                >
                  <i className="fa-solid fa-trash text-xs" />
                </button>
              </div>
            </div>
          ))}

          {attachments.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Chưa có file đính kèm
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
