'use client'

import InputLegend from "@/src/components/InputLegend";
import { useState } from "react";
import { Detail } from "./type";
import { JobDto, } from "@/src/api/types/job";
import { AccidentDto } from "@/src/api/types/accident";
import SelectInputLengend from "@/src/components/SelectInputLengend";
import { TraumaDto } from "@/src/api/types/trauma";

type DetailItemProps = {
    detail: Detail;
    onChangDetail: (idx: number, k: string, v: string | number) => void;
    handleDeleteDetail: (idx: number) => void;

    accidents?: AccidentDto[];
    traumas?: TraumaDto[];
    jobs?: JobDto[];

    errors?: Record<string, string>;
    clearError?: (idx: number, field: string) => void;
}

const DetailItem = ({ detail, onChangDetail, handleDeleteDetail, accidents, traumas, jobs, errors, clearError }: DetailItemProps) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="space-y-4 px-2 border-b pb-5 border-gray-300">
            <button
                className="flex items-center gap-2 w-full text-left text-sm font-semibold"
                onClick={() => setIsOpen(prev => !prev)}
            >
                <span>{isOpen ? "▲" : "▼"}</span>
                <span>Chi tiết vụ tai nạn số {detail.idx + 1}</span>
            </button>

            {isOpen && (
                <div className="space-y-4">
                    <div className="flex gap-6">
                        <div className="flex-1">
                            <label className="text-sm font-semibold">
                                1. Phân theo nguyên nhân xảy ra TNLĐ
                            </label>
                            <div className="mt-1">
                                <SelectInputLengend
                                    inputLengend={{
                                        input: {},
                                        errorMess: errors?.causeId
                                    }}
                                    onChange={(e) => {
                                        onChangDetail(detail.idx, "causeId", e.key);
                                        clearError?.(detail.idx, "causeId");
                                    }}
                                    value={accidents?.find(v => v.id == detail.causeId)?.name || ""}
                                    items={accidents?.map(t => ({ key: t.id.toString(), value: t.name })) || []}
                                    isSmall={true}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-semibold">
                                2. Phân theo yếu tố gây chấn thương
                            </label>

                            <div className="mt-1">
                                <SelectInputLengend
                                    inputLengend={{
                                        input: {},
                                        errorMess: errors?.traumaId
                                    }}
                                    onChange={(e) => {
                                        onChangDetail(detail.idx, "traumaId", e.key);
                                        clearError?.(detail.idx, "traumaId");
                                    }}
                                    value={traumas?.find(v => v.id == detail.traumaId)?.name || ""}
                                    items={traumas?.map(t => ({ key: t.id.toString(), value: t.name })) || []}
                                    isSmall={true}
                                />
                            </div>
                        </div>
                        <div className="flex-1"></div>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex-1">
                            <label className="text-sm font-semibold">
                                3. Phân theo nghề nghiệp
                            </label>
                            <div className="mt-1">
                                <SelectInputLengend
                                    inputLengend={{
                                        input: {},
                                        errorMess: errors?.jobId
                                    }}
                                    onChange={(e) => {
                                        onChangDetail(detail.idx, "jobId", e.key);
                                        clearError?.(detail.idx, "jobId");
                                    }}
                                    value={jobs?.find(v => v.id == detail.jobId)?.name || ""}
                                    items={jobs?.map(t => ({ key: t.id.toString(), value: t.name })) || []}
                                    isSmall={true}
                                />
                            </div>
                        </div>
                        <div className="flex-1"></div>
                        <div className="flex-1"></div>
                    </div>

                    {/* 4. Chi tiết vụ */}
                    <div>
                        <h2 className="text-sm font-semibold mb-3">
                            4. Chi tiết vụ tai nạn số {detail.idx + 1}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-6">
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số vụ"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.totalCases,
                                            disabled: true,
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số vụ có người chết"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.fatalCases,
                                            disabled: true,
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số vụ có 2 người bị nạn trở lên"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.multiVictimCases,
                                            disabled: true,
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1" />
                            </div>

                            {/* Vung co the nhap thong tin */}
                            <div className="flex gap-6">
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số người bị nạn"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.totalVictims,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;

                                                onChangDetail(detail.idx, "totalVictims", n);
                                                if (n < 2) {
                                                    onChangDetail(detail.idx, "multiVictimCases", 0);
                                                } else {
                                                    onChangDetail(detail.idx, "multiVictimCases", 1);
                                                }
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số lao động nữ bị nạn"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.femaleVictims,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                onChangDetail(detail.idx, "femaleVictims", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số người bị chết"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.fatalVictims,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                onChangDetail(detail.idx, "fatalVictims", n);

                                                if (n < 2) {
                                                    onChangDetail(detail.idx, "fatalCases", 0);
                                                } else {
                                                    onChangDetail(detail.idx, "fatalCases", 1);
                                                }
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số người bị thương nặng"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.severeInjuries,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                onChangDetail(detail.idx, "severeInjuries", n);
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
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.nonManagedVictims,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                onChangDetail(detail.idx, "nonManagedVictims", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Lao động nữ bị nạn không QL"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.nonManagedFemaleVictims,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                onChangDetail(detail.idx, "nonManagedFemaleVictims", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Số người chết không QL"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.nonManagedFatalVictims,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                onChangDetail(detail.idx, "nonManagedFatalVictims", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1">
                                    <InputLegend
                                        label="Người bị thương nặng không QL"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.nonManagedSevereInjuries,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                onChangDetail(detail.idx, "nonManagedSevereInjuries", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Thiệt hại */}
                    <div>
                        <h2 className="text-sm font-semibold mb-3">
                            5. Thiệt hại do tai nạn lao động số {detail.idx + 1}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-6">
                                <div className="flex-1 relative">
                                    <InputLegend
                                        label="Chi phí y tế"
                                        require
                                        input={{
                                            type: "text",
                                            value: detail.medicalCost.toLocaleString("vi-VN"),
                                            onChange: (e) => {
                                                const value = e.target.value.replace(/\./g, "");
                                                const n = Number(value);

                                                if (Number.isNaN(n)) return;

                                                onChangDetail(detail.idx, "medicalCost", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                    <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000đ</span>
                                </div>
                                <div className="flex-1 relative">
                                    <InputLegend
                                        label="Chi phí trả lương trong thời gian điều trị"
                                        require
                                        input={{
                                            type: "text",
                                            value: detail.salaryCompensation.toLocaleString("vi-VN"),
                                            onChange: (e) => {
                                                const value = e.target.value.replace(/\./g, "");
                                                const n = Number(value);

                                                if (Number.isNaN(n)) return;

                                                onChangDetail(detail.idx, "salaryCompensation", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                    <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000đ</span>
                                </div>
                                <div className="flex-1 relative">
                                    <InputLegend
                                        label="Chi phí bồi thường trợ cấp"
                                        require
                                        input={{
                                            type: "text",
                                            value: detail.propertyDamage.toLocaleString("vi-VN"),
                                            onChange: (e) => {
                                                const value = e.target.value.replace(/\./g, "");
                                                const n = Number(value);

                                                if (Number.isNaN(n)) return;

                                                onChangDetail(detail.idx, "propertyDamage", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                    <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000đ</span>
                                </div>
                                <div className="flex-1 relative">
                                    <InputLegend
                                        label="Tổng số tiền chi phí"
                                        require
                                        input={{
                                            type: "text",
                                            disabled: true,
                                            value: (detail.medicalCost + detail.salaryCompensation + detail.propertyDamage).toLocaleString("vi-VN"),
                                        }}
                                        isSmall={true}
                                    />
                                    <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000đ</span>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex-1">
                                    <InputLegend
                                        label="Tổng số ngày nghỉ vì TNLĐ"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.totalLeaveDays,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                onChangDetail(detail.idx, "totalLeaveDays", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <InputLegend
                                        label="Thiệt hại tài sản"
                                        require
                                        input={{
                                            type: "text",
                                            value: detail.totalDamage.toLocaleString("vi-VN"),
                                            onChange: (e) => {
                                                const value = e.target.value.replace(/\./g, "");
                                                const n = Number(value);

                                                if (Number.isNaN(n)) return;

                                                onChangDetail(detail.idx, "totalDamage", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                    <span className="absolute text-xs font-semibold text-gray-500 right-0 top-1/2 -translate-y-1/2 me-3">1.000đ</span>
                                </div>
                                <div className="flex-1" />
                                <div className="flex-1" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-end pt-10">
                <button onClick={() => handleDeleteDetail(detail.idx)} className="px-3 py-1 bg-red-50 text-red-600 ring-2 ring-red-600 rounded text-xs font-semibold flex items-center gap-2 hover:bg-red-100">
                    <i className="fa-solid fa-calendar-minus"></i>
                    <span>Xóa</span>
                </button>
            </div>
        </div>
    );
};

export default DetailItem;