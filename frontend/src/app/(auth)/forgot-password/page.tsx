'use client'

import TextInput from "@/src/components/form/TextInput";
import Button from "@/src/components/ui/Button";

export default function LoginPage() {

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="shadow-lg p-4 flex flex-col justify-center items-center rounded-2xl">

        {/* logo */}
        <div className="h-20 w-20">
          <img
            className="h-full w-full"
            src="quochuy.png"
            alt="quochuy"
          />

        </div>

        {/* title */}
        <h1 className="font-bold py-3 text-2xl text-primary">QUÊN MẬT KHẨU</h1>


        <div className="flex flex-col gap-4 w-full">
          <p className="">Vui lòng nhập email đã đăng ký tài khoản</p>

          <TextInput
            label="Email"
            placeholder="Nhập tài khoản"
            required={true}
          />

          {/* buttons */}
          <div className="flex flex-col gap-2 py-3">
            <Button
              variant="primary"
              type="button"
            >Đăng nhập</Button>

            <Button
              variant="outline"
              type="button"
            >Đăng ký tài khoản doanh nghiệp</Button>
          </div>
        </div>
      </div>
    </div>
  )
}