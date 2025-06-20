'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { aidGeneratorConfigSchema } from '@/lib/schemas';

const Schritt = ({ title, command, children }: { title: string, command?: string, children: React.ReactNode }) => (
  <div className="mb-4">
    <div className="font-mono font-bold">{title}</div>
    {command && (
        <pre className="mt-1 p-2 text-sm bg-gray-200 dark:bg-gray-900 rounded-md overflow-x-auto">
            <code>{command}</code>
        </pre>
    )}
    <div className="mt-1 pl-2 border-l-2 border-gray-300 dark:border-gray-600">{children}</div>
  </div>
);


export default function ResolverPage() {
  const [domain, setDomain] = useState('');
  const [log, setLog] = useState<React.ReactNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleResolve = async () => {
    if (!domain) return;
    setIsLoading(true);
    const newLog: React.ReactNode[] = [];
    const appendLog = (node: React.ReactNode) => {
        newLog.push(<div key={newLog.length}>{node}</div>);
        setLog([...newLog]);
    }

    // 1. DNS Lookup
    const recordName = `_agent.${domain}`;
    const dnsQueryUrl = `https://cloudflare-dns.com/dns-query?name=${recordName}&type=TXT`;
    
    appendLog(
        <Schritt title={`[1/4] Querying DNS for ${recordName}...`} command={`curl -H 'accept: application/dns-json' '${dnsQueryUrl}'`}>
            <span className="text-gray-500">Waiting for response...</span>
        </Schritt>
    );

    let manifestUrl = '';
    try {
        const dnsRes = await fetch(dnsQueryUrl, { headers: { 'accept': 'application/dns-json' } });
        if (!dnsRes.ok) throw new Error(`DNS query failed with status ${dnsRes.status}`);
        const dnsData = await dnsRes.json();

        if (dnsData.Status !== 0 || !dnsData.Answer) {
            throw new Error(`DNS query returned status ${dnsData.Status} or no answer. Response: ${JSON.stringify(dnsData)}`);
        }

        const txtRecord = dnsData.Answer.find((ans: any) => ans.type === 16)?.data.replace(/"/g, '');
        if (!txtRecord) throw new Error("No TXT record found in DNS response.");
        
        appendLog(
            <Schritt title={`[1/4] DNS Query for ${recordName}`} command={`dig ${recordName} TXT`}>
                <div className="text-green-600 dark:text-green-400">✅ Success</div>
                <pre className="mt-1 p-2 text-sm bg-gray-200 dark:bg-gray-900 rounded-md overflow-x-auto"><code>{txtRecord}</code></pre>
            </Schritt>
        );

        const configPart = txtRecord.split(';').find((part: string) => part.startsWith('config='));
        if (!configPart) {
             appendLog(
                <Schritt title={`[2/4] Parsing TXT record...`}>
                    <div className="text-yellow-600 dark:text-yellow-400">ℹ️ No 'config=' key found. Resolution ends here (inline-only profile).</div>
                </Schritt>
            );
            setIsLoading(false);
            return;
        }
        manifestUrl = configPart.split('=')[1];
    } catch (error: any) {
        appendLog(
            <Schritt title={`[1/4] DNS Query for ${recordName}`}>
                <div className="text-red-600 dark:text-red-400">❌ Error: {error.message}</div>
            </Schritt>
        );
        setIsLoading(false);
        return;
    }

    // 2. Fetch Manifest
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(manifestUrl)}`;
     appendLog(
        <Schritt title={`[2/4] Fetching manifest from ${manifestUrl}...`} command={`curl '${manifestUrl}'`}>
             <span className="text-gray-500">Using proxy to avoid CORS...</span>
        </Schritt>
    );

    let manifestContent = '';
    try {
        const manifestRes = await fetch(proxyUrl);
        if (!manifestRes.ok) {
            const err = await manifestRes.json();
            throw new Error(`Request failed with status ${manifestRes.status}. Details: ${err.details || err.error || 'Unknown error'}`);
        }
        manifestContent = await manifestRes.text();
        appendLog(
            <Schritt title={`[2/4] Fetching manifest...`}>
                <div className="text-green-600 dark:text-green-400">✅ Success</div>
            </Schritt>
        );
    } catch (error: any) {
        appendLog(
            <Schritt title={`[2/4] Fetching manifest...`}>
                <div className="text-red-600 dark:text-red-400">❌ Error: {error.message}</div>
            </Schritt>
        );
        setIsLoading(false);
        return;
    }

    // 3. Validate Manifest
    appendLog(
        <Schritt title={`[3/4] Validating manifest schema...`}>
            <span className="text-gray-500">Running Zod schema validation...</span>
        </Schritt>
    );
    try {
        const manifestJson = JSON.parse(manifestContent);
        aidGeneratorConfigSchema.parse(manifestJson); // We use the generator config schema as it's the superset
         appendLog(
            <Schritt title={`[3/4] Validating manifest schema...`}>
                <div className="text-green-600 dark:text-green-400">✅ Schema is valid.</div>
            </Schritt>
        );
    } catch (error: any) {
        appendLog(
            <Schritt title={`[3/4] Validating manifest schema...`}>
                <div className="text-red-600 dark:text-red-400">❌ Invalid Schema:</div>
                <pre className="mt-1 p-2 text-sm bg-gray-200 dark:bg-gray-900 rounded-md overflow-x-auto"><code>{error.message}</code></pre>
            </Schritt>
        );
        setIsLoading(false);
        return;
    }
    
    // 4. Display Final Result
    appendLog(
        <Schritt title="[4/4] Final Manifest">
            <pre className="mt-1 p-2 text-sm bg-gray-200 dark:bg-gray-900 rounded-md overflow-x-auto"><code>{JSON.stringify(JSON.parse(manifestContent), null, 2)}</code></pre>
        </Schritt>
    );

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AID Resolver Playground</h1>
      <Card>
        <CardHeader>
          <CardTitle>Enter Domain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2">
            <div className="grid flex-1 gap-2">
                <Label htmlFor="domain-input" className="sr-only">
                    Domain
                </Label>
                <Input
                    id="domain-input"
                    placeholder="auth0.agentcommunity.org"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
                    disabled={isLoading}
                />
            </div>
            <Button onClick={handleResolve} disabled={isLoading}>
              {isLoading ? 'Resolving...' : 'Resolve'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {log.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resolution Log</CardTitle>
          </CardHeader>
          <CardContent>
            {log}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 