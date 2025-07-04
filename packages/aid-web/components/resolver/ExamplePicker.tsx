'use client';

import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface ExamplePickerProps {
  handleExampleClick: (domain: string) => void;
}

export function ExamplePicker({ handleExampleClick }: ExamplePickerProps) {
  return (
    <div className="w-full max-w-2xl px-3 md:px-4 mt-3 text-center space-y-3">
      {/* Demo Examples */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Examples</p>
        <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick('simple.aid.agentcommunity.org')}
            className="h-8 px-2.5 md:px-3 text-xs touch-manipulation"
          >
            simple
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick('mixed.aid.agentcommunity.org')}
            className="h-8 px-2.5 md:px-3 text-xs touch-manipulation"
          >
            mixed-mode
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick('multi.aid.agentcommunity.org')}
            className="h-8 px-2.5 md:px-3 text-xs touch-manipulation"
          >
            multi-remote
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick('edge.aid.agentcommunity.org')}
            className="h-8 px-2.5 md:px-3 text-xs touch-manipulation"
          >
            edge-case
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick('agentcommunity.org')}
            className="h-8 px-2.5 md:px-3 text-xs touch-manipulation"
          >
            spec-compliant
          </Button>
        </div>
      </div>

      {/* Real-World Examples */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Real-World</p>
        <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick('auth0.agentdomain.xyz')}
            className="h-8 px-2.5 md:px-3 text-xs border-primary/30 text-primary hover:bg-primary/5 touch-manipulation"
          >
            <Star size={10} className="mr-1 fill-current" />
            auth0-mcp
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleExampleClick('supabase.agentdomain.xyz')}
            className="h-8 px-2.5 md:px-3 text-xs border-primary/30 text-primary hover:bg-primary/5 touch-manipulation"
          >
            <Star size={10} className="mr-1 fill-current" />
            supabase
          </Button>
        </div>
      </div>
    </div>
  );
} 