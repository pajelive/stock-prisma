"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    let mounted = true;

    api.get("/admin/auth/me")
        .then((res) => {
            if (mounted) setUsuario(res.data);
        })
        .catch(() => {
            if (mounted) setUsuario(null);
        })
        .finally(() => {
            if (mounted) setLoading(false);
        });

        return () => {
            mounted = false;
        };
        }, []);
        return (
        <AuthContext.Provider value={{ usuario, setUsuario, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}