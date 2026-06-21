'use client'

import { useEffect, useRef, useState } from "react"
import InputLegend, { InputLegendProps } from "./InputLegend"

type Item = {
  key: string;
  value: string;
}

type YearInputLengendProps = {
  inputLengend: InputLegendProps;
  value?: string;
  onChange: (item: Item) => void;
  onSearch?: (search: string) => void;
}

const YearInputLengend = ({ inputLengend, value, onChange, onSearch }: YearInputLengendProps) => {
  const nowYear = new Date().getFullYear();
  const years: Item[] = Array.from(
    { length: 31 },
    (_, i) => {
      const y = nowYear + 15 - i;
      return { key: String(y), value: String(y) };
    }
  );

  const [search, setSearch] = useState(value || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  useEffect(() => {
    if (showDropdown && value && listRef.current) {
      const el = listRef.current.querySelector(`[data-year="${value}"]`) as HTMLElement;
      if (el) el.scrollIntoView({ block: 'center' });
    }
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setSearch(value || "");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filteredItems = years.filter((item) =>
    item.value.includes(search)
  );

  const handleSelect = (item: Item) => {
    setSearch(item.value);
    setShowDropdown(false);
    onChange(item);
  };

  return (
    <div className="relative" ref={containerRef}>
      <InputLegend
        {...inputLengend}
        input={{
          ...inputLengend.input,
          value: search,
          maxLength: 4,
          onChange: (e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
            setSearch(val);
            setShowDropdown(true);
            onSearch?.(val);
            if (!val) onChange({ key: "", value: "" });
          },
          onFocus: () => setShowDropdown(true),
        }}
      />

      {showDropdown && filteredItems.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto text-sm"
        >
          {filteredItems.map((item) => {
            const isSelected = item.key === value;
            const isCurrentYear = item.key === String(nowYear);
            return (
              <li
                key={item.key}
                data-year={item.key}
                onMouseDown={() => handleSelect(item)}
                className={`px-3 py-2 cursor-pointer transition-colors
                  ${isSelected
                    ? 'bg-blue-500 text-white font-medium'
                    : isCurrentYear
                      ? 'text-blue-600 font-medium hover:bg-blue-50'
                      : 'hover:bg-blue-50'
                  }`}
              >
                {item.value}
              </li>
            );
          })}
        </ul>
      )}

      {showDropdown && search && filteredItems.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg px-3 py-2 text-sm text-gray-400">
          Không tìm thấy kết quả
        </div>
      )}
    </div>
  );
}

export default YearInputLengend;