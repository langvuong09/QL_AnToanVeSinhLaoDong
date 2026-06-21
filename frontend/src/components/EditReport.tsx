import { useContext, useState } from "react";
import DatePicker from "./DateLengend";
import InputLegend from "./InputLegend";
import SelectInputLengend from "./SelectInputLengend";
import SelectLegend from "./SelectLegend";
import YearInputLengend from "./YearInputLengend";
import { ReportType } from "../api/ReportType";
import { NotificateContext } from "../contexts/notificate/notificate";
import { Report } from "../api/types/report-type";

type EditReportProps = {
    report: Report;
    onClose: () => void;
    onSuccess: (v: Report) => void;
}

const EditReport = ({ report, onClose, onSuccess }: EditReportProps) => {
    const notificate = useContext(NotificateContext);

    const [submitForm, setSubmitForm] = useState<{
        name: string;
        year: number;
        period: string;
        startDate: string;
        endDate: string;
        isActive: boolean
    }>({
        name: report.name,
        year: report.year,
        period: report.period,
        startDate: report.startDate,
        endDate: report.endDate,
        isActive: report.isActive
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
        "3 tháng", "6 tháng", "9 tháng", "Cả năm"
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

            if (start < today) {
                newErrors.startDate = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại";
                hasError = true;
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
            await cls.UpdateReportType(report.id, submitForm);
            notificate?.showNotification({ type: "success", message: "Cập nhật kỳ báo cáo thành công" });
            onClose();
            onSuccess({ ...submitForm, id: report.id });
        } catch (error: any) {
            notificate?.showNotification({ type: "error", message: error });
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-gray-900/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded w-lg px-4 py-5 space-y-5">
                <div className="flex justify-between pb-2 border-b border-[#919EAB52]">
                    <h1 className="font-semibold">Chỉnh sửa</h1>
                    <button className="font-semibold text-gray-600" onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                        <SelectInputLengend
                            inputLengend={{
                                label: "Tên báo cáo",
                                require: true,
                                input: {},
                                errorMess: error.name
                            }}
                            onChange={(e) => {
                                setSubmitForm(prev => ({ ...prev, name: e.value }));
                                setError(prev => ({ ...prev, name: "" }));
                            }}
                            value={submitForm.name}
                            items={[
                                {
                                    key: "Báo cáo TNLĐ",
                                    value: "Báo cáo TNLD"
                                }
                            ]}
                            freeInput={true}
                        />
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
                        <SelectInputLengend
                            inputLengend={{
                                label: "Kỳ báo cáo",
                                require: true,
                                input: {},
                                errorMess: error.period
                            }}
                            value={submitForm.period}
                            onChange={(e) => {
                                setSubmitForm(prev => ({ ...prev, period: e.value }));
                                setError(prev => ({ ...prev, period: "" }));
                            }}
                            items={period.map(pe => ({ key: pe, value: pe }))}
                            freeInput={true}
                        />
                    </div>
                    <div className="col-span-1">
                        <DatePicker
                            label="Ngày bắt đầu"
                            require={true}
                            value={submitForm.startDate}
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
                            value={submitForm.endDate}
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

export default EditReport;