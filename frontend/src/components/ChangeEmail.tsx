import { useContext, useEffect, useState } from "react";
import InputLegend from "./InputLegend";
import Button from "./ui/Button";
import { NotificateContext } from "../contexts/notificate/notificate";
import { Auth } from "../api/Auth";
import Loading from "./Loading";

type ChangeEmailProps = {
    email: string;
    onClose: () => void;
    onResend: (v: number, onFunc?: () => void) => void;
    onSuccess: (v: string) => void;
}

const ChangeEmail = ({ email, onClose, onResend, onSuccess }: ChangeEmailProps) => {
    const notificate = useContext(NotificateContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [step, setStep] = useState<"opt" | "fill">("opt");
    const [countDown, setCountDown] = useState<number>(60);

    const [otp, setOtp] = useState<string>("");
    const [resetToken, setResetToken] = useState<string>("");
    const [valEmail, setValEmail] = useState<{ email: string, error: string }>({ email: "", error: "" });

    const convertToTime = (): string => {
        const minutes = Math.floor(countDown / 60);
        const secs = countDown % 60;

        return String(minutes).padStart(2, '0') + ":" + String(secs).padStart(2, '0');
    }

    const onSubmitOpt = async () => {
        setLoading(true);
        const cls = new Auth();
        const result = await cls.VerifyResetEmail(email, otp);
        if (result.success && result.data) {
            setResetToken(result.data.resetToken);
            setStep("fill");
            notificate?.showNotification({ type: "success", message: "Nhập mã thành công vui lòng điền địa chỉ email mới" });
            setCountDown(0);
            setOtp("");
        } else {
            notificate?.showNotification({ type: "error", message: "Mã đã hết hạn hoặc không tồn tại" });
        }

        setLoading(false);
    }

    const onSubmitEmail = async () => {
        let hasError = false;
        let error = "";
        if (!valEmail.email?.trim()) {
            error = "Email không được để trống";
            hasError = true;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valEmail.email)) {
            error = "Email không đúng định dạng";
            hasError = true;
        }

        if (hasError) {
            setValEmail(prev => ({ ...prev, error: error }));
            return;
        }

        setLoading(true);
        const cls = new Auth();
        const result = await cls.ConfirmResetEmail(valEmail.email, resetToken);
        if (result.success) {
            notificate?.showNotification({ type: "success", message: "Đổi địa chỉ email thành công" });
            onSuccess(valEmail.email);
            setValEmail({ email: "", error: "" });
        } else {
            notificate?.showNotification({ type: "error", message: result.message });
            setStep("opt");
            onResend(countDown, () => setCountDown(60));
        }
        setLoading(false);
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
            {loading && (
                <Loading />
            )}

            <div className="p-5 bg-white rounded-lg space-y-5 w-100">
                {step === "opt" ? (
                    <>
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
                            <Button variant="primary" onClick={onSubmitOpt}>Xác nhận</Button>
                            <Button variant="outline" onClick={onClose}>Hủy bỏ</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center space-y-2">
                            <h1 className="text-xl text-blue-600 font-semibold">THAY ĐỔI EMAIL</h1>
                            <p className="text-sm">
                                Vui lòng nhập địa chỉ email mới
                            </p>
                        </div>

                        <div className="space-y-2">
                            <InputLegend
                                label="Email"
                                require={true}
                                input={{
                                    type: "text",
                                    placeholder: "Điền địa chỉ email mới",
                                    value: valEmail.email,
                                    onChange: (e) => {
                                        setValEmail({ email: e.target.value, error: "" });
                                    },
                                }}
                                errorMess={valEmail.error}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button variant="primary" onClick={onSubmitEmail}>Lưu</Button>
                            <Button variant="outline" onClick={onClose}>Hủy bỏ</Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChangeEmail;