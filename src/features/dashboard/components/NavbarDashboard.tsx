// components/tenant/NavbarDashboard.tsx
"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function NavbarDashboard() {
  return (
    <nav className="sticky left-64 right-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Search */}
      <div className="flex w-1/3 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Type to search..."
            className="h-10 w-full rounded-lg border bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            5
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">Thomas Anree</p>
            <p className="text-xs text-gray-500">Tenant</p>
          </div>
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <Image
              src="/placeholder.jpg"
              alt="Profile"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
