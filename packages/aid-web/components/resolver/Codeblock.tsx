'use client';

import { CopyButton } from './CopyButton';

interface CodeblockProps {
  title?: string;
  content: string;
  variant?: 'default' | 'inline';
}

export function Codeblock({ title, content, variant = 'default' }: CodeblockProps) {
  const lines = content.split('\n');

  if (variant === 'inline') {
    // Lightweight version for chat messages and inline use
    return (
      <div className="rounded-md bg-muted/50 border border-border/30 text-foreground my-2 overflow-hidden">
        {title && (
          <div className="flex items-center justify-between px-3 py-2 bg-muted/30 border-b border-border/30">
            <h4 className="font-mono text-xs font-medium text-muted-foreground">{title}</h4>
            <CopyButton textToCopy={content} />
          </div>
        )}
        <div className="px-3 py-2 font-mono text-xs">
          <pre className="overflow-x-auto">
            <code>
              {lines.map((line, index) => (
                <div key={index} className="table-row">
                  <span className="table-cell pr-3 text-right text-muted-foreground/40 select-none text-xs">{index + 1}</span>
                  <span className="table-cell">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    );
  }

  // Default version with card styling for standalone use
  return (
    <div className="rounded-lg border border-border/50 bg-card text-card-foreground shadow-soft my-4">
      {title && (
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-mono text-sm font-semibold text-muted-foreground">{title}</h3>
          <CopyButton textToCopy={content} />
        </div>
      )}
      <div className="relative p-4 font-mono text-sm">
        <pre className="overflow-x-auto">
          <code>
            {lines.map((line, index) => (
              <div key={index} className="table-row">
                <span className="table-cell pr-4 text-right text-muted-foreground/50 select-none">{index + 1}</span>
                <span className="table-cell">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
} 