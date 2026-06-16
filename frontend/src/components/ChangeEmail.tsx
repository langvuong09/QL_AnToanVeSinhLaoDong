import { useEffect, useState } from "react";
import InputLegend from "./InputLegend";
import Button from "./ui/Button";

type ChangeEmailProps = {
    email: string;
    onClose: () => void;
    onResend: (v: number, onFunc?: () => void) => void;
}

const ChangeEmail = ({ email, onClose, onResend }: ChangeEmailProps) => {
    const [countDown, setCountDown] = useState<number>(60);
    const [otp, setOtp] = useState<string>("");

    const convertToTime = (): string => {
        const minutes = Math.floor(countDown / 60);
        const secs = countDown % 60;

        return String(minutes).padStart(2, '0') + ":" + String(secs).padStart(2, '0');
    }

    useEffect(() => {
        if (countDown <= 0) return;
        const timer = setInterval(() => {
            setCountDown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countDown]);

    return (
        <div className="fixed top-0 left-0 w-full h-screen bg-gray-900/50 z-50 flex items-center justify-center">
            <div className="p-5 bg-white rounded-lg space-y-5 w-96">
                <div className="text-center space-y-2">
                    <h1 className="text-xl text-blue-600 font-semibold">THAY ĐỔI EMAIL</h1>
                    <p className="text-sm">
                        Chúng tôi đã gửi mã xác minh qua số email cũ
                        <br />
                        <strong>{email}</strong>
                    </p>
                    <p className="text-sm">Bạn vui lòng kiểm tra và điền mã xác thực</p>
                </div>

                <div className="space-y-2">
                    <InputLegend
                        label="OTP"
                        require={true}
                        input={{
                            type: "text",
                            placeholder: "Nhập mã OTP",
                            value: otp,
                            onChange: (e) => setOtp(e.target.value),
                            maxLength: 6,
                        }}
                    />

                    <div>
                        <p className="text-blue-600 text-center">
                            {convertToTime()}
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-gray-500">Chưa nhận được mã?</span>
                        <button onClick={() => {
                            onResend(countDown, () => setCountDown(60));
                        }}>
                            Gửi lại
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button variant="primary">Xác nhận</Button>
                    <Button variant="outline" onClick={onClose}>Hủy bỏ</Button>
                </div>
            </div>
        </div>
    );
};

export default ChangeEmail;