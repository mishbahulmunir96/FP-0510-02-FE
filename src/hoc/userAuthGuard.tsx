// userAuthGuard.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function UserAuthGuard(Component: any) {
  return async function IsUserAuth(props: any) {
    const session = await auth();

    if (!session) {
      return redirect("/login");
    }

    // Check if user has the correct role
    if (session.user?.role !== "USER") {
      return redirect("/"); // Redirect to home if not a user
    }

    return <Component {...props} />;
  };
}
