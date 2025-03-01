import { Button } from "@/components/ui/button";
import Link from "next/link";
import RoomTenantList from "./components/RoomTenantList";

const RoomManagementPage = () => {
  return (
    <div>
      {/* Main Dashboard Content */}
      <section className="container mx-auto max-w-7xl space-y-10 p-6">
        <Link href="/tenant/dashboard/room/create">
          <Button>Create Room</Button>
        </Link>
        <RoomTenantList />
      </section>
    </div>
  );
};

export default RoomManagementPage;
