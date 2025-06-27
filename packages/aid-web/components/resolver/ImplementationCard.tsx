'use client';

import { ActionableImplementation } from '@aid/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pickaxe, Milestone, Terminal, KeyRound, Variable, FolderOpen, File, Link as LinkIcon } from 'lucide-react';
import { Codeblock } from './Codeblock';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Separator } from '../ui/separator';

interface ImplementationCardProps {
    implementation: ActionableImplementation;
    documentationUrl?: string;
}

export function ImplementationCard({ implementation, documentationUrl }: ImplementationCardProps) {
    const hasConfig = implementation.requiredConfig && implementation.requiredConfig.length > 0;
    const hasPaths = implementation.requiredPaths && implementation.requiredPaths.length > 0;

    const renderAuthDetails = () => {
        const auth = implementation.auth as any; 
        const cert = implementation.certificate;

        const Detail = ({ label, value }: { label: string, value: React.ReactNode }) => (
            <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">{label}:</span>
                <div className="text-right">{value}</div>
            </div>
        );

        switch (auth.scheme) {
            case 'oauth2_device':
            case 'oauth2_code':
            case 'oauth2_service':
                const oauth = auth.oauth || {};
                return (
                    <div className="space-y-1">
                        {oauth.deviceAuthorizationEndpoint && <Detail label="Device Endpoint" value={<code className="text-xs">{oauth.deviceAuthorizationEndpoint}</code>} />}
                        {oauth.authorizationEndpoint && <Detail label="Auth Endpoint" value={<code className="text-xs">{oauth.authorizationEndpoint}</code>} />}
                        {oauth.tokenEndpoint && <Detail label="Token Endpoint" value={<code className="text-xs">{oauth.tokenEndpoint}</code>} />}
                        {oauth.scopes && <Detail label="Scopes" value={<code className="text-xs">{oauth.scopes.join(', ')}</code>} />}
                        {oauth.clientId && <Detail label="Client ID" value={<code className="text-xs">{oauth.clientId}</code>} />}
                    </div>
                );
            case 'pat':
            case 'apikey':
            case 'basic':
                const secretKey = auth.requiredSecrets?.[0] || 'token';
                return (
                    <div className="p-3 my-2 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                        <Label htmlFor={`${auth.scheme}-token`} className="text-sm font-medium">{auth.description}</Label>
                        <Input id={`${auth.scheme}-token`} type="password" placeholder={`Enter your ${secretKey}...`} />
                        {auth.requiredSecrets?.length > 0 && <p className="text-xs text-muted-foreground">Requires key: <code>{auth.requiredSecrets.join(', ')}</code></p>}
                    </div>
                );
            case 'mtls':
                 if (!cert) return <p className="text-sm">{auth.description || 'mTLS authentication required.'}</p>;
                 return (
                     <div className="space-y-1">
                        <Detail label="Source" value={<code>{cert.source || 'unknown'}</code>} />
                        {cert.enrollmentEndpoint && <Detail label="Enrollment" value={<code>{cert.enrollmentEndpoint}</code>} />}
                    </div>
                 );
            default:
                return <p className="text-sm text-muted-foreground">{auth.description || 'No authentication required.'}</p>;
        }
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <CardTitle className="flex items-center gap-3">
                            {implementation.type === 'local' ? <Pickaxe size={20} /> : <Milestone size={20} />}
                            {implementation.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                            {implementation.type === 'remote' ? 'Remote API Endpoint' : 'Local Command-Line Tool'}
                        </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                           {implementation.protocol && <Badge variant="outline">{implementation.protocol}</Badge>}
                           {implementation.tags?.map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}
                        </div>
                         {documentationUrl && (
                            <Button variant="outline" size="sm" asChild>
                                <a href={documentationUrl} target="_blank" rel="noopener noreferrer">
                                    <LinkIcon size={14} className="mr-2"/>
                                    Docs
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="flex items-center text-md font-semibold mb-2">
                        <Terminal size={16} className="text-muted-foreground" />
                        <span className="ml-2">Execution</span>
                    </h4>
                     {implementation.type === 'remote'
                        ? <Codeblock content={implementation.execution.uri!} />
                        : <Codeblock content={`${implementation.execution.command} ${implementation.execution.args?.join(' ')}`} />
                    }
                </div>

                <Separator />

                <div>
                    <h4 className="flex items-center text-md font-semibold mb-2">
                        <KeyRound size={16} className="text-muted-foreground" />
                        <span className="ml-2">Authentication</span>
                    </h4>
                    <div className="pl-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between text-sm">
                           <span className="font-medium text-muted-foreground">Scheme:</span>
                           <code>{implementation.auth.scheme}</code>
                        </div>
                        {renderAuthDetails()}
                    </div>
                </div>
                
                {hasConfig && (
                    <>
                    <Separator />
                     <div>
                        <h4 className="flex items-center text-md font-semibold mb-2">
                            <Variable size={16} className="text-muted-foreground" />
                            <span className="ml-2">Configuration</span>
                        </h4>
                        <div className="pl-4 space-y-3">
                            {implementation.requiredConfig?.map(item => (
                                <div key={item.key}>
                                    <Label htmlFor={item.key} className="font-medium">{item.key}</Label>
                                    <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                                    {item.type === 'boolean' ? (
                                        <div className="flex items-center space-x-2 mt-2">
                                            <Checkbox id={item.key} defaultChecked={!!item.defaultValue} />
                                            <label htmlFor={item.key} className="text-sm font-medium">Enabled</label>
                                        </div>
                                    ) : (
                                        <Input 
                                            id={item.key} 
                                            type={item.type === 'integer' ? 'number' : item.secret ? 'password' : 'text'}
                                            placeholder={String(item.defaultValue ?? '')}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    </>
                )}

                {hasPaths && (
                    <>
                    <Separator />
                     <div>
                        <h4 className="flex items-center text-md font-semibold mb-2">
                            <FolderOpen size={16} className="text-muted-foreground"/>
                            <span className="ml-2">Required Paths</span>
                        </h4>
                        <div className="pl-4 space-y-2">
                            {implementation.requiredPaths?.map(p => (
                                <div key={p.key} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                    {p.type === 'directory' ? <FolderOpen size={14} /> : <File size={14} />}
                                    <code className="text-sm">{p.key}</code>
                                    <span className="text-xs text-muted-foreground">- {p.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
} 