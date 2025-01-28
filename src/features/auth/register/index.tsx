"use client";
import { User } from "lucide-react";
import RegisterForm from "./components/RegisterUserForm";

const UserRegisterPage = ({ role }: { role: "USER" | "TENANT" }) => {
  return (
    <div className="grid min-h-[950px] lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://res.cloudinary.com/andikalp/image/upload/v1737903319/photo-1563911302283-d2bc129e7570_iy9h5v.jpg"
          alt="Register background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            RateHaven.
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterPage;
