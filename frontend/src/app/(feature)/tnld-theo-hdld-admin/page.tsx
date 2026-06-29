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
import ChangeReportStatus from "./_component/ChangeReportStatus";
import { AccidentDto } from "@/src/api/types/accident";
import { TraumaDto } from "@/src/api/types/trauma";
import { JobDto } from "@/src/api/types/job";
import { Accident } from "@/src/api/Accident";
import { Trauma } from "@/src/api/Trauma";
import { Job } from "@/src/api/Job";
import { BusinessTypeApi, IBusinessType } from "@/src/api/BusinessType";

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
        pageSize: 100,
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

    const [accidents, setAccidents] = useState<AccidentDto[]>([]);
    const [traumas, setTraumas] = useState<TraumaDto[]>([]);
    const [jobs, setJobs] = useState<JobDto[]>([]);

    const [businessTyppes, setBusinessTypes] = useState<IBusinessType[]>([]);

    const flattenJobs = (jobs: JobDto[]): JobDto[] => {
        return jobs.flatMap(job => [
            {
                ...job,
                children: undefined,
            },
            ...(job.children ? flattenJobs(job.children) : []),
        ]);
    };

    const fetchOtherData = async () => {
        const accidentCls = new Accident();
        const traumaCls = new Trauma();
        const jobCls = new Job();

        const bstCls = new BusinessTypeApi();

        const result = await Promise.all([jobCls.GetAll(), traumaCls.GetAll(), accidentCls.GetAll(), bstCls.getAllForAdmin({ page: 1, pageSize: 1000 })]);

        setJobs(flattenJobs(result[0]));
        setTraumas(result[1])
        setAccidents(result[2]);
        const bstVs = result[3];
        setBusinessTypes(bstVs.data?.items || []);
    }

    useEffect(() => {
        const openAddress = new OpenAdress();
        setProvinces(openAddress.provinces);

        fetchOtherData();
    }, []);

    const [report, setReport] = useState<Record<string, any[]>>();
    useEffect(() => {
        const phantheonganhnghe = jobs.map(job => {
            const matchedDetails = reports.flatMap(re =>
                re.details?.filter(d => d.jobId === job.id) ?? []
            );

            return {
                id: job.id,
                totalCases: matchedDetails?.reduce((s, d) => s + d.totalCases, 0),
                fatalCases: matchedDetails?.reduce((s, d) => s + d.fatalCases, 0),
                multiVictimCases: matchedDetails?.reduce((s, d) => s + d.multiVictimCases, 0),

                totalVictims: matchedDetails?.reduce((s, d) => s + d.totalVictims, 0),
                femaleVictims: matchedDetails?.reduce((s, d) => s + d.femaleVictims, 0),
                fatalVictims: matchedDetails?.reduce((s, d) => s + d.fatalVictims, 0),
                severeInjuries: matchedDetails?.reduce((s, d) => s + d.severeInjuries, 0),

                totalLeaveDays: matchedDetails?.reduce((s, d) => s + d.totalLeaveDays, 0),
                totalCost: matchedDetails?.reduce((s, d) => s + d.totalCost, 0),

                medicalCost: matchedDetails?.reduce((s, d) => s + d.medicalCost, 0),
                salaryCompensation: matchedDetails?.reduce((s, d) => s + d.salaryCompensation, 0),
                propertyDamage: matchedDetails?.reduce((s, d) => s + d.propertyDamage, 0),

                totalDamage: matchedDetails?.reduce((s, d) => s + d.totalDamage, 0),

            }
        });

        const phantheonguyennhan = accidents.map(acc => {
            const matchedDetails = reports.flatMap(re =>
                re.details?.filter(d => d.causeId === acc.id) ?? []
            );

            return {
                id: acc.id,
                totalCases: matchedDetails?.reduce((s, d) => s + d.totalCases, 0),
                fatalCases: matchedDetails?.reduce((s, d) => s + d.fatalCases, 0),
                multiVictimCases: matchedDetails?.reduce((s, d) => s + d.multiVictimCases, 0),

                totalVictims: matchedDetails?.reduce((s, d) => s + d.totalVictims, 0),
                femaleVictims: matchedDetails?.reduce((s, d) => s + d.femaleVictims, 0),
                fatalVictims: matchedDetails?.reduce((s, d) => s + d.fatalVictims, 0),
                severeInjuries: matchedDetails?.reduce((s, d) => s + d.severeInjuries, 0),

                totalLeaveDays: matchedDetails?.reduce((s, d) => s + d.totalLeaveDays, 0),
                totalCost: matchedDetails?.reduce((s, d) => s + d.totalCost, 0),

                medicalCost: matchedDetails?.reduce((s, d) => s + d.medicalCost, 0),
                salaryCompensation: matchedDetails?.reduce((s, d) => s + d.salaryCompensation, 0),
                propertyDamage: matchedDetails?.reduce((s, d) => s + d.propertyDamage, 0),

                totalDamage: matchedDetails?.reduce((s, d) => s + d.totalDamage, 0),

            }
        });

        const phantheoyeuitogaychanthuong = traumas.map(trau => {
            const matchedDetails = reports.flatMap(re =>
                re.details?.filter(d => d.traumaId === trau.id) ?? []
            );

            return {
                id: trau.id,
                totalCases: matchedDetails?.reduce((s, d) => s + d.totalCases, 0),
                fatalCases: matchedDetails?.reduce((s, d) => s + d.fatalCases, 0),
                multiVictimCases: matchedDetails?.reduce((s, d) => s + d.multiVictimCases, 0),

                totalVictims: matchedDetails?.reduce((s, d) => s + d.totalVictims, 0),
                femaleVictims: matchedDetails?.reduce((s, d) => s + d.femaleVictims, 0),
                fatalVictims: matchedDetails?.reduce((s, d) => s + d.fatalVictims, 0),
                severeInjuries: matchedDetails?.reduce((s, d) => s + d.severeInjuries, 0),

                totalLeaveDays: matchedDetails?.reduce((s, d) => s + d.totalLeaveDays, 0),
                totalCost: matchedDetails?.reduce((s, d) => s + d.totalCost, 0),

                medicalCost: matchedDetails?.reduce((s, d) => s + d.medicalCost, 0),
                salaryCompensation: matchedDetails?.reduce((s, d) => s + d.salaryCompensation, 0),
                propertyDamage: matchedDetails?.reduce((s, d) => s + d.propertyDamage, 0),

                totalDamage: matchedDetails?.reduce((s, d) => s + d.totalDamage, 0),

            }
        });

        const record: Record<string, any[]> = {};
        record["phantheonganhnghe"] = phantheonganhnghe;
        record["phantheonguyennhan"] = phantheonguyennhan;
        record["phantheoyeuitogaychanthuong"] = phantheoyeuitogaychanthuong;

        // Tan suat tai nan lao dong = (so nguoi bi tai nan lao dong / tong so nhan vien) * 1000
        const tongquanloaihinhcoso = businessTyppes.map(bus => {
            const matchedBusinesses = reports.filter(re => re.doet.businessTypeId == bus.id);

            return {
                id: bus.id,
                label: bus.name,
                totalCases: matchedBusinesses?.reduce((s, d) => s + d.m1TotalCases + d.m2TotalCases, 0),
                totalParticipate: matchedBusinesses?.reduce((s, d) => s + d.status === "SUBMITTED" ? 1 : 0, 0),

                totalEmployees: matchedBusinesses?.reduce((s, d) => s + d.totalEmployees, 0),
                totalEmployeesParticipate: 0,
                femaleEmployees: matchedBusinesses?.reduce((s, d) => s + d.femaleEmployees, 0),

                totalVictims: matchedBusinesses?.reduce((s, d) => s + d.m1TotalVictims + d.m2TotalVictims, 0),
                fatalVictims: matchedBusinesses?.reduce((s, d) => s + d.m1FatalVictims + d.m2FatalVictims, 0),
                severeInjuries: matchedBusinesses?.reduce((s, d) => s + d.m1SevereInjuries + d.m2SevereInjuries, 0),

                ktnld: (matchedBusinesses?.reduce((s, d) => s + d.m1TotalVictims + d.m2TotalVictims, 0) / matchedBusinesses?.reduce((s, d) => s + d.totalEmployees, 0)) * 1000 || 0,
                kchet: (matchedBusinesses?.reduce((s, d) => s + d.m1FatalVictims + d.m2FatalVictims, 0) / matchedBusinesses?.reduce((s, d) => s + d.totalEmployees, 0)) * 1000 || 0
            }
            
        });
        record["tongquanloaihinhcoso"] = tongquanloaihinhcoso;

        setReport(record);
    }, [accidents, traumas, jobs, businessTyppes]);

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

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isChange, setIsChange] = useState<boolean>(false);

    const [isPrintSummary, setIsSummary] = useState<boolean>(false);

    return (
        <main className="h-screen flex flex-col py-2">
            {selectedIds.length > 0 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex rounded shadow overflow-hidden">
                    <div className="px-3 flex justify-center items-center py-1 bg-blue-600 font-semibold text-white">
                        <p>{selectedIds.length}</p>
                    </div>
                    <div className="px-2 py-2 text-sm">
                        <p>Dữ liệu đang được chọn</p>
                    </div>
                    <div className="px-2 py-2 flex gap-2 text-sm">
                        <button className="px-2 py-1 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition-all" onClick={() => setIsChange(true)}>
                            Thay đổi
                        </button>
                        <button className="px-2 py-1 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition-all" onClick={() => setIsChange(false)}>
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            {isChange && (
                <ChangeReportStatus
                    ids={selectedIds}
                    onSuccess={(s) => {
                        setSelectedIds([]);
                        const newReports = reports.map(r => {
                            if (selectedIds.includes(r.id)) {
                                return {
                                    ...r,
                                    status: s
                                }
                            }
                            return r;
                        })
                        setReports(newReports);
                        setIsChange(false);
                    }}
                    onClose={() => {
                        setIsChange(false);
                    }}
                />
            )}

            <TopHero
                lable="Báo cáo định kỳ tai nạn lao động"
                component={
                    <div className="flex gap-5 rounded">
                        {isPrintSummary ? (
                            <>
                                <button className="text-xs text-gray-500 font-semibold px-3 py-2">
                                    Hủy bỏ
                                </button>
                            </>
                        ) : (
                            <>
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

                                <button className="text-xs font-semibold px-3 py-2 ring rounded ring-blue-600 text-blue-600 hover:bg-gray-50 transition-all hover:ring-2" onClick={() => setIsSummary(true)}>
                                    Báo cáo tổng hợp
                                </button>
                            </>
                        )}
                    </div>
                }
            />

            {isPrintSummary ? (
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden mt-2 space-y-3 overflow-y-auto pb-10">
                    <div className="space-y-3">
                        <h1 className="font-semibold">I. Thông tin tổng quan:</h1>
                        <div>
                            <table className="w-full text-sm border-collapse border border-gray-400">
                                <thead className="font-semibold text-gray-600">
                                    <tr className="bg-gray-100">
                                        <td rowSpan={3} className="border border-gray-400 p-2 text-center w-100">Loại hình cơ sở</td>
                                        <td rowSpan={3} className="border border-gray-400 p-2 text-center">Mã số</td>
                                        <td colSpan={2} className="border border-gray-400 p-2 text-center">Cơ sở</td>
                                        <td colSpan={3} className="border border-gray-400 p-2 text-center">Lực lượng lao động</td>
                                        <td colSpan={3} className="border border-gray-400 p-2 text-center">Tổng số tai nạn lao động</td>
                                        <td colSpan={2} className="border border-gray-400 p-2 text-center">Tần suất tai nạn lao động</td>
                                        <td rowSpan={3} className="border border-gray-400 p-2 text-center w-50">Ghi chú</td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td rowSpan={2} className="border border-gray-400 p-2 text-center">Tổng số</td>
                                        <td rowSpan={2} className="border border-gray-400 p-2 text-center">Số cơ sở tham gia</td>
                                        <td rowSpan={2} className="border border-gray-400 p-2 text-center">Tổng số lao động</td>
                                        <td rowSpan={2} className="border border-gray-400 p-2 text-center">Tổng số LĐ của sở tham gia báo cáo</td>
                                        <td rowSpan={2} className="border border-gray-400 p-2 text-center">Số lao động nữ</td>
                                        <td colSpan={3} className="border border-gray-400 p-2 text-center">Số người bị TNLĐ</td>
                                        <td rowSpan={2} className="border border-gray-400 p-2 text-center">KTNLĐ</td>
                                        <td rowSpan={2} className="border border-gray-400 p-2 text-center">KChết</td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="border border-gray-400 p-2 text-center">Tổng số</td>
                                        <td className="border border-gray-400 p-2 text-center">Số người chết</td>
                                        <td className="border border-gray-400 p-2 text-center">Số người bị thương nặng</td>
                                    </tr>
                                </thead>

                                <tbody>
                                    
                                    {(report?.["tongquanloaihinhcoso"] ?? []).map((row: any, i: number) => (
                                        <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-white"}>
                                            <td className="border border-gray-400 p-2 text-left">{row.label}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.id}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalParticipate}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalEmployees}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalEmployeesParticipate}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.femaleEmployees}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.fatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.severeInjuries}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.ktnld}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.kchet}</td>
                                            <td className="border border-gray-400 p-2 text-center"></td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="font-semibold">II. Phân loại TNLĐ:</h1>
                        <div>
                            <table className="w-full text-sm border-collapse border border-gray-400 ">
                                <thead className="font-semibold text-gray-600">
                                    <tr className="bg-gray-100">
                                        <td rowSpan={3} className="border border-gray-400 p-2 text-center w-100">Tên tiêu chí thống kê</td>
                                        <td rowSpan={3} className="border border-gray-400 p-2 text-center">Mã số</td>
                                        <td colSpan={7} className="border border-gray-400 p-2 text-center">Phân loại TNLĐ theo mức độ thương tật</td>
                                        <td colSpan={6} className="border border-gray-400 p-2 text-center">Theo mức độ thương tật</td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td colSpan={3} className="border border-gray-400 p-2 text-center">Số vụ TNLĐ</td>
                                        <td colSpan={4} className="border border-gray-400 p-2 text-center">Số người bị nạn</td>
                                        <td rowSpan={2} className="border border-gray-400 p-2 text-center">Tổng số ngày nghỉ vì TNLĐ</td>
                                        <td rowSpan={2} className="border border-gray-400 p-2 text-center">Tổng số tiền</td>
                                        <td colSpan={3} className="border border-gray-400 p-2 text-center">Tổng số ngày nghỉ vì TNLĐ</td>
                                        <td rowSpan={2} className="border border-gray-400 p-2 text-center">Thiệt hại tài sản (1.000đ)</td>
                                    </tr>
                                    <tr className="bg-gray-100">
                                        <td className="border border-gray-400 p-2 text-center">Tổng số</td>
                                        <td className="border border-gray-400 p-2 text-center">Số vụ có người chết</td>
                                        <td className="border border-gray-400 p-2 text-center">Số vụ có từ 2 người bị nạn trở lên</td>
                                        <td className="border border-gray-400 p-2 text-center">Tổng số</td>
                                        <td className="border border-gray-400 p-2 text-center">Số LĐ nữ</td>
                                        <td className="border border-gray-400 p-2 text-center">Số người bị chết</td>
                                        <td className="border border-gray-400 p-2 text-center">Số người bị thương nặng</td>
                                        <td className="border border-gray-400 p-2 text-center">Y tế</td>
                                        <td className="border border-gray-400 p-2 text-center">Trả lương theo thời gian điều trị</td>
                                        <td className="border border-gray-400 p-2 text-center">Bồi thường/trợ cấp</td>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td className="border border-gray-400 p-2 text-left font-semibold">Tổng số</td>
                                        <td className="border border-gray-400 p-2 text-center"></td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.totalCases, 0)}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.fatalCases, 0)}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.multiVictimCases, 0)}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.totalVictims, 0)}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.femaleVictims, 0)}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.fatalVictims, 0)}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.severeInjuries, 0)}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.totalLeaveDays, 0)}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.totalCost, 0).toLocaleString("vi-VN")}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.medicalCost, 0).toLocaleString("vi-VN")}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.salaryCompensation, 0).toLocaleString("vi-VN")}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.propertyDamage, 0).toLocaleString("vi-VN")}</td>
                                        <td className="border border-gray-400 p-2 text-center">{report?.["phantheonganhnghe"]?.reduce((s, d) => s + d.totalDamage, 0).toLocaleString("vi-VN")}</td>
                                    </tr>

                                    <tr>
                                        <td rowSpan={(report?.["phantheonganhnghe"] ?? []).length + 1} className="border border-gray-400 p-2 text-left font-semibold">Phân theo ngành nghề</td>
                                    </tr>
                                    {(report?.["phantheonganhnghe"] ?? []).map((row: any, i: number) => (
                                        <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-white"}>
                                            <td className="border border-gray-400 p-2 text-center">{row.id}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.fatalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.multiVictimCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.femaleVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.fatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.severeInjuries}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalLeaveDays}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalCost}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.medicalCost}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.salaryCompensation}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.propertyDamage}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalDamage}</td>
                                        </tr>
                                    ))}

                                    <tr>
                                        <td rowSpan={(report?.["phantheonguyennhan"] ?? []).length + 1} className="border border-gray-400 p-2 text-left font-semibold">Phân theo nguyên nhân</td>
                                    </tr>
                                    {(report?.["phantheonguyennhan"] ?? []).map((row: any, i: number) => (
                                        <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-white"}>
                                            <td className="border border-gray-400 p-2 text-center">{row.id}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.fatalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.multiVictimCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.femaleVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.fatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.severeInjuries}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalLeaveDays}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalCost}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.medicalCost}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.salaryCompensation}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.propertyDamage}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalDamage}</td>
                                        </tr>
                                    ))}

                                    <tr>
                                        <td rowSpan={(report?.["phantheoyeuitogaychanthuong"] ?? []).length + 1} className="border border-gray-400 p-2 text-left font-semibold">Phân theo yếu tố gây chấn thương</td>
                                    </tr>
                                    {(report?.["phantheoyeuitogaychanthuong"] ?? []).map((row: any, i: number) => (
                                        <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-white"}>
                                            <td className="border border-gray-400 p-2 text-center">{row.id}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.fatalCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.multiVictimCases}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.femaleVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.fatalVictims}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.severeInjuries}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalLeaveDays}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalCost}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.medicalCost}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.salaryCompensation}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.propertyDamage}</td>
                                            <td className="border border-gray-400 p-2 text-center">{row.totalDamage}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            ) : (
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
                                <input type="checkbox" onChange={(e) => {
                                    setSelectedIds(e.target.checked ? reports.map(r => r.id) : []);
                                }} />
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
                                    <input type="checkbox" checked={selectedIds.includes(i.id)} onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIds(prev => [...prev, i.id]);
                                        } else {
                                            setSelectedIds(prev => prev.filter(p => p !== i.id));
                                        }
                                    }} />
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
            )}
        </main>
    )
}

export default TNLDTheoHDLDAdminPage;