import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Agent Interface Discovery (AID)",
  description: "A universal specification for discovering AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
      <body>
        <div style={{
          padding: '1rem',
          backgroundColor: '#fefcbf', // a light yellow
          color: '#5d520a',
          textAlign: 'center',
          borderBottom: '1px solid #e7e4a8'
        }}>
          This project is deprecated and has been archived. The official AID v1 specification has moved to a new, simpler standard. Visit <a href="https://aid.agentcommunity.org" style={{textDecoration: 'underline'}}>aid.agentcommunity.org</a> for the latest version.
        </div>
        <TooltipProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
          </div>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
