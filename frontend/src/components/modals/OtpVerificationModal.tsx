import { useEffect, useState } from "react";
import InputLegend from "../InputLegend";
import Button from "../ui/Button";
import Loading from "../Loading";

type OtpVerificationModalProps = {
  isOpen: boolean;
  email: string;
  title?: string;
  message?: string;
  onClose: () => void;
  onVerify: (otp: string) => Promise<{ success: boolean; message?: string }>;
  onResend: () => Promise<{ success: boolean; message?: string }>;
};

const OtpVerificationModal = ({
  isOpen,
  email,
  title = "XÁC MINH OTP",
  message = "Chúng tôi đã gửi mã xác minh qua email",
  onClose,
  onVerify,
  onResend,
}: OtpVerificationModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>(60);
  const [otp, setOtp] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const convertToTime = (): string => {
    const minutes = Math.floor(countDown / 60);
    const secs = countDown % 60;
    return String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  };

  const onSubmitOtp = async () => {
    if (!otp.trim()) {
      setErrorMsg("Mã OTP không được để trống");
      return;
    }
    if (otp.trim().length < 6) {
      setErrorMsg("Mã OTP phải gồm 6 ký tự");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    const result = await onVerify(otp);
    setLoading(false);

    if (!result.success) {
      setErrorMsg(result.message || "Mã OTP không chính xác, vui lòng kiểm tra lại");
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setErrorMsg("");
    const result = await onResend();
    setLoading(false);

    if (result.success) {
      setCountDown(60);
      setOtp("");
    } else {
      setErrorMsg(result.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau");
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCountDown(60);
      setOtp("");
      setErrorMsg("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (countDown <= 0) return;
    const timer = setInterval(() => {
      setCountDown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-gray-900/50 z-[100] flex items-center justify-center">
      {loading && <Loading />}

      <div className="p-6 bg-white rounded-lg space-y-5 w-96 shadow-xl border border-gray-100">
        <div className="text-center space-y-2">
          <h1 className="text-xl text-blue-600 font-semibold uppercase">{title}</h1>
          <p className="text-sm text-gray-600">
            {message}
            <br />
            <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500">Bạn vui lòng kiểm tra và điền mã xác thực</p>
        </div>

        <div className="space-y-3">
          <InputLegend
            label="OTP"
            require={true}
            input={{
              type: "text",
              placeholder: "Nhập mã OTP",
              value: otp,
              onChange: (e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                setErrorMsg("");
              },
              maxLength: 6,
            }}
            errorMess={errorMsg}
          />

          <div>
            <p className="text-blue-600 text-center font-mono font-medium">
              {convertToTime()}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-500">Chưa nhận được mã?</span>
            <button
              type="button"
              disabled={countDown > 0}
              className={`font-medium ${
                countDown > 0 ? "text-gray-300 cursor-not-allowed" : "text-primary hover:underline"
              }`}
              onClick={handleResend}
            >
              Gửi lại
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button variant="primary" type="button" onClick={onSubmitOtp}>
            Xác nhận
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>
            Hủy bỏ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
