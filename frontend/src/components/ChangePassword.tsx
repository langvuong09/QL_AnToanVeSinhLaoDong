'use client'

import { useState } from "react";
import InputLegend from "./InputLegend";

type ChangePasswordProps = {
    onClose: () => void;
}

const ChangePassword = ({
    onClose
}: ChangePasswordProps) => {
    const [submitForm, setSubmitForm] = useState<{}>();

    const onSubmit = async () => {

    }

    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-gray-900/50 flex items-center justify-center">
            <div className="bg-white min-w-sm rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white font-semibold px-5 py-3 text-center">
                    <h1>Đổi mật khẩu</h1>
                </div>

                <div className="flex flex-col gap-3 px-5 py-4 text-gray-600">
                    <InputLegend
                        label="Mật khẩu cũ"
                        require={true}
                        input={{
                            type: "password",
                            placeholder: "Nhập mật khẩu cũ"
                        }}
                    />

                    <InputLegend
                        label="Mật khẩu mới"
                        require={true}
                        input={{
                            type: "password",
                            placeholder: "Nhập mật khẩu mới"
                        }}
                    />

                    <InputLegend
                        label="Nhập lại mật khẩu mới"
                        require={true}
                        input={{
                            type: "password",
                            placeholder: "Nhập mật khẩu mới"
                        }}
                    />
                </div>

                <div className="flex gap-3 items-center justify-end px-5 py-4">
                    <button className="text-gray-500 font-semibold px-5 py-2 rounded" onClick={onClose}>
                        Hủy bỏ
                    </button>

                    <button className="text-white font-semibold bg-blue-600 px-5 py-2 rounded" onClick={onSubmit}>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;