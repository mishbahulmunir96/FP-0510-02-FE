"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu as IconMenu, UserCircle } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/",
    });
  };

  // Render navigation items
  const renderNavigationItems = () => {
    return (
      <>
        <Link
          href="/"
          className="text-base font-medium text-gray-600 transition-colors hover:text-gray-800"
        >
          Home
        </Link>
        <Link
          href="/property-catalog"
          className="text-base font-medium text-gray-600 transition-colors hover:text-gray-800"
        >
          Browse Properties
        </Link>
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
                {session.user.imageUrl ? (
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                    <Image
                      src={session.user.imageUrl}
                      alt="Profile Picture"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <UserCircle className="h-8 w-8" />
                )}
                <span>{session.user.name || "User"}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={
                      session.user.role === "TENANT"
                        ? "/tenant/dashboard/reports/statistics"
                        : "/user/dashboard/transactions"
                    }
                  >
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                
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
              {session?.user?.imageUrl ? (
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-200">
                  <Image
                    src={session.user.imageUrl}
                    alt="Profile Picture"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <IconMenu className="h-7 w-7 text-gray-700" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white">
              {session?.user && (
                <>
                  <div className="flex items-center gap-3 p-2">
                    {session.user.imageUrl ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200">
                        <Image
                          src={session.user.imageUrl}
                          alt="Profile Picture"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <UserCircle className="h-10 w-10" />
                    )}
                    <div>
                      <p className="font-medium">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.user.email || ""}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/property-catalog">explore Properties</Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {session?.user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/account">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>

                    <Link
                      href={
                        session.user.role === "TENANT"
                          ? "/tenant/dashboard/reports/statistics"
                          : "/user/dashboard/transactions"
                      }
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                 
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
