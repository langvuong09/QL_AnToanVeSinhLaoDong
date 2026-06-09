'use client'

import PasswordInput from "@/src/components/form/PasswordInput";
import TextInput from "@/src/components/form/TextInput";
import Alert from "@/src/components/ui/Alert";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Auth } from "@/src/api/Auth";
import { NotificateContext } from "@/src/contexts/notificate/notificate";

type ViewActivity = {
  get: boolean;
  roleId: number;
}

type View = {
  id: number;
  name: string;
  activities: ViewActivity[];
  url: string;
  icon: string;
  parentId: number | null;
  doet_id: number | null;
  order: number;
  value: ViewActivity;
}

type LoginResponse = {
  data?: {
    token?: string;
    views?: View[];
  };
  code: number;
  message: string;
  success: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const notificate = useContext(NotificateContext);

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    return account.trim() !== "" && password.trim() !== "";
  }

  const saveAuthData = (data: LoginResponse["data"]) => {
    if (!data?.token) return;

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("accessToken", data.token);
    storage.setItem("views", JSON.stringify(data.views || []));
  }

  const handleLoginSuccess = (result: LoginResponse) => {
    saveAuthData(result.data);

    notificate?.showNotification({ type: "error", message: "Vui lòng điền đầy đủ thông tin" });


    setAccount("");
    setPassword("");

    router.replace("/dashboard");
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      notificate?.showNotification({ type: "error", message: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    setLoading(true);

    try {
      const auth = new Auth();
      const result = await auth.Login(account, password) as LoginResponse;

      const isValid =
        result.success &&
        result.code >= 200 &&
        result.code < 300 &&
        !!result.data?.token;

      if (isValid) {
        handleLoginSuccess(result);
      }

    } catch (error: unknown) {

      notificate?.showNotification({ type: "error", message: "Tài khoản hoặc mật khẩu không đúng. Xin vui lòng thử lại" });

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="shadow-3drops p-8 flex flex-col justify-center items-center rounded-2xl ">

        {/* logo */}
        <div className="h-30 w-30">
          <img
            className="h-full w-full"
            src="quochuy.png"
            alt="quochuy"
          />
        </div>

        {/* title */}
        <div className="flex flex-col items-center font-bold py-3 text-2xl my-8">
          <h1 className="text-center">Phần Mềm Quản Lý - Tạo Lập Cơ Sở Dữ Liệu</h1>
          <h1>An Toàn Vệ Sinh Lao Động</h1>
        </div>

        {/* alerts */}
        <div className="w-full mb-4">
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
        </div>

        {/* form login */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
          <h2 className="text-primary font-bold text-lg">ĐĂNG NHẬP</h2>

          <TextInput
            label="Tài khoản"
            placeholder="Nhập tài khoản"
            required={true}
            value={account}
            onChange={(e) => {
              setAccount(e.target.value);
            }}
          />

          <PasswordInput
            label="Mật khẩu"
            required={true}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="cursor-pointer w-5 h-5"
              />
              <label htmlFor="rememberMe" className="ps-3 cursor-pointer">Nhớ đăng nhập</label>
            </div>

            <Link
              className="text-primary font-medium text-sm hover:underline"
              href={'/forgot-password'}
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* buttons */}
          <div className="flex flex-col gap-2 py-3">
            <Button
              variant="primary"
              type="submit"
              loading={loading}
            >
              Đăng nhập
            </Button>

            <Button
              variant="outline"
              type="button"
              disabled={loading}
            >
              Đăng ký tài khoản doanh nghiệp
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}