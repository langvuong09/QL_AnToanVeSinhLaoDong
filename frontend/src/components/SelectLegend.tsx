import { SelectHTMLAttributes } from "react";

type SelectLegendProps = {
    label?: string;
    require?: boolean;
    errorMess?: string;

    select: SelectHTMLAttributes<HTMLSelectElement>;
    children?: React.ReactNode;
}

const SelectLegend = ({
    label, require, select, errorMess, children
}: SelectLegendProps) => {
    const classname = `outline-none w-full`;

    return (
        <div className="flex flex-col gap-2">
            <div className={`relative border border-gray-400 px-3 py-2 rounded-lg ${select.disabled && "bg-gray-100"}`}>
                {label && (
                    <label
                        className="absolute bg-white bottom-full translate-y-1/2 text-sm text-gray-400 px-1"
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
