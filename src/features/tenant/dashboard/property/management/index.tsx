import { Button } from "@/components/ui/button";
import Link from "next/link";
import PropertyTenantList from "./components/PropertyTenantList";
import { FiPlus, FiHome, FiCalendar, FiList, FiSettings } from "react-icons/fi";
import { Card } from "@/components/ui/card";

const PropertyManagementPage = () => {
  const actionButtons = [
    {
      href: "/tenant/dashboard/property/category",
      label: "Manage Category",
      icon: <FiList className="h-5 w-5" />,
      variant: "secondary" as const,
    },
    {
      href: "/tenant/dashboard/property/room",
      label: "Manage Rooms",
      icon: <FiList className="h-5 w-5" />,
      variant: "secondary" as const,
    },
    {
      href: "/tenant/dashboard/property/peak-season-rate",
      label: "Peak Season Rate",
      icon: <FiCalendar className="h-5 w-5" />,
      variant: "secondary" as const,
    },
    {
      href: "/tenant/dashboard/property/management",
      label: "Settings",
      icon: <FiSettings className="h-5 w-5" />,
      variant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Property Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your properties and settings in one place
          </p>
        </div>
      </div>

      <section className="container mx-auto max-w-7xl space-y-8 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actionButtons.map((button, index) => (
            <Link key={index} href={button.href}>
              <Card className="group h-full transition-all duration-200 hover:border-blue-200 hover:shadow-lg">
                <Button
                  variant={button.variant}
                  className="h-full w-full justify-start gap-4 p-6 transition-colors"
                >
                  <span className="rounded-lg bg-gray-100 p-2 transition-colors group-hover:bg-blue-100">
                    {button.icon}
                  </span>
                  <span className="font-medium transition-colors group-hover:text-blue-600">
                    {button.label}
                  </span>
                </Button>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="overflow-hidden border-gray-200">
          <div className="border-b border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Properties
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Manage and monitor all your properties
                </p>
              </div>
              <Link href="/tenant/dashboard/property/create">
                <Button className="flex items-center gap-2 shadow-sm transition-shadow hover:shadow">
                  <FiPlus className="h-5 w-5" />
                  Add Property
                </Button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            <PropertyTenantList />
          </div>
        </Card>
      </section>
    </div>
  );
};

export default PropertyManagementPage;
