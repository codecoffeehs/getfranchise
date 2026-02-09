"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Compass,
  Bookmark,
  FileText,
  Folder,
  User,
  Settings,
  LogOut,
  Loader2,
  LogOutIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Home",
      url: "/dashboard/user",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Explore",
      url: "/dashboard/user/franchises",
      icon: Compass,
    },
    {
      title: "Shortlisted",
      url: "/dashboard/user/shortlisted",
      icon: Bookmark,
    },
    {
      title: "Applications",
      url: "/dashboard/user/applications",
      icon: FileText,
    },
    {
      title: "Documents",
      url: "/dashboard/user/documents",
      icon: Folder,
    },
    {
      title: "Profile",
      url: "/dashboard/user/profile",
      icon: User,
    },
    {
      title: "Settings",
      url: "/dashboard/user/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = React.useState(false);
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await axios.post(
        `http://localhost:5151/api/auth/logout`,
        {},
        { withCredentials: true },
      );
    },
    onSuccess: () => {
      toast.success("Logged Out");
      router.replace("/auth/user");
    },
    onError: () => {},
  });
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Button variant={"ghost"}>Get Franchise</Button>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
          <DialogTrigger asChild>
            <Button variant={"destructive"} className="py-4">
              {" "}
              <LogOutIcon />
              Log Out
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log out of your account?</DialogTitle>
            </DialogHeader>
            <DialogDescription className="sr-only">
              Log Out Modal
            </DialogDescription>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLogoutOpen(false)}
                disabled={logoutMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>Log Out</>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
