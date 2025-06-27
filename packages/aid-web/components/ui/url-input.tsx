"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, ShieldX, Ban } from "lucide-react"

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
  const [internalValue, setInternalValue] = useState(value)

  // Sync with external state changes (e.g., loading a sample)
  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const unformatValue = (val: string): string => {
    if (stripProtocol) {
      return val.replace(/^https?:\/\//, "")
    }
    return val
  }

  const handleFocus = () => {
    // Prepend https:// on focus if autoHttps is on, field has content, and no protocol exists.
    if (autoHttps && internalValue && !/:\/\//.test(internalValue)) {
      setInternalValue(`https://${internalValue}`)
    }
  }

  const handleBlur = () => {
    // When leaving the field, ensure the parent form state gets the correctly formatted value.
    onChange(unformatValue(internalValue))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow free-form typing, giving the user full control.
    const newValue = e.target.value
    setInternalValue(newValue)

    // If we're not stripping the protocol, update the parent on every change.
    if (!stripProtocol) {
      onChange(newValue)
    }
  }

  const isHttps = internalValue.startsWith("https://")
  const isHttp = internalValue.startsWith("http://")

  return (
    <div className="relative">
      <Input
        value={internalValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={className ? `${className} pr-24` : "pr-24"} // Add padding to avoid overlapping the badge
        disabled={disabled}
      />
      {internalValue && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {isHttps ? (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              HTTPS
            </Badge>
          ) : isHttp ? (
            <Badge variant="destructive" className="text-xs bg-yellow-100 text-yellow-600 border-yellow-200">
              <ShieldX className="w-3 h-3 mr-1" />
              HTTP
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-gray-200">
              <Ban className="w-3 h-3 mr-1" />
              No Protocol
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
