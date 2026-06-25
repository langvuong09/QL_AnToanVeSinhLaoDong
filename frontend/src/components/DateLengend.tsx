'use client'

import { useState, useEffect, useRef } from "react";

const LOCALE = {
    vi: {
        months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
        days: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    },
    en: {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    },
};

type Lang = 'vi' | 'en';

type DatePickerProps = {
    label?: string;
    require?: boolean;

    errorMess?: string;
    errorInput?: string;

    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    id?: string;
    defaultLang?: Lang;

    fillWhite?: boolean;
    isSmall?: boolean;
    maxDate?: string;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function isoToDisplay(iso: string): string {
    if (!iso) return '';
    const [yyyy, mm, dd] = iso.split('-');
    if (!yyyy || !mm || !dd) return '';
    return `${dd}/${mm}/${yyyy}`;
}

function displayToIso(display: string): string {
    const parts = display.split('/');
    if (parts.length !== 3) return '';
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm}-${dd}`;
}

export default function DatePicker({ label, require, errorMess, errorInput, value, onChange, disabled, id, defaultLang = 'vi', fillWhite, isSmall, maxDate }: DatePickerProps) {
    const today = new Date();
    const [lang, setLang] = useState<Lang>(defaultLang);

    const [inputVal, setInputVal] = useState(isoToDisplay(value ?? ''));
    const [showCal, setShowCal] = useState(false);
    const [curYear, setCurYear] = useState(today.getFullYear());
    const [curMonth, setCurMonth] = useState(today.getMonth());
    const [selected, setSelected] = useState<{ y: number; m: number; d: number } | null>(null);

    const [isInternalErr, setIsInternalErr] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const getMaxDate = (): Date | null => {
        if (!maxDate) return null;
        if (maxDate === 'today') {
            const d = new Date();
            d.setHours(23, 59, 59, 999);
            return d;
        }
        const d = new Date(maxDate);
        if (!Number.isNaN(d.getTime())) {
            d.setHours(23, 59, 59, 999);
            return d;
        }
        return null;
    };
    const maxD = getMaxDate();

    useEffect(() => {
        setInputVal(isoToDisplay(value ?? ''));
    }, [value]);

    const L = LOCALE[lang];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) setShowCal(false);
        };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    useEffect(() => {
        const maxDVal = getMaxDate();
        if (maxDVal) {
            const maxYear = maxDVal.getFullYear();
            const maxMonth = maxDVal.getMonth();
            if (curYear > maxYear) {
                setCurYear(maxYear);
                setCurMonth(maxMonth);
            } else if (curYear === maxYear && curMonth > maxMonth) {
                setCurMonth(maxMonth);
            }
        }
    }, [curYear, curMonth, maxDate]);

    const handleDayClick = (y: number, m: number, d: number) => {
        const cellDate = new Date(y, m, d);
        if (maxD && cellDate > maxD) {
            return;
        }
        setSelected({ y, m, d });
        const display = `${pad(d)}/${pad(m + 1)}/${y}`;
        const iso = `${y}-${pad(m + 1)}-${pad(d)}`;
        setInputVal(display);
        setIsInternalErr(false);
        onChange?.(iso); 
        setShowCal(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const prev = inputVal;

        if (raw.length < prev.length) {
            if (prev[raw.length] === '/') {
                setInputVal(raw.slice(0, -1));
            } else {
                setInputVal(raw);
            }
            return;
        }

        let digits = raw.replace(/\D/g, '');
        let formatted = '';
        if (digits.length <= 2) {
            formatted = digits;
        } else if (digits.length <= 4) {
            formatted = digits.slice(0, 2) + '/' + digits.slice(2);
        } else {
            formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8);
        }
        setInputVal(formatted);
    };

    const handleInputBlur = () => {
        if (!inputVal) {
            setIsInternalErr(false);
            onChange?.('');
            return;
        }
        const parts = inputVal.split('/');
        if (parts.length === 3) {
            const [dd, mm, yyyy] = parts.map(Number);
            const dt = new Date(yyyy, mm - 1, dd);
            if (dt.getFullYear() === yyyy && dt.getMonth() === mm - 1 && dt.getDate() === dd && yyyy > 1900) {
                setSelected({ y: yyyy, m: mm - 1, d: dd });
                setCurYear(yyyy);
                setCurMonth(mm - 1);
                setIsInternalErr(false);
                onChange?.(displayToIso(inputVal));
                return;
            }
        }

        setIsInternalErr(true);
        onChange?.("");
    };

    const firstDay = new Date(curYear, curMonth, 1).getDay();
    const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
    const prevMonthDays = new Date(curYear, curMonth, 0).getDate();
    const cells: { d: number; isOther: boolean }[] = [];
    for (let i = 0; i < firstDay; i++) cells.push({ d: prevMonthDays - firstDay + 1 + i, isOther: true });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ d, isOther: false });
    const rem = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
    for (let i = 1; i <= rem; i++) cells.push({ d: i, isOther: true });

    const maxYear = maxD ? maxD.getFullYear() : today.getFullYear() + 20;
    const yearRange = Array.from({ length: 121 }, (_, i) => today.getFullYear() + 20 - i)
        .filter(y => y <= maxYear);
    const displayError = errorMess;
    const isNextDisabled = !!(maxD && (curYear > maxD.getFullYear() || (curYear === maxD.getFullYear() && curMonth >= maxD.getMonth())));

    return (
        <div className="flex flex-col gap-2 flex-1">
            <div ref={containerRef} className="relative">
                <div className={`relative ${disabled ? 'bg-gray-100' : fillWhite ? 'bg-white': ''} ring ${displayError || isInternalErr ? 'ring-red-600' : 'ring-gray-400 focus-within:ring-blue-500 focus-within:ring-2'} ${isSmall ? 'px-2 py-[5.5px] text-sm': 'px-2.5 py-[9.5px]'} rounded-sm`}>
                    {label && (
                        <label className="absolute bg-white bottom-full translate-y-1/2 text-sm px-1 text-gray-500" htmlFor={id}>
                            {label}
                            {require && <span className="text-red-600">{" "}*</span>}
                        </label>
                    )}
                    <div className="flex items-center gap-2">
                        <input id={id} className="outline-none w-full bg-transparent" type="text"
                            placeholder="dd/mm/yyyy" maxLength={10} value={inputVal}
                            onChange={handleInputChange} onBlur={handleInputBlur} disabled={disabled} />
                        <button type="button" onClick={() => !disabled && setShowCal(v => !v)}
                            className="text-gray-400 hover:text-gray-600 shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                        </button>
                    </div>
                </div>

                {showCal && (
                    <div className="absolute top-[calc(100%+6px)] left-0 bg-white border border-gray-200 rounded-xl z-50 w-67 p-3 space-y-5">
                        <div className="flex items-center gap-1.5 mb-2.5">
                            <select value={curMonth} onChange={e => setCurMonth(+e.target.value)}
                                className="border border-gray-200 rounded-md px-1.5 py-1 text-xs font-medium flex-1 outline-none bg-white text-gray-700">
                                {L.months.map((m, i) => {
                                    const isMonthDisabled = !!(maxD && curYear === maxD.getFullYear() && i > maxD.getMonth());
                                    return (
                                        <option key={i} value={i} disabled={isMonthDisabled}>
                                            {m}
                                        </option>
                                    );
                                })}
                            </select>
                            <select value={curYear} onChange={e => setCurYear(+e.target.value)}
                                className="border border-gray-200 rounded-md px-1.5 py-1 text-xs font-medium w-17 outline-none bg-white text-gray-700">
                                {yearRange.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <div className="flex gap-0.5 shrink-0">
                                <button onClick={() => { if (curMonth === 0) { setCurMonth(11); setCurYear(y => y - 1); } else setCurMonth(m => m - 1); }}
                                    className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 text-xs">{"<"}</button>
                                <button 
                                    onClick={() => { 
                                        if (isNextDisabled) return;
                                        if (curMonth === 11) { setCurMonth(0); setCurYear(y => y + 1); } else setCurMonth(m => m + 1); 
                                    }}
                                    disabled={isNextDisabled}
                                    className={`w-6 h-6 flex items-center justify-center border border-gray-200 rounded text-gray-500 hover:bg-gray-50 text-xs ${isNextDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}>{">"}</button>
                            </div>
                        </div>
                        <div className="flex w-fit border border-gray-200 rounded overflow-hidden shrink-0">
                            {(['vi', 'en'] as Lang[]).map(l => (
                                <button key={l} onClick={() => setLang(l)}
                                    className={`px-2 py-0.5 text-[11px] font-medium transition-colors ${lang === l ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                                    {l.toUpperCase()}
                                </button>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 mb-1">
                            {L.days.map(d => <div key={d} className="text-center text-[11px] text-gray-400 font-medium py-0.5">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5">
                            {cells.map((cell, i) => {
                                if (cell.isOther) return <div key={i} className="w-full h-8 text-xs text-gray-300 flex items-center justify-center">{cell.d}</div>;
                                const isSel = selected?.y === curYear && selected?.m === curMonth && selected?.d === cell.d;
                                const isToday = cell.d === today.getDate() && curMonth === today.getMonth() && curYear === today.getFullYear();
                                const cellDate = new Date(curYear, curMonth, cell.d);
                                const isFuture = !!(maxD && cellDate > maxD);
                                return (
                                    <button 
                                        key={i} 
                                        onClick={() => !isFuture && handleDayClick(curYear, curMonth, cell.d)}
                                        disabled={isFuture}
                                        className={`h-8 text-xs rounded-md flex items-center justify-center transition-colors w-full
                                            ${isFuture 
                                                ? 'text-gray-300 cursor-not-allowed bg-transparent' 
                                                : isSel 
                                                    ? 'bg-green-500 text-white font-medium' 
                                                    : isToday 
                                                        ? 'text-green-600 font-medium hover:bg-gray-100' 
                                                        : 'text-gray-700 hover:bg-gray-100'
                                            }`}>
                                        {cell.d}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            {displayError && <p className="text-red-500 text-xs">{displayError}</p>}
            {isInternalErr && <p className="text-red-500 text-xs">{errorInput}</p>}
        </div>
    );
}