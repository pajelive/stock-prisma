import { createContext, useContext, useState } from "react";

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);

    const [usuario, setUsuario] = useState(null);

    return(
        <AuthContext.Provider value={{
            token,
            setToken,
            usuario,
            setUsuario
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}