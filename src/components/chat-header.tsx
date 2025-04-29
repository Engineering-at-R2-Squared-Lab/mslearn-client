"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface ChatHeaderProps {
  onMenuClick: () => void;
}

export function ChatHeader({ onMenuClick }: ChatHeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center space-x-2 mx-auto md:mx-0">
          <div className="w-8 h-8 bg-[#0078d4] rounded-md flex items-center justify-center">
            <span className="text-white font-bold">ML</span>
          </div>
          <h1 className="text-lg font-semibold">Microsoft Learn Copilot</h1>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="hidden md:inline-flex border-[0.5px] border-gray-600"
          >
            Feedback
          </Button>
        </div>
      </div>
    </header>
  );
}
