"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDomain = resolveDomain;
exports.getImplementations = getImplementations;
const schemas_1 = require("./schemas");
/**
 * The primary function for resolving a domain's AID profile.
 * It handles the entire discovery chain, from DNS TXT lookup to manifest fetching and validation.
 * This is an async generator, yielding each step of the process for real-time UI updates.
 *
 * @example
 * ```typescript
 * for await (const step of resolveDomain("example.com")) {
 *   // update UI based on step
 *   if (step.type === 'validation_success') {
 *     const implementations = getImplementations(step.data.manifest);
 *     // use implementations
 *   }
 * }
 * ```
 * @param domain The domain to resolve (e.g., "agentcommunity.org").
 * @returns An async generator that yields `ResolutionStep` objects.
 */
async function* resolveDomain(domain, options) {
    // 1. DNS Lookup
    const recordName = `_agent.${domain}`;
    yield { type: 'dns_query', data: { recordName } };
    let txtRecord = '';
    try {
        // Use the proxy for DNS query
        const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${recordName}&type=TXT`, {
            headers: { 'Accept': 'application/dns-json' }
        });
        if (!response.ok)
            throw new Error(`DNS query failed with status ${response.status}`);
        const data = await response.json();
        if (data.Status !== 0 || !data.Answer || data.Answer.length === 0) {
            throw new Error('DNS query returned status 3 or no answer.');
        }
        txtRecord = data.Answer[0].data.replace(/"/g, '');
        yield { type: 'dns_success', data: { txtRecord } };
    }
    catch (e) {
        yield { type: 'dns_error', error: e.message || 'An unknown error occurred during DNS query.' };
        return;
    }
    // Per spec: Check for an extended profile first by looking for the 'config' key.
    const configPart = txtRecord.split(';').find((part) => part.startsWith('config='));
    if (configPart) {
        const manifestUrl = configPart.split('=')[1];
        // 2. Fetch Manifest
        const proxyUrl = options?.manifestProxy ? `${options.manifestProxy}?url=${encodeURIComponent(manifestUrl)}` : manifestUrl;
        yield { type: 'manifest_fetch', data: { manifestUrl } };
        let manifestContent = '';
        try {
            const manifestRes = await fetch(proxyUrl);
            if (!manifestRes.ok) {
                const err = await manifestRes.json().catch(() => ({ details: manifestRes.statusText }));
                throw new Error(`Request failed with status ${manifestRes.status}. Details: ${err.details || 'Unknown error'}`);
            }
            manifestContent = await manifestRes.text();
            yield { type: 'manifest_success', data: { manifestContent } };
        }
        catch (error) {
            yield { type: 'manifest_error', error: error.message };
            return;
        }
        // 3. Validate Manifest
        yield { type: 'validation_start' };
        try {
            const manifestJson = JSON.parse(manifestContent);
            schemas_1.aidManifestSchema.parse(manifestJson);
            yield { type: 'validation_success', data: { manifest: manifestJson } };
        }
        catch (error) {
            yield { type: 'validation_error', error: error.message, data: { manifestContent } };
        }
        return; // End of flow for extended profiles.
    }
    // If no 'config' key is found, treat it as a Simple Profile.
    if (txtRecord.startsWith('v=aid1')) {
        yield { type: 'inline_profile', message: 'TXT record is an inline profile. Parsing...' };
        try {
            const parts = txtRecord.split(';').reduce((acc, part) => {
                const [key, ...value] = part.split('=');
                if (key && value.length)
                    acc[key.trim()] = value.join('=').trim();
                return acc;
            }, {});
            if (!parts.uri) {
                throw new Error('Simple inline profile is missing required field (uri). Local implementations require an extended profile manifest.');
            }
            const implementation = {
                name: parts.name || 'Remote Inline Profile',
                type: 'remote',
                protocol: parts.proto || 'unknown',
                tags: parts.tags ? parts.tags.split(',') : [],
                execution: {
                    uri: parts.uri,
                },
                auth: {
                    scheme: parts.auth || 'none',
                    description: `Authentication via ${parts.auth || 'none'}`,
                    requiredSecrets: ['pat', 'apikey', 'basic'].includes(parts.auth) ? ['TOKEN'] : [],
                },
                requiredConfig: [], // Note: Complex config not supported in simple inline profiles
            };
            implementation.tags?.push(implementation.protocol);
            yield { type: 'actionable_profile', data: { implementations: [implementation], domain: domain } };
        }
        catch (e) {
            yield { type: 'validation_error', error: e.message };
        }
        return;
    }
    yield { type: 'dns_error', error: 'Invalid TXT record format.' };
}
/**
 * Translates a valid `AidManifest` into an array of `ActionableImplementation` objects.
 * This function simplifies the manifest into a direct to-do list for a client application,
 * making it easy to determine what inputs are needed from the user (secrets, config) and
 * how to execute each available implementation.
 *
 * @param manifest The valid `AidManifest` object returned from a successful resolution.
 * @returns An array of `ActionableImplementation` objects.
 */
function getImplementations(manifest) {
    return manifest.implementations.map(impl => {
        const actionable = {
            name: impl.name,
            type: impl.type,
            protocol: impl.protocol,
            tags: impl.tags,
            execution: {},
            auth: {
                scheme: impl.authentication.scheme,
                description: 'description' in impl.authentication ? impl.authentication.description : '',
                requiredSecrets: [],
            },
            requiredConfig: impl.configuration,
            certificate: impl.certificate,
            requiredPaths: impl.requiredPaths,
        };
        if (impl.type === 'remote') {
            actionable.execution.uri = impl.uri;
        }
        else {
            actionable.execution.command = impl.execution.command;
            actionable.execution.args = impl.execution.args;
            actionable.execution.platformOverrides = impl.execution.platformOverrides;
        }
        // Handle auth specifics
        const auth = impl.authentication;
        if ('placement' in auth && auth.placement) {
            actionable.auth.placement = auth.placement;
        }
        if ('credentials' in auth && auth.credentials) {
            actionable.auth.requiredSecrets = auth.credentials.map(c => c.key);
        }
        else if (auth.scheme === 'pat' || auth.scheme === 'apikey' || auth.scheme === 'basic') {
            // If no credentials are listed for simple schemes, assume a single default secret is needed.
            actionable.auth.requiredSecrets = ['TOKEN'];
        }
        return actionable;
    });
}
