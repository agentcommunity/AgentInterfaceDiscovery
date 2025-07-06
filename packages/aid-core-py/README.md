> **DEPRECATION NOTICE**
>
> This repository and all associated packages are deprecated and no longer maintained. This project served as the initial research and development phase for the Agent Interface Discovery (AID) specification.
>
> The official v1 standard is now a simpler, DNS-based protocol. All new development has moved to the new repository.
>
> **Please migrate to the new official resources:**
> *   **New Repository:** [https://github.com/agentcommunity/agent-interface-discovery](https://github.com/agentcommunity/agent-interface-discovery)
> *   **NPM Package:** `@agentcommunity/aid`

# Python SDK for Agent Interface Discovery (AID)

[![PyPI version](https://badge.fury.io/py/aid-core-py.svg)](https://badge.fury.io/py/aid-core-py)

This package provides canonical Python models (Pydantic V2) and validation helpers for working with [Agent Interface Discovery (AID)](https://github.com/agentcommunity/AgentInterfaceDiscovery) manifests. The models are auto-generated from the canonical [AID JSON Schema](https://github.com/agentcommunity/AgentInterfaceDiscovery/blob/main/packages/aid-schema/aid.schema.json) to prevent drift.

## Installation

```sh
pip install aid-core-py
```

## Usage

The library provides helpers to validate manifests from a file path, a dictionary, or a raw string.

```python
import json
from aid_core_py import validate_manifest
from aid_core_py.models import AidManifest

with open("path/to/your/aid.json", "r") as f:
    manifest_dict = json.load(f)

is_valid, error = validate_manifest(manifest_dict)
if is_valid:
    manifest = AidManifest.model_validate(manifest_dict)
    print(f"Validated manifest for '{manifest.name}'")
    # Example: Find the first usable implementation
    if manifest.implementations:
        first_impl = manifest.implementations[0]
        print(f"First implementation: '{first_impl.title}'")
else:
  print(f"Validation error: {error}")
```

The auto-generated Pydantic models are located in `aid_core_py/models.py` and the validation logic, which embeds the canonical schema, is in `aid_core_py/__init__.py`. 