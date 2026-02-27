"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@/types/users";
import { getUser, getAccessToken, clearTokens } from "@/lib/utils/cookies";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth state from cookies
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = getAccessToken();
        const storedUser = getUser();
        console.log('this is stored user ', storedUser);

        if (token && storedUser) {
          setUser(storedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const protectedRoutes = ["/home"];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname?.startsWith(route),
    );

    if (isProtectedRoute && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, isLoading, pathname, router]);

  const logout = () => {
    clearTokens();
    setUser(null);
    router.push("/auth/sign-in");
  };

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        setUser: handleSetUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
