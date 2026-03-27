import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { refreshSession } from "./authApi";
import { getStoredSession, isAllowedRole } from "./session";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let active = true;

    async function validate() {
      const ok = await refreshSession();
      if (!active) return;

      if (ok) {
        const session = getStoredSession();
        setStatus(
          isAllowedRole(session.role, allowedRoles) ? "allowed" : "denied",
        );
      } else {
        setStatus("denied");
      }
    }

    validate();
    return () => {
      active = false;
    };
  }, [allowedRoles]);

  if (status === "checking") return null; // Or a spinner
  return status === "allowed" ? <Outlet /> : <Navigate to='/login' replace />;
}
