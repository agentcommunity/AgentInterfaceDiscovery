package main

import (
    "flag"
    "fmt"
    "io/ioutil"
    "log"
    "os"

    "github.com/agentcommunity/aid-core-go/aidcore"
)

func main() {
    quiet := flag.Bool("quiet", false, "suppress output")
    flag.Parse()

    args := flag.Args()
    if len(args) == 0 {
        log.Fatalf("usage: aid-validate <file.json|file.txt> [file2]")
    }

    content, err := ioutil.ReadFile(args[0])
    if err != nil {
        log.Fatal(err)
    }

    // For demo: only manifest validation
    if err := aidcore.ValidateManifest(content); err != nil {
        if !*quiet {
            fmt.Fprintln(os.Stderr, "❌", err)
        }
        os.Exit(1)
    }
    if !*quiet {
        fmt.Println("✓ validation passed")
    }
} 