"use client"

import { useFormContext } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { UrlInput } from "@/components/ui/url-input"
import { Badge } from "@/components/ui/badge"
import type { AidGeneratorConfig } from "@agentcommunity/aid-core/browser"
import { PlacementSection } from "./placement-section"
import { Checkbox } from "@/components/ui/checkbox"

interface AuthenticationSectionProps {
  index: number
}

// Helper function to determine if a scheme needs placement configuration.
// Placement is only required for REMOTE implementations using token-based schemes.
const needsPlacement = (scheme: string, implType?: string) => {
  if (implType !== "remote") return false
  return scheme !== "none" && scheme !== "mtls" && scheme !== ""
}

// Helper function to determine if a scheme needs credentials
const needsCredentials = (scheme: string) => {
  return scheme !== "none" && scheme !== "mtls" && scheme !== ""
}

// Helper function to determine if a scheme is OAuth-based
const isOAuthScheme = (scheme: string) => {
  return scheme === "oauth2_device" || scheme === "oauth2_code" || scheme === "oauth2_service"
}

// Helper function to get scheme display info
const getSchemeInfo = (scheme: string): { label: string; description: string; color: string } => {
  const schemes = {
    none: {
      label: "No Authentication",
      description: "Public access or setup commands",
      color: "bg-gray-100 text-gray-700",
    },
    pat: {
      label: "Personal Access Token",
      description: "Long-lived token for personal use",
      color: "bg-blue-100 text-blue-700",
    },
    apikey: {
      label: "API Key",
      description: "Simple key-based authentication",
      color: "bg-green-100 text-green-700",
    },
    basic: {
      label: "HTTP Basic",
      description: "Username and password authentication",
      color: "bg-yellow-100 text-yellow-700",
    },
    oauth2_device: {
      label: "OAuth2 Device Flow",
      description: "For devices without browsers",
      color: "bg-purple-100 text-purple-700",
    },
    oauth2_code: {
      label: "OAuth2 Authorization Code",
      description: "Standard OAuth web flow",
      color: "bg-purple-100 text-purple-700",
    },
    oauth2_service: {
      label: "OAuth2 Service-to-Service",
      description: "For automated services",
      color: "bg-purple-100 text-purple-700",
    },
    mtls: {
      label: "Mutual TLS",
      description: "Certificate-based authentication",
      color: "bg-red-100 text-red-700",
    },
    custom: {
      label: "Custom Authentication",
      description: "Custom authentication scheme",
      color: "bg-orange-100 text-orange-700",
    },
  }
  return (
    schemes[scheme as keyof typeof schemes] || {
      label: "Select Scheme",
      description: "",
      color: "bg-gray-100 text-gray-700",
    }
  )
}

export function AuthenticationSection({ index }: AuthenticationSectionProps) {
  const { watch, getValues, setValue, control } = useFormContext<AidGeneratorConfig>()
  const authScheme = watch(`implementations.${index}.authentication.scheme`) || ""
  const implType = watch(`implementations.${index}.type`) || ""
  const currentCredentials = watch(`implementations.${index}.authentication.credentials`) || []
  const schemeInfo = getSchemeInfo(authScheme)

  const addCredentialItem = () => {
    const current = getValues(`implementations.${index}.authentication.credentials`) || []
    setValue(`implementations.${index}.authentication.credentials`, [...current, { key: "", description: "" }])
  }

  const removeCredentialItem = (credIndex: number) => {
    const current = getValues(`implementations.${index}.authentication.credentials`) || []
    setValue(
      `implementations.${index}.authentication.credentials`,
      current.filter((_, i) => i !== credIndex),
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Authentication</h3>
          {authScheme && <Badge className={schemeInfo.color}>{schemeInfo.label}</Badge>}
        </div>

        <div className="space-y-4 pl-6 border-l-2 border-muted">
          {/* Scheme Selection */}
          <div className="space-y-4 pb-4">
            <FormField
              control={control}
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
                        <p className="text-xs text-muted-foreground mt-1">{schemeInfo.description}</p>
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
                      <SelectItem value="none">No Authentication</SelectItem>
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
                  <FormDescription>{schemeInfo.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description Field - Show for all non-none schemes */}
          {authScheme !== "none" && (
            <div className="space-y-4 pb-4">
              <FormField
                control={control}
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
                      <Input placeholder="Device flow starts on first run" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormDescription>A brief, human-readable guide for the user on how to authenticate.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Token URL - Show only for PAT and API Key */}
          {(authScheme === "pat" || authScheme === "apikey") && (
            <div className="space-y-4 pb-4">
              <FormField
                control={control}
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
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="example.com/account/tokens"
                        autoHttps={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Credential Items - Show for schemes that need credentials */}
          {needsCredentials(authScheme) && (
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Credential Prompts</h4>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Define prompts for multi-part secrets like Client ID & Secret.</p>
                      <p className="text-xs text-muted-foreground mt-1">These become ${"{"}auth.KEY{"}"} substitutions in args.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCredentialItem}
                  className={currentCredentials.length === 0 ? "animate-pulse" : ""}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Credential
                </Button>
              </div>

              {currentCredentials.length > 0 ? (
                <div className="pl-6 border-l-2 border-muted space-y-6">
                  {currentCredentials.map((_, credIndex) => (
                    <div key={credIndex}>
                      {credIndex > 0 && <Separator className="mb-6" />}
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h5 className="text-sm font-medium">Credential {credIndex + 1}</h5>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeCredentialItem(credIndex)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={control}
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
                            control={control}
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
              ) : (
                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                  <p>No credentials defined yet.</p>
                  <p className="text-sm">Click &quot;Add Credential&quot; to define authentication prompts.</p>
                </div>
              )}
            </div>
          )}

          {/* OAuth-specific fields */}
          {isOAuthScheme(authScheme) && (
            <div className="space-y-4 pb-4">
              <Separator />
              <div className="flex items-center gap-2 pt-4">
                <h4 className="text-sm font-medium text-muted-foreground">OAuth 2.0 Configuration</h4>
              </div>

              {/* Dynamic Client Registration Checkbox */}
              <FormField
                control={control}
                name={`implementations.${index}.authentication.oauth.dynamicClientRegistration`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        Enable Dynamic Client Registration
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Allow clients to dynamically register with the auth server (RFC 7591).</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormDescription>
                        Signals that clients without a static `clientId` should attempt to register themselves.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Scopes */}
              <FormField
                control={control}
                name={`implementations.${index}.authentication.oauth.scopes`}
                render={({ field }) => {
                  // Handle conversion between array and comma-separated string
                  const value = Array.isArray(field.value) ? field.value.join(", ") : ""
                  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const arr = e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    field.onChange(arr)
                  }
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        Scopes
                        <span className="text-muted-foreground italic text-sm">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea placeholder="read:*, write:users" value={value} onChange={onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
          )}

          {/* mTLS-specific fields */}
          {authScheme === "mtls" && (
            <div className="space-y-4 pb-4">
              <h4 className="text-sm font-medium text-muted-foreground">mTLS Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
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
                {watch(`implementations.${index}.certificate.source`) === "enrollment" && (
                  <FormField
                    control={control}
                    name={`implementations.${index}.certificate.enrollmentEndpoint`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Enrollment Endpoint</FormLabel>
                        <FormControl>
                          <UrlInput
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            placeholder="example.com/enroll"
                            autoHttps={false}
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

          {/* Authentication Placement */}
          {needsPlacement(authScheme, implType) && <PlacementSection index={index} />}
        </div>
      </div>
    </TooltipProvider>
  )
} 