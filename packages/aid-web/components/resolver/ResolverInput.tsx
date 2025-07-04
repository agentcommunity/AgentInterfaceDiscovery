'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizontal, Loader2 } from 'lucide-react';

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
      className="w-full max-w-2xl px-3 md:px-4 flex-shrink-0"
    >
      <form onSubmit={submitForm} className="relative w-full">
        <div className="relative group">
          <Input
            placeholder={isStreaming ? "Processing..." : "Enter domain (e.g., agentcommunity.org)..."}
            className="w-full rounded-full h-11 md:h-12 pl-4 md:pl-5 pr-11 md:pr-12 text-sm md:text-base bg-background border-border focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all duration-200 shadow-sm focus:shadow-md backdrop-blur-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isStreaming}
          />
          <Button
            type="submit"
            disabled={isStreaming || !inputValue.trim()}
            className="absolute right-1.5 md:right-2 top-1/2 -translate-y-1/2 h-8 w-8 md:h-8 md:w-8 rounded-full p-0 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-sm"
          >
            {isStreaming ? (
              <Loader2 size={14} className="md:hidden animate-spin" />
            ) : (
              <SendHorizontal size={14} className="md:hidden" />
            )}
            {isStreaming ? (
              <Loader2 size={16} className="hidden md:block animate-spin" />
            ) : (
              <SendHorizontal size={16} className="hidden md:block" />
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
} 