"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getImplementations, resolveDomain, ActionableImplementation } from "@aid/core/browser";
import { cn } from '@/lib/utils';
import { AidManifest } from '@aid/core';

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
                            <Codeblock content={step.data.txtRecord} />
                        </div>
                    );
                    break;
                case 'dns_error':
                    node = <p key={key} className="m-0 text-red-500">❌ DNS Error: {step.error}</p>;
                    break;
                case 'manifest_fetch':
                    node = <p key={key} className="m-0">Fetching manifest from <code>{step.data.manifestUrl}</code>...</p>;
                    break;
                case 'manifest_success':
                    node = <p key={key} className="m-0">✅ Manifest received.</p>;
                    break;
                case 'manifest_error':
                    node = <p key={key} className="m-0 text-red-500">❌ Manifest Error: {step.error}</p>;
                    break;
                case 'validation_start':
                    node = <p key={key} className="m-0">Validating manifest against schema...</p>;
                    break;
                case 'validation_success':
                    tempManifest = step.data.manifest;
                    node = <p key={key} className="m-0">✅ Manifest is valid! Preparing summary...</p>;
                    break;
                case 'validation_error':
                    node = <p key={key} className="m-0 text-red-500">❌ Validation Error: {step.error}</p>;
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
            await new Promise(resolve => setTimeout(resolve, 150));
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
            <main className="flex flex-col flex-grow w-full items-center">
                <div className={cn(
                    "w-full flex-grow overflow-y-auto p-4 md:p-6",
                    !hasStarted && "flex flex-col justify-center items-center"
                )}>
                    <AnimatePresence>
                        {!hasStarted && <WelcomeScreen />}
                    </AnimatePresence>
                    {hasStarted && (
                        <div className="w-full max-w-3xl mx-auto space-y-4">
                            {chatHistory.map((msg, index) => (
                                <ChatMessage key={index} role={msg.role} content={msg.content} />
                            ))}
                            {finalImplementations && finalDomain && (
                                <ActionableProfile domain={finalDomain} manifest={finalManifest} implementations={finalImplementations} />
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>
                
                <div className="sticky bottom-0 pb-4 w-full flex flex-col items-center bg-background/80 backdrop-blur-sm pt-2">
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