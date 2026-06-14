'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { IIndustry } from '@/src/api/Industry'

type SearchableSelectProps = {
  label?: string
  require?: boolean
  placeholder?: string
  value: string
  options: IIndustry[]
  disabled?: boolean
  errorMess?: string
  onChange: (value: string) => void
  loading?: boolean
  fallbackSelectedOption?: IIndustry | null
}

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export default function SearchableSelect({
  label,
  require = false,
  placeholder = 'Tìm kiếm nhóm ngành cha...',
  value,
  options,
  disabled = false,
  errorMess,
  onChange,
  loading = false,
  fallbackSelectedOption = null,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isMounted, setIsMounted] = useState(false)

  // Coordinates for the portal overlay dropdown
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Mount logic to avoid Next.js hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Find currently selected option (with fallback lookup)
  const selectedOption = useMemo(() => {
    const found = options.find((opt) => String(opt.id) === value)
    if (found) return found
    if (fallbackSelectedOption && String(fallbackSelectedOption.id) === value) {
      return fallbackSelectedOption
    }
    return undefined
  }, [options, value, fallbackSelectedOption])

  // Sync display input value when selection changes
  useEffect(() => {
    if (selectedOption) {
      setInputValue(`${selectedOption.code} - ${selectedOption.name} - (Cấp ${selectedOption.level})`)
    } else {
      setInputValue('')
    }
  }, [selectedOption])

  // Recalculate coordinates of the input wrapper to align the overlay dropdown
  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Also check if click is on the portal dropdown menu itself
        if (listRef.current && listRef.current.contains(event.target as Node)) {
          return
        }
        setIsOpen(false)
        setSearchTerm('')
        if (selectedOption) {
          setInputValue(`${selectedOption.code} - ${selectedOption.name} - (Cấp ${selectedOption.level})`)
        } else {
          setInputValue('')
        }
      }
    }

    if (isOpen) {
      updateCoords()
      window.addEventListener('resize', updateCoords)
      window.addEventListener('scroll', updateCoords, true)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      window.removeEventListener('resize', updateCoords)
      window.removeEventListener('scroll', updateCoords, true)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, selectedOption])

  // Local filtering based on multiple criteria: code, name, level (accent-insensitive)
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options

    const term = removeAccents(searchTerm.toLowerCase())
    return options.filter((opt) => {
      const codeMatch = removeAccents(opt.code.toLowerCase()).includes(term)
      const nameMatch = removeAccents(opt.name.toLowerCase()).includes(term)
      const levelText = `cap ${opt.level}`
      const levelMatch = levelText.includes(term)
      return codeMatch || nameMatch || levelMatch
    })
  }, [options, searchTerm])

  // Reset activeIndex whenever filteredOptions changes
  useEffect(() => {
    setActiveIndex(-1)
  }, [filteredOptions])

  // Limit displayed options for rendering performance
  const displayOptions = useMemo(() => {
    return filteredOptions.slice(0, 100)
  }, [filteredOptions])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    setSearchTerm(val)
    setIsOpen(true)
    if (val.trim() === '') {
      onChange('')
    }
  }

  const handleSelect = (opt: IIndustry) => {
    onChange(String(opt.id))
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    setInputValue('')
    setSearchTerm('')
  }

  const handleFocus = () => {
    if (!disabled && !loading) {
      updateCoords()
      setIsOpen(true)
      setSearchTerm('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || loading) return

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        updateCoords()
        setIsOpen(true)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev < displayOptions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : displayOptions.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < displayOptions.length) {
          handleSelect(displayOptions[activeIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSearchTerm('')
        if (selectedOption) {
          setInputValue(`${selectedOption.code} - ${selectedOption.name} - (Cấp ${selectedOption.level})`)
        } else {
          setInputValue('')
        }
        break
      default:
        break
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement
      if (activeEl) {
        listRef.current.scrollTo({
          top: activeEl.offsetTop - listRef.current.clientHeight / 2 + activeEl.clientHeight / 2,
          behavior: 'smooth',
        })
      }
    }
  }, [activeIndex])

  const showDropdown = isOpen && !disabled && !loading && isMounted

  return (
    <div ref={containerRef} className="flex flex-col gap-2 flex-1 relative">
      <div
        className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          disabled || loading
            ? 'bg-gray-50 border border-gray-200 cursor-not-allowed select-none'
            : `border ${
                errorMess
                  ? 'border-red-600 focus-within:ring-1 focus-within:ring-red-600'
                  : 'border-gray-400 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'
              }`
        }`}
      >
        {label && (
          <label
            className={`absolute px-1 text-sm transition-colors bottom-full translate-y-1/2 select-none ${
              disabled || loading ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-600'
            }`}
          >
            {label}
            {require && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}

        {/* Input search box */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          placeholder={placeholder}
          className={`outline-none w-full bg-transparent transition-colors ${
            disabled || loading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800'
          }`}
        />

        {/* Action icons */}
        <div className="flex items-center shrink-0 gap-1.5">
          {loading ? (
            <i className="fa-solid fa-spinner fa-spin text-gray-400 text-xs" />
          ) : (
            <>
              {value && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                  title="Xóa lựa chọn"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              )}
              <i
                className={`fa-solid fa-chevron-down text-gray-400 text-[10px] transition-transform duration-200 ${
                  isOpen && !disabled ? 'rotate-180 text-primary' : ''
                }`}
              />
            </>
          )}
        </div>
      </div>

      {errorMess && <p className="text-red-600 text-xs">{errorMess}</p>}

      {/* Options Dropdown Menu (via Portal to avoid overflow-hidden clipping) */}
      {showDropdown &&
        createPortal(
          <div
            ref={listRef}
            style={{
              position: 'absolute',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
            }}
            className="max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] py-1.5 animate-[fadeIn_0.15s_ease-out]"
          >
            {displayOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400 text-center select-none">
                Không tìm thấy ngành phù hợp
              </div>
            ) : (
              <>
                {displayOptions.map((opt, index) => {
                  const isSelected = String(opt.id) === value
                  const isActive = index === activeIndex
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelect(opt)}
                      className={`px-4 py-2 text-sm cursor-pointer transition-colors truncate ${
                        isSelected
                          ? 'bg-primary text-white font-medium'
                          : isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      title={`${opt.code} - ${opt.name} - (Cấp ${opt.level})`}
                    >
                      {opt.code} - {opt.name} - (Cấp {opt.level})
                    </div>
                  )
                })}
                {filteredOptions.length > 100 && (
                  <div className="px-4 py-2 text-xs text-gray-400 text-center bg-gray-50 border-t border-gray-100 select-none">
                    Hiển thị 100 trên {filteredOptions.length} kết quả. Vui lòng nhập từ khóa để tìm kiếm chính xác hơn.
                  </div>
                )}
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}

