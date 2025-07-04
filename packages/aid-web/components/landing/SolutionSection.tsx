import { Globe, FileText, Plug } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export function SolutionSection() {
  const steps = [
    {
      step: "01",
      icon: <Globe className="h-8 w-8" />,
      title: "Zero Configuration",
      description: "Add a single TXT record to your DNS. Clients can now resolve your agent's URI and authentication scheme directly.",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      step: "02",
      icon: <FileText className="h-8 w-8" />,
      title: "Describe Any Agent",
      description: "Point that DNS record to an aid.json describing multiple implementations, auth flows, and required configuration.",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      step: "03",
      icon: <Plug className="h-8 w-8" />,
      title: "Integrate in Minutes",
      description: "Clients automatically discover, authenticate, and interact—zero manual configuration required.",
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
  ]

  return (
    <section className="w-full section-padding">
      <div className="container mx-auto container-padding">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">
              A better workflow for 
              <span className="text-gradient"> agent discovery</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to make any AI agent discoverable and immediately usable.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="card-feature group">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${step.bgColor} rounded-xl flex items-center justify-center ${step.iconColor}`}>
                      {step.icon}
                    </div>
                    <div className="text-4xl font-bold text-muted-foreground/20">
                      {step.step}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
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