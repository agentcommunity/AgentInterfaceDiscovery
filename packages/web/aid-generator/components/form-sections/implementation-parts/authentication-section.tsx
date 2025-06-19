"use client"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { UrlInput } from "@/components/ui/url-input"
import type { AidGeneratorConfig } from "@aid/core"
import { PlacementSection } from "./placement-section"

interface AuthenticationSectionProps {
  form: UseFormReturn<AidGeneratorConfig>
  index: number
}

export function AuthenticationSection({ form, index }: AuthenticationSectionProps) {
  const authScheme = form.watch(`implementations.${index}.authentication.scheme`)
  const currentCredentials = form.watch(`implementations.${index}.authentication.credentials`) || []

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

  return (
    <TooltipProvider>
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

          {/* Authentication Placement */}
          {authScheme !== "none" && authScheme !== "mtls" && (
            <PlacementSection form={form} index={index} />
          )}
        </div>
      </div>
    </TooltipProvider>
  )
} 