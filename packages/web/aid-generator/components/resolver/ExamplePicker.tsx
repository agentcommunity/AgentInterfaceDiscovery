'use client';

import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface ExamplePickerProps {
  handleExampleClick: (domain: string) => void;
}

export function ExamplePicker({ handleExampleClick }: ExamplePickerProps) {
  return (
    <div className="w-full max-w-2xl px-4 mt-2 text-center">
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-1.5">Examples</p>
        <div className="flex flex-wrap gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => handleExampleClick('simple.aid.agentcommunity.org')}>simple</Button>
            <Button variant="outline" size="sm" onClick={() => handleExampleClick('mixed.aid.agentcommunity.org')}>mixed-mode</Button>
            <Button variant="outline" size="sm" onClick={() => handleExampleClick('multi.aid.agentcommunity.org')}>multi-remote</Button>
            <Button variant="outline" size="sm" onClick={() => handleExampleClick('edge-case.aid.agentcommunity.org')}>edge-case</Button>
            <Button variant="outline" size="sm" onClick={() => handleExampleClick('agentcommunity.org')}>fully spec compliant</Button>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Real-World Showcase</p>
        <div className="flex flex-wrap gap-2 justify-center">
             <Button variant="outline" size="sm" onClick={() => handleExampleClick('auth0.aid.agentcommunity.org')} className="border-primary/50 hover:bg-primary/10 text-primary hover:text-primary">
                <Star size={12} className="mr-2 fill-current" />
                auth0-mcp
            </Button>
        </div>
      </div>
    </div>
  );
} 