'use client';

import { motion } from 'framer-motion';
import { Search, Globe, Zap, ArrowDown } from 'lucide-react';

export function WelcomeScreen() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-8 max-w-3xl mx-auto"
    >
      {/* Hero Content */}
      <div className="space-y-6">
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Discover any <span className="text-primary">AI agent</span> instantly
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Enter a domain name below to see the AID discovery process in action. 
            Watch as we resolve DNS records, fetch manifests, and validate specifications.
          </p>
        </div>

        {/* Process Steps - Simplified */}
        <div className="grid md:grid-cols-3 gap-6 mt-8 mb-8">
          {[
            {
              icon: <Globe className="h-5 w-5" />,
              title: "DNS Resolution",
              description: "Query TXT records",
            },
            {
              icon: <Search className="h-5 w-5" />,
              title: "Manifest Fetch", 
              description: "Download specification",
            },
            {
              icon: <Zap className="h-5 w-5" />,
              title: "Validation",
              description: "Verify compliance",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-4 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-muted-foreground mx-auto mb-3">
                {step.icon}
              </div>
              <h3 className="font-medium text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">Start by entering a domain below</p>
            <ArrowDown className="h-4 w-4 text-muted-foreground animate-bounce" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 