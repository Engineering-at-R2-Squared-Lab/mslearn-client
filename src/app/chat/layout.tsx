import type React from "react";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Microsoft Learn Copilot</title>
        <meta
          name="Microsoft Learn Copilot"
          content="A Microsoft Learn Copilot developed by R2 Squared Lab for Micorosoft AI Agents Hackathon 2025"
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider defaultTheme="light" storageKey="ms-learn-copilot-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
