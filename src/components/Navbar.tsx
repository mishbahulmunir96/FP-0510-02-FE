"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Menu as IconMenu, ChevronDown, UserCircle } from "lucide-react";

const Navbar = () => {
  const pathName = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Protected routes configuration
  const protectedRoutes = {
    tenant: [
      "/tenant/dashboard",
      "/tenant/manage-properties",
      "/tenant/transactions",
      "/tenant/reports",
    ],
    user: ["/profile", "/settings", "/compare"],
  };

  const hideNavbarRoutes = ["/tenant/dashboard", "/tenant/manage-properties"];

  // Check if current user is a tenant
  const isTenant = session?.user?.role === "tenant";

  // Authorization check and redirect
  useEffect(() => {
    if (status === "authenticated") {
      // Redirect tenant trying to access user routes
      if (isTenant && protectedRoutes.user.includes(pathName)) {
        toast.error(
          "Access denied. Tenant accounts cannot access user features.",
        );
        router.push("/tenant/dashboard");
        return;
      }

      // Redirect user trying to access tenant routes
      if (!isTenant && protectedRoutes.tenant.includes(pathName)) {
        toast.error(
          "Access denied. Please register as a tenant to access these features.",
        );
        router.push("/");
        return;
      }
    } else if (
      status === "unauthenticated" &&
      [...protectedRoutes.tenant, ...protectedRoutes.user].includes(pathName)
    ) {
      toast.error("Please log in to access this feature.");
      router.push("/login");
    }
  }, [pathName, status, isTenant]);

  if (hideNavbarRoutes.includes(pathName)) {
    return null;
  }

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  // Render different navigation items based on user type
  const renderNavigationItems = () => {
    const commonItems = (
      <>
        <Link
          href="/"
          className="text-base font-medium text-gray-600 transition-colors hover:text-gray-800"
        >
          Home
        </Link>
        <Link
          href="/browse"
          className="text-base font-medium text-gray-600 transition-colors hover:text-gray-800"
        >
          Browse Properties
        </Link>
      </>
    );

    if (!session?.user) {
      return commonItems;
    }

    return (
      <>
        {commonItems}
        {!isTenant && (
          <Link
            href="/compare"
            className="text-base font-medium text-gray-600 transition-colors hover:text-gray-800"
          >
            Compare
          </Link>
        )}

        {isTenant && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-base font-medium text-gray-600 transition-colors hover:text-gray-800">
                Tenant Portal
                <ChevronDown className="ml-1 h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white">
              <DropdownMenuLabel className="text-gray-500">
                Tenant Tools
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/tenant/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tenant/manage-properties">Manage Properties</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tenant/transactions">Transactions</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/tenant/reports">Sales Reports</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/RateHavenLogo.png"
            alt="Rate Haven"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="text-xl font-bold text-gray-800">RateHaven</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          {renderNavigationItems()}
        </div>

        {/* User Menu - Desktop */}
        <div className="hidden items-center space-x-4 md:flex">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 rounded-md px-4 py-2 text-base font-medium text-gray-600 transition-colors hover:text-gray-900">
                <UserCircle className="h-5 w-5" />
                <span>{session.user.name || "User"}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/forgot-password">Reset Password</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-base font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[#0194F3] px-4 py-2 text-base font-medium text-white transition-colors hover:bg-sky-500"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IconMenu className="h-7 w-7 text-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/browse">Browse Properties</Link>
              </DropdownMenuItem>

              {session?.user && !isTenant && (
                <DropdownMenuItem asChild>
                  <Link href="/compare">Compare</Link>
                </DropdownMenuItem>
              )}

              {session?.user && isTenant && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Tenant Portal</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-white">
                    <DropdownMenuItem asChild>
                      <Link href="/tenant/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tenant/manage-properties">
                        Manage Properties
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tenant/transactions">Transactions</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tenant/reports">Sales Reports</Link>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}

              <DropdownMenuSeparator />

              {session?.user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/account">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/forgot-password">Reset Password</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
