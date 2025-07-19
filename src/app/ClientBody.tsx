"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../contexts/AuthContext";
import AuthWrapper from "../components/AuthWrapper";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <div className="antialiased">
      <SessionProvider>
        <AuthProvider>
          <AuthWrapper>
            {children}
          </AuthWrapper>
        </AuthProvider>
      </SessionProvider>
    </div>
  );
}
