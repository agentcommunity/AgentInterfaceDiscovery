import { Code, FileText, Shield, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function ProblemSection() {
  const problems = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "Manual Configuration Hell",
      description: "Manually configuring API keys and authentication schemes for every new agent.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "No Discovery Standard",
      description: "No standard way to discover an agent's capabilities or required configuration.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Scattered Documentation",
      description: "Inconsistent and hard-to-validate setup instructions scattered across READMEs.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Custom Integrations",
      description: "Every integration is a custom, one-off project that takes weeks to implement.",
    },
  ]

  return (
    <section className="w-full section-padding bg-muted/30">
      <div className="container mx-auto container-padding">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              If you&apos;ve ever built or used an AI agent, 
              <span className="text-muted-foreground"> this probably looks familiar...</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {problems.map((problem, index) => (
              <Card key={index} className="text-left hover bg-card/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
                      {problem.icon}
                    </div>
                    <CardTitle className="text-lg">{problem.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {problem.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 