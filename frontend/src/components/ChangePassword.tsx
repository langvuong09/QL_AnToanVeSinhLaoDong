'use client'

import { useContext, useState } from "react";
import PasswordInput from "./form/PasswordInput";
import { NotificateContext } from "../contexts/notificate/notificate";
import { User } from "../api/User";

type ChangePasswordProps = {
    onClose: () => void;
}

type FormErrors = {
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    form?: string;
}

const ChangePassword = ({
    onClose
}: ChangePasswordProps) => {
    const notificate = useContext(NotificateContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!oldPassword.trim()) {
            newErrors.oldPassword = "Mật khẩu cũ không được để trống";
        }

        if (!newPassword.trim()) {
            newErrors.newPassword = "Mật khẩu mới không được để trống";
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "Mật khẩu phải có tối thiểu 8 ký tự";
        }

        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const userApi = new User();
        const result = await userApi.ChangePassword(oldPassword, newPassword, confirmPassword);
        setIsLoading(false);

        if (result.success) {
            notificate?.showNotification({ type: "success", message: "Đổi mật khẩu thành công." });
            onClose();
            return;
        }

        notificate?.showNotification({ type: "error", message: result.message });
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
                <div className="bg-[#4f46e5] px-6 py-4 text-center">
                    <h1 className="text-lg font-semibold text-white">Đổi mật khẩu</h1>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-2 px-6 py-6 text-gray-700">
                    {errors.form && (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {errors.form}
                        </div>
                    )}

                    <PasswordInput
                        label="Mật khẩu cũ"
                        required
                        placeholder="Nhập mật khẩu cũ"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        disabled={isLoading}
                        error={errors.oldPassword}
                    />

                    <PasswordInput
                        label="Mật khẩu mới"
                        required
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        error={errors.newPassword}
                    />

                    <PasswordInput
                        label="Nhập lại mật khẩu mới"
                        required
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        error={errors.confirmPassword}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            onClick={onClose}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword;