import NextAuthProvider from "@/providers/NextAuthProvider";
import NuqsProvider from "@/providers/NuqsProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import "leaflet/dist/leaflet.css";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { poppins } from "./utils/font";
export const metadata: Metadata = {
  title: "RateHaven Property",
  description:
    "Welcome to RateHaven – Your Ultimate Event Management Solution! Whether you’re planning a personal celebration or a corporate gathering, MAKÉT is here to streamline your event management process. For Organizers: Effortlessly create, manage, and promote your events with our user-friendly platform. Collaborate with your team, track registrations, and sell tickets all in one place. For Attendees: Discover exciting events and enjoy a seamless registration experience. Stay updated with event details and connect with fellow attendees effortlessly. Join us at MAKÉT and make every event a memorable experience!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <NextAuthProvider>
          <NuqsProvider>
            <ReactQueryProvider>{children}</ReactQueryProvider>
            <ToastContainer />
          </NuqsProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
