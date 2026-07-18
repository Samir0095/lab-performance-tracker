"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  ChevronsUpDownIcon,
  UserIcon,
  LogOutIcon,
} from "lucide-react";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  async function handleLogout() {
    console.log("Logout clicked");

    const { error } = await supabase.auth.signOut();

    console.log("Supabase response:", error);

    if (!error) {
      router.replace("/login");
    } else {
      alert(error.message);
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name?.charAt(0) ?? "T"}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm">
                <span>{user.name}</span>
                <span className="text-xs">{user.email}</span>
              </div>

              <ChevronsUpDownIcon className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
          >
            <DropdownMenuLabel>
              {user.email}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={handleLogout}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}