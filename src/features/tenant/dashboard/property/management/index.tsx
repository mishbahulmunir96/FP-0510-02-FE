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
      href: "/tenant/dashboard/settings",
      label: "Settings",
      icon: <FiSettings className="h-5 w-5" />,
      variant: "outline" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Property Management
          </h1>
          <p className="mt-2 text-gray-600">Manage your properties and settings in one place</p>
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto max-w-7xl p-6 space-y-8">
        {/* Action Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actionButtons.map((button, index) => (
            <Link key={index} href={button.href}>
              <Card className="group h-full transition-all duration-200 hover:shadow-lg hover:border-blue-200">
                <Button
                  variant={button.variant}
                  className="w-full h-full p-6 justify-start gap-4 transition-colors"
                >
                  <span className="p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors">
                    {button.icon}
                  </span>
                  <span className="font-medium group-hover:text-blue-600 transition-colors">
                    {button.label}
                  </span>
                </Button>
              </Card>
            </Link>
          ))}
        </div>

        {/* Property List */}
        <Card className="overflow-hidden border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
                <p className="mt-1 text-sm text-gray-600">Manage and monitor all your properties</p>
              </div>
              <Link href="/tenant/dashboard/property/create">
                <Button className="flex items-center gap-2 shadow-sm hover:shadow transition-shadow">
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