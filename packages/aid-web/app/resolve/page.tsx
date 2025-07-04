"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getImplementations, resolveDomain, ActionableImplementation } from "@agentcommunity/aid-core/browser";
import { cn } from '@/lib/utils';
import { AidManifest } from '@agentcommunity/aid-core';

// New Component Imports
import { ResolverHeader } from '@/components/resolver/ResolverHeader';
import { WelcomeScreen } from '@/components/resolver/WelcomeScreen';
import { ChatMessage, ChatMessageProps } from '@/components/resolver/ChatMessage';
import { ResolverInput } from '@/components/resolver/ResolverInput';
import { ActionableProfile } from '@/components/resolver/ActionableProfile';
import { Codeblock } from '@/components/resolver/Codeblock';
import { ExamplePicker } from '@/components/resolver/ExamplePicker';
import { useSearchParams } from "next/navigation";

function ResolverPageContent() {
    const [inputValue, setInputValue] = useState('');
    const [hasStarted, setHasStarted] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessageProps[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // State for the final profile
    const [finalDomain, setFinalDomain] = useState<string | null>(null);
    const [finalManifest, setFinalManifest] = useState<AidManifest | null>(null);
    const [finalImplementations, setFinalImplementations] = useState<ActionableImplementation[] | null>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, finalImplementations]);

    const handleReset = () => {
        setHasStarted(false);
        setChatHistory([]);
        setInputValue('');
        setFinalDomain(null);
        setFinalManifest(null);
        setFinalImplementations(null);
        setIsStreaming(false);
    };

    const processStream = async (domain: string) => {
        setIsStreaming(true);
        if (!hasStarted) setHasStarted(true);

        setFinalDomain(null);
        setFinalManifest(null);
        setFinalImplementations(null);

        const userMessage: ChatMessageProps = { role: 'user', content: domain };
        
        const assistantResponseContent: React.ReactNode[] = [];
        const assistantMessage: ChatMessageProps = { role: 'assistant', content: assistantResponseContent };
        
        let currentHistory: ChatMessageProps[] = [userMessage, assistantMessage];
        setChatHistory(currentHistory);
        
        const addAssistantNode = (node: React.ReactNode) => {
            assistantResponseContent.push(node);
            setChatHistory([userMessage, { ...assistantMessage, content: [...assistantResponseContent] }]);
        };
        
        let tempManifest: AidManifest | null = null;
        let tempImplementations: ActionableImplementation[] | null = null;
        let tempDomain: string | null = null;
        const proxyPath = '/api/proxy';
        
        for await (const step of resolveDomain(domain, { manifestProxy: proxyPath })) {
            let node: React.ReactNode = null;
            const key = `${step.type}-${Date.now()}`;

            switch (step.type) {
                case 'dns_query':
                    node = <p key={key} className="m-0">Querying DNS for <code>{step.data.recordName}</code>...</p>;
                    break;
                case 'dns_success':
                    node = (
                        <div key={key}>
                            <p className="m-0">✅ Found TXT Record:</p>
                            <Codeblock content={step.data.txtRecord} variant="inline" />
                        </div>
                    );
                    break;
                case 'dns_error':
                    node = (
                        <div key={key} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
                            <span className="text-red-600 dark:text-red-400 text-lg">❌</span>
                            <div>
                                <p className="text-red-700 dark:text-red-300 font-medium text-sm m-0">DNS Resolution Failed</p>
                                <p className="text-red-600 dark:text-red-400 text-sm m-0 mt-1">{step.error}</p>
                            </div>
                        </div>
                    );
                    break;
                case 'manifest_fetch':
                    node = <p key={key} className="m-0">Fetching manifest from <code>{step.data.manifestUrl}</code>...</p>;
                    break;
                case 'manifest_success':
                    node = <p key={key} className="m-0">✅ Manifest received.</p>;
                    break;
                case 'manifest_error':
                    node = (
                        <div key={key} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
                            <span className="text-red-600 dark:text-red-400 text-lg">❌</span>
                            <div>
                                <p className="text-red-700 dark:text-red-300 font-medium text-sm m-0">Manifest Fetch Failed</p>
                                <p className="text-red-600 dark:text-red-400 text-sm m-0 mt-1">{step.error}</p>
                            </div>
                        </div>
                    );
                    break;
                case 'validation_start':
                    node = <p key={key} className="m-0">Validating manifest against schema...</p>;
                    break;
                case 'validation_success':
                    tempManifest = step.data.manifest;
                    node = <p key={key} className="m-0">✅ Manifest is valid! Preparing summary...</p>;
                    break;
                case 'validation_error':
                    const validationErrorNode = (
                        <div key={key} className="space-y-3">
                            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
                                <span className="text-red-600 dark:text-red-400 text-lg">❌</span>
                                <div>
                                    <p className="text-red-700 dark:text-red-300 font-medium text-sm m-0">Validation Failed</p>
                                    <p className="text-red-600 dark:text-red-400 text-sm m-0 mt-1">{step.error}</p>
                                </div>
                            </div>
                            {step.data?.manifestContent && (
                                <Codeblock title="Invalid Manifest Source" content={step.data.manifestContent} variant="inline" />
                            )}
                        </div>
                    );
                    node = validationErrorNode;
                    break;
                case 'actionable_profile':
                    tempImplementations = step.data.implementations;
                    tempDomain = step.data.domain;
                    node = <p key={key} className="m-0">✅ Inline profile parsed! Preparing summary...</p>;
                    break;
            }

            if (node) {
                 addAssistantNode(node);
            }
            // More natural streaming timing
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (tempManifest) {
            setFinalManifest(tempManifest);
            setFinalImplementations(getImplementations(tempManifest));
            setFinalDomain(domain);
        } else if (tempImplementations && tempDomain) {
            setFinalImplementations(tempImplementations);
            setFinalDomain(tempDomain);
        }

        setIsStreaming(false);
    };
    
    const handleExampleClick = (domain: string) => {
        setInputValue(domain);
        processStream(domain);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        processStream(inputValue);
        setInputValue('');
    };

    return (
        <div className="min-h-screen bg-background">
            <ResolverHeader hasStarted={hasStarted} onReset={handleReset} />
            <main className="flex flex-col w-full items-center">
                <div className={cn(
                    "w-full flex-grow overflow-y-auto px-4 py-6 md:px-6",
                    !hasStarted && "flex flex-col justify-center items-center min-h-[60vh]"
                )}>
                    <AnimatePresence>
                        {!hasStarted && <WelcomeScreen />}
                    </AnimatePresence>
                    {hasStarted && (
                        <div className="w-full max-w-4xl mx-auto space-y-3">
                            {chatHistory.map((msg, index) => (
                                <ChatMessage key={index} role={msg.role} content={msg.content} />
                            ))}
                            {isStreaming && (
                                <div className="w-full flex justify-start px-2 md:px-0">
                                    <div className="bg-muted/50 border border-border/50 rounded-lg px-3 md:px-4 py-2.5 md:py-3 mr-4 md:mr-8">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {finalImplementations && finalDomain && (
                                <div className="pt-2">
                                    <ActionableProfile domain={finalDomain} manifest={finalManifest} implementations={finalImplementations} />
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>
                
                <div className="sticky bottom-0 w-full flex flex-col items-center bg-background/95 backdrop-blur-sm border-t border-border/50 py-4">
                    <ResolverInput 
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        isStreaming={isStreaming}
                        hasStarted={hasStarted}
                        submitForm={submitForm}
                    />
                    <ExamplePicker handleExampleClick={handleExampleClick} />
                </div>
            </main>
        </div>
    );
}

export default function ResolverPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResolverPageContent />
        </Suspense>
    )
} 