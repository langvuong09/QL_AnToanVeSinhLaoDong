import { SelectHTMLAttributes } from "react";

type SelectLegendProps = {
    label?: string;
    require?: boolean;
    errorMess?: string;

    select: SelectHTMLAttributes<HTMLSelectElement>;
    children?: React.ReactNode;

    fillWhite?: boolean;
}

const SelectLegend = ({
    label, require, select, errorMess, children, fillWhite
}: SelectLegendProps) => {
    const classname = `outline-none w-full`;

    return (
        <div className="flex flex-col gap-2">
            <div className={`relative ${fillWhite && "bg-white"} ${select.disabled ? "bg-gray-100 border border-gray-400 text-gray-600" : `ring ${errorMess ? "ring-red-600" : "ring-gray-400 focus-within:ring-blue-500 focus-within:ring-2"}`} px-3 py-2 rounded-lg`}>
                {label && (
                    <label
                        className="absolute bg-white bottom-full translate-y-1/2 text-sm text-gray-500 px-1"
                        htmlFor={select.id}
                    >
                        {label}
                        {require && <span className="text-red-600">*</span>}
                    </label>
                )}
                <select
                    className={classname}
                    {...select}
                >
                    {children}
                </select>
            </div>

            {errorMess && (
                <p className="text-red-600 text-xs">{errorMess}</p>
            )}
        </div>
    )
}

export default SelectLegend;
