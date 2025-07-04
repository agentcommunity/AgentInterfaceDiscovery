import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Codeblock } from "@/components/resolver/Codeblock"

export function QuickStartSection() {
  return (
    <section className="w-full section-padding">
      <div className="container mx-auto container-padding">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Get Started in 
              <span className="text-muted-foreground"> 60 Seconds</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose your approach and start building with AID immediately.
            </p>
          </div>
          
          <Tabs defaultValue="discover" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="discover">Discover</TabsTrigger>
              <TabsTrigger value="implement">Implement</TabsTrigger>
              <TabsTrigger value="validate">Validate</TabsTrigger>
              <TabsTrigger value="multilang">Multi-language</TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-4 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Resolve any agent by domain</CardTitle>
                  <CardDescription>
                    Use our resolver to discover and connect to any AID-compatible agent instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Codeblock
                    content={`import { resolveDomain } from '@agentcommunity/aid-core'

for await (const step of resolveDomain('agentcommunity.org')) {
  console.log(step)
}`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="implement" className="space-y-4 mt-8">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Install the core library</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Codeblock content="npm install @agentcommunity/aid-core" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Build your manifest</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Codeblock
                      content={`import { buildManifest } from '@agentcommunity/aid-core'

const manifest = buildManifest({
  name: 'My Agent',
  // ...more config
})`}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="validate" className="space-y-4 mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Validate your manifest</CardTitle>
                  <CardDescription>
                    Use our conformance CLI to ensure your manifest meets the specification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Codeblock
                    content={`npx @agentcommunity/aid-conformance aid-validate ./my-manifest.json`}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="multilang" className="space-y-4 mt-8">
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Python</CardTitle>
                    <CardDescription>Official Python SDK with Pydantic models</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Codeblock
                      content={`pip install aid-core-py

from aid_core_py import validate_manifest
from aid_core_py.models import AidManifest

# Validate and parse your manifest
is_valid, error = validate_manifest(manifest_dict)
if is_valid:
    manifest = AidManifest.model_validate(manifest_dict)`}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Go</CardTitle>
                    <CardDescription>Official Go SDK with auto-generated structs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Codeblock
                      content={`go get github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore

import "github.com/agentcommunity/AgentInterfaceDiscovery/packages/aid-core-go/aidcore"

// Validate your manifest
isValid, err := aidcore.ValidateManifest(manifestBytes)
if isValid {
    var manifest aidcore.AidManifest
    json.Unmarshal(manifestBytes, &manifest)
}`}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
} 