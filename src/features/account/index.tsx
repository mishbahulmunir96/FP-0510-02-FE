import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditProfileForm from "./components/EditProfileForm";

export default async function ProfilePage() {
  // Ambil session dari NextAuth atau metode otentikasi yang Anda gunakan
  const session = await auth();

  // Jika session tidak ada, redirect ke halaman login
  if (!session) {
    redirect("/login");
  }

  // Jika session ada, render komponen form edit profil
  return <EditProfileForm />;
}
