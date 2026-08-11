"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Modal from "@/components/ui/Modal/Modal";
//import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/store/auth.store";

import css from "./LogoutUserModal.module.css";

export default function LogoutUserModalClient() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearSession
  );

  const handleClose = () => {
    router.back();
  };

  const handleLogoutUser = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
    //await logout();
  } catch (error) {
    console.error("Logout error:", error);
  }

  clearIsAuthenticated();
  router.replace("/register");
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div className={css.container}>
        <h3 className={css.title}>
          Are you sure?
        </h3>

        <p className={css.message}>
          We will miss you!
        </p>

        <div className={css.containerButtons}>
          <button
            type="button"
            className={css.buttonLogout}
            onClick={handleLogoutUser}
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Log out"}
          </button>

          <button
            type="button"
            className={css.buttonCancel}
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
