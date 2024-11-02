"use client";
//voir nextAuth
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
