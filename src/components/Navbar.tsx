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
  const pathName = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

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
        {session?.user && (
          <Link
            href="/compare"
            className="text-base font-medium text-gray-600 transition-colors hover:text-gray-800"
          >
            Compare
          </Link>
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

              {session?.user && (
                <DropdownMenuItem asChild>
                  <Link href="/compare">Compare</Link>
                </DropdownMenuItem>
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
