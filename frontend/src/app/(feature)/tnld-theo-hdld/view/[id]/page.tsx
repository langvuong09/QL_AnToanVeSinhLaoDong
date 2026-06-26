'use client'

import { Accident } from "@/src/api/Accident";
import { Agreement } from "@/src/api/Agreement";
import { Job } from "@/src/api/Job";
import { Trauma } from "@/src/api/Trauma";
import { AccidentDto } from "@/src/api/types/accident";
import { AgreementTable } from "@/src/api/types/agreement";
import { JobDto } from "@/src/api/types/job";
import { TraumaDto } from "@/src/api/types/trauma";
import InputLegend from "@/src/components/InputLegend";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type OptionReport = "business-info" | "option-1" | "option-2" | "review-report";

const TNLDTheoHDLDViewIdPage = () => {
    const { id } = useParams();
    const router = useRouter();

    if (!id) {
        router.push("/tnld-theo-hdld");
    }

    const [detail, setDetail] = useState<AgreementTable>();

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

    // Nguyen nhan xay ra tai nan
    const [accidents, setAccidents] = useState<AccidentDto[]>([]);
    // Yeu to chan thuong
    const [traumas, setTraumas] = useState<TraumaDto[]>([]);
    // Nghe nghiep
    const [jobs, setJobs] = useState<JobDto[]>([]);

    const fetchOtherData = async () => {
        const accidentCls = new Accident();
        const traumaCls = new Trauma();
        const jobCls = new Job();

        const result = await Promise.all([jobCls.GetAll(), traumaCls.GetAll(), accidentCls.GetAll()]);
        setJobs(result[0]);
        setTraumas(result[1])
        setAccidents(result[2]);
    }

    useEffect(() => {
        if (!id) return;
        fetchDetail();
        fetchOtherData();
    }, [id]);


    const [optionReport, setOptionReport] = useState<OptionReport>("business-info");
    const [optionChild, setOptionChild] = useState<"option-1.1" | "option-1.2">("option-1.1");


    return (
        <main className="flex flex-col min-h-screen pb-10">
            <TopHero
                title="Báo cáo định kỳ tai nạn lao động"
                actions={
                    <div className="flex gap-2 items-center">
                        <div className="w-18">
                            <InputLegend
                                input={{
                                    disabled: true,
                                    value: detail?.overview.reportConfig.year,
                                }}
                                isSmall={true}
                            />
                        </div>

                        <div className="flex gap-4 items-center text-xs font-semibold ps-10">
                            <button className="text-gray-400" onClick={() => router.push("/tnld-theo-hdld")}>Hủy bỏ</button>
                            {optionReport === "review-report" ? (
                                <button className="bg-white px-2 py-2 flex items-center gap-1 border-2 border-blue-600 text-blue-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsPrint(true)}>
                                    <i className="fa-solid fa-print"></i>
                                    <span>In báo cáo</span>
                                </button>
                            ) : (
                                <button className="bg-white px-2 py-2 flex items-center gap-1 border-2 border-blue-600 text-blue-600 hover:bg-gray-100 rounded-lg"
                                    onClick={() => {
                                        if (optionReport === "business-info") {
                                            setOptionReport("option-1");
                                            setOptionChild("option-1.1");
                                        }
                                        else if (optionReport === "option-1" && optionChild === "option-1.1") {
                                            setOptionReport("option-1");
                                            setOptionChild("option-1.2");
                                        }
                                        else if (optionReport === "option-1" && optionChild === "option-1.2") {
                                            setOptionReport("option-2");
                                        }
                                        else if (optionReport === "option-2") {
                                            setOptionReport("review-report");
                                        }
                                    }}
                                >
                                    <i className="fa-solid fa-angle-right"></i>
                                    <span>Tiếp tục</span>
                                </button>
                            )}
                        </div>
                    </div>
                }
                className="shrink-0"
            />

            <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2">
                <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0 space-y-5">
                    <div className="flex border-b pb-5 border-gray-300">
                        <div className="flex-2">
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
                        <div className="flex-3"></div>
                    </div>

                    {/* Bussiness Info */}
                    {optionReport === "business-info" && (
                        <div>
                            <h1 className="font-semibold text-sm">1. Thông tin công ty</h1>
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
                                                value: detail?.overview.companyInfo.totalEmployees,
                                                disabled: true,
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
                                                value: detail?.overview.companyInfo.femaleEmployees,
                                                disabled: true,
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Tổng quỹ lương"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: detail?.overview.companyInfo.totalPayroll,
                                                disabled: true,
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-50 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
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
                            <div className="text-sm space-y-3">
                                <p>
                                    **** Doanh nghiệp xảy ra tai nạn lao động vui lòng nhập theo từng bước
                                </p>
                            </div>
                            <div className="space-y-3">
                                <h1 className="font-semibold text-sm">1. Tổng số vụ tai nạn lao động & số nạn nhân lao động</h1>
                                <div className="space-y-6">
                                    {/* ------------------------------ */}
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Tổng số vụ"
                                                require={true}
                                                input={{
                                                    type: "number",
                                                    value: detail?.overview.summaryM1.totalCases,
                                                    disabled: true,
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
                                                    value: detail?.overview.summaryM1.fatalCases,
                                                    disabled: true,
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
                                                    value: detail?.overview.summaryM1.multiVictimCases,
                                                    disabled: true,
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
                                                    value: detail?.overview.summaryM1.totalVictims,
                                                    disabled: true,
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
                                                    value: detail?.overview.summaryM1.femaleVictims,
                                                    disabled: true,
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
                                                    value: detail?.overview.summaryM1.fatalVictims,
                                                    disabled: true,
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
                                                    value: detail?.overview.summaryM1.severeInjuries,
                                                    disabled: true,
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
                                                    value: detail?.overview.summaryM1.totalLeaveDays,
                                                    disabled: true,
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
                                                    value: detail?.overview.summaryM1.totalDamage,
                                                    disabled: true,
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
                                                    value: detail?.overview.summaryM1.totalDamage,
                                                    disabled: true,
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
                                                    value: submitForm.m1NonManagedSevereInjuries,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Thiệt hại do tai nạn lao động */}
                                <h1 className="font-semibold text-sm">2. Thiệt hại do tai nạn lao động</h1>
                                <div className="space-y-6">
                                    <div className="flex gap-6">
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Chi phí y tế"
                                                require={true}
                                                input={{
                                                    type: "text",
                                                    value: submitForm.m1MedicalCost.toLocaleString("vi-VN"),
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Chi phí trả lương trong thời gian điều trị"
                                                require={true}
                                                input={{
                                                    type: "text",
                                                    value: submitForm.m1SalaryCompensation.toLocaleString("vi-VN"),
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <InputLegend
                                                label="Chi phí bồi thường trợ cấp"
                                                require={true}
                                                input={{
                                                    type: "text",
                                                    value: submitForm.m1PropertyDamage.toLocaleString("vi-VN"),
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1 relative">
                                            <InputLegend
                                                label="Tổng số tiền chi phí"
                                                require={true}
                                                input={{
                                                    type: "text",
                                                    value: submitForm.m1TotalCost.toLocaleString("vi-VN"),
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                            <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
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
                                                    value: submitForm.m1TotalLeaveDays,
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                        </div>
                                        <div className="flex-1 relative">
                                            <InputLegend
                                                label="Thiệt hại tài sản"
                                                require={true}
                                                input={{
                                                    type: "text",
                                                    value: submitForm.m1TotalDamage.toLocaleString("vi-VN"),
                                                    disabled: true
                                                }}
                                                isSmall={true}
                                            />
                                            <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                        </div>
                                        <div className="flex-1"></div>
                                        <div className="flex-1"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {optionReport === "option-1" && optionChild === "option-1.2" && (
                        <div className="space-y-3 overflow-auto">
                            <div className="flex items-center gap-5 text-sm text-[#637381] font-semibold">
                                <button className="pb-2 border-b-2 border-white" onClick={() => setOptionChild("option-1.1")}>{"(1) Tổng số vụ tai nạn lao động"}</button>
                                <button className="pb-2 border-b-2 border-blue-600 text-blue-600">{"(2) Chi tiết các vụ lao động"}</button>
                            </div>
                            <div className="text-sm flex gap-5">
                                <p>**** Doanh nghiệp xảy ra tai nạn lao động vui lòng nhập theo từng bước</p>

                                <button className="flex items-center gap-2 bg-blue-50 ring-2 ring-blue-600 text-blue-600 text-xs px-2 py-1 rounded hover:bg-blue-100 font-semibold" onClick={handleSyncDetail}>
                                    <i className="fa-solid fa-arrow-rotate-right"></i>
                                    <span>Đồng bộ</span>
                                </button>

                                <button className="flex items-center gap-2 bg-green-50 ring-2 ring-green-600 text-green-600 text-xs px-2 py-1 rounded hover:bg-green-100 font-semibold" onClick={handleAddDetail}>
                                    <i className="fa-regular fa-calendar-plus"></i>
                                    <span>Thêm chi tiết</span>
                                </button>
                            </div>
                            <div className="space-y-3">
                                {submitForm.details.length === 0 ? (
                                    <div className="text-sm text-gray-400 italic">
                                        Vui lòng nhập "Tổng số vụ tai nạn lao động" ở mục (1) và ấn đồng bộ để hiển thị chi tiết.
                                    </div>
                                ) : (
                                    submitForm.details.map((detail, index) => (
                                        <DetailItem
                                            key={index}
                                            detail={detail}
                                            accidents={accidents}
                                            traumas={traumas}
                                            jobs={jobs}
                                            onChangDetail={onChangDetail}
                                            handleDeleteDetail={handleDeleteDetail}
                                            errors={(error.details as unknown as Array<{ idx: number } & Record<string, string>>)?.find(e => e.idx === detail.idx)}
                                            clearError={(idx, field) => {
                                                setError(prev => {
                                                    const currentDetails = (prev.details as unknown as Array<{ idx: number } & Record<string, string>>) ?? [];
                                                    return {
                                                        ...prev,
                                                        details: currentDetails.map(e =>
                                                            e.idx === idx ? { ...e, [field]: "" } : e
                                                        )
                                                    };
                                                });
                                            }}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {optionReport === "option-2" && (
                        <div className="space-y-5">
                            <h1 className="font-semibold text-sm">1. Tổng số vụ tai nạn lao động & số nạn nhân tai nạn lao động</h1>
                            <div className="mt-5 space-y-5">
                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số vụ"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2TotalCases,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2TotalCases: num }));
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
                                                value: submitForm.m2FatalCases,
                                                disabled: true
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
                                                value: submitForm.m2MultiVictimCases,
                                                disabled: true
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1"></div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số người bị nạn"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2TotalVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2TotalVictims: num }));
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
                                                value: submitForm.m2FemaleVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2FemaleVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số người bị chết"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2FatalVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2FatalVictims: num }));
                                                    if (num > 0) {
                                                        setSubmitForm(prev => ({ ...prev, m2FatalCases: 1 }));
                                                    }
                                                    if (num <= 0) {
                                                        setSubmitForm(prev => ({ ...prev, m2FatalCases: 0 }));
                                                        setSubmitForm(prev => ({ ...prev, m2MultiVictimCases: 0 }));
                                                    }
                                                    if (num >= 2) {
                                                        setSubmitForm(prev => ({ ...prev, m2MultiVictimCases: 1 }));
                                                    }
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
                                                value: submitForm.m2SevereInjuries,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2SevereInjuries: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Số người bị nạn không QL"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2NonManagedVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2NonManagedVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Số lao đọng nữ bị nạn không QL"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2NonManagedFemaleVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2NonManagedFemaleVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Số người chết không quản lý"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2NonManagedFatalVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2NonManagedFatalVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Số người bị thương nặng không quản lý"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2NonManagedSevereInjuries,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2NonManagedSevereInjuries: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                </div>
                            </div>

                            <h1 className="font-semibold text-sm">2. Thiệt hại do tai nạn lao động</h1>
                            <div className="mt-5 space-y-5">
                                <div className="flex gap-6">
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Chi phí y tế"
                                            require={true}
                                            input={{
                                                type: "text",
                                                value: submitForm.m2MedicalCost.toLocaleString("vi-VN"),
                                                onChange: (e) => {
                                                    const value = e.target.value.replace(/\./g, "");
                                                    const n = Number(value);

                                                    if (Number.isNaN(n)) return;

                                                    setSubmitForm(prev => ({ ...prev, m2MedicalCost: n }));
                                                    setSubmitForm(prev => ({ ...prev, m2TotalCost: n + submitForm.m2PropertyDamage + submitForm.m2SalaryCompensation }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Chi phí trả lương trong thời gian điều trị"
                                            require={true}
                                            input={{
                                                type: "text",
                                                value: submitForm.m2SalaryCompensation.toLocaleString("vi-VN"),
                                                onChange: (e) => {
                                                    const value = e.target.value.replace(/\./g, "");
                                                    const n = Number(value);

                                                    if (Number.isNaN(n)) return;

                                                    setSubmitForm(prev => ({ ...prev, m2SalaryCompensation: n }));
                                                    setSubmitForm(prev => ({ ...prev, m2TotalCost: n + submitForm.m2PropertyDamage + submitForm.m2MedicalCost }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Chi phí bồi thường trợ cấp"
                                            require={true}
                                            input={{
                                                type: "text",
                                                value: submitForm.m2PropertyDamage.toLocaleString("vi-VN"),
                                                onChange: (e) => {
                                                    const value = e.target.value.replace(/\./g, "");
                                                    const n = Number(value);

                                                    if (Number.isNaN(n)) return;

                                                    setSubmitForm(prev => ({ ...prev, m2PropertyDamage: n }));
                                                    setSubmitForm(prev => ({ ...prev, m2TotalCost: n + submitForm.m2SalaryCompensation + submitForm.m2MedicalCost }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Tổng số tiền chi phí"
                                            require={true}
                                            input={{
                                                type: "text",
                                                disabled: true,
                                                value: submitForm.m2TotalCost.toLocaleString("vi-VN"),
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                </div>

                                <div className="flex gap-6">
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Tổng số ngày nghỉ vì TNLĐ"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2TotalLeaveDays,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2TotalLeaveDays: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Thiệt hại tài sản"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m2FemaleVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m2FemaleVictims: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                        <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
                                    </div>
                                    <div className="flex-1"></div>
                                    <div className="flex-1"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {optionReport === "review-report" && (
                        <div className="space-y-3">
                            <h1 className="font-semibold text-sm">Báo cáo tổng hợp tình hình tai nạn lao động - Kỳ báo báo: {detail?.overview.reportConfig.period + " năm " + detail?.overview.reportConfig.year}</h1>
                            <span className="text-sm flex items-center gap-3">
                                <div className="flex gap-1">
                                    <span className="text-red-500">***</span>
                                    <span>Vui lòng đính kèm báo cáo TNLĐ có dấu mộc công ty:</span>
                                </div>
                                <div className="space-x-2">
                                    <button className="text-blue-600 underline" onClick={() => {
                                        inputFileRef.current?.click();
                                    }}>Tại đây</button>
                                    <input
                                        className="hidden"
                                        ref={inputFileRef}
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const isImage = file.type.startsWith("image/");
                                                const isPdf = file.type === "application/pdf";

                                                if (!isImage && !isPdf) {
                                                    notificate?.showNotification({ type: "error", message: "Chỉ được chọn file PDF hoặc ảnh (PNG, JPG, PDF)." });
                                                    e.target.value = "";
                                                    return;
                                                }
                                                setSelectedFile(file);
                                                notificate?.showNotification({ type: "success", message: "Tải file lên thành công" });
                                                return;
                                            }
                                            notificate?.showNotification({ type: "error", message: "Có lỗi khi tải file, vui lòng thử lại " });
                                        }}
                                    />

                                    <span className="text-blue-600" onClick={() => {
                                        if (!selectedFile) return;
                                        const url = URL.createObjectURL(selectedFile);
                                        window.open(url, "_blank");
                                    }}>
                                        {selectedFile && selectedFile.name}
                                    </span>
                                    {selectedFile && (
                                        <button className="text-red-600 underline" onClick={() => setSelectedFile(null)}>Xóa</button>
                                    )}
                                </div>
                            </span>

                            <div className="mt-5">
                                <table className="w-full text-sm border-collapse border border-gray-400 text-gray-600">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th rowSpan={4} className="border border-gray-400 p-2 text-left align-middle w-150">Tiêu chí thống kê</th>
                                            <th rowSpan={4} className="border border-gray-400 p-2 text-center align-middle">Mã số</th>
                                            <th colSpan={11} className="border border-gray-400 p-2 text-center">Phân loại TNLĐ theo mức độ thương tật</th>
                                        </tr>
                                        <tr className="bg-gray-100">
                                            <th colSpan={3} className="border border-gray-400 p-2 text-center">Số vụ</th>
                                            <th colSpan={8} className="border border-gray-400 p-2 text-center">Số người bị nạn (người)</th>
                                        </tr>
                                        <tr className="bg-gray-100">
                                            <th rowSpan={2} className="border border-gray-400 p-2 text-center align-middle">Tổng số</th>
                                            <th rowSpan={2} className="border border-gray-400 p-2 text-center align-middle">Số vụ có người chết</th>
                                            <th rowSpan={2} className="border border-gray-400 p-2 text-center align-middle">Số vụ có từ 2 người bị nạn trở lên</th>
                                            <th colSpan={2} className="border border-gray-400 p-2 text-center">Tổng số</th>
                                            <th colSpan={2} className="border border-gray-400 p-2 text-center">Số LĐ nữ</th>
                                            <th colSpan={2} className="border border-gray-400 p-2 text-center">Số người bị chết</th>
                                            <th colSpan={2} className="border border-gray-400 p-2 text-center">Số người bị thương nặng</th>
                                        </tr>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-400 p-2 text-center">Tổng số</th>
                                            <th className="border border-gray-400 p-2 text-center">NN không thuộc quyền quản lý</th>
                                            <th className="border border-gray-400 p-2 text-center">Tổng số</th>
                                            <th className="border border-gray-400 p-2 text-center">NN không thuộc quyền quản lý</th>
                                            <th className="border border-gray-400 p-2 text-center">Tổng số</th>
                                            <th className="border border-gray-400 p-2 text-center">NN không thuộc quyền quản lý</th>
                                            <th className="border border-gray-400 p-2 text-center">Tổng số</th>
                                            <th className="border border-gray-400 p-2 text-center">NN không thuộc quyền quản lý</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* rows ở đây — mỗi <tr> có 13 <td> */}
                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3" colSpan={13}>1. Tai nạn lao động</td>
                                        </tr>
                                        <tr className={"bg-white"}>
                                            <td className="border border-gray-400 p-2 ps-5">Tai nạn lao động</td>
                                            <td className="border border-gray-400 p-2 text-center"></td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1TotalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1FatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1MultiVictimCases}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1TotalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1NonManagedVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1FemaleVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1NonManagedFemaleVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1FatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1NonManagedFatalVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1SevereInjuries}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m1NonManagedSevereInjuries}</td>
                                        </tr>
                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-white" colSpan={13}>
                                                1.1 Phân theo nguyên nhân xảy ra TNLĐ
                                            </td>
                                        </tr>
                                        {(report?.["nguyennhan"] ?? []).map((row: any, i: number) => (
                                            <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-5"}>
                                                <td className="border border-gray-400 p-2 ps-5">{row.label}</td>
                                                <td className="border border-gray-400 p-2 text-center">{i + 1}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.multiVictimCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.femaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFemaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.severeInjuries}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedSevereInjuries}</td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-gray-5" colSpan={13}>
                                                1.2 Phân theo yếu tố gây chấn thương
                                            </td>
                                        </tr>
                                        {(report?.["yeutochanthuong"] ?? []).map((row: any, i: number) => (
                                            <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-5"}>
                                                <td className="border border-gray-400 p-2 ps-5">{row.label}</td>
                                                <td className="border border-gray-400 p-2 text-center">{i + 1}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.multiVictimCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.femaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFemaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.severeInjuries}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedSevereInjuries}</td>
                                            </tr>
                                        ))}

                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-gray-5" colSpan={13}>
                                                1.3 Phân theo nghề nghiệp
                                            </td>
                                        </tr>
                                        {(report?.["phantheonghenghiep"] ?? []).map((row: any, i: number) => (
                                            <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-white"}>
                                                <td className="border border-gray-400 p-2 ps-5">{row.label}</td>
                                                <td className="border border-gray-400 p-2 text-center">{i + 1}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.multiVictimCases}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.totalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.femaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFemaleVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.fatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedFatalVictims}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.severeInjuries}</td>
                                                <td className="border border-gray-400 p-2 text-center">{row.nonManagedSevereInjuries}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-white" colSpan={13}>
                                                2. Tai nạn được hưởng trợ cấp theo quy định Khoản 2 Điều 39 Luật ATVSLĐ
                                            </td>
                                        </tr>
                                        <tr className={"bg-white"}>
                                            <td className="border border-gray-400 p-2 ps-5">Tai nạn được hưởng trợ cấp theo quy định Khoản 2 Điều 39 Luật ATVSLĐ</td>
                                            <td className="border border-gray-400 p-2 text-center"></td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2TotalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2FatalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2MultiVictimCases}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2TotalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2NonManagedVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2FemaleVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2NonManagedFemaleVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2FatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2NonManagedFatalVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2SevereInjuries}</td>
                                            <td className="border border-gray-400 p-2 text-center">{submitForm.m2NonManagedSevereInjuries}</td>
                                        </tr>

                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-white" colSpan={13}>
                                                3. Tổng số
                                            </td>
                                        </tr>

                                        <tr className={"bg-white"}>
                                            <td className="border border-gray-400 p-2 ps-5">Tổng số 3 = 1 + 2</td>
                                            <td className="border border-gray-400 p-2 text-center"></td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1TotalCases + submitForm.m2TotalCases}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1FatalCases + submitForm.m2FatalCases}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1MultiVictimCases + submitForm.m2MultiVictimCases}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1TotalVictims + submitForm.m2TotalVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1NonManagedVictims + submitForm.m2NonManagedVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1FemaleVictims + submitForm.m2FemaleVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1NonManagedFemaleVictims + submitForm.m2NonManagedFemaleVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1FatalVictims + submitForm.m2FatalVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1NonManagedFatalVictims + submitForm.m2NonManagedFatalVictims}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1SevereInjuries + submitForm.m2SevereInjuries}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {submitForm.m1NonManagedSevereInjuries + submitForm.m2NonManagedSevereInjuries}
                                            </td>
                                        </tr>
                                        {/* Bruh */}
                                        <tr>
                                            <td className="font-semibold text-black py-1 ps-3 bg-white" colSpan={13}>
                                                Thiệt hại do tai nạn lao động
                                            </td>
                                        </tr>

                                        <tr className="bg-gray-100 font-semibold">
                                            <td className="border border-gray-400 p-2 text-center" rowSpan={3}>Tổng số ngày nghỉ vì tai nạn lao động (kể cả chế độ)</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={11}>Tổng số ngày nghỉ vì TNLĐ (1.000đ)</td>
                                            <td className="border border-gray-400 p-2 text-center" rowSpan={3}>
                                                Thiệt hại tài sản
                                                (1.000đ)
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-100 font-semibold">
                                            <td className="border border-gray-400 p-2 text-center" rowSpan={2} colSpan={2}>Tổng số</td>
                                            <td className="border border-gray-400 p-2 text-center" rowSpan={1} colSpan={9}>Khoản chi cụ thể của cơ sở</td>
                                        </tr>
                                        <tr className="bg-gray-100 font-semibold">
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>Y tế</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>Trả lương trong thời gian điều trị</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>Bồi thường trợ cấp</td>
                                        </tr>

                                        <tr>
                                            <td className="border border-gray-400 p-2 text-center" >{submitForm.m1TotalLeaveDays + submitForm.m2TotalLeaveDays}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={2}>{(submitForm.m1TotalDamage + submitForm.m2TotalDamage).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>{(submitForm.m1MedicalCost + submitForm.m2MedicalCost).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>{(submitForm.m1SalaryCompensation + submitForm.m2SalaryCompensation).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>{(submitForm.m1PropertyDamage + submitForm.m2PropertyDamage).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" >{(submitForm.m1PropertyDamage + submitForm.m2PropertyDamage).toLocaleString("vi-VN")}</td>
                                            {/* <td className="border border-gray-400 p-2 text-center">{(submitForm.m1TotalCost + submitForm.m2TotalCost).toLocaleString("vi-VN")}</td> */}
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default TNLDTheoHDLDViewIdPage;