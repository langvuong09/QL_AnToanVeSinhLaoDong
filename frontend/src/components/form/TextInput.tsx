import { HTMLInputTypeAttribute } from "react"
import InputLegend from "../InputLegend"

type TextInputProps = {
  label: string
  required?: boolean
  placeholder?: string
  classname?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  disabled?: boolean
  error?: string
}

export default function TextInput({
  label,
  required,
  placeholder,
  classname,
  value,
  onChange,
  type = "text",
  disabled = false,
  error
}: TextInputProps) {
  return (
    <InputLegend
      label={label}
      require={required}
      errorMess={error}
      input={{
        type: type as HTMLInputTypeAttribute,
        placeholder: placeholder,
        value: value,
        onChange: onChange,
        disabled: disabled,
        className: classname,
      }}
    />
  )
}