import { HtmlHTMLAttributes, InputHTMLAttributes } from "react";

type InputLegendProps = {
    label?: string;
    require?: boolean;
    input: InputHTMLAttributes<HTMLInputElement>
}

const InputLegend = ({
    label, input
}: InputLegendProps) => {
    const classname = "outline-none w-full";

    return (
        <div className="relative border border-gray-400 px-3 py-2 my-2 rounded-lg">
            {label && (
                <label
                    className="absolute bg-white bottom-full translate-y-1/2 text-sm text-gray-400 px-1"
                    htmlFor={input.id}
                >
                    {label}
                </label>
            )}
            <input
                className={classname}
                {...input}
            />
        </div>
    )
}

export default InputLegend;