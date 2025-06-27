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
        "w-full flex",
        role === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn(
        "max-w-xl md:max-w-2xl rounded-lg px-4 py-3 shadow-sm",
        role === 'user'
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground"
      )}>
        {typeof content === 'string' ? (
           <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:whitespace-pre-wrap prose-pre:break-all">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          content
        )}
      </div>
    </motion.div>
  );
} 