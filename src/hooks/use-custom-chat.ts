"use client";

import type React from "react";

import { useState, useCallback, useRef, useEffect } from "react";

export type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatOptions = {
  api?: string;
  initialMessages?: Message[];
  onError?: (error: Error) => void;
  onResponse?: (response: Response) => void;
  onFinish?: (message: Message) => void;
};

export function useCustomChat({
  api = "/api/chat",
  initialMessages = [],
  onError,
  onResponse,
  onFinish,
}: ChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!input.trim() || isLoading) {
        return;
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
      };

      setMessages((messages) => [...messages, userMessage]);
      setInput("");
      setIsLoading(true);
      setError(null);

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
        };

        setMessages((messages) => [...messages, assistantMessage]);

        // First, make a POST request to start the streaming response
        const response = await fetch(api, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
          }),
          signal,
        });

        if (onResponse) {
          onResponse(response);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          const contentType = response.headers.get("Content-Type") || "";
          let content = "";
          if (contentType.includes("application/json")) {
            const data = await response.json();
            content = data?.message || data?.content || "";
          } else {
            content = await response.text();
          }
          setMessages((messages) =>
            messages.map((message) =>
              message.role === "assistant" && message.content === ""
                ? { ...message, content }
                : message
            )
          );
          if (onFinish) {
            const lastAssistant = [...messages]
              .reverse()
              .find((m) => m.role === "assistant" && m.content === "");
            if (lastAssistant) {
              onFinish({ ...lastAssistant, content });
            }
          }
          setIsLoading(false);
          return;
        }

        // Handle the SSE response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let content = "";
        let buffer = "";

        const processStream = async () => {
          while (true) {
            const { value, done } = await reader.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const events = buffer.split("\n\n");
            buffer = events.pop() || "";

            for (const event of events) {
              if (!event.trim()) continue;

              const dataMatch = event.match(/^data: (.*)$/m);
              if (!dataMatch) continue;

              const data = dataMatch[1];

              if (data === "[DONE]") {
                if (onFinish) {
                  onFinish({ ...assistantMessage, content });
                }
                break;
              }

              content += data;

              setMessages((messages) =>
                messages.map((message) =>
                  message.id === assistantMessage.id
                    ? { ...message, content }
                    : message
                )
              );
            }
          }
        };

        await processStream();
      } catch (err: any) {
        if (err.name !== "AbortError") {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          if (onError) {
            onError(error);
          }
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [api, input, isLoading, messages, onError, onResponse, onFinish]
  );

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setIsLoading(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    setMessages,
  };
}
