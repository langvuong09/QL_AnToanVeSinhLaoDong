import { useContext, useState } from "react";
import DatePicker from "./DateLengend";
import SelectLegend from "./SelectLegend";
import YearInputLengend from "./YearInputLengend";
import { ReportType } from "../api/ReportType";
import { NotificateContext } from "../contexts/notificate/notificate";
import { Report } from "../api/types/report-type";

type CreateReportProps = {
    onClose: () => void;
    onSuccess: (v: Report) => void;
    reports?: Report[];
}

const CreateReport = ({ onClose, onSuccess, reports }: CreateReportProps) => {
    const notificate = useContext(NotificateContext);

    const [submitForm, setSubmitForm] = useState<{
        name: string;
        year: number;
        period: string;
        startDate: string;
        endDate: string;
        isActive: boolean
    }>({
        name: "Báo cáo TNLĐ",
        year: Number(new Date().getFullYear()),
        period: "6 tháng",
        startDate: "",
        endDate: "",
        isActive: true
    });

    const [error, setError] = useState<{
        name: string;
        year: string;
        period: string;
        startDate: string;
        endDate: string;
    }>({
        name: "",
        year: "",
        period: "",
        startDate: "",
        endDate: "",
    });

    const period = [
        "6 tháng", "Cả năm"
    ];

    const onSubmit = async () => {
        const nowYear = new Date().getFullYear();
        const minYear = nowYear - 15;
        const maxYear = nowYear + 15;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newErrors = {
            name: "",
            year: "",
            period: "",
            startDate: "",
            endDate: "",
        };

        let hasError = false;

        if (!submitForm.name.trim()) {
            newErrors.name = "Tên báo cáo không được để trống";
            hasError = true;
        }

        if (!submitForm.year) {
            newErrors.year = "Năm báo cáo không được để trống";
            hasError = true;
        } else if (submitForm.year < minYear || submitForm.year > maxYear) {
            newErrors.year = `Năm báo cáo phải trong khoảng ${minYear} – ${maxYear}`;
            hasError = true;
        }

        if (!submitForm.period.trim()) {
            newErrors.period = "Kỳ báo cáo không được để trống";
            hasError = true;
        }

        if (!submitForm.startDate) {
            newErrors.startDate = "Ngày bắt đầu không được để trống";
            hasError = true;
        }

        if (!submitForm.endDate) {
            newErrors.endDate = "Ngày kết thúc không được để trống";
            hasError = true;
        }

        if (submitForm.startDate && submitForm.endDate) {
            const start = new Date(submitForm.startDate);
            const end = new Date(submitForm.endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            if (start >= end) {
                newErrors.endDate = "Ngày kết thúc phải lớn hơn ngày bắt đầu";
                hasError = true;
            }

            // if (start < today) {
            //     newErrors.startDate = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại";
            //     hasError = true;
            // }
        
            const existingSameYear = (reports || []).filter(r => r.year === submitForm.year && r.isActive === true);

            if (existingSameYear.length >= 2) {
                newErrors.period = `Năm ${submitForm.year} đã có 2 kỳ báo cáo`;
                hasError = true;
            }

            const duplicatePeriod = existingSameYear.find(r => r.period === submitForm.period);
            if (duplicatePeriod) {
                newErrors.period = `Kỳ báo cáo "${submitForm.period}" đã tồn tại cho năm ${submitForm.year}`;
                hasError = true;
            }

            // Prevent overlapping date ranges with existing periods in the same year
            if (submitForm.startDate && submitForm.endDate) {
                const newStart = new Date(submitForm.startDate);
                const newEnd = new Date(submitForm.endDate);
                newStart.setHours(0,0,0,0);
                newEnd.setHours(0,0,0,0);

                for (const r of existingSameYear) {
                    // skip if same exact period (already handled) or missing dates
                    if (!r.startDate || !r.endDate) continue;
                    const exStart = new Date(r.startDate);
                    const exEnd = new Date(r.endDate);
                    exStart.setHours(0,0,0,0);
                    exEnd.setHours(0,0,0,0);

                    // Overlap if newStart < exEnd && newEnd > exStart
                    if (newStart < exEnd && newEnd > exStart) {
                        newErrors.startDate = "Thời gian bắt đầu trùng với kỳ báo cáo khác";
                        newErrors.endDate = "Thời gian kết thúc trùng với kỳ báo cáo khác";
                        hasError = true;
                        break;
                    }
                }
            }
        }

        if (hasError) {
            notificate?.showNotification({ type: "error", message: "Vui lòng kiểm tra lại thông tin" });
            setError(newErrors);
            return;
        }

        setError(newErrors);

        try {
            const cls = new ReportType();
            const result = await cls.CreateReportType(submitForm)
            notificate?.showNotification({ type: "success", message: "Cập nhật kỳ báo cáo thành công" });
            onClose();
            onSuccess(result);
        } catch (error: any) {
            notificate?.showNotification({ type: "error", message: error });
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-gray-900/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded w-lg px-4 py-5 space-y-5">
                <div className="flex justify-between pb-2 border-b border-[#919EAB52]">
                    <h1 className="font-semibold">Thêm mới</h1>
                    <button className="font-semibold text-gray-600" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                        <SelectLegend
                            label="Tên báo cáo"
                            require={true}
                            select={{
                                value: submitForm.name,
                                onChange: (e) => {
                                    setSubmitForm(prev => ({ ...prev, name: e.target.value }));
                                    setError(prev => ({ ...prev, name: "" }));
                                }
                            }}
                            errorMess={error.name}
                        >
                            <option value={"Báo cáo TNLĐ"}>Báo cáo TNLĐ</option>
                        </SelectLegend>
                    </div>
                    <div className="col-span-1">
                        <YearInputLengend
                            inputLengend={{
                                label: "Năm",
                                require: true,
                                input: {},
                                errorMess: error.year
                            }}
                            value={submitForm.year.toString()}
                            onChange={(e) => {
                                const year = Number(e.value);
                                setSubmitForm(prev => ({ ...prev, year: year }));
                                setError(prev => ({ ...prev, year: "" }));
                            }} />
                    </div>
                    <div className="col-span-1">
                        <SelectLegend
                            label="Kỳ báo cáo"
                            require={true}
                            select={{
                                value: submitForm.period,
                                onChange: (e) => {
                                    setSubmitForm(prev => ({ ...prev, period: e.target.value }));
                                setError(prev => ({ ...prev, period: "" }));
                                }

                            }}
                            errorMess={error.period}
                        >
                            {period.map((pe, idx) => (
                                <option key={idx} value={pe}>{pe}</option>
                            ))}
                        </SelectLegend>
                    </div>
                    <div className="col-span-1">
                        <DatePicker
                            label="Ngày bắt đầu"
                            require={true}
                            onChange={(v) => {
                                setSubmitForm(prev => ({ ...prev, startDate: v }));
                                setError(prev => ({ ...prev, startDate: "" }));
                                setError(prev => ({ ...prev, endDate: "" }));

                            }}
                            errorMess={error.startDate}
                        />
                    </div>
                    <div className="col-span-1">
                        <DatePicker
                            label="Ngày kết thúc"
                            require={true}
                            onChange={(v) => {
                                setSubmitForm(prev => ({ ...prev, endDate: v }));
                                setError(prev => ({ ...prev, endDate: "" }));
                                setError(prev => ({ ...prev, startDate: "" }));

                            }}
                            errorMess={error.endDate}
                        />
                    </div>
                    <div className="col-span-2">
                        <SelectLegend
                            label="Trạng thái"
                            select={{
                                value: String(submitForm.isActive),
                                onChange: (e) => {
                                    let rs: boolean;
                                    if (e.target.value === "true") {
                                        rs = true;
                                    } else {
                                        rs = false;
                                    }
                                    setSubmitForm(prev => ({ ...prev, isActive: rs }));
                                }
                            }}
                        >
                            <option value="true">Hoạt động</option>
                            <option value="false">Không hoạt động</option>
                        </SelectLegend>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-semibold" onClick={onSubmit}>
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span>Lưu</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateReport;