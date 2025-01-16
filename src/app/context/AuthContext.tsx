// /app/context/AuthContext.tsx (no changes from before, just showing context)
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, getUser, logout as doLogout, saveToken, saveUser } from "../lib/auth";

interface AuthState {
    user: any;             // e.g. { id, username, accessToken, ... }
    loggedIn: boolean;
    login: (user: any, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthState>({
    user: null,
    loggedIn: false,
    login: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = getToken();
        const storedUser = getUser();
        if (token && storedUser) {
            setUser(storedUser);
            setLoggedIn(true);
        }
    }, []);

    const login = (newUser: any, token: string) => {
        saveUser(newUser);
        saveToken(token);
        setUser(newUser);
        setLoggedIn(true);
    };

    const logout = () => {
        doLogout();
        setUser(null);
        setLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, loggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
