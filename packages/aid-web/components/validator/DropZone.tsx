"use client"

import { useCallback } from "react"
import { useDropzone, FileRejection } from "react-dropzone"
import { UploadCloud, X, File as FileIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DropZoneProps {
  onFileDrop: (file: File | null) => void
  acceptedMimeTypes?: Record<string, string[]>
  maxFileSize?: number // in bytes
  file: File | null
  title?: string
}

export function DropZone({
  onFileDrop,
  acceptedMimeTypes = { "application/json": [".json"], "text/plain": [".txt"] },
  maxFileSize = 1024 * 1024, // 1MB
  file,
  title = "Configuration File",
}: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        // TODO: Handle rejection with a toast notification
        console.error("File rejected:", fileRejections)
        onFileDrop(null)
        return
      }
      if (acceptedFiles.length > 0) {
        onFileDrop(acceptedFiles[0])
      }
    },
    [onFileDrop],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedMimeTypes,
    maxSize: maxFileSize,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        "border-muted-foreground/20 hover:border-primary/60",
        isDragActive && "border-primary bg-primary/10",
      )}
    >
      <input {...getInputProps()} />
      {file ? (
        <div className="flex flex-col items-center gap-2">
          <FileIcon className="w-12 h-12 text-muted-foreground" />
          <p className="font-medium">{file.name}</p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onFileDrop(null)
            }}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <UploadCloud className="w-12 h-12" />
          <p className="font-medium">{title}</p>
          <p className="text-sm">
            {isDragActive ? "Drop the file here ..." : "Drag & drop a file here, or click to select"}
          </p>
          <p className="text-xs">Max file size: {maxFileSize / (1024 * 1024)}MB</p>
        </div>
      )}
    </div>
  )
} 