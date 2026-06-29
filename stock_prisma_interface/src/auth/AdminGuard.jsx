"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminGuard({ children }) {
    const { usuario, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        if (!usuario) {
            router.replace("/login");
            return;
        }

        if (usuario.perfil !== "Administrador") {
            router.replace("/");
        }
    }, [usuario, loading]);

    if (loading || !usuario) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>Verificando permissões...</p>
            </div>
        );
    }

    if (usuario.perfil !== "Administrador") {
        return null;
    }

    return children;
}