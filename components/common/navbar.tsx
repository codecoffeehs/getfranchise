"use client";

import { useState } from "react";
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
import {
  LogOut,
  Settings,
  User,
  Menu,
  Plus,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userInitials?: string;
}

const Navbar = ({
  userName = "John Doe",
  userEmail = "john@franchisehub.com",
  userAvatar = "",
  userInitials = "JD",
}: NavbarProps) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard/franchise-owner" },
    { label: "Franchises", href: "/dashboard/franchise-owner/franchises" },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <Link href="/listings" className="flex items-center">
            <span className="text-lg font-semibold text-slate-900">
              FranchiseHub
            </span>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? "text-slate-900 bg-slate-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="outline" size="sm" asChild className="gap-2">
                <Link href="/my-franchises">
                  <LayoutGrid className="h-4 w-4" />
                  My Franchises
                </Link>
              </Button>
              {pathname === "/dashboard/franchise-owner/list-franchise" ? (
                <Button size="sm" asChild className="gap-2">
                  <Link href="/dashboard/franchise-owner/list-franchise">
                    <ChevronDown className="h-4 w-4" />
                    List Franchise
                  </Link>
                </Button>
              ) : (
                <Button size="sm" asChild className="gap-2">
                  <Link href="/dashboard/franchise-owner/list-franchise">
                    <Plus className="h-4 w-4" />
                    List Franchise
                  </Link>
                </Button>
              )}
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full p-0"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-slate-900 text-white text-sm font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-70 p-0">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback className="bg-slate-900 text-white font-medium">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {userEmail}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-4">
                    <div className="space-y-1">
                      {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                              active
                                ? "text-slate-900 bg-slate-100"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-6 space-y-2 pt-6 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full justify-start gap-2"
                      >
                        <Link
                          href="/my-franchises"
                          onClick={() => setMobileOpen(false)}
                        >
                          <LayoutGrid className="h-4 w-4" />
                          My Franchises
                        </Link>
                      </Button>

                      <Button
                        size="sm"
                        asChild
                        className="w-full justify-start gap-2"
                      >
                        <Link
                          href="/list-franchise"
                          onClick={() => setMobileOpen(false)}
                        >
                          <Plus className="h-4 w-4" />
                          List Franchise
                        </Link>
                      </Button>
                    </div>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="p-4 border-t space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link
                        href="/settings"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
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
