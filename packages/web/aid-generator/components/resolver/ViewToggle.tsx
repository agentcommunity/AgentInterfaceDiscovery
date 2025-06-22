'use client';

import { Button } from '@/components/ui/button';
import { Eye, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'preview' | 'raw';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
      <Button
        variant={viewMode === 'preview' ? 'default' : 'ghost'}
        size="sm"
        className="rounded-full flex items-center gap-2"
        onClick={() => onViewModeChange('preview')}
      >
        <Eye size={16} />
        Preview
      </Button>
      <Button
        variant={viewMode === 'raw' ? 'default' : 'ghost'}
        size="sm"
        className="rounded-full flex items-center gap-2"
        onClick={() => onViewModeChange('raw')}
      >
        <Code size={16} />
        Raw aid.json
      </Button>
    </div>
  );
} 