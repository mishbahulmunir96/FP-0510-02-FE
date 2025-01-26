import type { Metadata } from "next";
import "./globals.css";
import { amarante, poppins } from "./utils/font";
import NuqsProvider from "@/providers/NuqsProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ToastContainer } from "react-toastify";
export const metadata: Metadata = {
  title:
    "MAKÉT | Makelar Ticket. Access Your Favorite Events with a Single Click!",
  description:
    "Welcome to MAKÉT – Your Ultimate Event Management Solution! Whether you’re planning a personal celebration or a corporate gathering, MAKÉT is here to streamline your event management process. For Organizers: Effortlessly create, manage, and promote your events with our user-friendly platform. Collaborate with your team, track registrations, and sell tickets all in one place. For Attendees: Discover exciting events and enjoy a seamless registration experience. Stay updated with event details and connect with fellow attendees effortlessly. Join us at MAKÉT and make every event a memorable experience!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${amarante.className}antialiased`}>
        <NuqsProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NuqsProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
