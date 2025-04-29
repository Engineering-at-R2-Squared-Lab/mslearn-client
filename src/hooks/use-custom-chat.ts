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

      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      try {
        // Create a new assistant message
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
        };

        // Add the empty assistant message to the state
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
          throw new Error("Response body is null");
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

            // Decode the chunk and add it to the buffer
            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE events in the buffer
            const events = buffer.split("\n\n");
            buffer = events.pop() || ""; // Keep the last incomplete event in the buffer

            for (const event of events) {
              if (!event.trim()) continue;

              // Extract the data from the SSE event
              const dataMatch = event.match(/^data: (.*)$/m);
              if (!dataMatch) continue;

              const data = dataMatch[1];

              // Check if this is the end marker
              if (data === "[DONE]") {
                if (onFinish) {
                  onFinish({ ...assistantMessage, content });
                }
                break;
              }

              // Add the chunk to the content
              content += data;

              // Update the assistant message with the new content
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
