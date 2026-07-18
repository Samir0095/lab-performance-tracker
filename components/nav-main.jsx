"use client";

import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { ChevronRightIcon, PlusIcon, UsersIcon } from "lucide-react";

export function NavMain({ items }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>

      <SidebarMenu>

        {items.map((item) => (

          <Collapsible
            key={item.title}
            defaultOpen
            className="group/collapsible"
          >

            <SidebarMenuItem>

              <CollapsibleTrigger asChild>

                <SidebarMenuButton tooltip={item.title}>

                  {item.icon}

                  <span>{item.title}</span>

                  <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90"/>

                </SidebarMenuButton>

              </CollapsibleTrigger>

              <CollapsibleContent>

                <SidebarMenuSub>

                  {item.items.map((course) => (

                    <Collapsible
                      key={course.id}
                      className="group/course"
                    >

                      <SidebarMenuSubItem>

                        <SidebarMenuSubButton asChild>

                          <Link
                            href={`/dashboard/${course.id}`}
                            className="flex flex-col items-start h-auto py-2"
                          >

                            <span className="font-medium">
                              {course.title}
                            </span>

                            <span className="text-[11px] text-muted-foreground">
                              {course.subtitle}
                            </span>

                          </Link>

                        </SidebarMenuSubButton>

                      </SidebarMenuSubItem>

                      <CollapsibleTrigger asChild>

                        <button className="ml-8 mt-1 flex items-center text-xs">

                          <ChevronRightIcon className="mr-1 h-3 w-3 transition group-data-[state=open]/course:rotate-90"/>

                          Options

                        </button>

                      </CollapsibleTrigger>

                      <CollapsibleContent>

                        <SidebarMenuSub>

                          <SidebarMenuSubItem>

                            <SidebarMenuSubButton asChild>

                              <Link
                                href={`/dashboard/${course.id}/manage-students`}
                              >

                                <UsersIcon className="h-4 w-4"/>

                                Manage Students

                              </Link>

                            </SidebarMenuSubButton>

                          </SidebarMenuSubItem>

                        </SidebarMenuSub>

                      </CollapsibleContent>

                    </Collapsible>

                  ))}

                  {item.title === "My Labs" && (

                    <SidebarMenuSubItem>

                      <SidebarMenuSubButton asChild>

                        <Link
                          href="/add-class"
                          className="text-indigo-600 font-medium flex items-center gap-2"
                        >

                          <PlusIcon size={14}/>

                          Add Class

                        </Link>

                      </SidebarMenuSubButton>

                    </SidebarMenuSubItem>

                  )}

                </SidebarMenuSub>

              </CollapsibleContent>

            </SidebarMenuItem>

          </Collapsible>

        ))}

      </SidebarMenu>

    </SidebarGroup>
  );
}