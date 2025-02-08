"use client";

import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  FileBarChart,
  Settings,
  ChevronDown,
  Home,
  Bed,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/tenant/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Properties",
    icon: Building2,
    submenu: [
      {
        title: "Manage Property",
        url: "/tenant/dashboard/property/create",
        icon: Home,
      },
      {
        title: "Manage Room",
        url: "/tenant/dashboard/room",
        icon: Bed,
      },
      {
        title: "Manage Category",
        url: "/tenant/dashboard/property/category",
        icon: LayoutGrid,
      },
    ],
  },
  {
    title: "Peak Seasons",
    url: "/tenant/peak-seasons",
    icon: CalendarDays,
  },
  {
    title: "Reports",
    url: "/tenant/reports",
    icon: FileBarChart,
  },
  {
    title: "Settings",
    url: "/tenant/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/tenant/dashboard" className="flex items-center gap-2">
          <Image
            src="/RateHavenLogo.png"
            alt="Logo"
            width={64}
            height={64}
            className="h-6 w-10"
            quality={100}
            priority
          />
          <span className="text-xl font-bold text-gray-900">RateHaven</span>
        </Link>
      </div>

      {/* Menu */}
      <div className="p-4">
        <p className="mb-4 px-4 text-xs font-semibold uppercase text-gray-500">
          Menu
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      openSubmenu === item.title
                        ? "bg-sky-50 text-sky-600"
                        : "text-gray-600 hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        openSubmenu === item.title ? "rotate-180" : "",
                      )}
                    />
                  </button>
                  {openSubmenu === item.title && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.url}
                          href={subitem.url}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                            pathname === subitem.url
                              ? "bg-sky-50 text-sky-600"
                              : "text-gray-600 hover:bg-gray-50",
                          )}
                        >
                          <subitem.icon className="h-4 w-4" />
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    pathname === item.url
                      ? "bg-sky-50 text-sky-600"
                      : "text-gray-600 hover:bg-gray-50",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
