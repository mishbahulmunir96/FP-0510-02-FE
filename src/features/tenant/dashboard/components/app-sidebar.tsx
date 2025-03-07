"use client";

import { cn } from "@/lib/utils";
import {
  Bed,
  Building2,
  CalendarDays,
  CalendarFold,
  ChartBar,
  ChevronDown,
  FileBarChart,
  Home,
  LayoutGrid,
  LucideIcon,
  Menu,
  NotebookPen,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
              "group flex w-full items-center rounded-lg p-2 text-left transition-all duration-200",
              isOpen ? "bg-sky-50" : "hover:bg-gray-50",
            )}
          >
            <div
              className={cn(
                "mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                isOpen
                  ? "bg-sky-100 text-sky-600"
                  : "bg-gray-50 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
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
                "ml-2 h-5 w-5 flex-shrink-0 transform transition-all duration-200",
                isOpen ? "rotate-180 text-sky-600" : "text-gray-400",
              )}
            />
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
            "mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200",
            isActive
              ? "bg-sky-100 text-sky-600"
              : "bg-gray-50 text-gray-600 group-hover:bg-gray-100 group-hover:text-gray-900",
            isSubmenuItem && "h-8 w-8",
          )}
        >
          <item.icon className={cn("h-5 w-5", isSubmenuItem && "h-4 w-4")} />
        </div>
        <div className="flex-1 text-left">
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
      title: "Properties",
      icon: Building2,
      description: "Manage your properties and rooms",
      submenu: [
        {
          title: "Manage Property",
          url: "/tenant/dashboard/property/management",
          icon: Home,
          description: "Add and manage properties",
        },
        {
          title: "Manage Room",
          url: "/tenant/dashboard/property/room",
          icon: Bed,
          description: "Room configurations",
        },
        {
          title: "Manage Category",
          url: "/tenant/dashboard/property/category",
          icon: LayoutGrid,
          description: "Property categories",
        },
        {
          title: "Room Non Availability",
          url: "/tenant/dashboard/property/room-non-availability",
          icon: Bed,
          description: "Set room availability",
        },
      ],
    },
    {
      title: "Peak Seasons",
      url: "/tenant/dashboard/property/peak-season-rate",
      icon: CalendarDays,
      description: "Manage seasonal rates",
    },
    {
      title: "My Transactions",
      url: "/tenant/dashboard/transactions",
      icon: NotebookPen,
      description: "Manage all transactions",
    },
    {
      title: "Reports",
      icon: FileBarChart,
      description: "View analytics and reports",
      submenu: [
        {
          title: "Statistics",
          url: "/tenant/dashboard/reports/statistics",
          icon: ChartBar,
          description: "View your sales reports",
        },
        {
          title: "Calendar Report",
          url: "/tenant/dashboard/reports/calendar-report",
          icon: CalendarFold,
          description: "View your sales reports",
        },
      ],
    },
    {
      title: "Settings",
      url: "/tenant/dashboard/reports/statistics",
      icon: Settings,
      description: "Configure your account",
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
