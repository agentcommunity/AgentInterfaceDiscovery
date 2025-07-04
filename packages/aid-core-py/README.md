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

# Load your manifest from a file
with open("path/to/your/aid.json", "r") as f:
    manifest_dict = json.load(f)

# Validate it
is_valid, error = validate_manifest(manifest_dict)

if error:
    # This indicates a structural or schema validation error
    print(f"Validation error: {error}")
elif is_valid:
    print("Manifest is valid!")
    # You can now load the data into the Pydantic models
    manifest = AidManifest.model_validate(manifest_dict)
    print(f"Validated manifest for '{manifest.service_name}'")
else:
    print("Manifest is invalid.")

```

The auto-generated Pydantic models are located in `aid_core_py/models.py` and the validation logic, which embeds the canonical schema, is in `aid_core_py/__init__.py`. 