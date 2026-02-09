import type { Metadata } from "next";

import Navbar from "@/components/common/navbar";

export const metadata: Metadata = {
  title: "Dashboard - Get Franchise",
  description: "List Your Franchise",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
