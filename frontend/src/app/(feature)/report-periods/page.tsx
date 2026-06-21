'use client'

import { ReportType } from "@/src/api/ReportType"
import { Report } from "@/src/api/types/report-type"
import CheckboxLengend from "@/src/components/CheckboxLengend"
import CreateReport from "@/src/components/CreateReport"
import DatePicker from "@/src/components/DateLengend"
import EditReport from "@/src/components/EditReport"
import InputLegend from "@/src/components/InputLegend"
import SelectLegend from "@/src/components/SelectLegend"
import TopHero from "@/src/components/TopHero"
import YearInputLengend from "@/src/components/YearInputLengend"
import { NotificateContext } from "@/src/contexts/notificate/notificate"
import { useContext, useEffect, useRef, useState } from "react"

const DEBOUNCE_MS = 500;
const PERIOD_OPTIONS = ["3 tháng", "6 tháng", "9 tháng", "Cả năm"];

export default function ReportPeriodsPage() {
  const notificate = useContext(NotificateContext);

  const [isClickedCreate, setIsClickedCreate] = useState(false);
  const [isClickedEdit, setIsClickedEdit] = useState<{ state: Report | null, isClicked: boolean }>({ state: null, isClicked: false });
  const [items, setItems] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    year: undefined as number | undefined,
    name: '',
    period: '',
    startDate: '',
    endDate: '',
    isActive: undefined as boolean | undefined,
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchItems = async (
    page = 1,
    pageSize = pagination.pageSize,
    filterParams = filters,
  ) => {
    setLoading(true);
    try {
      const cls = new ReportType();
      const result = await cls.GetAll({
        page,
        pageSize,
        year: filterParams.year,
        name: filterParams.name || undefined,
        period: filterParams.period || undefined,
        startDate: filterParams.startDate || undefined,
        endDate: filterParams.endDate || undefined,
        isActive: filterParams.isActive,
      });

      setItems(result.items);
      setPagination(prev => ({ ...prev, page, pageSize, total: result.count }));
    } catch (error: any) {
      notificate?.showNotification({ type: "error", message: error });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(1);
  }, []);

  const handleFilterChange = (field: string, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchItems(1, pagination.pageSize, newFilters);
    }, DEBOUNCE_MS);
  };

  const handleFilterImmediate = (field: string, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    fetchItems(1, pagination.pageSize, newFilters);
  };

  const onChangeStatus = async (id: number, status: boolean) => {
    try {
      const cls = new ReportType();
      await cls.UpdateReportType(id, { isActive: status });
      notificate?.showNotification({ type: "success", message: "Cập nhật kỳ báo cáo thành công" });
      setItems(prev => prev.map(u => u.id === id ? { ...u, isActive: status } : u));
    } catch (error) {
      notificate?.showNotification({ type: "error", message: error });
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      {isClickedCreate && (
        <CreateReport
          onClose={() => setIsClickedCreate(false)}
          onSuccess={(e) => {
            setIsClickedCreate(false);
            setItems(prev => [...prev, e]);
          }}
        />
      )}

      {isClickedEdit.isClicked && isClickedEdit.state && (
        <EditReport
          report={isClickedEdit.state}
          onClose={() => {
            setIsClickedEdit({ state: null, isClicked: false });
          }}
          onSuccess={(e) => {
            setItems(prev => prev.map(u => u.id === e.id ? { ...e } : u));
          }}
        />
      )}

      <TopHero
        lable="Danh sách cấu hình báo cáo"
        component={
          <div className="flex gap-5 rounded">
            <button
              className="flex gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded items-center font-semibold text-sm"
              onClick={() => setIsClickedCreate(true)}
            >
              <i className="fa-solid fa-plus"></i>
              <span>Thêm mới</span>
            </button>
          </div>
        }
      />

      <div className="flex flex-col flex-1 pt-3">
        <div className="flex-1">
          <div className="bg-[#F4F6F8] px-3 py-2">
            <div className="flex font-semibold gap-5 pb-3 text-sm text-[#637381]">
              <div className="flex-1">Thao tác</div>
              <div className="flex-1">Năm báo cáo</div>
              <div className="flex-4">Tên báo cáo</div>
              <div className="flex-2">Kỳ báo cáo</div>
              <div className="flex-2">Thời gian bắt đầu</div>
              <div className="flex-2">Thời gian kết thúc</div>
              <div className="flex-1">Trạng thái</div>
            </div>

            {/* Filter */}
            <div className="flex gap-5 pb-5">
              <div className="flex-1"></div>

              <div className="flex-1">
                <YearInputLengend
                  inputLengend={{ input: {}, fillWhite: true, isSmall: true }}
                  value={filters.year ? String(filters.year) : ''}
                  onChange={(item) => handleFilterImmediate('year', item.key ? Number(item.key) : undefined)}
                />
              </div>

              <div className="flex-4">
                <InputLegend
                  input={{
                    value: filters.name,
                    onChange: (e) => handleFilterChange('name', e.target.value),
                  }}
                  fillWhite={true}
                  isSmall={true}
                />
              </div>

              <div className="flex-2">
                <SelectLegend
                  select={{
                    value: filters.period,
                    onChange: (e) => handleFilterImmediate('period', e.target.value),
                  }}
                  fillWhite={true}
                  isSmall={true}
                >
                  <option value="">Tất cả</option>
                  {PERIOD_OPTIONS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </SelectLegend>
              </div>

              <div className="flex-2">
                <DatePicker
                  fillWhite={true}
                  isSmall={true}
                  value={filters.startDate}
                  onChange={(v) => handleFilterImmediate('startDate', v)}
                />
              </div>

              <div className="flex-2">
                <DatePicker
                  fillWhite={true}
                  isSmall={true}
                  value={filters.endDate}
                  onChange={(v) => handleFilterImmediate('endDate', v)}
                />
              </div>

              <div className="flex-1">
                <SelectLegend
                  select={{
                    value: filters.isActive === undefined ? '' : String(filters.isActive),
                    onChange: (e) => handleFilterImmediate(
                      'isActive',
                      e.target.value === '' ? undefined : e.target.value === 'true'
                    ),
                  }}
                  fillWhite={true}
                  isSmall={true}
                >
                  <option value="">Tất cả</option>
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </SelectLegend>
              </div>
            </div>
          </div>

          {/* Danh sách */}
          <div className="space-y-2 px-3">
            {items.length === 0 && !loading && (
              <div className="py-10 text-center text-gray-400 text-sm">Không có dữ liệu</div>
            )}
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-5 py-2 border-b border-gray-300 text-sm">
                <div className="flex-1 flex items-center justify-center gap-3">
                  <button className="text-gray-500" onClick={() => {
                    setIsClickedEdit({ state: item, isClicked: true });
                  }}>
                    <i className="fa-solid fa-pen"></i>
                  </button>
                </div>
                <div className="flex-1">{item.year}</div>
                <div className="flex-4">{item.name}</div>
                <div className="flex-2">{item.period}</div>
                <div className="flex-2">{item.startDate}</div>
                <div className="flex-2">{item.endDate}</div>
                <div className="flex-1">
                  <button>
                    <CheckboxLengend
                      isChecked={item.isActive}
                      checkbox={{}}
                      onChange={() => {
                        onChangeStatus(item.id, !item.isActive);
                      }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}