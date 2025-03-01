"use client";
import { AppSidebar } from "./components/app-sidebar";
import NavbarDashboard from "./components/NavbarDashboard";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileView, setIsMobileView] = useState(false);
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024); // 1024px is the 'lg' breakpoint
    };

    // Initial check
    checkMobileView();

    // Add resize listener
    window.addEventListener("resize", checkMobileView);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppSidebar />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isMobileView ? "ml-0" : "ml-72", // Match sidebar width (w-72)
        )}
      >
        <NavbarDashboard />
        <main className="container mx-auto max-w-7xl p-4 lg:p-6">
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
