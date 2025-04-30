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
          const errorText = await response.text();
          const errorMessage = `HTTP error! status: ${response.status}, body: ${errorText}`;
          console.error("Fetch error:", errorMessage);
          throw new Error(errorMessage);
        }

        if (!response.body) {
          console.warn("Response body is empty.");
          setIsLoading(false);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let content = "";
        let buffer = "";

        const processStream = async () => {
          while (true) {
            const { value, done } = await reader.read();

            if (done) {
              console.log("Stream finished.");
              if (onFinish) {
                onFinish({ ...assistantMessage, content });
              }
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            const events = buffer.split("\n\n");
            buffer = events.pop() || "";

            for (const event of events) {
              if (!event.trim()) continue;

              const dataMatch = event.match(/^data: (.*)$/m);
              if (!dataMatch) continue;

              const data = dataMatch[1];

              if (data === "[DONE]") {
                console.log("[DONE] signal received.");
                if (onFinish) {
                  onFinish({ ...assistantMessage, content });
                }
                break;
              }

              content += data;
              console.log("Received data chunk:", data);
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

        console.log("Starting to process stream.");
        await processStream();
      } catch (err: any) {
        if (err.name !== "AbortError") {
          const error = err instanceof Error ? err : new Error(String(err));
          console.error("Stream processing error:", error);
          setError(error);
          if (onError) {
            onError(error);
          }
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
        console.log("Fetch and stream processing completed.");
      }
    },
    [api, input, isLoading, messages, onError, onResponse, onFinish]
  );

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      console.log("Stream aborted.");
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      console.log("EventSource closed.");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        console.log("Unmounting: Stream aborted.");
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        console.log("Unmounting: EventSource closed.");
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
