import Sidebar from "@/src/components/Sidebar";
import React from "react";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex">
      {/* sidebar */}
      <Sidebar />

      {/* pages */}
      {children}
    </div>
  )
}