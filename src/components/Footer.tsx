"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";

const Footer = () => {
  // Contoh: Sembunyikan footer di route tertentu
  const pathName = usePathname();
  const hideFooterRoutes = ["/tenant/dashboard", "/tenant/manage-properties"];
  if (hideFooterRoutes.includes(pathName)) {
    return null;
  }

  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Kolom 1: Logo & Deskripsi */}
          <div className="flex flex-col">
            <div className="mb-3 flex items-center space-x-2">
              {/* Logo tidak terpotong */}
              <Image
                src="/RateHavenLogo.png" // Ganti sesuai path logo Anda
                alt="Rate Haven Logo"
                width={64} // Ubah sesuai kebutuhan
                height={64} // Ubah sesuai kebutuhan
                className="object-contain"
                priority
              />
              <span className="text-xl font-bold text-gray-800">RateHaven</span>
            </div>
            <p className="text-sm text-gray-500">
              Your trusted partner for convenient property renting. Find the
              perfect place at the best price.
            </p>
          </div>

          {/* Kolom 2: Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-gray-700">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-gray-700">
                  Compare
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-700">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms-of-service" className="hover:text-gray-700">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gray-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-gray-700">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Social Media */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-800">
              Follow Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-gray-700"
                >
                  <Facebook className="h-4 w-4" />
                  <span>Facebook</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-gray-700"
                >
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-gray-700"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bagian Bawah Footer */}
        <div className="mt-8 border-t pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RateHaven. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
