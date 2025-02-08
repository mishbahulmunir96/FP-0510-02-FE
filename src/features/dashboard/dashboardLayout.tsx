import { AppSidebar } from "./components/app-sidebar";
import NavbarDashboard from "./components/NavbarDashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <div className="ml-64">
        <NavbarDashboard />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
