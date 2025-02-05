import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function TenantAuthGuard(Component: any) {
  return async function IsTenantAuth(props: any) {
    const session = await auth();

    if (!session) {
      return redirect("/login");
    }

    // Check if user has the tenant role
    if (session.user?.role !== "TENANT") {
      return redirect("/"); // Redirect to home if not a tenant
    }

    return <Component {...props} />;
  };
}
