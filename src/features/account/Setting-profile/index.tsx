import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditProfileForm from "./components/EditProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center">
        <Link
          href="/"
          className="flex items-center text-blue-600 transition-colors hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back Home
        </Link>
      </div>

      <EditProfileForm />
    </div>
  );
}
