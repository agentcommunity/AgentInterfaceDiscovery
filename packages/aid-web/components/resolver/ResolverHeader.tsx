'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResolverHeaderProps {
  hasStarted: boolean;
  onReset: () => void;
}

export function ResolverHeader({ hasStarted, onReset }: ResolverHeaderProps) {
  return (
    <header className="relative py-6 md:py-8 border-b border-border/50 bg-background">
      {/* Reset button positioned absolutely */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <AnimatePresence>
          {hasStarted && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: -20 }} 
              animate={{ opacity: 1, scale: 1, x: 0 }} 
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="outline" onClick={onReset} className="shadow-sm hover:shadow-md transition-shadow text-sm">
                <RotateCcw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main header content */}
      <div className="container mx-auto container-padding">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            AID <span className="text-muted-foreground">Resolver</span>
          </h1>
          
          <p className="text-muted-foreground max-w-lg mx-auto">
            Discover agent capabilities instantly from any domain. Watch the resolution process unfold in real-time.
          </p>
        </div>
      </div>
    </header>
  );
} 