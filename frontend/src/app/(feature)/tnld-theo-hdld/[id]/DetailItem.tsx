'use client'

import InputLegend from "@/src/components/InputLegend";
import { useState } from "react";
import { SubmitForm } from "./type";
import { formatVND } from "./utils";
import { TrauMaDto } from "@/src/api/types/trauma";
import { InjuryDto } from "@/src/api/types/Injury";
import SelectInputLengend from "@/src/components/SelectInputLengend";

type Detail = SubmitForm["details"][number];

const Causes = [
    { key: '1', value: 'Kỹ thuật'},
    { key: '2', value: 'Thiết bị không đảm bảo ATVSLĐ'},
    { key: '3', value: 'Thiếu thiết bị ATVSLĐ'},
    { key: '4', value: 'Thiết bị ATVSLĐ hỏng'},
    { key: '5', value: 'Không sử dụng thiết bị ATVSLĐ'},
    { key: '6', value: 'Vi phạm nội quy ATVSLĐ'},
]

type Props = {
    index: number;
    detail: Detail;
    onUpdate: (index: number, field: keyof Detail, value: string | number) => void;

    traumas?: TrauMaDto[];
    injuries?: InjuryDto[];
};

const DetailItem = ({ index, detail, onUpdate, traumas, injuries }: Props) => {
    const [isOpen, setIsOpen] = useState(true);

    const update = (field: keyof Detail, value: string | number) => {
        onUpdate(index, field, value);
    };

    return (
        <div className="space-y-4">
            <button
                className="flex items-center gap-2 w-full text-left text-sm font-semibold"
                onClick={() => setIsOpen(prev => !prev)}
            >
                <span>{isOpen ? "▲" : "▼"}</span>
                <span>Chi tiết vụ tai nạn số {index + 1}</span>
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
                                        input: {}
                                    }}
                                    onChange={() => {

                                    }}
                                     items={Causes.map(c => ({ key: c.key, value: c.value }))}
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
                                        input: {}
                                    }}
                                    onChange={() => {

                                    }}
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
                                        input: {}
                                    }}
                                    onChange={() => {

                                    }}
                                    items={injuries?.map(t => ({ key: t.id.toString(), value: t.name })) || []}
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
                            4. Chi tiết vụ tai nạn số {index + 1}
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
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                update("totalCases", n);
                                            }
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
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                update("fatalCases", n);
                                            }
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
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                update("multiVictimCases", n);
                                            }
                                        }}
                                        isSmall={true}
                                    />
                                </div>
                                <div className="flex-1" />
                            </div>

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
                                                update("totalVictims", n);
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
                                                update("femaleVictims", n);
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
                                                update("fatalVictims", n);
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
                                                update("severeInjuries", n);
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
                                                update("nonManagedVictims", n);
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
                                                update("nonManagedFemaleVictims", n);
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
                                                update("nonManagedFatalVictims", n);
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
                                                update("nonManagedSevereInjuries", n);
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
                            5. Thiệt hại do tai nạn lao động số {index + 1}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex gap-6">
                                <div className="flex-1 relative">
                                    <InputLegend
                                        label="Chi phí y tế"
                                        require
                                        input={{
                                            type: "number",
                                            value: detail.medicalCost,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                update("medicalCost", n);
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
                                            type: "number",
                                            value: detail.salaryCompensation,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                update("salaryCompensation", n);
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
                                            type: "number",
                                            value: detail.propertyDamage,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                update("propertyDamage", n);
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
                                            value: formatVND(detail.medicalCost + detail.salaryCompensation + detail.propertyDamage),
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
                                                update("totalLeaveDays", n);
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
                                            type: "number",
                                            value: detail.totalDamage,
                                            onChange: (e) => {
                                                const n = Number(e.target.value);
                                                if (n < 0) return;
                                                update("totalDamage", n);
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
        </div>
    );
};

export default DetailItem;