"use client"

import { useState } from "react"
import {
  validateManifest,
  validateTxt,
  validatePair,
} from "@agentcommunity/aid-conformance"
import { buildManifest } from "@agentcommunity/aid-core/browser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArtefactSelector } from "@/components/validator/ArtefactSelector"
import { DropZone } from "@/components/validator/DropZone"
import { ValidationReport } from "@/components/validator/ValidationReport"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Shield, CheckCircle, Upload, FileText, Sparkles, Settings } from "lucide-react"
import type { ValidationResult } from "@agentcommunity/aid-conformance"
import type { AidGeneratorConfig, AidManifest } from "@agentcommunity/aid-core/browser"
import { EditableCodeblock } from "@/components/validator/EditableCodeblock"

type ArtefactType = "config" | "manifest" | "txt" | "pair"

export default function ValidatePage() {
  const [artefactType, setArtefactType] = useState<ArtefactType>("manifest")
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [validatedContent, setValidatedContent] = useState<string>("")

  const artefactDescriptions: Record<ArtefactType, string> = {
    manifest: "A generated aid.json manifest that describes your service interface.",
    config: "The generator's config.json file which you use to produce a manifest.",
    txt: "The DNS TXT record (aid.txt) that you publish under your domain.",
    pair: "A config.json and its corresponding aid.json for cross-validation.",
  }

  const artefactPlaceholders: Record<ArtefactType, string> = {
    manifest: "Paste your manifest JSON (aid.json) here...",
    config: "Paste your generator config JSON (config.json) here...",
    txt: "Paste your DNS TXT record value here (e.g., 'v=aid1;uri=...')",
    pair: "Paste either your config.json or aid.json content here...",
  }

  const getDropZoneTitle = (type: Exclude<ArtefactType, "pair">): string => {
    switch (type) {
      case "manifest":
        return "Manifest File (aid.json)"
      case "config":
        return "Generator Config (config.json)"
      case "txt":
        return "DNS TXT (aid.txt)"
      default:
        return "File"
    }
  }

  const resetState = () => {
    setResult(null)
    setFile1(null)
    setFile2(null)
    setPastedText("")
    setValidatedContent("")
    setIsLoading(false)
  }

  const handleArtefactChange = (type: ArtefactType) => {
    setArtefactType(type)
    resetState()
  }

  const handleFileDrop = (file: File | null, index: 1 | 2) => {
    resetState()
    if (index === 1) setFile1(file)
    if (index === 2) setFile2(file)
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target?.result as string)
      reader.onerror = (error) => reject(error)
      reader.readAsText(file)
    })
  }

  const handleValidate = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      if (pastedText) {
        setValidatedContent(pastedText)
        if (artefactType === "txt") {
          setResult(validateTxt(pastedText))
        } else {
          const json = JSON.parse(pastedText)
          if (artefactType === "manifest") {
            setResult(validateManifest(json))
          } else if (artefactType === "config") {
            const config = json as AidGeneratorConfig
            setResult(validatePair(config, buildManifest(config)))
          }
        }
      } else if (file1) {
        const content1 = await readFileContent(file1)
        setValidatedContent(content1)
        const json1 = JSON.parse(content1)

        if (artefactType === "manifest") {
          setResult(validateManifest(json1))
        } else if (artefactType === "config") {
          const config = json1 as AidGeneratorConfig
          setResult(validatePair(config, buildManifest(config)))
        } else if (artefactType === "txt") {
          setResult(validateTxt(content1))
        } else if (artefactType === "pair" && file2) {
          const content2 = await readFileContent(file2)
          const json2 = JSON.parse(content2)
          // Basic detection of config vs manifest
          if ("serviceName" in json1 && "implementations" in json2) {
            setResult(validatePair(json1 as AidGeneratorConfig, json2 as AidManifest))
          } else if ("serviceName" in json2 && "implementations" in json1) {
            setResult(validatePair(json2 as AidGeneratorConfig, json1 as AidManifest))
          } else {
            setResult({ ok: false, errors: [{ message: "Could not determine which file is the config and which is the manifest." }] })
          }
        }
      }
    } catch (e: any) {
      setResult({ ok: false, errors: [{ message: e.message }] })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header Section */}
      <div className="relative py-6 md:py-8 border-b border-border/50 bg-background">
        <div className="container mx-auto container-padding">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              AID <span className="text-muted-foreground">Validator</span>
            </h1>
            
            <p className="text-muted-foreground max-w-lg mx-auto">
              Validate your Agent Interface Discovery artifacts instantly against the official specification.
            </p>
            
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>Specification compliant</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Detailed reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto container-padding pb-24">
        <Card className="w-full max-w-4xl mx-auto shadow-soft-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Validation Configuration
            </CardTitle>
            <CardDescription>
              Select the type of artifact you want to validate and choose your input method.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Artifact Type Selector */}
            <div className="space-y-4">
              <ArtefactSelector
                value={artefactType}
                onChange={(v) => handleArtefactChange(v as ArtefactType)}
              />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {artefactDescriptions[artefactType]}
                </p>
              </div>
            </div>

            {/* Input Method Tabs */}
            <Tabs defaultValue="paste" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="paste">Paste Content</TabsTrigger>
                <TabsTrigger value="upload">Upload File(s)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Upload className="h-5 w-5" />
                      File Upload
                    </CardTitle>
                    <CardDescription>
                      Drag and drop your files or click to browse.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {artefactType === "pair" ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        <DropZone
                          file={file1}
                          onFileDrop={(f) => handleFileDrop(f, 1)}
                          title="Config File (config.json)"
                        />
                        <DropZone
                          file={file2}
                          onFileDrop={(f) => handleFileDrop(f, 2)}
                          title="Manifest File (aid.json)"
                        />
                      </div>
                    ) : (
                      <DropZone
                        file={file1}
                        onFileDrop={(f) => handleFileDrop(f, 1)}
                        title={getDropZoneTitle(artefactType)}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="paste" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      Paste Content
                    </CardTitle>
                    <CardDescription>
                      Paste your {artefactType} content directly into the editor.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EditableCodeblock
                      value={pastedText}
                      onChange={(val) => {
                        resetState()
                        setPastedText(val)
                      }}
                      placeholder={artefactPlaceholders[artefactType]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Validate Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleValidate} 
                disabled={isLoading || (!file1 && !pastedText)}
                size="lg"
                className="min-w-32"
              >
                {isLoading ? "Validating..." : "Validate"}
              </Button>
            </div>

            {/* Validation Results */}
            <ValidationReport result={result} content={validatedContent} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 