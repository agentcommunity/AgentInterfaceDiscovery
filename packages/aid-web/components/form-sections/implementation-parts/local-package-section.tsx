"use client"

import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AidGeneratorConfig } from "@aid/core/browser"

interface LocalPackageSectionProps {
  index: number
}

export function LocalPackageSection({ index }: LocalPackageSectionProps) {
  const { watch, getValues, setValue, control } = useFormContext<AidGeneratorConfig>()
  const packageManager = watch(`implementations.${index}.package.manager`)
  const packageIdentifier = watch(`implementations.${index}.package.identifier`)

  // Auto-sync execution command with package manager
  useEffect(() => {
    if (packageManager) {
      const currentCommand = getValues(`implementations.${index}.execution.command`)
      if (!currentCommand || currentCommand !== packageManager) {
        setValue(`implementations.${index}.execution.command`, packageManager)
      }
    }
  }, [packageManager, getValues, setValue, index])

  // Auto-suggest args based on package identifier
  useEffect(() => {
    if (packageIdentifier && packageManager === "npx") {
      const currentArgs = getValues(`implementations.${index}.execution.args`)
      if (!currentArgs || currentArgs.length === 0) {
        setValue(`implementations.${index}.execution.args`, ["-y", packageIdentifier])
      }
    }
  }, [packageIdentifier, packageManager, getValues, setValue, index])

  return (
    <TooltipProvider>
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
              control={control}
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
              control={control}
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
            control={control}
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

      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Execution Configuration</h3>
        <div className="space-y-4 pl-6 border-l-2 border-muted">
          <FormField
            control={control}
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
            control={control}
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
    </TooltipProvider>
  )
} 