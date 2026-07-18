"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  GalleryVerticalEndIcon,
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react";

export function AppSidebar(props) {
  const [courses, setCourses] = React.useState([]);
  const [teacher, setTeacher] = React.useState(null);

  React.useEffect(() => {
    loadSidebar();
  }, []);

  async function loadSidebar() {
    // Get logged in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Get teacher profile
    const { data: teacherData } = await supabase
      .from("teachers")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    setTeacher(teacherData);

    // Get classes
    const { data: classData } = await supabase
      .from("classes")
      .select("*")
      .eq("teacher_id", user.id)
      .order("code");

    const classItems =
      classData?.map((c) => ({
        id: c.id,
        title: c.code,
        subtitle: c.title,
      })) || [];

    setCourses(classItems);
  }

  const navMain = [
    {
      title: "My Labs",
      icon: <TerminalSquareIcon />,
      items: courses,
    },
    {
      title: "Lab Reports",
      icon: <BotIcon />,
      items: [],
    },
    {
      title: "Lab Final",
      icon: <BookOpenIcon />,
      items: [],
    },
    {
      title: "Viva",
      icon: <Settings2Icon />,
      items: [],
    },
  ];

  const projects = [
    {
      name: "Website Project",
      url: "#",
      icon: <FrameIcon />,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher
          teams={[
            {
              name: "Lab Performance Tracker",
              logo: <GalleryVerticalEndIcon />,
              plan: teacher?.department || "",
            },
          ]}
        />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: teacher?.full_name || "Teacher",
            email: teacher?.email || "",
            avatar: "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}