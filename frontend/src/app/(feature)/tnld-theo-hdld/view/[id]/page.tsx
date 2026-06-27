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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DetailItem from "../../_component/DetailItem";
import { SubmitForm } from "../../_types/type";
import ViewReport from "../../_component/ViewReport";

type OptionReport = "business-info" | "option-1" | "option-2" | "review-report";

const TNLDTheoHDLDViewIdPage = () => {
    const { id } = useParams();
    const router = useRouter();

    if (!id) {
        router.push("/tnld-theo-hdld");
    }

    const [detail, setDetail] = useState<SubmitForm>();
    const fetchDetail = async () => {
        if (!id) return;
        try {
            const cls = new Agreement();
            const result = await cls.GetFeTableById(Array.isArray(id) ? id[0] : id);

            setDetail({
                title: result.title || "",
                year: Number(result.year) || 0,
                reportTypeId: Number(result.reportTypeId) || 0,

                totalEmployees: Number(result.totalEmployees) || 0,
                femaleEmployees: Number(result.femaleEmployees) || 0,
                totalPayroll: Number(result.totalPayroll) || 0,

                m1TotalCases: Number(result.m1TotalCases) || 0,
                m1FatalCases: Number(result.m1FatalCases) || 0,
                m1MultiVictimCases: Number(result.m1MultiVictimCases) || 0,

                m1TotalVictims: Number(result.m1TotalVictims) || 0,
                m1FemaleVictims: Number(result.m1FemaleVictims) || 0,
                m1FatalVictims: Number(result.m1FatalVictims) || 0,
                m1SevereInjuries: Number(result.m1SevereInjuries) || 0,

                m1NonManagedVictims: Number(result.m1NonManagedVictims) || 0,
                m1NonManagedFemaleVictims: Number(result.m1NonManagedFemaleVictims) || 0,
                m1NonManagedFatalVictims: Number(result.m1NonManagedFatalVictims) || 0,
                m1NonManagedSevereInjuries: Number(result.m1NonManagedSevereInjuries) || 0,

                m1MedicalCost: Number(result.m1MedicalCost) || 0,
                m1SalaryCompensation: Number(result.m1SalaryCompensation) || 0,
                m1PropertyDamage: Number(result.m1PropertyDamage) || 0,
                m1TotalCost: Number(result.m1TotalCost) || 0,

                m1TotalLeaveDays: Number(result.m1TotalLeaveDays) || 0,
                m1TotalDamage: Number(result.m1TotalDamage) || 0,

                details: result.details?.map((d, index) => ({
                    idx: index,
                    causeId: Number(d.causeId) || 0,
                    traumaId: Number(d.traumaId) || 0,
                    jobId: Number(d.jobId) || 0,

                    totalCases: Number(d.totalCases) || 0,
                    fatalCases: Number(d.fatalCases) || 0,
                    multiVictimCases: Number(d.multiVictimCases) || 0,

                    totalVictims: Number(d.totalVictims) || 0,
                    femaleVictims: Number(d.femaleVictims) || 0,
                    fatalVictims: Number(d.fatalVictims) || 0,
                    severeInjuries: Number(d.severeInjuries) || 0,

                    nonManagedVictims: Number(d.nonManagedVictims) || 0,
                    nonManagedFemaleVictims: Number(d.nonManagedFemaleVictims) || 0,
                    nonManagedFatalVictims: Number(d.nonManagedFatalVictims) || 0,
                    nonManagedSevereInjuries: Number(d.nonManagedSevereInjuries) || 0,

                    medicalCost: Number(d.medicalCost) || 0,
                    salaryCompensation: Number(d.salaryCompensation) || 0,
                    propertyDamage: Number(d.propertyDamage) || 0,
                    totalCost: Number(d.totalCost) || 0,

                    totalLeaveDays: Number(d.totalLeaveDays) || 0,
                    totalDamage: Number(d.totalDamage) || 0,
                })) ?? [],

                m2TotalCases: Number(result.m2TotalCases) || 0,
                m2FatalCases: Number(result.m2FatalCases) || 0,
                m2MultiVictimCases: Number(result.m2MultiVictimCases) || 0,

                m2TotalVictims: Number(result.m2TotalVictims) || 0,
                m2FemaleVictims: Number(result.m2FemaleVictims) || 0,
                m2FatalVictims: Number(result.m2FatalVictims) || 0,
                m2SevereInjuries: Number(result.m2SevereInjuries) || 0,

                m2NonManagedVictims: Number(result.m2NonManagedVictims) || 0,
                m2NonManagedFemaleVictims: Number(result.m2NonManagedFemaleVictims) || 0,
                m2NonManagedFatalVictims: Number(result.m2NonManagedFatalVictims) || 0,
                m2NonManagedSevereInjuries: Number(result.m2NonManagedSevereInjuries) || 0,

                m2MedicalCost: Number(result.m2MedicalCost) || 0,
                m2SalaryCompensation: Number(result.m2SalaryCompensation) || 0,
                m2PropertyDamage: Number(result.m2PropertyDamage) || 0,
                m2TotalCost: Number(result.m2TotalCost) || 0,

                m2TotalLeaveDays: Number(result.m2TotalLeaveDays) || 0,
                m2TotalDamage: Number(result.m2TotalDamage) || 0,

                fileIds: result.files?.map(f => ({ name: f.originalFilename, url: f.url })) ?? [],

                doet: result.doet,
                reportType: result.reportType
            });

        } catch (error) {

        }
    }

    const [accidents, setAccidents] = useState<AccidentDto[]>([]);
    const [traumas, setTraumas] = useState<TraumaDto[]>([]);
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

    const [report, setReport] = useState<Record<string, any[]>>();
    const [isPrint, setIsPrint] = useState<boolean>(false);

    useEffect(() => {
        // Muc 1
        // Nguyen nhan xay ra tai nan lao dong
        const nguyennhan = accidents.map(acc => {
            // Lọc các detail có cùng causeId
            const matchedDetails = detail?.details.filter(d => Number(d.causeId) == acc.id);

            return {
                label: acc.name,
                id: acc.id,

                // Số vụ
                totalCases: matchedDetails?.reduce((s, d) => s + d.totalCases, 0),
                fatalCases: matchedDetails?.reduce((s, d) => s + d.fatalCases, 0),
                multiVictimCases: matchedDetails?.reduce((s, d) => s + d.multiVictimCases, 0),

                // Tổng số người bị nạn
                totalVictims: matchedDetails?.reduce((s, d) => s + d.totalVictims, 0),
                nonManagedVictims: matchedDetails?.reduce((s, d) => s + d.nonManagedVictims, 0),

                // Số LĐ nữ
                femaleVictims: matchedDetails?.reduce((s, d) => s + d.femaleVictims, 0),
                nonManagedFemaleVictims: matchedDetails?.reduce((s, d) => s + d.nonManagedFemaleVictims, 0),

                // Số người bị chết
                fatalVictims: matchedDetails?.reduce((s, d) => s + d.fatalVictims, 0),
                nonManagedFatalVictims: matchedDetails?.reduce((s, d) => s + d.nonManagedFatalVictims, 0),

                // Số người bị thương nặng
                severeInjuries: matchedDetails?.reduce((s, d) => s + d.severeInjuries, 0),
                nonManagedSevereInjuries: matchedDetails?.reduce((s, d) => s + d.nonManagedSevereInjuries, 0),
            };
        });

        const yeutochanthuong = traumas.map(acc => {
            const matchedDetails = detail?.details.filter(d => Number(d.traumaId) == acc.id);

            return {
                label: acc.name,
                id: acc.id,

                // Số vụ
                totalCases: matchedDetails?.reduce((s, d) => s + d.totalCases, 0),
                fatalCases: matchedDetails?.reduce((s, d) => s + d.fatalCases, 0),
                multiVictimCases: matchedDetails?.reduce((s, d) => s + d.multiVictimCases, 0),

                // Tổng số người bị nạn
                totalVictims: matchedDetails?.reduce((s, d) => s + d.totalVictims, 0),
                nonManagedVictims: matchedDetails?.reduce((s, d) => s + d.nonManagedVictims, 0),

                // Số LĐ nữ
                femaleVictims: matchedDetails?.reduce((s, d) => s + d.femaleVictims, 0),
                nonManagedFemaleVictims: matchedDetails?.reduce((s, d) => s + d.nonManagedFemaleVictims, 0),

                // Số người bị chết
                fatalVictims: matchedDetails?.reduce((s, d) => s + d.fatalVictims, 0),
                nonManagedFatalVictims: matchedDetails?.reduce((s, d) => s + d.nonManagedFatalVictims, 0),

                // Số người bị thương nặng
                severeInjuries: matchedDetails?.reduce((s, d) => s + d.severeInjuries, 0),
                nonManagedSevereInjuries: matchedDetails?.reduce((s, d) => s + d.nonManagedSevereInjuries, 0),
            };
        });

        const phantheonghenghiep = jobs.map(acc => {
            const matchedDetails = detail?.details.filter(d => Number(d.jobId) == acc.id);

            return {
                label: acc.name,
                id: acc.id,

                // Số vụ
                totalCases: matchedDetails?.reduce((s, d) => s + d.totalCases, 0),
                fatalCases: matchedDetails?.reduce((s, d) => s + d.fatalCases, 0),
                multiVictimCases: matchedDetails?.reduce((s, d) => s + d.multiVictimCases, 0),

                // Tổng số người bị nạn
                totalVictims: matchedDetails?.reduce((s, d) => s + d.totalVictims, 0),
                nonManagedVictims: matchedDetails?.reduce((s, d) => s + d.nonManagedVictims, 0),

                // Số LĐ nữ
                femaleVictims: matchedDetails?.reduce((s, d) => s + d.femaleVictims, 0),
                nonManagedFemaleVictims: matchedDetails?.reduce((s, d) => s + d.nonManagedFemaleVictims, 0),

                // Số người bị chết
                fatalVictims: matchedDetails?.reduce((s, d) => s + d.fatalVictims, 0),
                nonManagedFatalVictims: matchedDetails?.reduce((s, d) => s + d.nonManagedFatalVictims, 0),

                // Số người bị thương nặng
                severeInjuries: matchedDetails?.reduce((s, d) => s + d.severeInjuries, 0),
                nonManagedSevereInjuries: matchedDetails?.reduce((s, d) => s + d.nonManagedSevereInjuries, 0),
            };
        });

        // Muc 2
        const record: Record<string, any[]> = {};
        record["nguyennhan"] = nguyennhan;
        record["yeutochanthuong"] = yeutochanthuong;
        record["phantheonghenghiep"] = phantheonghenghiep;

        setReport(record);

    }, [accidents, traumas, jobs]);

    return (
        <main className="flex flex-col min-h-screen pb-10">
            {isPrint && (
                <div className="fixed top-0 left-0 w-full h-screen bg-gray-800/50 z-100 flex justify-center py-10">
                    <ViewReport submitForm={detail!} report={report!} onClose={() => setIsPrint(false)} />
                </div>
            )}

            <TopHero
                title="Báo cáo định kỳ tai nạn lao động"
                actions={
                    <div className="flex gap-2 items-center">
                        <div className="w-18">
                            <InputLegend
                                input={{
                                    disabled: true,
                                    value: detail?.year,
                                }}
                                isSmall={true}
                            />
                        </div>

                        <div className="flex gap-4 items-center text-xs font-semibold ps-10">
                            <button className="text-gray-400" onClick={() => router.push("/tnld-theo-hdld")}>Hủy bỏ</button>
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
                                    else if (optionReport === "review-report") {
                                        setOptionReport("business-info");
                                    }
                                }}
                            >
                                <i className="fa-solid fa-angle-right"></i>
                                <span>Tiếp tục</span>
                            </button>
                            <button className="bg-white px-2 py-2 flex items-center gap-1 border-2 border-blue-600 text-blue-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsPrint(true)}>
                                <i className="fa-solid fa-print"></i>
                                <span>In báo cáo</span>
                            </button>
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
                                                value: detail?.doet?.name
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Loại hình công ty"
                                            input={{
                                                disabled: true,
                                                value: detail?.doet?.businessType.name
                                            }}
                                            isSmall={true}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputLegend
                                            label="Loại hình công ty"
                                            input={{
                                                disabled: true,
                                                value: detail?.doet?.industry.name
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
                                                value: detail?.totalEmployees,
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
                                                value: detail?.femaleEmployees,
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
                                                type: "text",
                                                value: detail?.totalPayroll.toLocaleString("vi-VN"),
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
                                                    value: detail?.m1TotalCases,
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
                                                    value: detail?.m1FatalCases,
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
                                                    value: detail?.m1MultiVictimCases,
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
                                                    value: detail?.m1TotalVictims,
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
                                                    value: detail?.m1FemaleVictims,
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
                                                    value: detail?.m1FatalVictims,
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
                                                    value: detail?.m1SevereInjuries,
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
                                                    value: detail?.m1NonManagedVictims,
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
                                                    value: detail?.m1NonManagedFemaleVictims,
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
                                                    value: detail?.m1NonManagedFatalVictims,
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
                                                    value: detail?.m1NonManagedSevereInjuries,
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
                                                    value: detail?.m1MedicalCost.toLocaleString("vi-VN"),
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
                                                    value: detail?.m1SalaryCompensation.toLocaleString("vi-VN"),
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
                                                    value: detail?.m1PropertyDamage.toLocaleString("vi-VN"),
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
                                                    value: detail?.m1TotalCost.toLocaleString("vi-VN"),
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
                                                    value: detail?.m1TotalLeaveDays,
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
                                                    value: detail?.m1TotalDamage.toLocaleString("vi-VN"),
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
                            </div>
                            <div className="space-y-3">
                                {detail?.details.length === 0 ? (
                                    <div className="text-sm text-gray-400 italic">
                                        Báo cáo này không có chi tiết vụ tai nạn. Vui lòng liên hệ doanh nghiệp để điều chỉnh.
                                    </div>
                                ) : (
                                    detail?.details.map((detail, index) => (
                                        <DetailItem
                                            key={index}
                                            detail={detail}
                                            accidents={accidents}
                                            traumas={traumas}
                                            jobs={jobs}
                                            isDisable={true}
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
                                                value: detail?.m2TotalCases,
                                                disabled: true
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
                                                value: detail?.m2FatalCases,
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
                                                value: detail?.m2MultiVictimCases,
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
                                                value: detail?.m2TotalVictims,
                                                disabled: true
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
                                                value: detail?.m2FemaleVictims,
                                                disabled: true
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
                                                value: detail?.m2FatalVictims,
                                                disabled: true
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
                                                value: detail?.m2SevereInjuries,
                                                disabled: true
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
                                                value: detail?.m2NonManagedVictims,
                                                disabled: true
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
                                                value: detail?.m2NonManagedFemaleVictims,
                                                disabled: true
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
                                                value: detail?.m2NonManagedFatalVictims,
                                                disabled: true
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
                                                value: detail?.m2NonManagedSevereInjuries,
                                                disabled: true
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
                                                value: detail?.m2MedicalCost.toLocaleString("vi-VN"),
                                                disabled: true
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
                                                value: detail?.m2SalaryCompensation.toLocaleString("vi-VN"),
                                                disabled: true
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
                                                value: detail?.m2PropertyDamage.toLocaleString("vi-VN"),
                                                disabled: true
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
                                                value: detail?.m2TotalCost.toLocaleString("vi-VN"),
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
                                                value: detail?.m2TotalLeaveDays,
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
                                                type: "number",
                                                value: detail?.m2FemaleVictims,
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
                    )}

                    {optionReport === "review-report" && (
                        <div className="space-y-3">
                            <h1 className="font-semibold text-sm">Báo cáo tổng hợp tình hình tai nạn lao động - Kỳ báo báo: {detail?.reportType?.period + " năm " + detail?.reportType?.year}</h1>
                            <span className="text-sm flex items-center gap-3">
                                <div className="flex gap-1">
                                    <span className="text-red-500">***</span>
                                    <span>Vui lòng đính kèm báo cáo TNLĐ có dấu mộc công ty:</span>
                                </div>
                                <div className="space-x-2">
                                    <button className="text-blue-600" onClick={() => {
                                        if (detail?.fileIds[0]) {
                                            window.open(detail.fileIds[0].url, "_blank");
                                        }
                                    }}>
                                        {detail?.fileIds[0].name}
                                    </button>
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
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1TotalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1FatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1MultiVictimCases}</td>

                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1TotalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1NonManagedVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1FemaleVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1NonManagedFemaleVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1FatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1NonManagedFatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1SevereInjuries}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m1NonManagedSevereInjuries}</td>
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
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2TotalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2FatalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2MultiVictimCases}</td>

                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2TotalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2NonManagedVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2FemaleVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2NonManagedFemaleVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2FatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2NonManagedFatalVictims}</td>

                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2SevereInjuries}</td>
                                            <td className="border border-gray-400 p-2 text-center">{detail?.m2NonManagedSevereInjuries}</td>
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
                                                {(detail?.m1TotalCases || 0) + (detail?.m2TotalCases || 0)}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {(detail?.m1FatalCases || 0) + (detail?.m2FatalCases || 0)}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {(detail?.m1MultiVictimCases || 0) + (detail?.m2MultiVictimCases || 0)}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {(detail?.m1TotalVictims || 0) + (detail?.m2TotalVictims || 0)}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {(detail?.m1NonManagedVictims || 0) + (detail?.m2NonManagedVictims || 0)}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {(detail?.m1FemaleVictims || 0) + (detail?.m2FemaleVictims || 0)}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {(detail?.m1NonManagedFemaleVictims || 0) + (detail?.m2NonManagedFemaleVictims || 0)}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {(detail?.m1FatalVictims || 0) + (detail?.m2FatalVictims || 0)}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {(detail?.m1NonManagedFatalVictims || 0) + (detail?.m2NonManagedFatalVictims || 0)}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {(detail?.m1SevereInjuries || 0) + (detail?.m2SevereInjuries || 0)}
                                            </td>

                                            <td className="border border-gray-400 p-2 text-center">
                                                {(detail?.m1NonManagedSevereInjuries || 0) + (detail?.m2NonManagedSevereInjuries || 0)}
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
                                            <td className="border border-gray-400 p-2 text-center" >{(detail?.m1TotalLeaveDays || 0) + (detail?.m2TotalLeaveDays || 0)}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={2}>{((detail?.m1TotalDamage || 0) + (detail?.m2TotalDamage || 0)).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>{((detail?.m1MedicalCost || 0) + (detail?.m2MedicalCost || 0)).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>{((detail?.m1SalaryCompensation || 0) + (detail?.m2SalaryCompensation || 0)).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" colSpan={3}>{((detail?.m1PropertyDamage || 0) + (detail?.m2PropertyDamage || 0)).toLocaleString("vi-VN")}</td>
                                            <td className="border border-gray-400 p-2 text-center" >{((detail?.m1PropertyDamage || 0) + (detail?.m2PropertyDamage || 0)).toLocaleString("vi-VN")}</td>
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