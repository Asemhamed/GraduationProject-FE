import { createContext, useContext, useState } from "react";

type UserDataContextType = {
    token: string | undefined;
    setToken: (token: string | undefined) => void;
};

const UserData = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }:{children: React.ReactNode}) {
    const [token, setToken] = useState<string | undefined>();

    return (
        <UserData.Provider value={{ token, setToken }}>
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