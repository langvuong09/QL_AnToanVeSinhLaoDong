
'use client'

import { Agreement } from "@/src/api/Agreement";
import SelectInputLengend from "@/src/components/SelectInputLengend";
import TopHero from "@/src/components/TopHero";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import { useContext, useEffect, useState } from "react";

const TNLDTheoHDLDPage = () => {
    const now = new Date();
    const notificate = useContext(NotificateContext);

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

            <div className="flex flex-col flex-1 pt-3">
                <div className="flex-1">
                    <div className="bg-[#F4F6F8] px-5 py-2">
                        <div className="flex font-semibold gap-5 pb-3 text-sm text-[#637381]">
                            <div className="flex-1">Thao tác</div>
                            <div className="flex-3">Tên doanh nghiệp</div>
                            <div className="flex-1">Mã số thuế</div>
                            <div className="flex-1">Kỳ báo cáo</div>
                            <div className="flex-1">Trạng thái</div>
                        </div>
                    </div>
                </div>
                {/* List */}

            </div>
        </main>
    )
}

export default TNLDTheoHDLDPage;