import TenantForm from "./components/RegisterTenantForm";

export default function TenantRegistrationComponent() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://res.cloudinary.com/andikalp/image/upload/v1737911288/AdobeStock_498105626-scaled_lvzrgi.jpg"
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center p-8">
        <TenantForm />
      </div>
    </div>
  );
}
