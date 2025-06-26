# Schema Bump Plan (aid 1 → aid 1 (updated! ))

src/schemas.ts IS NOT CHANGABLE!! THIS CAN NOT BE CHANGED UNDER ANY CIRCUMSTANCES. THIS IS THE SINGLE SOURCE OF TRUTH and it is in line with the specification (src/specifiction.md)


## 1. Schema Changes Overview


### 1.1 Core Changes
- **Implementation Object**
  - `name`: Now REQUIRED (machine identifier, unique within manifest)
  - `title`: Now REQUIRED (human-readable display string)
  - `mcpVersion`: New OPTIONAL field (e.g., "2025-06-18")
  - `capabilities`: New OPTIONAL object (e.g., `{ structuredOutput: {}, resourceLinks: {} }`)

- **Authentication Object**
  - OAuth changes:
    - REMOVED: Static endpoints (`authorizationEndpoint`, etc.)
    - ADDED: `dynamicClientRegistration` boolean flag
  - Enhanced mTLS support via `certificate` object

### 1.2 Impact Surface
1. **Core Package**
   - `schemas.ts` (primary schema definitions)
   - `types.ts` (TypeScript type definitions)
   - Generated JSON Schema
   - Tests and snapshots

2. **Conformance Package**
   - All validators
   - Test fixtures (valid/invalid)
   - Snapshot tests

3. **Web UI**
   - Form components
   - Validation logic
   - Example manifests

## 2. Execution Plan

### Phase 1: Core Schema Update (Day 1-2)
1. Create branch `feat/schema-1`
2. Update `schemas.ts`:
   - Add new fields
   - Mark removed fields as deprecated
   - Update Zod schemas
3. Regenerate JSON Schema
4. Update type definitions
5. Add migration utilities
6. Update core tests

### Phase 2: Conformance Updates (Day 2-3)
1. Branch `feat/conformance-1`
2. Update validators for new requirements
3. Add test fixtures for new fields
4. Update snapshot tests
5. Add OAuth flow validation
6. Add capability validation

### Phase 3: Web UI Adaptation (Day 3-4)
1. Branch `feat/web-1`
2. Update form components
3. Add new field UI elements
4. Update validation
5. Update example manifests
6. Add migration helper UI

### Phase 4: Integration (Day 4-5)
1. Merge all branches
2. Full end-to-end testing
3. Documentation updates
4. Release preparation

## 3. Validation & Testing

### 3.1 Test Matrix
| Component | Test Focus | Success Criteria |
|-----------|------------|------------------|
| Schema | Field validation | All new fields parse correctly |
| OAuth | Discovery flow | RFC 9728 compliance |
| Capabilities | MCP alignment | Runtime negotiation respected |
| Web UI | Form handling | All fields editable |

### 3.2 Migration Testing
- Forward compatibility
- Backward compatibility
- Schema version detection
- OAuth endpoint removal
- Capability hints

## 4. Rollback Plan

### 4.1 Immediate Rollback
1. Revert schema changes
2. Restore previous validators
3. Revert UI changes

### 4.2 Graceful Degradation
- Keep v1.0 support
- Warn on deprecated fields
- Maintain old endpoints temporarily

## 5. Post-Release Tasks

### 5.1 Documentation
- Update specification
- Add migration guide
- Update examples

### 5.2 Monitoring
- Track schema version usage
- Monitor OAuth flows
- Collect capability usage metrics

## 6. Success Criteria

1. All tests pass
2. Web UI fully functional
3. No breaking changes
4. Migration path clear
5. Documentation complete

## 7. Timeline

- Day 1: Schema updates
- Day 2: Conformance updates
- Day 3: Web UI updates
- Day 4: Integration
- Day 5: Testing & Documentation
- Day 6: Release & Monitoring 



reminder. src/schemas.ts can't be changed. It is the single source of truth! 