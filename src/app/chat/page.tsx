"use client";

import { Chat } from "@/components/chat";
import { useTheme } from "@/components/theme-provider";

export default function Home() {
  const { theme, setTheme } = useTheme();

  console.log("Current theme:", theme);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 dark:text-gray-200">
      <Chat />
    </div>
  );
}
