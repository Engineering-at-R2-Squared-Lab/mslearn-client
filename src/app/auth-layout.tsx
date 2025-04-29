import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Microsoft Learn Copilot - Authentication</title>
        <meta name="description" content="Sign in to Microsoft Learn Copilot" />
      </head>
      <body>
        <ThemeProvider
          defaultTheme="system"
          storageKey="ms-learn-copilot-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
