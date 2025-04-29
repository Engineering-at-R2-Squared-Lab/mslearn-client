"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatHeader } from "@/components/chat-header";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";
import { useMobile } from "@/hooks/use-mobile";
import { useCustomChat } from "@/hooks/use-custom-chat";

export function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMobile();

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useCustomChat({
      api: "/api/chat",
    });

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen) {
        const sidebar = document.querySelector('[data-sidebar="true"]');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <ChatHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-4xl px-4 py-4">
            <ChatMessages messages={messages} isLoading={isLoading} />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto max-w-4xl px-4 py-4">
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              onStop={stop}
            />
          </div>
        </div>
      </div>
    </>
  );
}
