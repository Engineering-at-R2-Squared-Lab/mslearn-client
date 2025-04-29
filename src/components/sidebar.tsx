"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LogOutIcon,
  UserIcon,
  SettingsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [conversations, setConversations] = useState([
    { id: 1, title: "Azure Fundamentals Help", date: "2 hours ago" },
    { id: 2, title: "C# Programming Questions", date: "Yesterday" },
    { id: 3, title: "Power BI Dashboard Tips", date: "3 days ago" },
    { id: 4, title: "Microsoft 365 Admin Tasks", date: "1 week ago" },
  ]);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      data-sidebar="true"
      className={`fixed inset-y-0 left-0 z-50 bg-[#f0f0f0] dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${collapsed ? "w-20" : "w-72"} md:relative md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0078d4] rounded-md flex items-center justify-center">
                <span className="text-white font-bold">ML</span>
              </div>
              <h2 className="text-lg font-semibold">MS Learn Copilot</h2>
            </div>
          )}

          {collapsed && (
            <div className="w-8 h-8 bg-[#0078d4] rounded-md flex items-center justify-center mx-auto">
              <span className="text-white font-bold">ML</span>
            </div>
          )}

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {collapsed ? (
                <ChevronRightIcon className="h-5 w-5" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden ml-1"
            >
              <XIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className={`p-4 ${collapsed ? "px-2" : ""}`}>
          <Button
            className={`${
              collapsed ? "p-2 w-full justify-center" : "w-full"
            } bg-[#0078d4] hover:bg-[#106ebe] text-white`}
          >
            <PlusIcon className={`${collapsed ? "" : "mr-2"} h-4 w-4`} />
            {!collapsed && "New conversation"}
          </Button>
        </div>

        <ScrollArea className={`flex-1 ${collapsed ? "px-2" : "px-4"}`}>
          <div className="space-y-2 py-2">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`w-full text-left p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                  collapsed ? "flex justify-center items-center" : ""
                }`}
              >
                {collapsed ? (
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                      {conversation.title.charAt(0)}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="font-medium truncate">
                      {conversation.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {conversation.date}
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>

        <div
          className={`p-4 py-6 border-t border-gray-200 dark:border-gray-700 ${
            collapsed ? "px-2" : ""
          }`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`w-full flex items-center space-x-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                {!collapsed && (
                  <div className="text-sm font-medium">John Doe</div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 focus:text-red-500">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
