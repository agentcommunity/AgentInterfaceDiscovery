"use client"

import { ConfigForm } from "@/components/config-form"
import { GeneratorFormProvider } from "@/components/generator-form-provider"
import { OutputPanel } from "@/components/output-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Eye, Sparkles, Code, Settings } from "lucide-react"

export default function GeneratorPage() {
  const scrollToOutput = () => {
    document.getElementById("output-panel")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <GeneratorFormProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        {/* Header Section */}
        <div className="relative py-6 md:py-8 border-b border-border/50 bg-background">
          <div className="container mx-auto container-padding">
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Code className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                AID <span className="text-muted-foreground">Generator</span>
              </h1>
              
              <p className="text-muted-foreground max-w-lg mx-auto">
                Create a spec-compliant manifest and DNS record with an interactive, real-time editor.
              </p>
              
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Settings className="h-4 w-4" />
                  <span>Real-time validation</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Code className="h-4 w-4" />
                  <span>Export ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto container-padding pb-24">
          {/* Mobile Quick Access */}
          <div className="md:hidden mb-8">
            <Button 
              onClick={scrollToOutput} 
              className="w-full" 
              variant="outline"
              size="lg"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Live Output
            </Button>
          </div>

          {/* Desktop Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <Card className="shadow-soft-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your agent&apos;s interface specification. Changes are reflected in real-time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConfigForm />
                </CardContent>
              </Card>
            </div>

            {/* Output Panel */}
            <div id="output-panel" className="space-y-6">
              <Card className="shadow-soft-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Generated Output
                  </CardTitle>
                  <CardDescription>
                    Your manifest and DNS record, ready for deployment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <OutputPanel />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </GeneratorFormProvider>
  )
} 