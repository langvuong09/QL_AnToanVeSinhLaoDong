'use client'

import { Agreement } from "@/src/api/Agreement";
import { AgreementTable } from "@/src/api/types/agreement";
import InputLegend from "@/src/components/InputLegend";
import SelectLegend from "@/src/components/SelectLegend";
import TopHero from "@/src/components/TopHero";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SubmitForm } from "./type";
import { formatVND } from "./utils";
import DetailItem from "./DetailItem";
import { TrauMa } from "@/src/api/Trauma";
import { TrauMaDto } from "@/src/api/types/trauma";
import { Injury } from "@/src/api/Injury";
import { InjuryDto } from "@/src/api/types/Injury";

type OptionReport = "business-info" | "option-1" | "option-2" | "review-report";

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

        totalEmployees: 0,
        femaleEmployees: 0,
        totalPayroll: 0,

        // Muc 1
        // Muc 1.1
        m1TotalCases: 0,
        m1FatalCases: 0,
        m1MultiVictimCases: 0,

        m1TotalVictims: 0,
        m1FemaleVictims: 0,
        m1FatalVictims: 0,
        m1SevereInjuries: 0,

        m1NonManagedVictims: 0,
        m1NonManagedFemaleVictims: 0,
        m1NonManagedFatalVictims: 0,
        m1NonManagedSevereInjuries: 0,

        // Muc 1.2
        m1MedicalCost: 0,
        m1SalaryCompensation: 0,
        m1PropertyDamage: 0,
        m1TotalCost: 0,

        m1TotalLeaveDays: 0,
        m1TotalDamage: 0,

        details: [],

        // Muc 2
        // Muc 2.1
        m2TotalCases: 0,
        m2FatalCases: 0,
        m2MultiVictimCases: 0,

        m2TotalVictims: 0,
        m2FemaleVictims: 0,
        m2FatalVictims: 0,
        m2SevereInjuries: 0,

        m2NonManagedVictims: 0,
        m2NonManagedFemaleVictims: 0,
        m2NonManagedFatalVictims: 0,
        m2NonManagedSevereInjuries: 0,

        // Muc 2.2
        m2MedicalCost: 0,
        m2SalaryCompensation: 0,
        m2PropertyDamage: 0,
        m2TotalCost: 0,

        m2TotalLeaveDays: 0,
        m2TotalDamage: 0,
    });

    const handleUpdateDetail = (index: number, field: keyof SubmitForm["details"][number], value: string | number) => {
        setSubmitForm(prev => {
            const newDetails = [...prev.details];
            const existing = newDetails[index] || {
                cause: "", traumaId: 0, injuryTypeId: 0,
                totalCases: 0, fatalCases: 0, multiVictimCases: 0,
                totalVictims: 0, femaleVictims: 0, fatalVictims: 0, severeInjuries: 0,
                nonManagedVictims: 0, nonManagedFemaleVictims: 0,
                nonManagedFatalVictims: 0, nonManagedSevereInjuries: 0,
                medicalCost: 0, salaryCompensation: 0, propertyDamage: 0,
                totalCost: 0, totalLeaveDays: 0, totalDamage: 0,
            };
            newDetails[index] = { ...existing, [field]: value };
            return { ...prev, details: newDetails };
        });
    };

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

    const [traumas, setTraumas] = useState<TrauMaDto[]>([]);
    const [injuries, setInjuries] = useState<InjuryDto[]>([]);

    const fetchOtherData = async () => {
        const traumaCls = new TrauMa();
        const injuryCls = new Injury();

        const result = await Promise.all([traumaCls.GetAll(), injuryCls.GetAll()]);
        setTraumas(result[0]);
        setInjuries(result[1]);
    }

    useEffect(() => {
        if (!id) return;
        fetchDetail();
        fetchOtherData();
    }, [id]);

    const [optionReport, setOptionReport] = useState<OptionReport>("business-info");
    const [optionChild, setOptionChild] = useState<"option-1.1" | "option-1.2">("option-1.1");

    return (
        <main className="flex flex-col min-h-screen">
            <TopHero
                lable="Báo cáo định kỳ tai nạn lao động"
                component={
                    <div className="flex items-center gap-10 rounded">
                        <div className="w-15 text-sm font-semibold">
                            <InputLegend
                                input={{
                                    disabled: true,
                                    value: detail?.overview.reportConfig.year,
                                }}
                                isSmall={true}
                            />
                        </div>

                        <div className="flex gap-5 items-center text-sm font-semibold" onClick={() => router.push("/tnld-theo-hdld")}>
                            <button className="text-gray-400">Hủy bỏ</button>
                            <button className="bg-white px-3 py-2 flex items-center gap-1 border-2 border-blue-600 text-blue-600 hover:bg-gray-100 rounded-lg">
                                <i className="fa-solid fa-angle-right"></i>
                                <span>Tiếp tục</span>
                            </button>
                            <button className="bg-blue-600 px-4 py-2 flex items-center gap-1 border-2 border-blue-600 text-white hover:bg-blue-700 hover:bg-border-700 rounded-lg">
                                <i className="fa-solid fa-floppy-disk"></i>
                                <span>Lưu</span>
                            </button>
                        </div>
                    </div>
                }
            />

            <div className="pt-8 px-5 space-y-5">
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
                                            value: submitForm.totalEmployees,
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;
                                                setSubmitForm(prev => ({ ...prev, totalEmployees: num }));
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
                                            value: submitForm.femaleEmployees,
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;
                                                setSubmitForm(prev => ({ ...prev, femaleEmployees: num }));
                                            }
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
                                            value: submitForm.totalPayroll,
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;
                                                setSubmitForm(prev => ({ ...prev, totalPayroll: num }));
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                    <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000 đ</span>
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
                        <div className="text-sm">
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
                                                value: submitForm.m1TotalCases,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1TotalCases: num }));
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
                                                value: submitForm.m1FatalCases,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1FatalCases: num }));
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
                                                value: submitForm.m1MultiVictimCases,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1MultiVictimCases: num }));
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
                                                value: submitForm.m1TotalVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1TotalVictims: num }));
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
                                                value: submitForm.m1FemaleVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1FemaleVictims: num }));
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
                                                value: submitForm.m1FatalVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1FatalVictims: num }));
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
                                                value: submitForm.m1SevereInjuries,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1SevereInjuries: num }));
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
                                                value: submitForm.m1NonManagedVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1NonManagedVictims: num }));
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
                                                value: submitForm.m1NonManagedFemaleVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1NonManagedFemaleVictims: num }));
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
                                                value: submitForm.m1NonManagedFatalVictims,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1NonManagedFatalVictims: num }));
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
                                                value: submitForm.m1NonManagedSevereInjuries,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1NonManagedSevereInjuries: num }));
                                                }
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
                                                type: "number",
                                                value: submitForm.m1MedicalCost,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1MedicalCost: num }));
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
                                                value: submitForm.m1SalaryCompensation,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1SalaryCompensation: num }));
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
                                                value: submitForm.m1PropertyDamage,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1PropertyDamage: num }));
                                                }
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <InputLegend
                                            label="Tổng số tiền chi phí"
                                            require={true}
                                            input={{
                                                type: "number",
                                                value: submitForm.m1TotalCost,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1TotalCost: num }));
                                                }
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
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1TotalLeaveDays: num }));
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
                                                value: submitForm.m1TotalDamage,
                                                onChange: (e) => {
                                                    const num = Number(e.target.value);
                                                    if (!num || num < 0) return;
                                                    setSubmitForm(prev => ({ ...prev, m1TotalDamage: num }));
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
                    </div>
                )}

                {optionReport === "option-1" && optionChild === "option-1.2" && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-5 text-sm text-[#637381] font-semibold">
                            <button className="pb-2 border-b-2 border-white" onClick={() => setOptionChild("option-1.1")}>{"(1) Tổng số vụ tai nạn lao động"}</button>
                            <button className="pb-2 border-b-2 border-blue-600 text-blue-600">{"(2) Chi tiết các vụ lao động"}</button>
                        </div>
                        <div className="text-sm">
                            <p>**** Doanh nghiệp xảy ra tai nạn lao động vui lòng nhập theo từng bước</p>
                        </div>
                        <div className="space-y-3">
                            {submitForm.m1TotalCases === 0 ? (
                                <div className="text-sm text-gray-400 italic">
                                    Vui lòng nhập "Tổng số vụ tai nạn lao động" ở mục (1) để hiển thị chi tiết.
                                </div>
                            ) : (
                                Array.from({ length: submitForm.m1TotalCases }).map((_, index) => (
                                    <DetailItem
                                        key={index}
                                        index={index}
                                        detail={submitForm.details[index] || {
                                            cause: "", traumaId: 0, injuryTypeId: 0,
                                            totalCases: 0, fatalCases: 0, multiVictimCases: 0,
                                            totalVictims: 0, femaleVictims: 0, fatalVictims: 0, severeInjuries: 0,
                                            nonManagedVictims: 0, nonManagedFemaleVictims: 0,
                                            nonManagedFatalVictims: 0, nonManagedSevereInjuries: 0,
                                            medicalCost: 0, salaryCompensation: 0, propertyDamage: 0,
                                            totalCost: 0, totalLeaveDays: 0, totalDamage: 0,
                                        }}
                                        traumas={traumas}
                                        injuries={injuries}
                                        onUpdate={handleUpdateDetail}
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
                                                if (!num || num < 0) return;
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
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;
                                                setSubmitForm(prev => ({ ...prev, m2FatalCases: num }));
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
                                            value: submitForm.m2MultiVictimCases,
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;
                                                setSubmitForm(prev => ({ ...prev, m2MultiVictimCases: num }));
                                            }
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
                                                if (!num || num < 0) return;
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
                                                if (!num || num < 0) return;
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
                                                if (!num || num < 0) return;
                                                setSubmitForm(prev => ({ ...prev, m2FatalVictims: num }));
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
                                                if (!num || num < 0) return;
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
                                                if (!num || num < 0) return;
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
                                                if (!num || num < 0) return;
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
                                                if (!num || num < 0) return;
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
                                                if (!num || num < 0) return;
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
                                            type: "number",
                                            value: submitForm.m2MedicalCost,
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;
                                                setSubmitForm(prev => ({ ...prev, m2MedicalCost: num }));
                                                setSubmitForm(prev => ({ ...prev, m2TotalCost: num + submitForm.m2PropertyDamage + submitForm.m2SalaryCompensation }));
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
                                            type: "number",
                                            value: submitForm.m2SalaryCompensation,
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;
                                                setSubmitForm(prev => ({ ...prev, m2SalaryCompensation: num }));
                                                setSubmitForm(prev => ({ ...prev, m2TotalCost: num + submitForm.m2PropertyDamage + submitForm.m2MedicalCost }))
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
                                            type: "number",
                                            value: submitForm.m2PropertyDamage,
                                            onChange: (e) => {
                                                const num = Number(e.target.value);
                                                if (!num || num < 0) return;
                                                setSubmitForm(prev => ({ ...prev, m2PropertyDamage: num }));
                                                setSubmitForm(prev => ({ ...prev, m2TotalCost: num + submitForm.m2SalaryCompensation + submitForm.m2MedicalCost }))
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
                                            value: formatVND(submitForm.m2TotalCost),
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
                                                if (!num || num < 0) return;
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
                                                if (!num || num < 0) return;
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
                        <span className="text-sm">
                            <span className="text-red-500">***</span>
                            <span>{" "}</span>
                            <span>Vui lòng đính kèm báo cáo TNLĐ có dấu mộc công ty:</span>
                            <span>{" "}</span>
                            <button className="text-blue-600 underline">Tại đây</button>
                            <span>{"            "}</span>
                            <span className="text-blue-600">
                                {/* File name */}
                            </span>
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
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

        </main>
    )
}

export default TNLDTheoHDLDIdPage;