import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function TenantAuthGuard(Component: any) {
  return async function IsTenantAuth(props: any) {
    const session = await auth();

    if (!session) {
      return redirect("/login");
    }
    if (session.user?.role !== "TENANT") {
      return redirect("/");
    }

    return <Component {...props} />;
  };
}
