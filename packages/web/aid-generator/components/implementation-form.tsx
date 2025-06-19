"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X, HelpCircle, Terminal } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UrlInput } from "@/components/ui/url-input"
import { useState, useEffect } from "react"
import type { AidGeneratorConfig } from "@aid/core"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ImplementationFormProps {
  form: UseFormReturn<AidGeneratorConfig>
  index: number
}

export function ImplementationForm({ form, index }: ImplementationFormProps) {
  const implementationType = form.watch(`implementations.${index}.type`)
  const authScheme = form.watch(`implementations.${index}.authentication.scheme`)
  const packageIdentifier = form.watch(`implementations.${index}.package.identifier`)
  const packageManager = form.watch(`implementations.${index}.package.manager`)
  const [newTag, setNewTag] = useState("")

  // Auto-sync execution command with package manager
  useEffect(() => {
    if (implementationType === "local" && packageManager) {
      const currentCommand = form.getValues(`implementations.${index}.execution.command`)
      if (!currentCommand || currentCommand !== packageManager) {
        form.setValue(`implementations.${index}.execution.command`, packageManager)
      }
    }
  }, [packageManager, implementationType, form, index])

  // Auto-suggest args based on package identifier
  useEffect(() => {
    if (implementationType === "local" && packageIdentifier && packageManager === "npx") {
      const currentArgs = form.getValues(`implementations.${index}.execution.args`)
      if (!currentArgs || currentArgs.length === 0) {
        form.setValue(`implementations.${index}.execution.args`, ["-y", packageIdentifier])
      }
    }
  }, [packageIdentifier, packageManager, implementationType, form, index])

  const addTag = () => {
    if (!newTag.trim()) return
    const currentTags = form.getValues(`implementations.${index}.tags`) || []
    form.setValue(`implementations.${index}.tags`, [...currentTags, newTag.trim()])
    setNewTag("")
  }

  const removeTag = (tagIndex: number) => {
    const currentTags = form.getValues(`implementations.${index}.tags`) || []
    form.setValue(
      `implementations.${index}.tags`,
      currentTags.filter((_, i) => i !== tagIndex),
    )
  }

  const addConfigItem = () => {
    const currentConfig = form.getValues(`implementations.${index}.configuration`) || []
    form.setValue(`implementations.${index}.configuration`, [
      ...currentConfig,
      {
        key: "",
        description: "",
        type: "string" as const,
        defaultValue: "",
        secret: false,
      },
    ])
  }

  const removeConfigItem = (configIndex: number) => {
    const currentConfig = form.getValues(`implementations.${index}.configuration`) || []
    form.setValue(
      `implementations.${index}.configuration`,
      currentConfig.filter((_, i) => i !== configIndex),
    )
  }

  const addCredentialItem = () => {
    const currentCredentials = form.getValues(`implementations.${index}.authentication.credentials`) || []
    form.setValue(`implementations.${index}.authentication.credentials`, [...currentCredentials, { key: "", description: "" }])
  }

  const removeCredentialItem = (credIndex: number) => {
    const currentCredentials = form.getValues(`implementations.${index}.authentication.credentials`) || []
    form.setValue(
      `implementations.${index}.authentication.credentials`,
      currentCredentials.filter((_, i) => i !== credIndex),
    )
  }

  const addRequiredPathItem = () => {
    const currentPaths = form.getValues(`implementations.${index}.requiredPaths`) || []
    form.setValue(`implementations.${index}.requiredPaths`, [
      ...currentPaths,
      { key: "", description: "", type: "file" as const },
    ])
  }

  const removeRequiredPathItem = (pathIndex: number) => {
    const currentPaths = form.getValues(`implementations.${index}.requiredPaths`) || []
    form.setValue(
      `implementations.${index}.requiredPaths`,
      currentPaths.filter((_, i) => i !== pathIndex),
    )
  }

  const addPlatformOverrideItem = () => {
    const currentOverrides = form.getValues(`implementations.${index}.platformOverrides`) || {}
    const newKey = `platform${Object.keys(currentOverrides).length + 1}`
    form.setValue(`implementations.${index}.platformOverrides`, {
      ...currentOverrides,
      [newKey]: { command: "", args: [] },
    })
  }

  const removePlatformOverrideItem = (key: string) => {
    const currentOverrides = form.getValues(`implementations.${index}.platformOverrides`) || {}
    const newOverrides = { ...currentOverrides }
    delete newOverrides[key]
    form.setValue(`implementations.${index}.platformOverrides`, newOverrides)
  }

  const currentTags = form.watch(`implementations.${index}.tags`) || []
  const currentConfig = form.watch(`implementations.${index}.configuration`) || []
  const currentCredentials = form.watch(`implementations.${index}.authentication.credentials`) || []
  const currentRequiredPaths = form.watch(`implementations.${index}.requiredPaths`) || []
  const currentPlatformOverrides = form.watch(`implementations.${index}.platformOverrides`) || {}

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`implementations.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Name
                  <span className="text-red-500">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Human-readable name for this implementation</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Example: &apos;Production API&apos; or &apos;Auth0 MCP (run)&apos;
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Auth0 MCP (run)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`implementations.${index}.protocol`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Protocol
                  <span className="text-red-500">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Communication protocol used by this implementation</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        MCP = Model Context Protocol, A2A = Agent-to-Agent, None = Setup/utility commands
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mcp">MCP</SelectItem>
                    <SelectItem value="a2a">A2A</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`implementations.${index}.status`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Status
                  <span className="text-muted-foreground italic text-sm">(optional)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark this implementation as active or deprecated</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue="active">
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            name={`implementations.${index}.revocationURL` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Revocation URL
                  <span className="text-muted-foreground italic text-sm">(optional)</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Overrides global revocation URL for this implementation</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <UrlInput
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={field.onChange}
                    placeholder="example.com/status"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Tags</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Optional labels to categorize this implementation</p>
                <p className="text-xs text-muted-foreground mt-1">Examples: &apos;local&apos;, &apos;tools&apos;, &apos;setup&apos;, &apos;production&apos;</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-3 pl-6 border-l-2 border-muted">
            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeTag(tagIndex)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="local, tools, setup..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Type-specific fields */}
        {implementationType === "remote" && (
          <FormField
            control={form.control}
            name={`implementations.${index}.uri`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  URI
                  <span className="text-red-500">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>HTTPS endpoint where your remote service is accessible</p>
                      <p className="text-xs text-muted-foreground mt-1">Example: api.example.com/v1</p>
                      <p className="text-xs text-muted-foreground">https:// will be added automatically</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <FormControl>
                  <UrlInput value={field.value} onChange={field.onChange} placeholder="api.example.com/v1" />
                </FormControl>
                <FormDescription>HTTPS endpoint for your remote service</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {implementationType === "local" && (
          <>
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Developer Security Notice</AlertTitle>
              <AlertDescription>
                You are creating a manifest for local execution. Clients running this command should require explicit
                user consent and verify its integrity. See AID Spec Section 4.1 for client responsibilities.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Package Configuration</h3>
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`implementations.${index}.package.manager`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Manager
                          <span className="text-red-500">*</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Package manager used to run this implementation</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                npx = Node packages, docker = Containers, pip = Python packages
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select manager" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="docker">Docker</SelectItem>
                            <SelectItem value="npx">NPX</SelectItem>
                            <SelectItem value="pip">Pip</SelectItem>
                            <SelectItem value="npm">NPM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`implementations.${index}.package.identifier`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Identifier
                          <span className="text-red-500">*</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Package name or container image to run</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Examples: @auth0/auth0-mcp-server, my-service:latest
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="@auth0/auth0-mcp-server" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`implementations.${index}.package.digest`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Digest
                        <span className="text-muted-foreground italic text-sm">(optional)</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>SHA256 digest for package verification and security</p>
                            <p className="text-xs text-muted-foreground mt-1">Example: sha256:abc123...</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="sha256:..." {...field} />
                      </FormControl>
                      <FormDescription>SHA256 digest for package verification</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Execution Configuration</h3>
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <FormField
                  control={form.control}
                  name={`implementations.${index}.execution.command`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Command
                        <span className="text-red-500">*</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Base command to execute (usually matches the package manager)</p>
                            <p className="text-xs text-muted-foreground mt-1">Examples: npx, docker, python</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="npx" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`implementations.${index}.execution.args`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Arguments
                        <span className="text-red-500">*</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Command line arguments, one per line</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Use ${"{"}config.VAR{"}"} for user configuration variables
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Use ${"{"}package.identifier{"}"} for the package name
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="-y&#10;@auth0/auth0-mcp-server&#10;run&#10;${config.TOOLS_FLAG}&#10;${config.READ_ONLY_FLAG}"
                          value={Array.isArray(field.value) ? field.value.join("\n") : ""}
                          onChange={(e) => {
                            const values = e.target.value.split("\n").filter(Boolean)
                            field.onChange(values.length > 0 ? values : [])
                          }}
                          rows={6}
                        />
                      </FormControl>
                      <FormDescription>
                        One argument per line. Use ${"{"}config.VARIABLE_NAME{"}"} for configuration substitution.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />

            {/* Required Paths */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Required Paths</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Local filesystem paths the user must provide to run this implementation.</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        These become ${"{"}path.KEY{"}"} substitutions in args.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addRequiredPathItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Path
                </Button>
              </div>

              {currentRequiredPaths.length > 0 && (
                <div className="pl-6 border-l-2 border-muted space-y-6">
                  {currentRequiredPaths.map((_, pathIndex) => (
                    <div key={pathIndex}>
                      {pathIndex > 0 && <Separator className="mb-6" />}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium">Path {pathIndex + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRequiredPathItem(pathIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`implementations.${index}.requiredPaths.${pathIndex}.key`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Key</FormLabel>
                                <FormControl>
                                  <Input placeholder="CONFIG_DIR" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`implementations.${index}.requiredPaths.${pathIndex}.type`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="file">File</SelectItem>
                                    <SelectItem value="directory">Directory</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`implementations.${index}.requiredPaths.${pathIndex}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Path to config directory" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Separator />

            {/* Platform Overrides */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">Platform Overrides</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Define different execution configs for specific platforms.</p>
                      <p className="text-xs text-muted-foreground mt-1">Keys: &apos;windows&apos;, &apos;linux&apos;, &apos;macos&apos;</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addPlatformOverrideItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Override
                </Button>
              </div>

              {Object.keys(currentPlatformOverrides).length > 0 && (
                <div className="pl-6 border-l-2 border-muted space-y-6">
                  {Object.entries(currentPlatformOverrides).map(([key], overrideIndex) => (
                    <div key={key}>
                      {overrideIndex > 0 && <Separator className="mb-6" />}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium">Override {overrideIndex + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removePlatformOverrideItem(key)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`implementations.${index}.platformOverrides.${key}.command`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Platform Key</FormLabel>
                              <FormControl>
                                <Input placeholder="windows" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="pl-6 border-l-2 border-muted space-y-4">
                          <FormField
                            control={form.control}
                            name={`implementations.${index}.platformOverrides.${key}.command`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Command</FormLabel>
                                <FormControl>
                                  <Input placeholder="docker.exe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`implementations.${index}.platformOverrides.${key}.args`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Arguments</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="run..."
                                    value={Array.isArray(field.value) ? field.value.join("\n") : ""}
                                    onChange={(e) => {
                                      const values = e.target.value.split("\n").filter(Boolean)
                                      field.onChange(values.length > 0 ? values : [])
                                    }}
                                    rows={3}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Authentication */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Authentication</h3>
          <div className="space-y-4 pl-6 border-l-2 border-muted">
            <FormField
              control={form.control}
              name={`implementations.${index}.authentication.scheme`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Scheme
                    <span className="text-red-500">*</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Authentication method required to use this implementation</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Choose &apos;none&apos; for public APIs or setup commands
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select authentication scheme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="pat">Personal Access Token</SelectItem>
                      <SelectItem value="apikey">API Key</SelectItem>
                      <SelectItem value="basic">HTTP Basic</SelectItem>
                      <SelectItem value="oauth2_device">OAuth2 Device Flow</SelectItem>
                      <SelectItem value="oauth2_code">OAuth2 Authorization Code</SelectItem>
                      <SelectItem value="oauth2_service">OAuth2 Service-to-Service</SelectItem>
                      <SelectItem value="mtls">Mutual TLS</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {authScheme !== "none" && (
              <FormField
                control={form.control}
                name={`implementations.${index}.authentication.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Description
                      <span className="text-muted-foreground italic text-sm">(optional)</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Human-readable description of the authentication process</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Example: &apos;Device flow starts on first run&apos;
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Device flow starts on first run" {...field} />
                    </FormControl>
                    <FormDescription>Human-readable description of the authentication process</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {(authScheme === "pat" || authScheme === "apikey") && (
              <FormField
                control={form.control}
                name={`implementations.${index}.authentication.tokenUrl`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Token URL
                      <span className="text-muted-foreground italic text-sm">(optional)</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>A link to where users can generate this token</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <UrlInput
                        value={typeof field.value === "string" ? field.value : ""}
                        onChange={field.onChange}
                        placeholder="example.com/account/tokens"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Credential Items for multi-part secrets */}
            {authScheme !== "none" && authScheme !== "mtls" && (
              <div className="space-y-4 mt-4 pt-4 border-t border-muted">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Credential Prompts</h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Define prompts for multi-part secrets like Client ID & Secret.</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          These become ${"{"}auth.KEY{"}"} substitutions in args.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addCredentialItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Credential
                  </Button>
                </div>
                {currentCredentials.length > 0 && (
                  <div className="pl-6 border-l-2 border-muted space-y-6">
                    {currentCredentials.map((_, credIndex) => (
                      <div key={credIndex}>
                        {credIndex > 0 && <Separator className="mb-6" />}
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <h5 className="text-sm font-medium">Credential {credIndex + 1}</h5>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCredentialItem(credIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`implementations.${index}.authentication.credentials.${credIndex}.key`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Key</FormLabel>
                                  <FormControl>
                                    <Input placeholder="CLIENT_ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`implementations.${index}.authentication.credentials.${credIndex}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your OAuth Client ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* OAuth-specific fields */}
            {(authScheme === "oauth2_device" || authScheme === "oauth2_code" || authScheme === "oauth2_service") && (
              <div className="space-y-4 mt-4 pt-4 border-t border-muted">
                <h4 className="text-sm font-medium text-muted-foreground">OAuth Configuration</h4>
                <FormField
                  control={form.control}
                  name={`implementations.${index}.authentication.oauth.tokenEndpoint`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Token Endpoint
                        <span className="text-muted-foreground italic text-sm">(optional)</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>OAuth endpoint for exchanging codes/credentials for tokens</p>
                            <p className="text-xs text-muted-foreground mt-1">Example: auth0.com/oauth/token</p>
                            <p className="text-xs text-muted-foreground">https:// will be added automatically</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <UrlInput value={field.value} onChange={field.onChange} placeholder="auth0.com/oauth/token" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {authScheme === "oauth2_device" && (
                  <FormField
                    control={form.control}
                    name={`implementations.${index}.authentication.oauth.deviceAuthorizationEndpoint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          Device Authorization Endpoint
                          <span className="text-muted-foreground italic text-sm">(optional)</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>OAuth endpoint for device flow authorization</p>
                              <p className="text-xs text-muted-foreground mt-1">Example: auth0.com/oauth/device/code</p>
                              <p className="text-xs text-muted-foreground">https:// will be added automatically</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <UrlInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="auth0.com/oauth/device/code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`implementations.${index}.authentication.oauth.scopes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Scopes
                        <span className="text-muted-foreground italic text-sm">(optional)</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>OAuth scopes to request, one per line</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Use ${"{"}config.VAR{"}"} for user-configurable scopes
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Examples: read:*, write:users, ${"{"}config.AUTH0_MCP_SCOPES{"}"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="read:*&#10;${config.AUTH0_MCP_SCOPES}"
                          value={Array.isArray(field.value) ? field.value.join("\n") : ""}
                          onChange={(e) => {
                            const values = e.target.value.split("\n").filter(Boolean)
                            field.onChange(values.length > 0 ? values : [])
                          }}
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        One scope per line. Use ${"{"}config.VARIABLE_NAME{"}"} for configuration substitution.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* mTLS-specific fields */}
            {authScheme === "mtls" && (
              <div className="space-y-4 mt-4 pt-4 border-t border-muted">
                <h4 className="text-sm font-medium text-muted-foreground">mTLS Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`implementations.${index}.certificate.source`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Source</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="file">File</SelectItem>
                            <SelectItem value="enrollment">Enrollment</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch(`implementations.${index}.certificate.source`) === "enrollment" && (
                    <FormField
                      control={form.control}
                      name={`implementations.${index}.certificate.enrollmentEndpoint`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enrollment Endpoint</FormLabel>
                          <FormControl>
                            <UrlInput
                              value={typeof field.value === "string" ? field.value : ""}
                              onChange={field.onChange}
                              placeholder="example.com/enroll"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            )}

            {authScheme !== "none" && authScheme !== "mtls" && (
              <div className="space-y-4 mt-4 pt-4 border-t border-muted">
                <h4 className="text-sm font-medium text-muted-foreground">Authentication Placement</h4>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`implementations.${index}.authentication.placement.in`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>In</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select placement" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="header">Header</SelectItem>
                            <SelectItem value="query">Query Parameter</SelectItem>
                            <SelectItem value="cli_arg">CLI Argument</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`implementations.${index}.authentication.placement.key`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Authorization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`implementations.${index}.authentication.placement.format`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Format</FormLabel>
                      <FormControl>
                        <Input placeholder="Bearer {token}" {...field} />
                      </FormControl>
                      <FormDescription>
                        Use {"{token}"} as the placeholder for the secret.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Configuration Variables */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Configuration Variables</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>User-configurable variables that can be referenced in args and scopes</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    These become ${"{"}config.VARIABLE_NAME{"}"} substitutions
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addConfigItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Variable
            </Button>
          </div>

          <div className="pl-6 border-l-2 border-muted">
            {currentConfig.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No configuration variables defined. Add variables that users can customize.
              </p>
            ) : (
              <div className="space-y-6">
                {currentConfig.map((_, configIndex) => (
                  <div key={configIndex}>
                    {configIndex > 0 && <Separator className="mb-6" />}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium">Variable {configIndex + 1}</h4>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeConfigItem(configIndex)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`implementations.${index}.configuration.${configIndex}.key`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Key
                                <span className="text-muted-foreground italic text-sm">(optional)</span>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="AUTH0_MCP_SCOPES" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`implementations.${index}.configuration.${configIndex}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Type
                                <span className="text-muted-foreground italic text-sm">(optional)</span>
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="string">String</SelectItem>
                                  <SelectItem value="boolean">Boolean</SelectItem>
                                  <SelectItem value="integer">Integer</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`implementations.${index}.configuration.${configIndex}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Description
                              <span className="text-muted-foreground italic text-sm">(optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Scopes to request during init" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`implementations.${index}.configuration.${configIndex}.defaultValue`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Default Value
                                <span className="text-muted-foreground italic text-sm">(optional)</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="read:*" 
                                  value={typeof field.value === 'boolean' ? field.value.toString() : field.value || ''} 
                                  onChange={(e) => {
                                    const value = e.target.value
                                    // Try to convert back to appropriate type based on configuration type
                                    const configType = form.getValues(`implementations.${index}.configuration.${configIndex}.type`)
                                    if (configType === 'boolean') {
                                      field.onChange(value === 'true')
                                    } else if (configType === 'integer') {
                                      field.onChange(parseInt(value) || 0)
                                    } else {
                                      field.onChange(value)
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`implementations.${index}.configuration.${configIndex}.secret`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                              <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Secret
                                  <span className="text-muted-foreground italic text-sm">(optional)</span>
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
