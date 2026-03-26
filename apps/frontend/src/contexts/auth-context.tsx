"use client";

import { createContext, useContext, useState } from "react";

type AuthContextType = {
  email: string;
  setEmail: (email: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");

  return (
    <AuthContext.Provider value={{ email, setEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
