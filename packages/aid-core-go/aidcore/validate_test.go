package aidcore_test

import (
    "io/ioutil"
    "path/filepath"
    "testing"

    "github.com/agentcommunity/aid-core-go/aidcore"
)

func TestValidateManifestValid(t *testing.T) {
    root := filepath.Join("..", "..", "aid-conformance", "tests", "fixtures", "valid")
    files, err := ioutil.ReadDir(root)
    if err != nil {
        t.Fatalf("%v", err)
    }
    for _, f := range files {
        if filepath.Ext(f.Name()) != ".json" {
            continue
        }
        content, err := ioutil.ReadFile(filepath.Join(root, f.Name()))
        if err != nil {
            // skip broken symlinks
            continue
        }
        if err := aidcore.ValidateManifest(content); err != nil {
            t.Errorf("expected valid, got error for %s: %v", f.Name(), err)
        }
    }
}

func TestValidateManifestInvalid(t *testing.T) {
    root := filepath.Join("..", "..", "aid-conformance", "tests", "fixtures", "invalid")
    files, err := ioutil.ReadDir(root)
    if err != nil {
        t.Fatalf("%v", err)
    }
    for _, f := range files {
        if filepath.Ext(f.Name()) != ".json" {
            continue
        }
        content, err := ioutil.ReadFile(filepath.Join(root, f.Name()))
        if err != nil {
            continue
        }
        if err := aidcore.ValidateManifest(content); err == nil {
            t.Errorf("expected error, got nil for %s", f.Name())
        }
    }
}

func TestValidateTxtBasic(t *testing.T) {
    txt := `_agent.example.com. 3600 IN TXT "v=aid1;uri=https://api.example.com;proto=mcp"`
    if err := aidcore.ValidateTxt(txt); err != nil {
        t.Fatalf("expected txt valid: %v", err)
    }
}

func TestValidatePair(t *testing.T) {
    manifestJSON := []byte(`{"schemaVersion":"1","name":"Simple Service","implementations":[{"type":"remote","name":"prod","title":"prod","protocol":"mcp","uri":"https://api.example.com","authentication":{"scheme":"none"}}]}`)
    txt := `_agent.example.com. 3600 IN TXT "v=aid1;uri=https://api.example.com;proto=mcp"`
    if err := aidcore.ValidatePair(manifestJSON, txt); err != nil {
        t.Fatalf("pair validation failed: %v", err)
    }
} 