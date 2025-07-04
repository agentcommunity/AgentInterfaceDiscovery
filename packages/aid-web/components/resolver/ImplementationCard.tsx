'use client';

import { ActionableImplementation } from '@agentcommunity/aid-core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pickaxe, Milestone, Terminal, KeyRound, Link as LinkIcon } from 'lucide-react';
import { Codeblock } from './Codeblock';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface ImplementationCardProps {
    implementation: ActionableImplementation;
    documentationUrl?: string;
}

export function ImplementationCard({ implementation, documentationUrl }: ImplementationCardProps) {
    const auth = implementation.auth as any;

    const renderAuthInput = () => {
        switch (auth.scheme) {
            case 'pat':
            case 'apikey':
            case 'basic':
                const secretKey = auth.requiredSecrets?.[0] || 'token';
                return (
                    <div className="space-y-2">
                        <Label htmlFor={`${auth.scheme}-token`} className="text-xs font-medium">
                            {auth.description || `Enter your ${secretKey}`}
                        </Label>
                        <Input 
                            id={`${auth.scheme}-token`} 
                            type="password" 
                            placeholder={`${secretKey}...`}
                            className="h-8 text-sm"
                        />
                    </div>
                );
            case 'oauth2_device':
            case 'oauth2_code':
            case 'oauth2_service':
                return (
                    <div className="text-xs text-muted-foreground">
                        OAuth2 flow required - would redirect to auth endpoint
                    </div>
                );
            case 'mtls':
                return (
                    <div className="text-xs text-muted-foreground">
                        Client certificate authentication required
                    </div>
                );
            default:
                return (
                    <div className="text-xs text-muted-foreground">
                        {auth.description || 'No authentication required'}
                    </div>
                );
        }
    };

    const executionCode = implementation.type === 'remote'
        ? implementation.execution.uri!
        : `${implementation.execution.command} ${implementation.execution.args?.join(' ') || ''}`;

    return (
        <Card className="border border-border/50">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                        <CardTitle className="flex items-center gap-2 text-base">
                            {implementation.type === 'local' ? 
                                <Pickaxe className="h-4 w-4 text-orange-600" /> : 
                                <Milestone className="h-4 w-4 text-blue-600" />
                            }
                            {implementation.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs h-5">
                                {implementation.type === 'remote' ? 'API' : 'CLI'}
                            </Badge>
                            {implementation.protocol && (
                                <Badge variant="secondary" className="text-xs h-5">
                                    {implementation.protocol}
                                </Badge>
                            )}
                        </div>
                    </div>
                    {documentationUrl && (
                        <Button variant="outline" size="sm" className="h-7 px-2 text-xs" asChild>
                            <a href={documentationUrl} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="h-3 w-3 mr-1"/>
                                Docs
                            </a>
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0">
                {/* Execution - Made Prominent */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Terminal className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Execute</span>
                    </div>
                    <Codeblock content={executionCode} variant="inline" />
                </div>

                {/* Authentication - Simplified */}
                <div className="pt-2 border-t border-border/30">
                    <div className="flex items-center gap-2 mb-2">
                        <KeyRound className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium">Authentication</span>
                        <Badge variant="outline" className="text-xs h-5">
                            {auth.scheme}
                        </Badge>
                    </div>
                    <div className="pl-6">
                        {renderAuthInput()}
                    </div>
                </div>

                {/* Configuration - Only if needed */}
                {implementation.requiredConfig && implementation.requiredConfig.length > 0 && (
                    <div className="pt-2 border-t border-border/30">
                        <div className="text-sm font-medium mb-2">
                            Configuration ({implementation.requiredConfig.length} required)
                        </div>
                        <div className="text-xs text-muted-foreground pl-4">
                            {implementation.requiredConfig.map(item => item.key).join(', ')}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 