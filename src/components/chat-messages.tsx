import { ComputerIcon as MicrosoftIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageContent } from "@/components/message-content";
import type { Message } from "@/hooks/use-custom-chat";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <div className="w-16 h-16 bg-[#0078d4] rounded-full flex items-center justify-center mb-4">
          <MicrosoftIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Microsoft Learn Copilot</h2>
        <p className="text-center text-gray-500 dark:text-gray-400 max-w-md">
          Your AI-powered assistant for Microsoft technologies. Ask me anything
          about Azure, Microsoft 365, Power Platform, or any Microsoft product.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-start gap-4 rounded-lg",
            message.role === "user" ? "justify-end" : ""
          )}
        >
          {message.role !== "user" && (
            <div className="w-8 h-8 bg-[#0078d4] rounded-md flex items-center justify-center flex-shrink-0">
              <MicrosoftIcon className="h-5 w-5 text-white" />
            </div>
          )}

          <div
            className={cn(
              "rounded-lg px-4 py-3 max-w-[80%]",
              message.role === "user"
                ? "bg-[#0078d4] text-white"
                : "bg-gray-100 dark:bg-gray-800"
            )}
          >
            {message.role === "user" ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <MessageContent content={message.content} />
            )}
          </div>

          {message.role === "user" && (
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </div>
          )}
        </div>
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-[#0078d4] rounded-md flex items-center justify-center flex-shrink-0">
              <MicrosoftIcon className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-2 max-w-[80%]">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        )}
    </div>
  );
}
