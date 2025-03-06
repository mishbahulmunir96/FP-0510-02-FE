import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditProfileForm from "./components/EditProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return <EditProfileForm />;
}
