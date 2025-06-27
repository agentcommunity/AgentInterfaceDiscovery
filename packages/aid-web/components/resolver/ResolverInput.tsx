'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal } from 'lucide-react';

interface ResolverInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isStreaming: boolean;
  hasStarted: boolean;
  submitForm: (e: React.FormEvent) => void;
}

export function ResolverInput({
  inputValue,
  setInputValue,
  isStreaming,
  hasStarted,
  submitForm,
}: ResolverInputProps) {
  return (
    <motion.div
      layout
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: hasStarted ? 0 : 1 }}
      className="w-full max-w-2xl px-4 flex-shrink-0"
    >
      <form onSubmit={submitForm} className="relative w-full">
        <div className="relative group">
          <Input
            placeholder="Enter a domain to resolve..."
            className="w-full rounded-full h-12 pl-5 pr-12 text-md bg-background/80 backdrop-blur-sm focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/50 transition-shadow duration-300 shadow-lg focus:shadow-xl group-focus-within:shadow-2xl"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isStreaming}
          />
          <Button
            type="submit"
            disabled={isStreaming || !inputValue}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full p-0"
          >
            <SendHorizontal size={16} />
          </Button>
        </div>
      </form>
    </motion.div>
  );
} 