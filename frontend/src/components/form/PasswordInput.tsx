import { HTMLInputTypeAttribute } from "react"
import InputLegend from "../InputLegend"

type PasswordInputProps = {
  label: string
  required?: boolean
  classname?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  error?: string
}

export default function PasswordInput({
  label,
  required,
  classname,
  placeholder = "Nhập mật khẩu",
  value,
  onChange,
  disabled = false,
  error
}: PasswordInputProps) {
  return (
    <InputLegend
      label={label}
      require={required}
      errorMess={error}
      input={{
        type: "password" as HTMLInputTypeAttribute,
        placeholder: placeholder,
        value: value,
        onChange: onChange,
        disabled: disabled,
        className: classname,
      }}
    />
  )
}