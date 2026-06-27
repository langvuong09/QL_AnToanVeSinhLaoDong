'use client'

import { Report } from "@/src/api/Report";
import { AgreementTable } from "@/src/api/types/agreement";
import InputLegend from "@/src/components/InputLegend";
import Pagination from "@/src/components/Pagination";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import { OpenAdress, Province, Ward } from "@/src/services/open-address";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TNLDTheoHDLDAdminPage = () => {
    const router = useRouter();
    const now = new Date();

    const [filters, setFilters] = useState({
        businessName: "",
        taxCode: "",
        period: "",
        status: "",
        year: now.getFullYear(),

        province: "",
        ward: "",
    });

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });

    const [reports, setReports] = useState<AgreementTable[]>([]);

    const fetchReports = async (
        page = 1,
        pageSize = pagination.pageSize,
        filterParams = filters,
    ) => {
        try {
            const cls = new Report();
            const result = await cls.GetAll({
                page,
                pageSize,
                businessName: filterParams.businessName || undefined,
                taxCode: filterParams.taxCode || undefined,
                period: filterParams.period || undefined,
                status: filterParams.status,
                year: filterParams.year || undefined,

                province: filterParams.province || undefined,
                ward: filterParams.ward || undefined,
            });

            const items = result.items;

            setReports(items);
            setPagination(prev => ({
                ...prev,
                page,
                pageSize,
                total: result.total
            }));
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchReports(1);
    }, [filters]);

    const [provinces, setProvinces] = useState<Province[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [provinceCodeSelected, setProvinceCodeSelected] = useState<number | undefined>();

    // --- Province search state ---
    const [provinceSearch, setProvinceSearch] = useState("");
    const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
    const provinceRef = useRef<HTMLDivElement>(null);

    // --- Ward search state ---
    const [wardSearch, setWardSearch] = useState("");
    const [showWardDropdown, setShowWardDropdown] = useState(false);
    const wardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const openAddress = new OpenAdress();
        setProvinces(openAddress.provinces);
    }, []);

    useEffect(() => {
        if (!provinceCodeSelected) return;
        const openAddress = new OpenAdress();
        setWards(openAddress.filterWards(provinceCodeSelected));
    }, [provinceCodeSelected]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) {
                setShowProvinceDropdown(false);
            }
            if (wardRef.current && !wardRef.current.contains(e.target as Node)) {
                setShowWardDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredProvinces = provinces.filter((p) =>
        p.name.toLowerCase().includes(provinceSearch.toLowerCase())
    );

    const filteredWards = wards.filter((w) =>
        w.name.toLowerCase().includes(wardSearch.toLowerCase())
    );

    const handleSelectProvince = (province: Province) => {
        setProvinceCodeSelected(province.code);
        setProvinceSearch(province.name);
        setShowProvinceDropdown(false);
        // reset ward
        setWardSearch("");
    };

    const handleSelectWard = (ward: Ward) => {
        setWardSearch(ward.name);
        setShowWardDropdown(false);
    };

    return (
        <main className="h-screen flex flex-col py-2">
            <TopHero
                lable="Báo cáo định kỳ tai nạn lao động"
                component={
                    <div className="flex gap-5 rounded">
                        <SelectLegend
                            select={{
                                className: "pe-10",
                                value: filters.year,
                                onChange: (e) => {
                                    setFilters(prev => ({ ...prev, year: Number(e.target.value) }));
                                }
                            }}
                            isSmall={true}
                        >
                            {Array.from({ length: 21 }, (_, i) => now.getFullYear() - 20 + i).map((v, idx) => (
                                <option key={idx} value={v}>{v}</option>
                            ))}
                        </SelectLegend>

                        <button className="text-xs font-semibold px-3 py-2 ring rounded ring-blue-600 text-blue-600 hover:bg-gray-50 transition-all hover:ring-2">
                            Báo cáo tổng hợp
                        </button>
                    </div>
                }
            />

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">
                <div className="flex gap-5 py-5 px-5">
                    <div className="relative flex-1">
                        <InputLegend
                            label="Tỉnh/Thành phố"
                            require={true}
                            input={{
                                type: "text",
                                placeholder: "Tìm tỉnh/thành phố",
                                value: filters.province || provinceSearch,
                                onChange: (event) => {
                                    setProvinceSearch(event.target.value);
                                    setShowProvinceDropdown(true);
                                    setFilters(prev => ({ ...prev, province: event.target.value }));

                                    if (!event.target.value) {
                                        setProvinceCodeSelected(undefined);
                                        setWards([]);
                                        setWardSearch("");
                                    }
                                },
                                onFocus: () => {
                                    setShowProvinceDropdown(true)
                                }
                            }}
                            isSmall={true}
                        />

                        {/* Dropdown list */}
                        {showProvinceDropdown && filteredProvinces.length > 0 && (
                            <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto text-sm">
                                {filteredProvinces.map((province) => (
                                    <li
                                        key={province.code}
                                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                                        onMouseDown={() => handleSelectProvince(province)}
                                    >
                                        {province.name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {showProvinceDropdown && provinceSearch && filteredProvinces.length === 0 && (
                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm text-gray-400">
                                Không tìm thấy kết quả
                            </div>
                        )}
                    </div>

                    <div className="relative flex-1">
                        <InputLegend
                            label="Phường xã"
                            require={true}
                            input={{
                                type: "text",
                                placeholder: "Tìm phường xã",
                                value: filters.ward || wardSearch,
                                onChange: (event) => {
                                    setWardSearch(event.target.value);
                                    setShowWardDropdown(true);
                                    setFilters(prev => ({ ...prev, ward: event.target.value }));

                                    if (!event.target.value) {

                                    }
                                },
                                onFocus: () => {
                                    if (provinceCodeSelected) setShowWardDropdown(true);
                                }
                            }}
                            isSmall={true}
                        />

                        {showWardDropdown && filteredWards.length > 0 && (
                            <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto text-sm">
                                {filteredWards.map((ward) => (
                                    <li
                                        key={ward.code}
                                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
                                        onMouseDown={() => handleSelectWard(ward)}
                                    >
                                        {ward.name}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {showWardDropdown && wardSearch && filteredWards.length === 0 && (
                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm text-gray-400">
                                Không tìm thấy kết quả
                            </div>
                        )}
                    </div>
                </div>

                {/* Header wrapper */}
                <div className="shrink-0 px-5 py-3 bg-gray-100 space-y-3">
                    <div className="flex font-semibold gap-5 text-xs text-gray-500">
                        <div className="flex-1 text-center flex items-center gap-3">
                            <input type="checkbox" />
                            <span>Thao tác</span>
                        </div>
                        <div className="flex-3">Tên doanh nghiệp</div>
                        <div className="flex-1">Mã số thuế</div>
                        <div className="flex-1">Kỳ báo cáo</div>
                        <div className="flex-1">Trạng thái</div>
                    </div>

                    <div className="flex gap-5">
                        <div className="flex-1"></div>
                        <div className="flex-3">
                            <InputLegend
                                input={{
                                    value: filters.businessName,
                                    onChange: (e) => {
                                        setFilters(prev => ({ ...prev, businessName: e.target.value }));
                                    }
                                }}
                                isSmall={true}
                                fillWhite={true}
                            />
                        </div>
                        <div className="flex-1">
                            <InputLegend
                                input={{
                                    value: filters.taxCode,
                                    onChange: (e) => {
                                        setFilters(prev => ({ ...prev, taxCode: e.target.value }));
                                    }
                                }}
                                isSmall={true}
                                fillWhite={true}
                            />
                        </div>
                        <div className="flex-1">
                            <SelectLegend
                                select={{
                                    value: filters.period,
                                    onChange: (e) => {
                                        setFilters(prev => ({ ...prev, period: e.target.value }));
                                    }
                                }}
                                isSmall={true}
                                fillWhite={true}
                            >
                                <option value="">Kỳ báo cáo</option>
                                <option value="3 tháng">3 tháng</option>
                                <option value="6 tháng">6 tháng</option>
                                <option value="9 tháng">9 tháng</option>
                                <option value="Cả năm">Cả năm</option>
                            </SelectLegend>
                        </div>
                        <div className="flex-1">
                            <SelectLegend
                                select={{
                                    value: filters.status,
                                    onChange: (e) => {
                                        setFilters(prev => ({ ...prev, status: e.target.value }));
                                    }
                                }}
                                isSmall={true}
                                fillWhite={true}
                            >
                                <option value="">Trạng thái</option>
                                <option value="DRAFT">Đang báo cáo</option>
                                <option value="SUBMITTED">Đã nộp</option>
                                <option value="APPROVED">Được chấp nhận</option>
                                <option value="REJECTED">Bị từ chối</option>
                                <option value="OVERDUE_WARNING">Cảnh báo hết hạn</option>
                                <option value="OVERDUE">Đã hết hạn nộp</option>
                            </SelectLegend>
                        </div>
                    </div>
                </div>

                {/* Danh sách - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0 px-5" onClick={() => {
                    setShowProvinceDropdown(false);
                    setShowWardDropdown(false);
                }}>
                    {reports.length === 0 && (
                        <div className="py-12 text-center text-gray-400 text-sm">Không có dữ liệu</div>
                    )}
                    {reports.map((i) => (
                        <div key={i.id} className="flex items-center gap-5 py-2.5 border-b border-gray-100 hover:bg-blue-50/40 transition-colors text-sm text-gray-700">
                            <div className="flex-1 flex items-center justify-start gap-4 text-gray-400">
                                <input type="checkbox" />
                                <button onClick={() => {
                                    router.push(`/tnld-theo-hdld-admin/view/${i.id}`)
                                }}>
                                    <i className="fa-solid fa-eye"></i>
                                </button>

                            </div>
                            <div className="flex-3 truncate">{i.doet.name}</div>
                            <div className="flex-1 truncate">{i.doet.taxCode}</div>
                            <div className="flex-1">{i.reportType.period}</div>
                            <div className="flex-1">
                                {i.status === "DRAFT" && (
                                    <div className="text-gray-500 flex items-center gap-1.5 text-xs font-semibold">
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span>Đang báo cáo</span>
                                    </div>
                                )}
                                {i.status === "SUBMITTED" && (
                                    <div className="text-blue-600 flex items-center gap-1.5 text-xs font-semibold">
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span>Đã tiếp nhận</span>
                                    </div>
                                )}
                                {i.status === "APPROVED" && (
                                    <div className="text-green-600 flex items-center gap-1.5 text-xs font-semibold">
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span>chấp nhận</span>
                                    </div>
                                )}
                                {i.status === "REJECTED" && (
                                    <div className="text-red-600 flex items-center gap-1.5 text-xs font-semibold">
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span>chấp nhận</span>
                                    </div>
                                )}
                                {i.status === "OVERDUE_WARNING" && (
                                    <div className="text-yellow-600 flex items-center gap-1.5 text-xs font-semibold">
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span>Cảnh báo hết hạn</span>
                                    </div>
                                )}
                                {i.status === "OVERDUE" && (
                                    <div className="text-black flex items-center gap-1.5 text-xs font-semibold">
                                        <i className="fa-solid fa-circle text-[8px]"></i>
                                        <span>Đã hết hạn nộp</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="shrink-0 flex items-center justify-end gap-4 px-5 py-3 border-t border-gray-200 bg-white">
                    <Pagination
                        totalCount={pagination.total}
                        pageSize={pagination.pageSize}
                        currentPage={pagination.page}
                        setPageSize={(newSize) => {
                            fetchReports(1, newSize)
                        }}
                        setCurrentPage={(newPage) => {
                            fetchReports(newPage, pagination.pageSize)
                        }}
                    />
                </div>
            </div>
        </main>
    )
}

export default TNLDTheoHDLDAdminPage;