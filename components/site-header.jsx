"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const router = useRouter();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      alert("Failed to log out.");
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 h-20 bg-[#D0D9F3]">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="[&>svg]:!size-6" />

        <h1 className="text-lg sm:text-2xl font-bold">
          <span className="text-black">LAB </span>
          <span className="text-indigo-600">Performance </span>
          <span className="text-black">Tracker</span>
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-md transition">
            <svg
              viewBox="0 0 24 24"
              className="w-7 h-7 text-blue-600"
              fill="currentColor"
            >
              <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5Z" />
            </svg>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={handleLogout}
            className="text-red-600 cursor-pointer"
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}