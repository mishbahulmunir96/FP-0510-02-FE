"use client";
import useGetTenant from "@/hooks/api/account/useGetTenant";
import { cn } from "@/lib/utils";
import { Building, LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NavbarDashboard() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const { data: session } = useSession();
  const { data: tenant, isLoading: isTenantLoading } = useGetTenant();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const checkMobileView = () => {
    setIsMobileView(window.innerWidth < 1024);
  };

  useEffect(() => {
    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowAuthDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", checkMobileView);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white shadow-sm xl:pr-36",
        isMobileView ? "px-4" : "px-6",
      )}
    >
      <div className="flex items-center">
        <h1 className="text-lg font-medium text-gray-800"></h1>
      </div>
      <div className="flex w-auto items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          {session ? (
            <button
              onClick={() => setShowAuthDropdown(!showAuthDropdown)}
              className="flex items-center gap-2 rounded-full transition-all hover:bg-gray-50"
            >
              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium text-gray-800">
                  {tenant?.name || session?.user?.name || "User"}
                </div>
                <div className="text-xs text-gray-500">
                  {session.user.role === "TENANT" ? "Tenant" : "User"}
                </div>
              </div>
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-white shadow-sm transition-all hover:shadow">
                {tenant?.imageUrl ? (
                  <Image
                    src={tenant.imageUrl}
                    alt="Tenant"
                    fill
                    className="object-cover"
                  />
                ) : session?.user?.imageUrl ? (
                  <Image
                    src={session.user.imageUrl}
                    alt="/images/profile_default.jpg"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-indigo-50 text-sm font-medium text-indigo-600">
                    {tenant?.name?.charAt(0) || session?.user?.name?.charAt(0)}
                  </div>
                )}
              </div>
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>
          )}
          {showAuthDropdown && session && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-gray-100 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-800">
                  {tenant?.name || session?.user?.name}
                </p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
                {tenant?.phoneNumber && (
                  <p className="text-xs text-gray-500">{tenant.phoneNumber}</p>
                )}
              </div>

              <Link
                href={
                  session.user.role === "TENANT"
                    ? "/tenant/dashboard/account"
                    : "/user/dashboard/account"
                }
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                onClick={() => setShowAuthDropdown(false)}
              >
                <Building className="h-4 w-4 text-gray-500" />
                {session.user.role === "TENANT"
                  ? "Tenant Profile"
                  : "User Profile"}
              </Link>
              <div className="border-t border-gray-100 pt-1">
                <button
                  onClick={() => {
                    signOut();
                    setShowAuthDropdown(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
