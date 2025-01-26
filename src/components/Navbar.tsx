"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
import { Menu as IconMenu, ChevronDown } from "lucide-react";

const Navbar = () => {
  const pathName = usePathname();
  const hideNavbarRoutes = ["/tenant/dashboard", "/tenant/manage-properties"];

  if (hideNavbarRoutes.includes(pathName)) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-30 bg-white shadow-sm">
      {/* 
        Ubah px, py, serta text size agar navbar lebih besar 
        misalnya `px-6 py-5 text-base md:text-lg` 
      */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/RateHavenLogo.png"
            alt="Rate Haven"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          {/* Perbesar juga font */}
          <span className="text-xl font-bold text-gray-800">RateHaven</span>
        </Link>

        {/* Menu Utama - Desktop */}
        <div className="hidden items-center space-x-8 md:flex">
          {/* Perbesar text ke text-base atau text-lg */}
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
          <Link
            href="/compare"
            className="text-base font-medium text-gray-600 transition-colors hover:text-gray-800"
          >
            Compare
          </Link>

          {/* Dropdown Menu - Tools / Tenant */}
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
        </div>

        {/* Bagian Kanan - Login & Sign Up (Desktop) */}
        <div className="hidden items-center space-x-4 md:flex">
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
        </div>

        {/* Tombol Menu - Mobile */}
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
              <DropdownMenuItem asChild>
                <Link href="/compare">Compare</Link>
              </DropdownMenuItem>

              {/* Tenant Portal Submenu */}
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

              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/login">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sign-up">Sign Up</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
