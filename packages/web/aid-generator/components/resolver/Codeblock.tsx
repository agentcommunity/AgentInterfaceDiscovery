'use client';

import { CopyButton } from './CopyButton';

interface CodeblockProps {
  content: string;
  title?: string;
  className?: string;
}

export function Codeblock({ content, title, className }: CodeblockProps) {
  return (
    <div className="bg-muted/50 rounded-lg border my-2">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <p className="text-sm font-medium text-muted-foreground">
          {title || 'Code'}
        </p>
        <CopyButton textToCopy={content} />
      </div>
      <div className="relative p-4">
        <pre className="text-sm whitespace-pre-wrap break-all">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
} 