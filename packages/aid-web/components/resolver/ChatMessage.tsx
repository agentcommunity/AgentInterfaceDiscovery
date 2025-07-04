'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessageProps {
  role: ChatRole;
  content: string | React.ReactNode;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "w-full flex px-2 md:px-0",
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn(
        "max-w-[85%] sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-lg px-3 md:px-4 py-2.5 md:py-3 shadow-sm text-sm md:text-base",
        role === 'user'
          ? "bg-primary text-primary-foreground ml-4 md:ml-8"
          : "bg-muted/50 text-foreground border border-border/50 mr-4 md:mr-8"
      )}>
        {typeof content === 'string' ? (
           <div className={cn(
             "prose prose-sm max-w-none prose-pre:whitespace-pre-wrap prose-pre:break-all prose-p:leading-relaxed prose-p:my-1",
             role === 'user' 
               ? "prose-invert prose-headings:text-primary-foreground prose-p:text-primary-foreground/90 prose-code:text-primary-foreground/90" 
               : "dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-code:text-foreground"
           )}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="space-y-2">
            {content}
          </div>
        )}
      </div>
    </motion.div>
  );
} 