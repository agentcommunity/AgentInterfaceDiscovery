# Go SDK for Agent Interface Discovery (AID)

[![Go Reference](https://pkg.go.dev/badge/github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore.svg)](https://pkg.go.dev/github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore)

This module provides canonical Go structs and validation helpers for working with [Agent Interface Discovery (AID)](https://github.com/agentcommunity/AgentInterfaceDiscovery) manifests. The models are auto-generated from the canonical [AID JSON Schema](https://github.com/agentcommunity/AgentInterfaceDiscovery/blob/main/packages/aid-schema/aid.schema.json) to prevent drift.

## Installation

```sh
go get github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore
```

## Usage

The library can validate a manifest from a file path or from a byte slice.

```go
package main

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore"
)

func main() {
	manifestBytes, _ := os.ReadFile("path/to/your/aid.json")
	isValid, err := aidcore.ValidateManifest(manifestBytes)

	if err != nil {
		fmt.Printf("Validation error: %v\n", err)
		return
	}

	if isValid {
		var manifest aidcore.AidManifest
		json.Unmarshal(manifestBytes, &manifest)
		fmt.Printf("Manifest for '%s' is valid!\n", manifest.Name)

		// Example: Find the first usable implementation
		if len(manifest.Implementations) > 0 {
			firstImpl := manifest.Implementations[0]
			fmt.Printf("First implementation: '%s'\n", firstImpl.Title)
		}
	}
}
```

The auto-generated Go structs are located in `aidcore/models.go` and the validation logic, which embeds the canonical schema, is in `aidcore/validate.go`. 