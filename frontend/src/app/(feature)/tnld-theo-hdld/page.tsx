
'use client'

import { Agreement } from "@/src/api/Agreement";
import { AgreementBusiness } from "@/src/api/types/agreement";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Pagination from "@/src/components/Pagination";

const TNLDTheoHDLDPage = () => {
    const now = new Date();
    const notificate = useContext(NotificateContext);
    const route = useRouter();
    const [items, setItems] = useState<AgreementBusiness[]>([]);

    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });
    const [filters, setFilters] = useState({
        year: now.getFullYear()
    });

    const fetchDetails = async (
        page = 1,
        pageSize = pagination.pageSize,
        filterParams = filters,
    ) => {
        try {
            const cls = new Agreement();
            const result = await cls.GetAll({
                page,
                pageSize,
                year: filterParams.year || undefined
            });

            setItems(result.items);
            setPagination(prev => ({
                ...prev,
                page,
                pageSize,
                total: result!.count,
            }));

        } catch {
            notificate?.showNotification({ type: "error", message: "Có lỗi xảy ra phía server, thử lại sau" });
        }
    }

    useEffect(() => {
        fetchDetails(1);
    }, [filters]);

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
                    </div>
                }
            />

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">
                {/* Header wrapper */}
                <div className="shrink-0 border-b border-gray-200 px-5 py-3 bg-gray-50/20">
                    <div className="flex font-semibold gap-5 text-xs text-gray-500">
                        <div className="flex-1 text-center">Thao tác</div>
                        <div className="flex-3">Tên doanh nghiệp</div>
                        <div className="flex-1">Mã số thuế</div>
                        <div className="flex-1">Kỳ báo cáo</div>
                        <div className="flex-1">Trạng thái</div>
                    </div>
                </div>

                {/* Danh sách - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0 px-5">
                    {items.length === 0 && (
                        <div className="py-12 text-center text-gray-400 text-sm">Không có dữ liệu</div>
                    )}
                    {items.map((i) => (
                        <div key={i.id} className="flex items-center gap-5 py-2.5 border-b border-gray-100 hover:bg-blue-50/40 transition-colors text-sm text-gray-700">
                            <div className="flex-1 flex items-center justify-center gap-4 text-gray-400">
                                <button className="hover:text-primary transition-colors" onClick={() => route.push(`/tnld-theo-hdld//view/${i.id}`)}>
                                    <i className="fa-solid fa-eye text-xs"></i>
                                </button>
                                {i.status === "DRAFT" && (
                                    <button className="hover:text-primary transition-colors" onClick={() => route.push(`/tnld-theo-hdld/${i.id}`)}>
                                        <i className="fa-solid fa-pencil text-xs"></i>
                                    </button>
                                )}
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
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer with Pagination */}
                <div className="shrink-0 flex items-center justify-end gap-4 px-5 py-3 border-t border-gray-200 bg-white">
                    <Pagination
                        totalCount={pagination.total}
                        pageSize={pagination.pageSize}
                        currentPage={pagination.page}
                        setPageSize={(newSize) => fetchDetails(1, newSize)}
                        setCurrentPage={(newPage) => fetchDetails(newPage, pagination.pageSize)}
                    />
                </div>
            </div>
        </main>
    )
}

export default TNLDTheoHDLDPage;