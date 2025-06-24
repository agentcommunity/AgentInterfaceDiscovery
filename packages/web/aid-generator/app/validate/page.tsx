"use client"

import { useState } from "react"
import {
  validateManifest,
  validateTxt,
  validatePair,
} from "@aid/conformance"
import { buildManifest } from "@aid/core/browser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArtefactSelector } from "@/components/validator/ArtefactSelector"
import { DropZone } from "@/components/validator/DropZone"
import { ValidationReport } from "@/components/validator/ValidationReport"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ValidationResult } from "@aid/conformance"
import type { AidGeneratorConfig, AidManifest } from "@aid/core/browser"

type ArtefactType = "config" | "manifest" | "txt" | "pair"

export default function ValidatePage() {
  const [artefactType, setArtefactType] = useState<ArtefactType>("manifest")
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [validatedContent, setValidatedContent] = useState<string>("")

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
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">AID Validator</h1>
        <p className="text-muted-foreground mt-2">
          Validate your Agent Interface Discovery artifacts instantly.
        </p>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <ArtefactSelector
            value={artefactType}
            onChange={(v) => handleArtefactChange(v as ArtefactType)}
          />

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File(s)</TabsTrigger>
              <TabsTrigger value="paste">Paste Content</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="mt-4">
                {artefactType === "pair" ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <DropZone
                      file={file1}
                      onFileDrop={(f) => handleFileDrop(f, 1)}
                      title="Generator Config"
                    />
                    <DropZone
                      file={file2}
                      onFileDrop={(f) => handleFileDrop(f, 2)}
                      title="Manifest File"
                    />
                  </div>
                ) : (
                  <DropZone file={file1} onFileDrop={(f) => handleFileDrop(f, 1)} />
                )}
              </div>
            </TabsContent>
            <TabsContent value="paste">
              <div className="mt-4">
                <Textarea
                  placeholder="Paste your JSON or TXT content here..."
                  value={pastedText}
                  onChange={(e) => {
                    resetState()
                    setPastedText(e.target.value)
                  }}
                  rows={10}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-center">
            <Button onClick={handleValidate} disabled={isLoading || (!file1 && !pastedText)}>
              {isLoading ? "Validating..." : "Validate"}
            </Button>
          </div>

          <ValidationReport result={result} content={validatedContent} />
        </CardContent>
      </Card>
    </main>
  )
} 