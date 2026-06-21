'use client'

import PasswordInput from "@/src/components/form/PasswordInput";
import TextInput from "@/src/components/form/TextInput";
import Alert from "@/src/components/ui/Alert";
import Button from "@/src/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Auth } from "@/src/api/Auth";
import { AuthData } from "@/src/api/types/auth";
import { NotificateContext } from "@/src/contexts/notificate/notificate";
import { AuthenticateContext } from "@/src/contexts/authenticate/authenticate";
import { parseAccessToken } from "@/src/utils/jwt-parser";
import { BusinessTypeApi, type IBusinessType } from "@/src/api/BusinessType";
import { IndustryApi, type IIndustry } from "@/src/api/Industry";
import { DoetApi } from "@/src/api/Doet";
import { Media } from "@/src/api/Media";
import EnterpriseModal from "@/src/components/modals/EnterpriseModal";
import type { EnterpriseFormData, AttachmentGroup } from "@/src/components/modals/EnterpriseStepOne";


type FormErrors = {
  account?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const notificate = useContext(NotificateContext);
  const authenticate = useContext(AuthenticateContext);

  const [errors, setErrors] = useState<FormErrors>({});

  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [businessTypes, setBusinessTypes] = useState<IBusinessType[]>([]);
  const [industries, setIndustries] = useState<IIndustry[]>([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      const [businessTypeResult, industryResult] = await Promise.all([
        new BusinessTypeApi().getAllForBusiness({ page: 1, pageSize: 1000 }),
        new IndustryApi().getAllForBusiness({ page: 1, pageSize: 1000, level: 4 }),
      ]);

      if (businessTypeResult.success) {
        setBusinessTypes(businessTypeResult.data?.items.filter((item) => item.isActive) || []);
      }
      if (industryResult.success) {
        setIndustries((industryResult.data?.items || []).filter((item) => item.level === 4 && item.isActive));
      }
    };

    loadOptions();
  }, []);

  const handleUploadPendingFiles = async (doetId: number, attachments: AttachmentGroup[]) => {
    const media = new Media();
    const failedFiles: string[] = [];

    for (const group of attachments) {
      for (const file of group.files) {
        if (!file.file) continue;
        const formData = new FormData();
        formData.append("fileType", group.fileType);
        formData.append("doetId", String(doetId));
        formData.append("file", file.file);

        try {
          const res = await media.UploadImage(formData);
          if (!res.success) failedFiles.push(file.name);
        } catch {
          failedFiles.push(file.name);
        }
      }
    }

    if (failedFiles.length > 0) {
      throw new Error(`Upload thất bại: ${failedFiles.join(", ")}`);
    }
  };

  const handleRegisterSave = async (form: EnterpriseFormData, attachments: AttachmentGroup[]) => {
    const api = new DoetApi();
    const payload = {
      name: form.companyName.trim(),
      issuedDate: form.gpkdDate,
      businessTypeId: Number(form.businessTypeId),
      industryId: Number(form.industryId),
      foreignName: form.foreignName.trim() || undefined,
      representative: form.representative.trim() || undefined,
      repPhone: form.representativePhone.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      address: form.address.trim() || undefined,
      province: form.gpkdProvinceData,
      district: { key: 0, value: "" },
      ward: form.gpkdWardData,
      taxCode: form.taxCode.trim(),
    };

    const result = await api.create(payload);

    if (!result.success || !result.data) {
      return { success: false, message: result.message };
    }

    try {
      await handleUploadPendingFiles(result.data.id, attachments);
      return {
        success: true,
        message: "Đăng ký doanh nghiệp thành công",
        savedId: result.data.id,
        rawResult: result.data,
      };
    } catch {
      return {
        success: false,
        message: "Doanh nghiệp đã được lưu nhưng upload tài liệu thất bại. Vui lòng liên hệ quản trị viên để hoàn tất tài liệu.",
        savedId: result.data.id,
        rawResult: result.data,
      };
    }
  };


  useEffect(() => {
    const savedAccount = localStorage.getItem("rememberedAccount");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedAccount) {
      setAccount(savedAccount);
      setRememberMe(true);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }

    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      const parsed = parseAccessToken(token);
      if (parsed?.role?.code === 'business') {
        router.replace("/business-info");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!account.trim()) {
      newErrors.account = "Vui lòng nhập tài khoản";
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    setErrors(newErrors);

    return account.trim() !== "" && password.trim() !== "" && Object.keys(newErrors).length === 0;;
  }

  const clearAccountError = () => {
    if (errors.account) {
      setErrors((prev) => ({
        ...prev,
        account: undefined
      }));
    }
  }

  const clearPasswordError = () => {
    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: undefined
      }));
    }
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
      const result = await auth.Login(account, password);
      console.log(result)

      if (result) {

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("accessToken", result.token);
        storage.setItem("refreshToken", result.refreshToken);
        storage.setItem("views", JSON.stringify(result.views || []));

        if (rememberMe) {
          localStorage.setItem("rememberedAccount", account);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedAccount");
          localStorage.removeItem("rememberedPassword");
        }

        const parsed = parseAccessToken(result.token);
        const isBusiness = parsed?.role?.code === 'business';

        await authenticate?.refreshAuth();

        notificate?.showNotification({ type: "success", message: "Đăng nhập thành công." });

        setTimeout(() => {
          if (isBusiness) {
            router.replace("/business-info");
          } else {
            router.replace("/dashboard");
          }
        }, 200);

        return;
      }

      notificate?.showNotification({ type: "error", message: "Có lỗi xảy ra vui lòng thử lại sau." })

    } catch (error: any) {

      notificate?.showNotification({ type: "error", message: error });

    } finally {
      setLoading(false);
    }
  }

  if (showRegisterModal) {
    return (
      <div className="fixed inset-0 z-50 bg-white h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <EnterpriseModal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            onSave={handleRegisterSave}
            isRegister={true}
            businessTypes={businessTypes}
            industries={industries}
          />
        </div>
      </div>
    );
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
              clearAccountError();
            }}

            error={errors.account}
          />

          <PasswordInput
            label="Mật khẩu"
            required={true}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearPasswordError();
            }}

            error={errors.password}
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
              onClick={() => setShowRegisterModal(true)}
            >
              Đăng ký tài khoản doanh nghiệp
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}