'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  handleExampleClick: (domain: string) => void;
}

export function WelcomeScreen({ handleExampleClick }: WelcomeScreenProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center"
    >
      <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
        <Sparkles size={24} /> AID Resolver
      </h2>
      <p className="text-muted-foreground mb-8">
        Enter a domain to discover its Agent Interface Definition.
      </p>
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <Button variant="outline" size="sm" onClick={() => handleExampleClick('simple.agentcommunity.org')}>simple</Button>
        <Button variant="outline" size="sm" onClick={() => handleExampleClick('auth0.agentcommunity.org')}>auth0-mcp</Button>
        <Button variant="outline" size="sm" onClick={() => handleExampleClick('mixed-mode.agentcommunity.org')}>mixed-mode</Button>
        <Button variant="outline" size="sm" onClick={() => handleExampleClick('multi-remote.agentcommunity.org')}>multi-remote</Button>
      </div>
    </motion.div>
  );
} 