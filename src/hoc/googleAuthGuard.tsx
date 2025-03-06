import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function GoogleAuthGuard(Component: any) {
  return async function IsGoogleAuth(props: any) {
    const session = await auth();

    if (!session) {
      return redirect("/");
    }
    if (session.user?.provider === "GOOGLE") {
      return redirect("/");
    }

    return <Component {...props} />;
  };
}
