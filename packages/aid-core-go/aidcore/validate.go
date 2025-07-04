package aidcore

import (
    _ "embed"
    "encoding/json"
    "errors"
    "strings"

    "github.com/santhosh-tekuri/jsonschema/v5"
)

//go:embed aid.schema.json
var schemaBytes []byte

var compiled *jsonschema.Schema

func init() {
    sch, err := jsonschema.CompileString("aid", string(schemaBytes))
    if err != nil {
        panic(err)
    }
    compiled = sch
}

func ValidateManifest(manifestJSON []byte) error {
    var v interface{}
    if err := json.Unmarshal(manifestJSON, &v); err != nil {
        return err
    }
    return compiled.Validate(v)
}

// ValidateTxt checks basic structure of an AID TXT record string.
func ValidateTxt(txt string) error {
    // Trim whitespace but keep record intact
    txt = strings.TrimSpace(txt)
    // The important key-value segment starts with v=aid1; ensure it exists anywhere
    if !strings.Contains(txt, "v=aid1") {
        return errors.New("TXT missing v=aid1")
    }
    // Basic presence check for uri= or config=
    if !strings.Contains(txt, "uri=") && !strings.Contains(txt, "config=") {
        return errors.New("TXT must contain uri or config key")
    }
    return nil
}

// ValidatePair validates manifest and txt.
func ValidatePair(manifestJSON []byte, txt string) error {
    if err := ValidateManifest(manifestJSON); err != nil {
        return err
    }
    return ValidateTxt(txt)
} 