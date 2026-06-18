"use client";

import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    const [usuario, setUsuario] = useState(() => {
        const usuario = localStorage.getItem("usuario");
        return usuario ? JSON.parse(usuario) : null;
    });

    return (
        <AuthContext.Provider
            value={{
                token,
                setToken,
                usuario,
                setUsuario
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}