"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Settings, User, Menu, Plus, LayoutGrid } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

/* ------------------ simple helpers ------------------ */

// const getInitialsFromEmail = (email?: string) => {
//   if (!email) return "??";

//   const name = email.split("@")[0];
//   const parts = name.split(/[._-]/);

//   return parts
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((p) => p[0].toUpperCase())
//     .join("")
//     .padEnd(2, parts[0]?.[0]?.toUpperCase() ?? "?");
// };

/* ------------------ api call ------------------ */

const fetchMe = async () => {
  const { data } = await axios.get("http://localhost:5151/api/auth/me", {
    withCredentials: true,
  });
  return data;
};

/* ------------------ component ------------------ */

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { data: userEmail, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  const navItems = [
    { label: "Dashboard", href: "/dashboard/franchise-owner" },
    {
      label: "List Franchise",
      href: "/dashboard/franchise-owner/list-franchise",
    },
  ];

  const isActive = (href: string) => pathname === href;

  const logout = async () => {
    await axios.post(
      `http://localhost:5151/api/auth/logout`,
      {},
      { withCredentials: true },
    );
  };
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("Logged Out Successfully");
      router.replace(`/auth/franchise-owner?mode=login`);
    },
    onError: () => {
      toast.error("Cannot Log Out");
    },
  });
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard/franchise-owner">
            <span className="text-lg font-semibold text-slate-900">
              FranchiseHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 w-9 rounded-full p-0"
                  disabled={isLoading}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-slate-900 text-sm font-medium text-white">
                      {userEmail?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-muted-foreground text-xs">
                    {isLoading ? "Loading..." : userEmail}
                  </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {/* <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator /> */}

                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  className="text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="p-0">
                <div className="flex items-center gap-3 border-b p-6">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-slate-900 text-white">
                      {userEmail?.slice(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground text-xs">
                    {userEmail}
                  </span>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
