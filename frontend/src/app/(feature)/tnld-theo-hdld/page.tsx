
'use client'

import { Agreement } from "@/src/api/Agreement";
import { AgreementBusiness } from "@/src/api/types/agreement";
import SelectInputLengend from "@/src/components/SelectInputLengend";
import TopHero from "@/src/components/TopHero";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

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
    }, []);


    return (
        <main className="flex flex-col min-h-screen">
            <TopHero
                lable="Báo cáo định kỳ tai nạn lao động"
                component={
                    <div className="flex gap-5 rounded">

                    </div>
                }
            />

            <div className="mt-5">
                <div className="bg-[#F4F6F8] px-5 py-2">
                    <div className="flex font-semibold gap-5 pb-3 text-sm text-[#637381]">
                        <div className="flex-1">Thao tác</div>
                        <div className="flex-3">Tên doanh nghiệp</div>
                        <div className="flex-1">Mã số thuế</div>
                        <div className="flex-1">Kỳ báo cáo</div>
                        <div className="flex-1">Trạng thái</div>
                    </div>
                </div>

                <div className="space-y-2 px-3">
                    {items.length === 0 && (
                        <div className="py-10 text-center text-gray-400 text-sm">Không có dữ liệu</div>
                    )}
                    {items.map((i) => (
                        <div key={i.id} className="flex items-center gap-5 py-2 border-b border-gray-300 text-sm">
                            <div className="flex-1 flex items-center justify-center gap-5 text-[#637381]">
                                <button>
                                    <i className="fa-solid fa-eye"></i>
                                </button>
                                {i.status === "DRAFT" && (
                                    <button onClick={() => route.push(`/tnld-theo-hdld/${i.id}`)}>
                                        <i className="fa-solid fa-pencil"></i>
                                    </button>
                                )}
                            </div>
                            <div className="flex-3">{i.doet.name}</div>
                            <div className="flex-1">{i.doet.taxCode}</div>
                            <div className="flex-1">{i.reportType.period}</div>
                            <div className="flex-1">
                                {i.status === "DRAFT" ? (
                                    <div className="text-[#637381] flex items-center gap-1 text-sm font-semibold">
                                        <i className="fa-solid fa-circle"></i>
                                        <span>Đang báo cáo</span>
                                    </div>
                                ) : (
                                    <div className="text-blue-600 flex items-center gap-1 text-sm font-semibold">
                                        <i className="fa-solid fa-circle"></i>
                                        <span>Đã tiếp nhận</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default TNLDTheoHDLDPage;