'use client'

import { Agreement } from "@/src/api/Agreement";
import InputLegend from "@/src/components/InputLegend";
import SelectLegend from "@/src/components/SelectLegend";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import { useContext, useState } from "react";

type ChangeReportStatusProps = {
    ids: number[];
    onSuccess: (status: string) => void;
    onClose: () => void;
}

const ChangeReportStatus = ({ ids, onSuccess, onClose }: ChangeReportStatusProps) => {
    const notificate = useContext(NotificateContext);

    const [submitForm, setSubmitForm] = useState<{
        status: string;
        note: string;
    }>({
        status: "",
        note: ""
    });

    const [error, setError] = useState<{
        note: string;
        status: string;
    }>({
        note: "",
        status: ""
    });

    const onSubmit = async () => {
        let error = {
            note: "",
            status: ""
        };

        let hasError = false;

        if (!submitForm.status) {
            hasError = true;
            error.status = "Vui lòng chọn trạng thái"
        }

        if (submitForm.status === "REJECTED" && !submitForm.note) {
            hasError = true;
            error.note = "Vui điền lý do hủy báo cáo"
        }

        setError(error);

        if (hasError) {
            notificate?.showNotification({ type: "error", message: "Vui lòng điền đầy đủ thông tin" });
            return;
        }

        try {
            const cls = new Agreement();
            await cls.UpdateBulkStatus(ids, submitForm.status, submitForm.note);
            onSuccess(submitForm.status);
            notificate?.showNotification({ type: "success", message: "Cập nhật danh sách thành công" });
            onClose();
        } catch (error) {
            notificate?.showNotification({ type: "error", message: "Có lỗi xảy ra vui lòng thử lại sau" });
        }

    }

    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-gray-800/50 flex justify-center items-center z-100 rounded overflow-hidden">
            <div className="bg-white space-y-3">
                <div className="text-center py-3 bg-blue-600 text-white font-semibold">
                    <h1>Thay đổi trạng thái</h1>
                </div>

                <div className="space-y-10 px-5 py-4">
                    <div className="flex flex-col gap-6 w-80">
                        <div>
                            <InputLegend
                                label="Ghi chú"
                                input={{
                                    value: submitForm.note,
                                    onChange: (e) => {
                                        setSubmitForm(prev => ({ ...prev, note: e.target.value }));
                                    }
                                }}
                                isSmall={false}
                            />
                        </div>
                        <div>
                            <SelectLegend
                                label="Trạng thái"
                                require={true}
                                select={{
                                    value: submitForm.status,
                                    onChange: (e) => {
                                        setSubmitForm(prev => ({ ...prev, status: e.target.value }));
                                    }
                                }}
                                errorMess={error.status}
                                isSmall={false}
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
                    <div className="flex items-center gap-5 justify-end">
                        <button className="text-gray-500 font-semibold" onClick={onClose}>Hủy</button>
                        <button className="px-5 py-1 rounded text-white bg-blue-600 font-semibold hover:bg-blue-700" onClick={onSubmit}>Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeReportStatus;