import { Textarea } from "@/components/ui/textarea"
import { CopyButton } from "@/components/resolver/CopyButton"

interface EditableCodeblockProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  title?: string
  rows?: number
}

export function EditableCodeblock({
  value,
  onChange,
  placeholder = "Paste your JSON or TXT content here...",
  title = "Content",
  rows = 10,
}: EditableCodeblockProps) {
  return (
    <div className="bg-muted/50 rounded-lg border my-2">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <CopyButton textToCopy={value} />
      </div>
      <Textarea
        className="bg-transparent p-4 font-mono text-sm whitespace-pre-wrap break-all min-h-[theme(spacing[40])]"
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
} 