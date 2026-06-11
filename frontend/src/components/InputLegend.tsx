'use client'

import { InputHTMLAttributes, useState } from "react";

type InputLegendProps = {
    label?: string;
    require?: boolean;
    errorMess?: string;

    input: InputHTMLAttributes<HTMLInputElement>
}

const InputLegend = ({
    label, require, errorMess, input
}: InputLegendProps) => {
    const classname = "outline-none w-full";

    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setIsShowPassword(!isShowPassword);
    };

    return (
        <div className="flex flex-col gap-2 flex-1">
            <div className={`relative ${input.disabled && "bg-gray-100"} ring ${errorMess ? "ring-red-600" : "ring-gray-400 focus-within:ring-blue-500 focus-within:ring-2"} px-3 py-2 rounded-lg`}>
                {label && (
                    <label
                        className="absolute bg-white bottom-full translate-y-1/2 text-sm text-gray-400 px-1"
                        htmlFor={input.id}
                    >
                        {label}

                        {require && (
                            <span className="text-red-600">{" "}*</span>
                        )}
                    </label>
                )}
                <div className="flex items-center gap-2">
                    <input
                        className={classname}
                        type={input.type === "password" && !isShowPassword ? "password" : input.type === "password" ? "text" : input.type}
                        {...input}
                    />

                    {input.type === "password" && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="text-gray-500 hover:text-gray-700 shrink-0"
                            title={isShowPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {isShowPassword ? (
                                <i className="fa-regular fa-eye"></i>
                            ) : (
                                <i className="fa-regular fa-eye-slash"></i>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {errorMess && (
                <p className="text-red-600 text-xs">{errorMess}</p>
            )}
        </div>
    )
}

export default InputLegend;