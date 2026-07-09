'use client'

import { Agreement } from "@/src/api/Agreement";
import { AgreementTable } from "@/src/api/types/agreement";
import { Accident } from "@/src/api/Accident";
import { Trauma } from "@/src/api/Trauma";
import { Job } from "@/src/api/Job";
import { ConfirmContext } from "@/src/contexts/confirm/confirm";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import { useContext, useState, useEffect, useMemo } from "react";

type ChangeReportStatusProps = {
    ids: number[];
    reports: AgreementTable[];
    onSuccess: (status: string) => void;
    onClose: () => void;
}

type ItemNote = {
    id: number;
    note: string;
}

const ChangeReportStatus = ({ ids, reports, onSuccess, onClose }: ChangeReportStatusProps) => {
    const notificate = useContext(NotificateContext);
    const confirm = useContext(ConfirmContext);

    // Memoized so the reference is stable across renders unless ids/reports actually change.
    // Without this, `reports.filter(...)` created a brand new array every render, which fed
    // into the effect below and caused it to re-run (and re-setState) on every single render.
    const selectedReports = useMemo(
        () => reports.filter(r => ids.includes(r.id)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(ids), reports]
    );

    const [selectedReportId, setSelectedReportId] = useState<number>(selectedReports[0]?.id || 0);
    const currentReport = selectedReports.find(r => r.id === selectedReportId) || selectedReports[0];
    // Loose cast so we can freely read the aggregate m1/m2 fields (fatalCases, multiVictimCases,
    // nonManaged* variants, etc.) the same way ViewReport does, without fighting the AgreementTable type.
    const cr: any = currentReport;

    const [status, _] = useState<string>("REJECTED");
    const [items, setItems] = useState<ItemNote[]>(
        selectedReports.map(r => ({ id: r.id, note: "" }))
    );

    // Detail-level notes per report: { [reportId]: string[] }
    const [detailNotes, setDetailNotes] = useState<Record<number, string[]>>(() => {
        const map: Record<number, string[]> = {};
        selectedReports.forEach(r => {
            map[r.id] = (r.details || []).map(() => "");
        });
        return map;
    });

    const [error, setError] = useState<{
        note: string;
        status: string;
    }>({
        note: "",
        status: ""
    });

    // State for accidents, traumas, jobs
    const [accidents, setAccidents] = useState<any[]>([]);
    const [traumas, setTraumas] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);

    const flattenJobs = (jobs: any[]): any[] => {
        return jobs.flatMap(job => [
            {
                ...job,
                children: undefined,
            },
            ...(job.children ? flattenJobs(job.children) : []),
        ]);
    };

    useEffect(() => {
        const fetchOtherData = async () => {
            try {
                const accidentCls = new Accident();
                const traumaCls = new Trauma();
                const jobCls = new Job();

                const result = await Promise.all([jobCls.GetAll(), traumaCls.GetAll(), accidentCls.GetAll()]);
                setJobs(flattenJobs(result[0]));
                setTraumas(result[1]);
                setAccidents(result[2]);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchOtherData();
    }, []);

    const handleNoteChange = (reportId: number, noteValue: string) => {
        setItems(prev =>
            prev.map(item =>
                item.id === reportId ? { ...item, note: noteValue } : item
            )
        );
    };

    useEffect(() => {
        setDetailNotes(prev => {
            let changed = false;
            const next: Record<number, string[]> = { ...prev };

            selectedReports.forEach(r => {
                const detailLength = (r.details || []).length;

                if (!next[r.id]) {
                    next[r.id] = (r.details || []).map(() => "");
                    changed = true;
                } else if (detailLength !== next[r.id].length) {
                    // resize preserving existing values
                    next[r.id] = (r.details || []).map((_, i) => next[r.id][i] || "");
                    changed = true;
                }
            });

            // Returning the same reference when nothing actually changed stops React from
            // scheduling another render, which is what was causing the repeated re-renders.
            return changed ? next : prev;
        });
    }, [selectedReports]);

    const onSubmit = async () => {
        let formError = {
            note: "",
            status: ""
        };

        let hasError = false;

        if (!status) {
            hasError = true;
            formError.status = "Vui lòng chọn trạng thái"
        }

        if (status === "REJECTED") {
            const hasEmptyNote = items.some(item => {
                const main = item.note || "";
                const dnotes = detailNotes[item.id] || [];
                const hasDetail = dnotes.some(n => (n || "").trim() !== "");
                return main.trim() === "" && !hasDetail;
            });
            if (hasEmptyNote) {
                hasError = true;
                formError.note = "Vui lòng điền lý do từ chối cho tất cả báo cáo"
            }
        }

        setError(formError);

        if (hasError) {
            notificate?.showNotification({ type: "error", message: "Vui lòng điền đầy đủ thông tin" });
            return;
        }

        try {
            const w = await confirm.waitConfirm();
            if (!w) return;

            const cls = new Agreement();
            // Merge detail-level notes into the main note per report
            const payloadItems = items.map(it => {
                const dnotes = detailNotes[it.id] || [];
                const formatted = dnotes
                    .map((n, idx) => n ? `Vụ ${idx + 1}: ${n}` : null)
                    .filter(Boolean)
                    .join('\n');

                return {
                    id: it.id,
                    note: [it.note, formatted].filter(Boolean).join('\n')
                };
            });

            await cls.UpdateBulkStatus(ids, status, payloadItems);
            onSuccess(status);
            notificate?.showNotification({ type: "success", message: "Cập nhật danh sách thành công" });
            onClose();
        } catch (error) {
            notificate?.showNotification({ type: "error", message: "Có lỗi xảy ra vui lòng thử lại sau" });
        }
    }

    if (!currentReport) {
        return null;
    }

    // Build detail rows for current report
    const buildDetailRows = (type: 'cause' | 'trauma' | 'job') => {
        if (!currentReport.details) return [];

        const sourceList = type === 'cause' ? accidents : type === 'trauma' ? traumas : jobs;
        const matchField = type === 'cause' ? 'causeId' : type === 'trauma' ? 'traumaId' : 'jobId';

        return sourceList.map((item: any) => {
            const matchedDetails = currentReport.details.filter((d: any) => d[matchField] === item.id);
            return {
                label: item.name,
                id: item.id,
                totalCases: matchedDetails?.reduce((s: number, d: any) => s + d.totalCases, 0) || 0,
                fatalCases: matchedDetails?.reduce((s: number, d: any) => s + d.fatalCases, 0) || 0,
                multiVictimCases: matchedDetails?.reduce((s: number, d: any) => s + d.multiVictimCases, 0) || 0,
                totalVictims: matchedDetails?.reduce((s: number, d: any) => s + d.totalVictims, 0) || 0,
                nonManagedVictims: matchedDetails?.reduce((s: number, d: any) => s + d.nonManagedVictims, 0) || 0,
                femaleVictims: matchedDetails?.reduce((s: number, d: any) => s + d.femaleVictims, 0) || 0,
                nonManagedFemaleVictims: matchedDetails?.reduce((s: number, d: any) => s + d.nonManagedFemaleVictims, 0) || 0,
                fatalVictims: matchedDetails?.reduce((s: number, d: any) => s + d.fatalVictims, 0) || 0,
                nonManagedFatalVictims: matchedDetails?.reduce((s: number, d: any) => s + d.nonManagedFatalVictims, 0) || 0,
                severeInjuries: matchedDetails?.reduce((s: number, d: any) => s + d.severeInjuries, 0) || 0,
                nonManagedSevereInjuries: matchedDetails?.reduce((s: number, d: any) => s + d.nonManagedSevereInjuries, 0) || 0,
            };
        });
        // Note: intentionally NOT filtering out zero-value rows here — the review table
        // must always list every cause/trauma/job in the catalog (even if all counts are 0),
        // matching the full submitted report layout.
    };

    const causeRows = buildDetailRows('cause');
    const traumaRows = buildDetailRows('trauma');
    const jobRows = buildDetailRows('job');

    const renderDetailRow = (row: any, i: number) => (
        <tr key={row.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
            <td className="border border-gray-300 p-1 text-left">{row.label}</td>
            <td className="border border-gray-300 p-1 text-center">{row.id}</td>
            <td className="border border-gray-300 p-1 text-center">{row.totalCases}</td>
            <td className="border border-gray-300 p-1 text-center">{row.fatalCases}</td>
            <td className="border border-gray-300 p-1 text-center">{row.multiVictimCases}</td>
            <td className="border border-gray-300 p-1 text-center">{row.totalVictims}</td>
            <td className="border border-gray-300 p-1 text-center">{row.nonManagedVictims}</td>
            <td className="border border-gray-300 p-1 text-center">{row.femaleVictims}</td>
            <td className="border border-gray-300 p-1 text-center">{row.nonManagedFemaleVictims}</td>
            <td className="border border-gray-300 p-1 text-center">{row.fatalVictims}</td>
            <td className="border border-gray-300 p-1 text-center">{row.nonManagedFatalVictims}</td>
            <td className="border border-gray-300 p-1 text-center">{row.severeInjuries}</td>
            <td className="border border-gray-300 p-1 text-center">{row.nonManagedSevereInjuries}</td>
        </tr>
    );

    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-gray-800/50 flex justify-center items-center z-50 overflow-auto">
            <div className="bg-white space-y-3 h-200 overflow-y-auto w-full max-w-6xl m-4">
                <div className="text-center py-3 bg-blue-600 text-white font-semibold sticky top-0">
                    <h1>Từ chối báo cáo</h1>
                </div>

                <div className="px-5 py-4 space-y-4">
                    {/* 2-Column Layout: Review + Notes */}
                    <div className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                        {/* Left Column: Report Statistics Table (same layout as ViewReport) */}
                        <div className="flex-2 overflow-auto max-h-150">
                            <div className="space-y-2 mb-3">
                                <h3 className="font-semibold text-gray-700">Review báo cáo</h3>
                                <div className="text-xs text-gray-600">
                                    <p><span className="font-semibold">Báo cáo:</span> {currentReport.title}</p>
                                    <p><span className="font-semibold">Đơn vị:</span> {currentReport.doet.name}</p>
                                </div>
                            </div>

                            {/* Statistics Table - mirrors ViewReport's "I. Tình hình chung tai nạn lao động" table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-[11px] border-collapse border border-gray-300 bg-white">
                                    <thead>
                                        <tr>
                                            <th rowSpan={4} className="border border-gray-300 p-1 text-left align-middle bg-gray-100">Tiêu chí thống kê</th>
                                            <th rowSpan={4} className="border border-gray-300 p-1 text-center align-middle bg-gray-100">Mã số</th>
                                            <th colSpan={11} className="border border-gray-300 p-1 text-center bg-gray-100">Phân loại TNLĐ theo mức độ thương tật</th>
                                        </tr>
                                        <tr>
                                            <th colSpan={3} className="border border-gray-300 p-1 text-center bg-gray-100">Số vụ</th>
                                            <th colSpan={8} className="border border-gray-300 p-1 text-center bg-gray-100">Số người bị nạn (người)</th>
                                        </tr>
                                        <tr>
                                            <th rowSpan={2} className="border border-gray-300 p-1 text-center align-middle bg-gray-100">Tổng số</th>
                                            <th rowSpan={2} className="border border-gray-300 p-1 text-center align-middle bg-gray-100">Số vụ có người chết</th>
                                            <th rowSpan={2} className="border border-gray-300 p-1 text-center align-middle bg-gray-100">Số vụ ≥2 người bị nạn</th>
                                            <th colSpan={2} className="border border-gray-300 p-1 text-center bg-gray-100">Tổng số</th>
                                            <th colSpan={2} className="border border-gray-300 p-1 text-center bg-gray-100">Số LĐ nữ</th>
                                            <th colSpan={2} className="border border-gray-300 p-1 text-center bg-gray-100">Số người chết</th>
                                            <th colSpan={2} className="border border-gray-300 p-1 text-center bg-gray-100">Số người bị thương nặng</th>
                                        </tr>
                                        <tr>
                                            <th className="border border-gray-300 p-1 text-center bg-gray-100">Tổng số</th>
                                            <th className="border border-gray-300 p-1 text-center bg-gray-100">NN không thuộc quyền quản lý</th>
                                            <th className="border border-gray-300 p-1 text-center bg-gray-100">Tổng số</th>
                                            <th className="border border-gray-300 p-1 text-center bg-gray-100">NN không thuộc quyền quản lý</th>
                                            <th className="border border-gray-300 p-1 text-center bg-gray-100">Tổng số</th>
                                            <th className="border border-gray-300 p-1 text-center bg-gray-100">NN không thuộc quyền quản lý</th>
                                            <th className="border border-gray-300 p-1 text-center bg-gray-100">Tổng số</th>
                                            <th className="border border-gray-300 p-1 text-center bg-gray-100">NN không thuộc quyền quản lý</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Section 1 */}
                                        <tr className="bg-blue-50">
                                            <td colSpan={13} className="border border-gray-300 p-1 font-semibold text-blue-800">
                                                1. Tai nạn lao động
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-1">Tai nạn lao động</td>
                                            <td className="border border-gray-300 p-1 text-center"></td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1TotalCases}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1FatalCases}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1MultiVictimCases}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1TotalVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1NonManagedVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1FemaleVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1NonManagedFemaleVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1FatalVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1NonManagedFatalVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1SevereInjuries}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1NonManagedSevereInjuries}</td>
                                        </tr>

                                        {/* Cause Details */}
                                        {causeRows.length > 0 && (
                                            <>
                                                <tr className="bg-blue-100">
                                                    <td colSpan={13} className="border border-gray-300 p-1 font-semibold text-blue-900">
                                                        1.1 Phân theo nguyên nhân
                                                    </td>
                                                </tr>
                                                {causeRows.map((row: any, i: number) => renderDetailRow(row, i))}
                                            </>
                                        )}

                                        {/* Trauma Details */}
                                        {traumaRows.length > 0 && (
                                            <>
                                                <tr className="bg-blue-100">
                                                    <td colSpan={13} className="border border-gray-300 p-1 font-semibold text-blue-900">
                                                        1.2 Phân theo yếu tố gây chấn thương
                                                    </td>
                                                </tr>
                                                {traumaRows.map((row: any, i: number) => renderDetailRow(row, i))}
                                            </>
                                        )}

                                        {/* Job Details */}
                                        {jobRows.length > 0 && (
                                            <>
                                                <tr className="bg-blue-100">
                                                    <td colSpan={13} className="border border-gray-300 p-1 font-semibold text-blue-900">
                                                        1.3 Phân theo nghề nghiệp
                                                    </td>
                                                </tr>
                                                {jobRows.map((row: any, i: number) => renderDetailRow(row, i))}
                                            </>
                                        )}

                                        {/* Section 2 */}
                                        <tr className="bg-green-50">
                                            <td colSpan={13} className="border border-gray-300 p-1 font-semibold text-green-800">
                                                2. TNLĐ được hưởng trợ cấp
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="border border-gray-300 p-1">TNLĐ trợ cấp</td>
                                            <td className="border border-gray-300 p-1 text-center"></td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2TotalCases}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2FatalCases}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2MultiVictimCases}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2TotalVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2NonManagedVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2FemaleVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2NonManagedFemaleVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2FatalVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2NonManagedFatalVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2SevereInjuries}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m2NonManagedSevereInjuries}</td>
                                        </tr>

                                        {/* Total */}
                                        <tr className="bg-yellow-50 font-semibold text-yellow-900">
                                            <td className="border border-gray-300 p-1">Tổng (M1 + M2)</td>
                                            <td className="border border-gray-300 p-1 text-center"></td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1TotalCases + cr.m2TotalCases}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1FatalCases + cr.m2FatalCases}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1MultiVictimCases + cr.m2MultiVictimCases}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1TotalVictims + cr.m2TotalVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1NonManagedVictims + cr.m2NonManagedVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1FemaleVictims + cr.m2FemaleVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1NonManagedFemaleVictims + cr.m2NonManagedFemaleVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1FatalVictims + cr.m2FatalVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1NonManagedFatalVictims + cr.m2NonManagedFatalVictims}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1SevereInjuries + cr.m2SevereInjuries}</td>
                                            <td className="border border-gray-300 p-1 text-center">{cr.m1NonManagedSevereInjuries + cr.m2NonManagedSevereInjuries}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Column: Reports List with Notes */}
                        <div className="w-80 flex flex-col max-h-150">
                            <h3 className="font-semibold text-gray-700 mb-2">Ghi chú cho từng báo cáo</h3>
                            <div className="space-y-2 overflow-y-auto flex-1">
                                {selectedReports.map((report, idx) => {
                                    const itemNote = items.find(item => item.id === report.id);
                                    const isSelected = selectedReportId === report.id;

                                    return (
                                        <div
                                            key={report.id}
                                            onClick={() => setSelectedReportId(report.id)}
                                            className={`p-3 rounded-md cursor-pointer transition-colors border ${
                                                isSelected
                                                    ? "border-blue-300 bg-blue-50"
                                                    : "border-gray-200 bg-white hover:border-gray-300"
                                            }`}
                                        >
                                            {/* Report Info */}
                                            <p className="text-xs font-semibold text-gray-800 truncate">
                                                {report.title}
                                            </p>
                                            <p className="text-xs text-gray-600 truncate mb-2">
                                                {report.doet.name}
                                            </p>

                                            {/* Note Input */}
                                            <textarea
                                                onClick={(e) => e.stopPropagation()}
                                                value={itemNote?.note || ""}
                                                onChange={(e) => {
                                                    handleNoteChange(report.id, e.target.value);
                                                }}
                                                className={`w-full px-2 py-1.5 border rounded text-xs resize-none focus:outline-none focus:ring-1 focus:ring-blue-300 ${
                                                    status === "REJECTED" && !itemNote?.note
                                                        ? "border-red-300"
                                                        : "border-gray-300"
                                                }`}
                                                rows={2}
                                                placeholder={status === "REJECTED" ? "Lý do từ chối..." : "Ghi chú..."}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {error.note && (
                                <p className="text-red-600 text-xs mt-2">{error.note}</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-5 justify-end pt-4 border-t">
                        <button
                            className="text-gray-500 font-semibold hover:text-gray-700 transition"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            className="px-5 py-2 rounded text-white bg-blue-600 font-semibold hover:bg-blue-700 transition"
                            onClick={onSubmit}
                        >
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeReportStatus;