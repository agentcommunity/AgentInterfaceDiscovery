"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, X } from "lucide-react"

interface UrlInputProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  autoHttps?: boolean
  stripProtocol?: boolean
}

export function UrlInput({
  value = "",
  onChange,
  placeholder,
  className,
  disabled,
  autoHttps = true,
  stripProtocol = false,
}: UrlInputProps) {
  const [inputValue, setInputValue] = useState(value)
  const isFocused = useRef(false)

  const formatValue = (val: string): string => {
    if (!autoHttps || !val || val.includes("://") || val.startsWith("localhost")) {
      return val
    }
    return `https://${val}`
  }

  const unformatValue = (val: string): string => {
    if (stripProtocol) {
      return val.replace(/^https?:\/\//, "")
    }
    return val
  }

  useEffect(() => {
    if (!isFocused.current) {
      setInputValue(value)
    }
  }, [value])

  const handleFocus = () => {
    isFocused.current = true
    if (inputValue) {
      const formatted = formatValue(inputValue)
      if (formatted !== inputValue) {
        setInputValue(formatted)
      }
    }
  }

  const handleBlur = () => {
    isFocused.current = false
    const currentVal = inputValue
    if (currentVal === "https://") {
      setInputValue("")
      onChange("")
    } else {
      // On blur, ensure the parent form state has the right format
      onChange(unformatValue(currentVal))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    // If user deletes the protocol, allow it
    if (inputValue.startsWith("https://") && !rawValue.startsWith("https://")) {
      setInputValue(rawValue)
      onChange(unformatValue(rawValue))
      return
    }

    const formatted = formatValue(rawValue)
    setInputValue(formatted)
    onChange(unformatValue(formatted))
  }

  const isHttps = inputValue.startsWith("https://")

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
        />
        {inputValue && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {isHttps ? (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                HTTPS
              </Badge>
            ) : (
              inputValue && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-gray-200">
                  <X className="w-3 h-3 mr-1" />
                  HTTP
                </Badge>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}
