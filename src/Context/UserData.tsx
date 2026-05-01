'use client';
import { createContext, useContext, useEffect, useState } from "react";

type UserDataContextType = {
    token: string | undefined;
    setToken: (token: string | undefined) => void;
    role: string | undefined;
    setRole: (role: string | undefined) => void;
    email: string | undefined;
    setEmail: (email: string | undefined) => void;
};

const UserData = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }:{children: React.ReactNode}) {
const [token, setToken] = useState<string | undefined>(undefined);
    const [role, setRole] = useState<string | undefined>(undefined);
    const [email, setEmail] = useState<string | undefined>(undefined);

    useEffect(() => {
        setToken(localStorage.getItem('token') || undefined);
        setRole(localStorage.getItem('role') || undefined);
        setEmail(localStorage.getItem('email') || undefined);
    }, []);
    
    return (
        <UserData.Provider value={{ token, setToken, role, setRole, email, setEmail }}>
            {children}
        </UserData.Provider>
    );
}

export function useUserData() {
  const context = useContext(UserData);
  if (context === undefined) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
}