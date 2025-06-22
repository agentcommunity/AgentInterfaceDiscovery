'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function WelcomeScreen() {
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
        Enter a domain to discover its Agent Interface Definition, or select an example below.
      </p>
    </motion.div>
  );
} 