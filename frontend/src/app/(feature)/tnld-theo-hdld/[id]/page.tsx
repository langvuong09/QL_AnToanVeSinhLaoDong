'use client'

import InputLegend from "@/src/components/InputLegend";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import { AuthenticateContext } from "@/src/contexts/authenticate/authenticate";
import { useContext, useState } from "react";

type OptionReport = "business-info" | "option-1" | "option-2" | "review-report";

const TNLDTheoHDLDIdPage = () => {
    const authenticate = useContext(AuthenticateContext);
    const [optionReport, setOptionReport] = useState<OptionReport>("business-info");

    return (
        <main className="flex flex-col min-h-screen">
            <TopHero
                lable="Báo cáo định kỳ tai nạn lao động"
                component={
                    <div className="flex gap-5 rounded">

                    </div>
                }
            />

            <div className="pt-8 px-5 space-y-8">
                <div className="flex">
                    <div className="flex-1">
                        <SelectLegend
                            select={{
                                onChange: (e) => {
                                    setOptionReport(e.target.value as OptionReport);
                                }
                            }}
                            label="Chọn mục báo cáo"
                            isSmall={true}
                        >

                            <option value={"business-info"}>Thông tin doanh nghiệp</option>
                            <option value={"option-1"}>1. Tai nạn lao động</option>
                            <option value={"option-2"}>2. Tai nạn lao động được hưởng trợ cấp theo quy định tại khoản 2 Điều 39 Luật ATVSLĐ</option>
                            <option value={"review-report"}>Xem báo cáo tổng quan</option>
                        </SelectLegend>
                    </div>
                    <div className="flex-2"></div>
                </div>

                {/* Bussiness Info */}
                {optionReport === "business-info" && (
                    <div>
                        <h1 className="font-semibold">1. Thông tin công ty</h1>
                        <span className="text-sm font-semibold text-red-500">
                            *** Lưu ý: Nhập tổng quỹ lương 6 tháng khi khai báo TNLĐ 6 tháng hoặc tổng quỹ lương 12 tháng khi khai báo TNLĐ cả năm
                        </span>

                        <div className="mt-5 space-y-5">
                            <div className="flex gap-10">
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tên công ty"
                                        input={{
                                            disabled: true,
                                            value: authenticate?.state?.fullName
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Loại hình công ty"
                                        input={{
                                            disabled: true,
                                            value: authenticate?.state?.fullName
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Loại hình công ty"
                                        input={{
                                            disabled: true,
                                            value: authenticate?.state?.fullName
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-10">
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số lao động của sở"
                                        require={true}
                                        input={{
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số lao động nữ"
                                        require={true}
                                        input={{
                                        }}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng quỹ lương"
                                        require={true}
                                        input={{
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </main>
    )
}

export default TNLDTheoHDLDIdPage;