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
	"fmt"
	"os"

	"github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore"
)

func main() {
	// Read the manifest file
	manifestBytes, err := os.ReadFile("path/to/your/aid.json")
	if err != nil {
		panic(err)
	}

	// Validate it
	isValid, validationErr := aidcore.ValidateManifest(manifestBytes)
	if validationErr != nil {
		// This indicates a structural or schema validation error
		fmt.Printf("Validation error: %v\n", validationErr)
		return
	}

	if isValid {
		fmt.Println("Manifest is valid!")
		// You can now unmarshal the bytes into the generated structs
		var manifest aidcore.AidManifest
		// ... unmarshal logic ...
	} else {
		fmt.Println("Manifest is invalid.")
	}
}
```

The auto-generated Go structs are located in `aidcore/models.go` and the validation logic, which embeds the canonical schema, is in `aidcore/validate.go`. 