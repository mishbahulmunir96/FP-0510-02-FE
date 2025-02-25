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
  Menu,
  X,
  NotebookPen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";

// Define interfaces for menu items
interface BaseMenuItem {
  title: string;
  icon: LucideIcon;
  description: string;
}

interface SubMenuItem extends BaseMenuItem {
  url: string;
}

interface ParentMenuItem extends BaseMenuItem {
  submenu?: SubMenuItem[];
  url?: string;
}

// Define interface for MenuItem component props
interface MenuItemProps {
  item: ParentMenuItem;
  isSubmenuItem?: boolean;
}

export function AppSidebar() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const MenuItem = ({ item, isSubmenuItem = false }: MenuItemProps) => {
    const isActive = pathname === item.url;
    const isOpen = openSubmenu === item.title;

    if (item.submenu) {
      return (
        <div className="relative">
          <button
            onClick={() => toggleSubmenu(item.title)}
            className={cn(
              "group w-full rounded-lg transition-all duration-200",
              isOpen ? "bg-sky-50" : "hover:bg-gray-50",
            )}
          >
            <div className="flex items-center p-2">
              <div
                className={cn(
                  "mr-3 flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
                  isOpen
                    ? "bg-sky-100 text-sky-600"
                    : "bg-gray-50 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900",
                )}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isOpen
                      ? "text-sky-600"
                      : "text-gray-700 group-hover:text-gray-900",
                  )}
                >
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 transform transition-all duration-200",
                  isOpen ? "rotate-180 text-sky-600" : "text-gray-400",
                )}
              />
            </div>
          </button>
          {isOpen && (
            <div className="mt-1 space-y-1 pl-12">
              {item.submenu.map((subitem) => (
                <MenuItem key={subitem.url} item={subitem} isSubmenuItem />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.url || ""}
        className={cn(
          "group flex items-center rounded-lg p-2 transition-all duration-200",
          isActive ? "bg-sky-50" : "hover:bg-gray-50",
          isSubmenuItem && "pl-2",
        )}
      >
        <div
          className={cn(
            "mr-3 flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200",
            isActive
              ? "bg-sky-100 text-sky-600"
              : "bg-gray-50 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900",
            isSubmenuItem && "h-8 w-8",
          )}
        >
          <item.icon className={cn("h-5 w-5", isSubmenuItem && "h-4 w-4")} />
        </div>
        <div className="flex-1">
          <p
            className={cn(
              "text-sm font-medium",
              isActive
                ? "text-sky-600"
                : "text-gray-700 group-hover:text-gray-900",
            )}
          >
            {item.title}
          </p>
          {!isSubmenuItem && (
            <p className="text-xs text-gray-500">{item.description}</p>
          )}
        </div>
      </Link>
    );
  };

  const menuItems: ParentMenuItem[] = [
    {
      title: "My Bookings",
      url: "/user/dashboard/transactions",
      icon: NotebookPen,
      description: "Manage your bookings",
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed left-4 top-3 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-600" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-800/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-72 transform border-r bg-white transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link
            href="/tenant/dashboard"
            className="flex items-center gap-3 transition-transform hover:scale-[0.98]"
          >
            <Image
              src="/RateHavenLogo.png"
              alt="Logo"
              width={64}
              height={64}
              className="h-8 w-12"
              quality={100}
              priority
            />
            <span className="text-xl font-bold text-gray-900">RateHaven</span>
          </Link>
        </div>

        <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4">
          <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Menu
          </p>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <MenuItem key={item.title} item={item} />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
