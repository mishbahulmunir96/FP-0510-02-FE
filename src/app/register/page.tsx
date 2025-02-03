"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RegisterPage from "@/features/auth/register";
import TenantRegistrationComponent from "@/features/auth/register/tenantRegister";
import { useSearchParams } from "next/navigation";

export default function Register() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState(
    searchParams.get("role")?.toUpperCase() || "USER",
  );

  useEffect(() => {
    const newRole = searchParams.get("role")?.toUpperCase() || "USER";
    setRole(newRole);
  }, [searchParams]);

  const pageVariants = {
    initial: { opacity: 0, x: "-100%" },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: "100%" },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {role === "TENANT" ? (
          <motion.div
            key="tenant"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <TenantRegistrationComponent />
          </motion.div>
        ) : (
          <motion.div
            key="user"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <RegisterPage role={"USER"} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
