import UserNavbar from "@/components/common/user-navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Franchise",
  description: "List Your Franchise",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserNavbar />
      {children}
    </>
  );
}
