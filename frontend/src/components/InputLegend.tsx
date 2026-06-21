'use client'

import { InputHTMLAttributes, useState } from "react";

export type InputLegendProps = {
    label?: string;
    require?: boolean;
    errorMess?: string;

    input: InputHTMLAttributes<HTMLInputElement>,

    fillWhite?: boolean;
    isSmall?: boolean;
    suffix?: React.ReactNode;
}

const InputLegend = ({
    label, require, errorMess, input, fillWhite, isSmall, suffix
}: InputLegendProps) => {
    const classname = `outline-none w-full bg-transparent peer ${isSmall ? "text-sm px-2 pb-1.5 pt-2" : "px-2.5 pb-2 pt-3"} ${suffix ? "pr-16" : ""}`;
    const value = input.value || "";

    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState(false);

    const togglePasswordVisibility = () => {
        if (input.disabled) return;
        setIsShowPassword(prev => !prev);
    }

    return (
        <div className="flex flex-col gap-2 flex-1">
            <div className={`relative 
                ${fillWhite && "bg-white"} 
                ${input.disabled ? "bg-gray-100 border border-gray-400 text-gray-600" : `ring ${errorMess ? "ring-red-600" : "ring-gray-400 focus-within:ring-blue-500 focus-within:ring-2"}`} 
                rounded-sm
                `}>
                {/* Input */}
                <input
                    {...input}
                    className={classname}
                    type={
                        input.type === "password"
                            ? (isShowPassword ? "text" : "password")
                            : input.type
                    }
                    value={value}
                    onFocus={(e) => {
                        input.onFocus?.(e);
                        setIsFocused(true);
                    }}
                    onBlur={(e) => {
                        input.onBlur?.(e);
                        setIsFocused(false);
                    }}
                    placeholder={!label ? input.placeholder : ""}
                />

                {/* Suffix */}
                {suffix && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center">
                        {suffix}
                    </div>
                )}

                {/* Eye button */}
                {input.type === "password" && (
                    <button
                        type="button"
                        onClick={() => !input.disabled && setIsShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        <i className={`fa-regular ${isShowPassword ? "fa-eye" : "fa-eye-slash"}`} />
                    </button>
                )}
                {/* Label */}
                {label && (
                    <label
                        className={`absolute text-gray-500 text-[15px] bg-white transition-all duration-200 
                            top-1/2 -translate-y-1/2 left-2.5
                            peer-focus:top-0 
                            ${errorMess ? "peer-focus:text-red-600" : "peer-focus:text-blue-500"} peer-focus:text-sm

                            peer-[:not(:placeholder-shown)]:top-0 
                            `}
                        htmlFor={input.id}
                    >
                        {label}

                        {require && (
                            <span className={`text-red-600 ${isFocused ? "inline" : "hidden"}`}> *</span>
                        )}
                    </label>
                )}
            </div>

            {errorMess && (
                <p className="text-red-600 text-xs">{errorMess}</p>
            )}
        </div>
    )
}

export default InputLegend;