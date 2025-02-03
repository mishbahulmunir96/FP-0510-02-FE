"use client";

import RegisterForm from "./components/RegisterUserForm";

const UserRegisterPage = ({ role }: { role: "USER" | "TENANT" }) => {
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default UserRegisterPage;
