'use client'

import { useEffect, useRef, useState } from "react"
import InputLegend, { InputLegendProps } from "./InputLegend"

type Item = {
  key: string;
  value: string;
}

type SelectInputProps = {
  inputLengend: InputLegendProps;
  items?: Item[];
  value?: string;
  freeInput?: boolean; 
  onChange: (item: Item) => void;
  onSearch?: (search: string) => void;
  isSmall?: boolean;
}

const SelectInputLengend = ({ inputLengend, items = [], value, freeInput = false, onChange, onSearch, isSmall }: SelectInputProps) => {
  const [search, setSearch] = useState(value || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);

        if (freeInput && search) {
          onChange({ key: search, value: search });
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [freeInput, search]);

  const filteredItems = items.filter((item) =>
    item.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: Item) => {
    setSearch(item.value);
    setShowDropdown(false);
    onChange(item);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setShowDropdown(true);
    onSearch?.(val);

    if (!val) {
      onChange({ key: "", value: "" });
      return;
    }

    if (freeInput) {
      onChange({ key: val, value: val });
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <InputLegend
        {...inputLengend}
        input={{
          ...inputLengend.input,
          value: search,
          onChange: handleChange,
          onFocus: () => setShowDropdown(true),
        }}
        isSmall={isSmall}
      />

      {showDropdown && filteredItems.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto text-sm">
          {filteredItems.map((item) => (
            <li
              key={item.key}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer"
              onMouseDown={() => handleSelect(item)}
            >
              {item.value}
            </li>
          ))}
        </ul>
      )}

      {!freeInput && showDropdown && search && filteredItems.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm text-gray-400">
          Không tìm thấy kết quả
        </div>
      )}
    </div>
  );
}

export default SelectInputLengend;