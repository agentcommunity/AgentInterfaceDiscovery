Of course. Here is a detailed, human-readable changelog that documents the precise differences between the old and new schemas.ts files.

Changelog: AID Manifest Schemas (v1.0 → v1.1)

This document outlines the normative and non-normative changes to the schemas.ts file, reflecting the AID specification's alignment with MCP 2025-06-18 and modern OAuth 2.0 best practices.

1. High-Level Summary

The primary driver for this update is the removal of static OAuth endpoint definitions in favor of a dynamic discovery model mandated by IETF RFCs. This significantly enhances security and forward-compatibility. Additionally, the schemas have been enriched with new fields to support MCP's evolving capabilities and to improve the clarity of intent between machine-readable identifiers and human-readable titles.

2. 💥 Breaking Changes

These changes will require providers to update their manifests and clients to update their parsing and handling logic.

Area	Change	Rationale / Details
OAuth Configuration	The authentication.oauth object has been completely overhauled.	To align with modern security standards (RFC 8414/9728), static endpoints are removed. Clients MUST now use dynamic discovery.
Field Rename	The configuration field in an implementation was renamed to requiredConfig.	The new name more accurately reflects that these are user-provided configuration values, distinct from other parts of the manifest.
3. ✨ New Features & Additions

These new fields provide enhanced functionality and hints for clients.

Schema	Field	Description
oAuthDetailsSchema	dynamicClientRegistration	Added an optional boolean to signal that the Authorization Server supports RFC 7591 Dynamic Client Registration.
baseImplementationSchema	title	Added a mandatory, human-readable display name for an implementation. The existing name field is now for machine-readable identifiers.
baseImplementationSchema	mcpVersion	Added an optional, non-binding string hint for the supported MCP version (e.g., "2025-06-18").
baseImplementationSchema	capabilities	Added an optional, non-binding object to hint at supported MCP features like structuredOutput and resourceLinks.
osExecutionSchema	digest	Added an optional content digest to the platformOverrides object, allowing for verification of platform-specific packages.
4. 🛠️ Improvements & Minor Changes

These changes improve validation, clarity, and developer experience without introducing new features.

Schema	Field / Change	Description
authConfigSchema	basic auth	The credentials array is now validated with .nonempty(), making it mandatory to provide both username and password for this scheme.
implementationConfigSchema	mtls validation	The .refine() logic for mtls is now more specific, requiring the certificate object to contain either a source or an enrollmentEndpoint.
baseImplementationSchema	mcpVersion format	Added .regex() validation to ensure the version string is in the YYYY-MM-DD format.
Schema Descriptions	Various .describe() calls	Added descriptive text to dynamicClientRegistration, mcpVersion, capabilities, osExecutionSchema.digest, and domain to improve auto-generated documentation and developer guidance.
5. ⛔ Removals

The following fields have been removed from the schema and are now considered deprecated.

Schema	Field(s) Removed	Reason
authConfigSchema	oauth.authorizationEndpoint	Replaced by dynamic discovery (RFC 8414/9728).
authConfigSchema	oauth.deviceAuthorizationEndpoint	Replaced by dynamic discovery (RFC 8414/9728).
authConfigSchema	oauth.tokenEndpoint	Replaced by dynamic discovery (RFC 8414/9728).
baseImplementationSchema	configuration	Renamed to requiredConfig for clarity.