"use client";

import type React from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, PaperclipIcon, MicIcon, StopCircleIcon } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onStop?: () => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  onStop,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center border-[0.5px] border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-[#0078d4]">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about Microsoft technologies..."
          className="min-h-[60px] max-h-[200px] border-0 focus-visible:ring-0 resize-none py-3 px-4 flex-1 dark:text-white"
          disabled={isLoading}
        />
        <div className="flex items-center p-2 gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            disabled={isLoading}
          >
            <PaperclipIcon className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            disabled={isLoading}
          >
            <MicIcon className="h-5 w-5" />
            <span className="sr-only">Voice input</span>
          </Button>
          {isLoading && onStop ? (
            <Button
              type="button"
              onClick={onStop}
              size="icon"
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <StopCircleIcon className="h-5 w-5" />
              <span className="sr-only">Stop generating</span>
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              className="bg-[#0078d4] hover:bg-[#106ebe] text-white"
              disabled={isLoading || !input.trim()}
            >
              <SendIcon className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
