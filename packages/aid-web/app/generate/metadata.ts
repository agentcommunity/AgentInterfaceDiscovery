import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AID Generator",
  description: "Generate validated Agent Interface Discovery (AID) manifests and DNS records in real-time",
  openGraph: {
    title: "AID Generator",
    description: "Generate validated Agent Interface Discovery (AID) manifests and DNS records in real-time",
    url: "https://aid.agentcommunity.org/generate",
    siteName: "AID",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AID logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AID Generator",
    description: "Generate validated Agent Interface Discovery (AID) manifests and DNS records in real-time",
    images: ["/og-image.png"],
  },
} 