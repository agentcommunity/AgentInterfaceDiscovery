'use client';

import { ActionableImplementation, getImplementations } from '@/lib/resolver';
import { AidManifest, AuthConfig, UserConfigurableItem } from '@aid/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CopyButton } from './CopyButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, KeyRound, Braces, FileCode, Pickaxe, Variable, File, FolderOpen, ShieldCheck, Milestone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface ActionableProfileProps {
    domain: string;
    manifest: AidManifest | null;
    implementations: ActionableImplementation[];
}

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div>
        <h4 className="flex items-center text-md font-semibold mb-2 text-muted-foreground">
            {icon}
            <span className="ml-2">{title}</span>
        </h4>
        <div className="pl-6 space-y-2 text-sm">{children}</div>
    </div>
);

const Detail = ({ label, value, isCode = false, allowCopy = false }: { label: string, value: string, isCode?: boolean, allowCopy?: boolean }) => (
    <div className="flex items-center justify-between">
        <span className="font-medium">{label}:</span>
        <div className="flex items-center gap-2">
            {isCode ? <code>{value}</code> : <span>{value}</span>}
            {allowCopy && <CopyButton textToCopy={value} />}
        </div>
    </div>
);

const AuthSection = ({ auth }: { auth: ActionableImplementation['auth'] }) => {
    const renderAuthDetails = () => {
        switch (auth.scheme) {
            case 'oauth2_device':
            case 'oauth2_code':
            case 'oauth2_service':
                const oauth = 'oauth' in auth ? (auth as any).oauth : {};
                return (
                    <>
                        {oauth.deviceAuthorizationEndpoint && <Detail label="Device Endpoint" value={oauth.deviceAuthorizationEndpoint} allowCopy />}
                        {oauth.authorizationEndpoint && <Detail label="Auth Endpoint" value={oauth.authorizationEndpoint} allowCopy />}
                        {oauth.tokenEndpoint && <Detail label="Token Endpoint" value={oauth.tokenEndpoint} allowCopy />}
                        {oauth.scopes && <Detail label="Scopes" value={oauth.scopes.join(', ')} isCode allowCopy />}
                        {oauth.clientId && <Detail label="Client ID" value={oauth.clientId} allowCopy />}
                    </>
                )
            case 'pat':
            case 'apikey':
            case 'basic':
                return (
                    <div>
                        <Label htmlFor={`${auth.scheme}-token`}>{auth.description}</Label>
                        <Input id={`${auth.scheme}-token`} type="password" placeholder={`Enter your ${auth.scheme === 'basic' ? 'credentials' : 'token'}`} />
                        {auth.requiredSecrets.length > 0 && <p className="text-xs text-muted-foreground mt-1">Requires: {auth.requiredSecrets.join(', ')}</p>}
                    </div>
                );
            case 'mtls':
                 const cert = 'certificate' in auth ? (auth as any).certificate : undefined;
                 if (!cert) {
                    return <p>{auth.description || 'mTLS authentication required.'}</p>;
                 }
                 return (
                    <>
                        <Detail label="Source" value={cert.source || 'unknown'} />
                        {cert.enrollmentEndpoint && <Detail label="Enrollment Endpoint" value={cert.enrollmentEndpoint} allowCopy />}
                    </>
                 )
            default:
                return <p>{auth.description}</p>;
        }
    }

    return (
        <Section title="Authentication" icon={<KeyRound size={16} />}>
            <div className="p-3 bg-muted/50 rounded-md">
                <Detail label="Scheme" value={auth.scheme} isCode />
                <Separator className="my-2" />
                {renderAuthDetails()}
            </div>
        </Section>
    )
}

const ConfigSection = ({ config }: { config: UserConfigurableItem[] }) => (
    <Section title="Configuration" icon={<Variable size={16} />}>
        <div className="space-y-3">
            {config.map(item => (
                <div key={item.key}>
                    <Label htmlFor={item.key} className="font-medium">{item.key}</Label>
                    <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                    {item.type === 'boolean' ? (
                        <div className="flex items-center space-x-2 mt-2">
                             <Checkbox id={item.key} defaultChecked={!!item.defaultValue} />
                             <label htmlFor={item.key} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Enabled
                             </label>
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
    </Section>
);

const RequiredPathsSection = ({ paths }: { paths: ActionableImplementation['requiredPaths'] }) => (
    <Section title="Required Paths" icon={<FolderOpen size={16} />}>
         {paths?.map(p => (
            <div key={p.key} className="flex items-center gap-2">
                {p.type === 'directory' ? <FolderOpen size={14} /> : <File size={14} />}
                <code className="text-sm">{p.key}</code>
                <span className="text-xs text-muted-foreground">- {p.description}</span>
            </div>
        ))}
    </Section>
)


export function ActionableProfile({ domain, manifest, implementations }: ActionableProfileProps) {
    if (!implementations || implementations.length === 0) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>No Implementations Found</AlertTitle>
                <AlertDescription>
                    The resolver could not find any actionable implementations for {domain}.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
             <div className="mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><ShieldCheck size={20} /> Actionable Profile for <code className="text-lg">{domain}</code></h2>
                <p className="text-muted-foreground">Found {implementations.length} implementation(s). Here's how to use them:</p>
                {manifest?.metadata?.documentation && (
                    <a href={manifest.metadata.documentation} target="_blank" rel="noopener noreferrer" className="text-sm text-primary">
                        View Documentation
                    </a>
                )}
            </div>
            <div className="space-y-6">
                {implementations.map((impl, index) => (
                    <Card key={index} className="overflow-hidden">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-3">
                                        {impl.type === 'local' ? <Pickaxe size={20} /> : <Milestone size={20} />}
                                        {impl.name}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {impl.type === 'remote' ? 'Remote API Endpoint' : 'Local Command-Line Tool'}
                                    </CardDescription>
                                </div>
                                 <div className="flex items-center gap-2">
                                    {impl.tags?.map((t:string) => <Badge key={t} variant="outline">{t}</Badge>)}
                                    {impl.type === 'local' && <Badge variant="secondary">Local</Badge>}
                                    {(impl as any).status === 'deprecated' && <Badge variant="destructive">Deprecated</Badge>}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Section title="Execution" icon={<Terminal size={16} />}>
                                {impl.type === 'remote'
                                    ? <Detail label="URI" value={impl.execution.uri!} isCode allowCopy />
                                    : (
                                        <div className="p-3 font-mono text-sm bg-muted rounded-md flex items-center justify-between">
                                            <span className="break-all">$ {impl.execution.command} {impl.execution.args?.join(' ')}</span>
                                            <CopyButton textToCopy={`${impl.execution.command} ${impl.execution.args?.join(' ')}`} className="ml-2 flex-shrink-0" />
                                        </div>
                                    )
                                }
                            </Section>

                            <Separator />
                            
                            <AuthSection auth={{ ...impl.auth, certificate: impl.certificate } as any} />

                            {impl.requiredConfig && impl.requiredConfig.length > 0 && (
                                <>
                                    <Separator />
                                    <ConfigSection config={impl.requiredConfig} />
                                </>
                            )}

                             {impl.requiredPaths && impl.requiredPaths.length > 0 && (
                                <>
                                    <Separator />
                                    <RequiredPathsSection paths={impl.requiredPaths} />
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 