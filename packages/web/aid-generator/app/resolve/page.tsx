"use client";

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getImplementations, resolveDomain, ResolutionStep, ActionableImplementation } from "@aid/core/browser";
import { cn } from '@/lib/utils';
import { AidManifest } from '@aid/core';

// New Component Imports
import { ResolverHeader } from '@/components/resolver/ResolverHeader';
import { WelcomeScreen } from '@/components/resolver/WelcomeScreen';
import { ChatMessage, ChatMessageProps } from '@/components/resolver/ChatMessage';
import { ResolverInput } from '@/components/resolver/ResolverInput';
import { ActionableProfile } from '@/components/resolver/ActionableProfile';
import { CopyButton } from "@/components/resolver/CopyButton";
import { useSearchParams } from "next/navigation";

export default function ResolverPage() {
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
    }, [chatHistory]);

    const handleReset = () => {
        setHasStarted(false);
        setChatHistory([]);
        setInputValue('');
        setFinalDomain(null);
        setFinalManifest(null);
        setFinalImplementations(null);
    };

    const processStream = async (domain: string) => {
        setIsStreaming(true);
        if (!hasStarted) setHasStarted(true);

        // Reset previous results
        setFinalDomain(null);
        setFinalManifest(null);
        setFinalImplementations(null);

        // Start with the user's message
        const newHistory: ChatMessageProps[] = [{ role: 'user', content: domain }];
        setChatHistory(newHistory);
        
        // Prepare assistant message
        const assistantMessage: ChatMessageProps = { role: 'assistant', content: '' };
        const updatedHistory = [...newHistory, assistantMessage];
        setChatHistory(updatedHistory);
        
        let tempManifest: AidManifest | null = null;
        let tempImplementations: ActionableImplementation[] | null = null;
        let tempDomain: string | null = null;

        const proxyPath = '/api/proxy';
        for await (const step of resolveDomain(domain, { manifestProxy: proxyPath })) {
            let message = '';
            switch (step.type) {
                case 'dns_query':
                    message = `Querying DNS for \`${step.data.recordName}\`...`;
                    break;
                case 'dns_success':
                    message = `✅ Found TXT Record:\n\`\`\`\n${step.data.txtRecord}\n\`\`\``;
                    break;
                case 'dns_error':
                    message = `❌ DNS Error: ${step.error}`;
                    break;
                case 'inline_profile':
                    message = `ℹ️ TXT record is an inline profile.`;
                    break;
                case 'manifest_fetch':
                    message = `Fetching manifest from \`${step.data.manifestUrl}\`...`;
                    break;
                case 'manifest_success':
                    message = '✅ Manifest received.';
                    break;
                case 'manifest_error':
                    message = `❌ Manifest Error: ${step.error}`;
                    break;
                case 'validation_start':
                    message = 'Validating manifest against schema...';
                    break;
                case 'validation_success':
                    tempManifest = step.data.manifest;
                    message = '✅ Manifest is valid! Preparing summary...';
                    break;
                case 'validation_error':
                    message = `❌ Validation Error: ${step.error}`;
                    break;
                case 'actionable_profile':
                    tempImplementations = step.data.implementations;
                    tempDomain = step.data.domain;
                    message = '✅ Inline profile parsed! Preparing summary...';
                    break;
            }
            assistantMessage.content += `\n- ${message}`;
            setChatHistory([...updatedHistory]);
            await new Promise(resolve => setTimeout(resolve, 50));
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
        <div className="flex flex-col h-[calc(100vh-80px)] bg-background text-foreground">
            <ResolverHeader hasStarted={hasStarted} onReset={handleReset} />

            <main className={cn(
                "flex flex-col flex-grow items-center w-full relative",
                hasStarted ? 'justify-end' : 'justify-center'
            )}>

                <div className="absolute top-0 left-0 w-full h-full overflow-y-auto p-4 md:p-6">
                    <AnimatePresence>
                        {!hasStarted && (
                           <WelcomeScreen handleExampleClick={handleExampleClick} />
                        )}
                        {hasStarted && (
                            <div className="w-full max-w-3xl mx-auto space-y-4">
                                {chatHistory.map((msg, index) => (
                                    <ChatMessage key={index} role={msg.role} content={msg.content} />
                                ))}
                                {finalImplementations && finalDomain && (
                                     <ActionableProfile 
                                        domain={finalDomain}
                                        manifest={finalManifest}
                                        implementations={finalImplementations}
                                    />
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
                
                <ResolverInput 
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    isStreaming={isStreaming}
                    hasStarted={hasStarted}
                    submitForm={submitForm}
                />
            </main>
        </div>
    );
} 