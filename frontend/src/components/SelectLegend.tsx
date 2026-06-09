import { SelectHTMLAttributes } from "react";

type SelectLegendProps = {
    label?: string;
    require?: boolean;
    select: SelectHTMLAttributes<HTMLSelectElement>;
    children?: React.ReactNode;
}

const SelectLegend = ({
    label, select, children
}: SelectLegendProps) => {
    const classname = "outline-none w-full";

    return (
        <div className="relative border border-gray-400 px-3 py-2 my-2 rounded-lg">
            {label && (
                <label
                    className="absolute bg-white bottom-full translate-y-1/2 text-sm text-gray-400 px-1"
                    htmlFor={select.id}
                >
                    {label}
                </label>
            )}
            <select
                className={classname}
                {...select}
            >
                {children}
            </select>
        </div>
    )
}

export default SelectLegend;
