'use client';

import { useState } from 'react';
import { ActionableImplementation } from '@/lib/resolver';
import { AidManifest } from '@agentcommunity/aid-core';
import { Terminal, ShieldCheck, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ImplementationCard } from './ImplementationCard';
import { ViewToggle, ViewMode } from './ViewToggle';
import { Codeblock } from './Codeblock';

interface ActionableProfileProps {
    domain: string;
    manifest: AidManifest | null;
    implementations: ActionableImplementation[];
}

export function ActionableProfile({ domain, manifest, implementations }: ActionableProfileProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('preview');

    if (!implementations || implementations.length === 0) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>No Implementations Found</AlertTitle>
                <AlertDescription>
                    The resolver could not find any actionable implementations for {domain}.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-4">
            {/* Example Client Notice */}
            <div className="text-xs text-muted-foreground bg-muted/30 border border-border/50 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                    <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium mb-1">Example Client Interface</p>
                        <p>This shows how a real client would discover and connect to the agent. In a real implementation, you&apos;d enter your credentials and the client would execute automatically.</p>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <div>
                    <h3 className="text-base font-semibold flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" /> 
                        {implementations.length} implementation{implementations.length > 1 ? 's' : ''} found
                    </h3>
                    <p className="text-sm text-muted-foreground">Domain: <code className="text-xs">{domain}</code></p>
                </div>
                <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>

            {viewMode === 'preview' ? (
                <div className="space-y-3">
                    {implementations.map((impl, index) => (
                        <ImplementationCard 
                            key={index} 
                            implementation={impl} 
                            documentationUrl={manifest?.metadata?.documentation} 
                        />
                    ))}
                </div>
            ) : (
                <Codeblock
                    title="Raw Manifest"
                    content={JSON.stringify(manifest || implementations, null, 2)}
                    variant="inline"
                />
            )}
        </div>
    );
} 