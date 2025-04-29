"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  value: string;
  className?: string;
}

export function CodeBlock({ language, value, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const onCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <div
      className={cn(
        "relative my-4 rounded-md bg-gray-900 dark:bg-gray-950",
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 dark:border-gray-800">
        <span className="text-xs text-gray-300 dark:text-gray-400">
          {language}
        </span>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900"
            onClick={onCopy}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">{copied ? "Copied" : "Copy code"}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-900"
            onClick={() => {
              const blob = new Blob([value], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `code.${language}`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download code</span>
          </Button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-gray-100">{value}</code>
      </pre>
    </div>
  );
}
