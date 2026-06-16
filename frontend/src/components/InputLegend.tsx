'use client'

import { InputHTMLAttributes, useState } from "react";

type InputLegendProps = {
    label?: string;
    require?: boolean;
    errorMess?: string;

    input: InputHTMLAttributes<HTMLInputElement>,

    fillWhite?: boolean;
}

const InputLegend = ({
    label, require, errorMess, input, fillWhite
}: InputLegendProps) => {
    const classname = `outline-none w-full bg-transparent`;

    const value = input.value || "";

    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        if (input.disabled) return;
        setIsShowPassword(prev => !prev);
    };

    return (
        <div className="flex flex-col gap-2 flex-1">
            <div className={`relative ${fillWhite && "bg-white"} ${input.disabled ? "bg-gray-100 border border-gray-400 text-gray-600" : `ring ${errorMess ? "ring-red-600" : "ring-gray-400 focus-within:ring-blue-500 focus-within:ring-2"}`} px-3 py-2 rounded-lg`}>
                {label && (
                    <label
                        className={`absolute text-gray-500 bg-white bottom-full translate-y-1/2 text-sm px-1`}
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
                        {...input}
                        className={classname}
                        type={
                            input.type === "password"
                                ? (isShowPassword ? "text" : "password")
                                : input.type
                        }
                        value={value}
                    />

                    {input.type === "password" && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="text-gray-600 hover:text-gray-700 shrink-0"
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