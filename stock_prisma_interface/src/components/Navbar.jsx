"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"
import api from "@/services/api"

export default function Navbar() {
    const pathname = usePathname();
    const { usuario, setUsuario } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await api.post("/admin/auth/logout");
        }catch (_){}
        setUsuario(null);
        router.replace("/login");
    }

    const navItem = (href, label) => (
        <Link
            href={href}
            className={`text-sm md:text-base font-medium transition-colors ${
                pathname === href
                    ? "text-sky-500"
                    : "text-zinc-500 hover:text-zinc-800"
            }`}
        >
            {label}
        </Link>
    );

    return (
        <nav className="flex items-center justify-between px-4 md:px-8 h-16 md:h-20 border-b border-zinc-200 bg-white">

            {/* Logo */}
            <Image
                src="/logo_nav.png"
                alt="Stock Prisma"
                width={320}
                height={80}
                priority
                className="h-8 md:h-12 w-auto"
            />

            {/* Menu */}
            <div className="flex items-center gap-4 md:gap-8">

                {navItem("/", "Início")}

                {navItem("/movimentacoes", "Movimentações")}
                {/* Adiciona botão de sair */}
                {usuario ? (
                    <button
                        onClick={handleLogout}
                        className="rounded-full bg-red-500 px-4 py-2 text-sm md:text-base font-semibold text-white transition hover:bg-red-600"
                    >
                        Sair
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="rounded-full bg-sky-500 px-4 py-2 text-sm md:text-base font-semibold text-white transition hover:bg-sky-600"
                    >
                        Login
                    </Link>
                )}

            </div>
        </nav>
    );
}