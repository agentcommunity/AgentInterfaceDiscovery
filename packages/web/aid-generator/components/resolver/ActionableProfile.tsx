'use client';

import { useState } from 'react';
import { ActionableImplementation } from '@/lib/resolver';
import { AidManifest } from '@aid/core';
import { Terminal, ShieldCheck } from 'lucide-react';
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
        <div className="prose prose-sm dark:prose-invert max-w-none">
             <div className="mb-4 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold flex items-center gap-2 m-0">
                        <ShieldCheck size={20} /> Actionable Profile for <code className="text-lg">{domain}</code>
                    </h2>
                    <p className="text-muted-foreground m-0 p-0">
                        Found {implementations.length} implementation(s).
                    </p>
                </div>
                <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>

            {viewMode === 'preview' ? (
                 <div className="space-y-6">
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
                />
            )}
        </div>
    );
} 