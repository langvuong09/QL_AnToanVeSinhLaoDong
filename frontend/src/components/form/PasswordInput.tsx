import clsx from "clsx"
import FormField from "./FormField"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

type PasswordInputProps = {
  label: string,
  required?: boolean,
  classname?: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  disabled?: boolean,
  error?: string
}

export default function PasswordInput({
  label,
  required,
  classname,
  value,
  onChange,
  disabled = false,
  error
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      label={label}
      required={required}
      error={error}
    >
      <div className="relative">
        <input
          placeholder="Nhập mật khẩu"
          className={clsx(
            "outline-none ps-4 pt-1 py-2.5 w-full disabled:bg-gray-100 disabled:cursor-not-allowed",
            {
              "border-red-500": error
            },
            classname
          )}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />

        <button
          onClick={() => setShowPassword(!showPassword)}
          type="button"
          disabled={disabled}
          className="disabled:opacity-50 absolute top-1/2 right-0 translate-y-[-60%] me-4"
        >
          {showPassword ? (
            <Eye
              size={20}
              className="cursor-pointer text-primary"
            />
          ) : (
            <EyeOff
              size={20}
              className="cursor-pointer text-primary"
            />
          )}
        </button>
      </div>
    </FormField>
  )
}