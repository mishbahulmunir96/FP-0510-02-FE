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
      href: "/tenant/dashboard/room/create",
      label: "Manage Room",
      icon: <FiList className="h-5 w-5" />,
      variant: "secondary" as const,
    },
    {
      href: "/tenant/dashboard/peak-season",
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Property Management
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto max-w-7xl p-6">
        {/* Action Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {actionButtons.map((button, index) => (
            <Link key={index} href={button.href}>
              <Card className="group cursor-pointer p-4 transition-all hover:scale-105 hover:shadow-md">
                <Button
                  variant={button.variant}
                  className="w-full justify-start gap-3"
                >
                  {button.icon}
                  <span className="group-hover:font-medium">
                    {button.label}
                  </span>
                </Button>
              </Card>
            </Link>
          ))}
        </div>

        {/* Property List */}
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Properties</h2>
            <Link href="/tenant/dashboard/property/create">
              <Button className="flex items-center gap-2">
                <FiPlus className="h-5 w-5" />
                Add Property
              </Button>
            </Link>
          </div>
          <PropertyTenantList />
        </Card>
      </section>
    </div>
  );
};

export default PropertyManagementPage;
