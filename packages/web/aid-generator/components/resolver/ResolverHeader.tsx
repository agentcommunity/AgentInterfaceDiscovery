'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResolverHeaderProps {
  hasStarted: boolean;
  onReset: () => void;
}

export function ResolverHeader({ hasStarted, onReset }: ResolverHeaderProps) {
  return (
    <header className="p-4 flex justify-between items-center border-b flex-shrink-0">
      <h1 className="text-xl font-bold">AID Resolver Playground</h1>
      <AnimatePresence>
        {hasStarted && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
            <Button variant="ghost" onClick={onReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 