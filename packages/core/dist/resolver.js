"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDomain = resolveDomain;
exports.getImplementations = getImplementations;
const schemas_1 = require("./schemas");
async function* fetchAndValidateManifest(manifestUrl) {
    // 2. Fetch Manifest
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(manifestUrl)}`;
    yield { type: 'manifest_fetch', data: { manifestUrl } };
    let manifestContent = '';
    try {
        const manifestRes = await fetch(proxyUrl);
        if (!manifestRes.ok) {
            let errorDetails = 'Unknown error';
            try {
                const err = await manifestRes.json();
                errorDetails = err.details || JSON.stringify(err);
            }
            catch (e) {
                errorDetails = await manifestRes.text();
            }
            throw new Error(`Request failed with status ${manifestRes.status}. Details: ${errorDetails}`);
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
        schemas_1.aidGeneratorConfigSchema.parse(manifestJson);
        yield { type: 'validation_success', data: { manifest: manifestJson } };
    }
    catch (error) {
        yield { type: 'validation_error', error: error.message };
        return;
    }
}
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
async function* resolveDomain(domain) {
    // 1. DNS Lookup
    const recordName = `_agent.${domain}`;
    yield { type: 'dns_query', data: { recordName } };
    let txtRecord = '';
    try {
        // Use a public DNS-over-HTTPS resolver
        const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${recordName}&type=TXT`, {
            headers: { 'Accept': 'application/dns-json' }
        });
        if (!response.ok)
            throw new Error(`DNS query failed with status ${response.status}`);
        const data = await response.json();
        if (data.Status !== 0 || !data.Answer || data.Answer.length === 0) {
            throw new Error('No AID record found for this domain.');
        }
        txtRecord = data.Answer[0].data.replace(/"/g, '');
        yield { type: 'dns_success', data: { txtRecord } };
    }
    catch (e) {
        yield { type: 'dns_error', error: e.message || 'An unknown error occurred during DNS query.' };
        return;
    }
    if (txtRecord.startsWith('v=aid1')) {
        const parts = txtRecord.split(';').reduce((acc, part) => {
            const [key, ...value] = part.split('=');
            if (key && value.length)
                acc[key.trim()] = value.join('=').trim();
            return acc;
        }, {});
        // Case 1: TXT record points to a manifest file
        if (parts.config) {
            yield* fetchAndValidateManifest(parts.config);
            return;
        }
        // Case 2: TXT record is an inline profile
        yield { type: 'inline_profile', message: 'TXT record is an inline profile. Parsing...' };
        try {
            const isLocal = parts['pkg-id'] || parts['pkg-mgr'];
            const implementation = {
                name: parts.name || (isLocal ? 'Local Inline Profile' : 'Remote Inline Profile'),
                type: isLocal ? 'local' : 'remote',
                protocol: parts.proto || 'unknown',
                tags: parts.tags ? parts.tags.split(',') : [],
                execution: {},
                auth: {
                    scheme: parts.auth || 'none',
                    description: `Authentication via ${parts.auth || 'none'}`,
                    requiredSecrets: ['pat', 'apikey', 'basic'].includes(parts.auth) ? ['TOKEN'] : [],
                },
                requiredConfig: [], // Note: Complex config not supported in simple inline profiles
            };
            if (isLocal) {
                if (!parts['pkg-id'] || !parts['pkg-mgr']) {
                    throw new Error('Local inline profile is missing required fields (pkg-id, pkg-mgr).');
                }
                implementation.execution.command = parts.cmd || parts['pkg-mgr'];
                implementation.execution.args = parts.args ? parts.args.split(' ') : [parts['pkg-id']];
                implementation.package = {
                    manager: parts['pkg-mgr'],
                    identifier: parts['pkg-id'],
                };
                implementation.tags?.push(parts['pkg-mgr']);
            }
            else { // Remote inline profile
                if (!parts.uri) {
                    throw new Error('Remote inline profile is missing required field (uri).');
                }
                implementation.execution.uri = parts.uri;
            }
            implementation.tags?.push(implementation.protocol);
            yield { type: 'actionable_profile', data: { implementations: [implementation], domain: domain } };
        }
        catch (e) {
            yield { type: 'validation_error', error: e.message };
        }
        return;
    }
    // Legacy format support
    if (txtRecord.startsWith('aid-manifest=')) {
        const manifestUrl = txtRecord.substring('aid-manifest='.length);
        yield* fetchAndValidateManifest(manifestUrl);
        return;
    }
    yield { type: 'dns_error', error: 'Invalid or unrecognized TXT record format.' };
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
