'use client'

import { Agreement } from "@/src/api/Agreement";
import { AgreementTable } from "@/src/api/types/agreement";
import InputLegend from "@/src/components/InputLegend";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import { AuthenticateContext } from "@/src/contexts/authenticate/authenticate";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

type OptionReport = "business-info" | "option-1" | "option-2" | "review-report";

type SubmitForm = {
    title: string;
    year: number;
    reportTypeId: number;
    details: {
        traumaId: number;
        injuryTypeId: number;

        totalCases: number;
        fatalCases: number;
        multiVictimCases: number;

        totalVictims: number;
        femaleVictims: number;
        fatalVictims: number;

        severeInjuries: number;
        nonManagedVictims: number;

        nonManagedFemaleVictims: number;
        nonManagedFatalVictims: number;
        nonManagedSevereInjuries: number;
        medicalCost: number;
        salaryCompensation: number;
        propertyDamage: number;
    }[];
    fileIds: string[];
}

const TNLDTheoHDLDIdPage = () => {
    const { id } = useParams();
    const router = useRouter();

    if (!id) {
        router.push("/tnld-theo-hdld");
    }

    const [detail, setDetail] = useState<AgreementTable>();
    const [submitForm, setSubmitForm] = useState<SubmitForm>({
        title: detail?.overview.title || "",
        year: detail?.overview.year || (new Date()).getFullYear(),
        reportTypeId: detail?.overview.reportConfig.id || 0,
        details: [
            {
                // Option: 26.3
                traumaId: 0,
                injuryTypeId: 0,

                totalCases: 0, // Tong so vu
                fatalCases: 0, // Tong so vu co nguoi chet
                multiVictimCases: 0, // Tong so vu co 2 nguoi chet tro len

                totalVictims: 0, // Tong so nguoi bi nan
                femaleVictims: 0, // Tong so lao dong nu bi nan
                fatalVictims: 0, // Tong so nguoi bi chet
                severeInjuries: 0, // Tong so nguoi bi thuong nang

                nonManagedVictims: 0, // So nguoi bi nan khong QL
                nonManagedFemaleVictims: 0, // So lao dong nu bi nan khong QL
                nonManagedFatalVictims: 0, // So nguoi chet khong QL
                nonManagedSevereInjuries: 0, // So nguoi bi thuong nang khong QL

                medicalCost: 0, // Chi phi y te
                salaryCompensation: 0, // Chi phi tra luong trong tg dieu tri
                propertyDamage: 0, // Thiet hai tai san

            }
        ],
        fileIds: [],
    });

    const fetchDetail = async () => {
        if (!id) return;
        try {
            const cls = new Agreement();
            const result = await cls.GetFeTableById(Array.isArray(id) ? id[0] : id);

            console.log(result)
            setDetail(result);

        } catch (error) {

        }
    }

    useEffect(() => {
        if (!id) return;
        fetchDetail();
    }, [id]);


    const authenticate = useContext(AuthenticateContext);

    const [optionReport, setOptionReport] = useState<OptionReport>("business-info");
    const [optionChild, setOptionChild] = useState<"option-1.1" | "option-1.2">("option-1.1");

    return (
        <main className="flex flex-col min-h-screen">
            <TopHero
                lable="Báo cáo định kỳ tai nạn lao động"
                component={
                    <div className="flex gap-5 rounded">

                    </div>
                }
            />

            <div className="pt-8 px-5 space-y-5">
                <div className="flex border-b pb-5 border-gray-300">
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
                                            value: detail?.overview.company.name
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Loại hình công ty"
                                        input={{
                                            disabled: true,
                                            value: detail?.overview.company.businessType.name
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Loại hình công ty"
                                        input={{
                                            disabled: true,
                                            value: detail?.overview.company.industry.name
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-10">
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số lao động của sở"
                                        require={true}
                                        input={{
                                            type: "number",
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;

                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số lao động nữ"
                                        require={true}
                                        input={{
                                            type: "number",
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;

                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng quỹ lương"
                                        require={true}
                                        input={{
                                            type: "number",
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;

                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {optionReport === "option-1" && optionChild === "option-1.1" && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-5 text-sm text-[#637381] font-semibold">
                            <button className="pb-2 border-b-2 border-blue-600 text-blue-600">{"(1) Tổng số vụ tai nạn lao động"}</button>
                            <button className="pb-2 border-b-2 border-white" onClick={() => setOptionChild("option-1.2")}>{"(2) Chi tiết các vụ lao động"}</button>
                        </div>
                        <div>
                            <p>
                                **** Doanh nghiệp xảy ra tai nạn lao động vui lòng nhập theo từng bước
                            </p>
                        </div>
                        <div className="space-y-3">
                            <h1 className="font-semibold">1. Tổng số vụ tai nạn lao động & số nạn nhân lao động</h1>
                            <div className="space-y-6">
                                {/* ------------------------------ */}
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số vụ"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số vụ có người chết"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số vụ có 2 người chết trở lên"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1"></div>
                                </div>
                                {/* ------------------------------ */}
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số người bị nạn"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số lao động nữ bị nạn"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số người chết"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số người bị thương nặng"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                </div>
                                {/* ------------------------------ */}
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Số người bị nạn không QL"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Lao động nữ bị nạn không QL"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Số người chết không QL"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Người bị thương nặng không QL"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Thiệt hại do tai nạn lao động */}
                            <h1 className="font-semibold">2. Thiệt hại do tai nạn lao động</h1>
                            <div className="space-y-6">
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Chi phí y tế"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Chi phí trả lương trong thời gian điều trị"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Chi phí bồi thường trợ cấp"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số tiền chi phí"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                </div>
                                {/* ------------------------------ */}
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số ngày nghỉ vì TNLĐ"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Thiệt hại tài sản"
                                            require={true}
                                            input={{
                                                type: "number",
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;

                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1"></div>
                                    <div className="flex-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {optionReport === "option-1" && optionChild === "option-1.2" && (
                    <div>
                        <div className="flex items-center gap-5 text-sm text-[#637381] font-semibold">
                            <button className="pb-2 border-b-2 border-white" onClick={() => setOptionChild("option-1.1")}>{"(1) Tổng số vụ tai nạn lao động"}</button>
                            <button className="pb-2 border-b-2 border-blue-600 text-blue-600">{"(2) Chi tiết các vụ lao động"}</button>
                        </div>
                        <div>
                            <p>
                                **** Doanh nghiệp xảy ra tai nạn lao động vui lòng nhập theo từng bước
                            </p>
                        </div>
                        <div>
                            
                        </div>
                    </div>
                )}
            </div>

        </main>
    )
}

export default TNLDTheoHDLDIdPage;