"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { CodeBlock } from "@/components/code-block";

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  const [formattedContent, setFormattedContent] = useState<React.ReactNode[]>(
    []
  );

  useEffect(() => {
    // Parse the content to identify code blocks
    // Updated regex to handle both escaped and unescaped backticks
    const codeBlockRegex =
      /(?:\\?```|```)([\w]*)?(?:\n|\r\n)([\s\S]*?)(?:\\?```|```)/g;
    const parts: React.ReactNode[] = [];

    let lastIndex = 0;
    let match;

    // First, unescape any escaped backticks
    const normalizedContent = content.replace(/\\`/g, "`");

    while ((match = codeBlockRegex.exec(normalizedContent)) !== null) {
      // Add text before the code block
      if (match.index > lastIndex) {
        parts.push(
          <p key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {normalizedContent.substring(lastIndex, match.index)}
          </p>
        );
      }

      // Add the code block
      const language = match[1] || "text";
      const code = match[2];
      parts.push(
        <CodeBlock
          key={`code-${match.index}`}
          language={language}
          value={code}
        />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last code block
    if (lastIndex < normalizedContent.length) {
      parts.push(
        <p key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {normalizedContent.substring(lastIndex)}
        </p>
      );
    }

    setFormattedContent(
      parts.length > 0
        ? parts
        : [
            <p key="text" className="whitespace-pre-wrap">
              {normalizedContent}
            </p>,
          ]
    );
  }, [content]);

  return <div className="space-y-2">{formattedContent}</div>;
}
