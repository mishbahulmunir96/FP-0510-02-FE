"use client"
import { Bell, Search } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function NavbarDashboard() {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  return (
    <nav className={cn(
      "sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white",
      isMobileView ? "px-4" : "px-6"
    )}>
      {/* Search */}
      <div className={cn(
        "hidden sm:flex",
        isMobileView ? "w-auto" : "w-1/3"
      )}>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm 
                     transition-colors placeholder:text-gray-400
                     focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-end gap-4 sm:w-auto sm:gap-6">
        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg 
                       text-gray-600 transition-colors hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full 
                        bg-red-500 text-xs font-medium text-white ring-2 ring-white">
            5
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-gray-700">Thomas Anree</div>
            <div className="text-xs text-gray-500">Tenant</div>
          </div>
          <div className="overflow-hidden rounded-full ring-2 ring-gray-100">
            <Image
              src="/images/profile_default.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="h-9 w-9 object-cover sm:h-10 sm:w-10"
              priority
            />
          </div>
        </div>
      </div>
    </nav>
  );
}