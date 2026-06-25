"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext"
import api from "@/services/api"

export default function Navbar() {
    const pathname = usePathname();
    const { usuario, setUsuario, loading } = useAuth();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

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
            onClick={() => setMenuOpen(false)}
            className={`block text-base font-medium transition-colors py-3 px-4 ${
                pathname === href
                    ? "text-sky-500 bg-sky-50"
                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
            }`}
        >
            {label}
        </Link>
    );

    return (
        <nav className="relative flex items-center justify-between px-4 md:px-8 h-16 md:h-20 border-b border-zinc-200 bg-white">

            {/* Logo */}
            <Image
                src="/logo_nav.png"
                alt="Stock Prisma"
                width={320}
                height={80}
                priority
                className="h-8 md:h-12 w-auto"
            />

            {/* Botão Hambúrguer (apenas mobile) */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden flex flex-col justify-center items-center w-10 h-10"
                aria-label="Menu"
            >
                <span className={`block w-6 h-0.5 bg-zinc-700 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-6 h-0.5 bg-zinc-700 my-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-zinc-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>

            {/* Menu Desktop */}
            <div className="hidden md:flex items-center gap-4 md:gap-8">
                {navItem("/", "Início")}
                {navItem("/movimentacoes", "Movimentações")}
                {navItem("/compartimentos", "Compartimentos")}

                {loading ? (
                    <div className="h-9 w-20 md:h-10 md:w-24 rounded-full bg-zinc-100 animate-pulse" />
                ) : usuario ? (
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

            {/* Menu Mobile */}
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-zinc-200 shadow-lg md:hidden z-50">
                    <div className="flex flex-col py-2">
                        {navItem("/", "Início")}
                        {navItem("/movimentacoes", "Movimentações")}
                        {navItem("/compartimentos", "Compartimentos")}

                        <div className="px-4 py-3">
                            {loading ? (
                                <div className="h-10 w-full rounded-full bg-zinc-100 animate-pulse" />
                            ) : usuario ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full rounded-full bg-red-500 px-4 py-2 text-base font-semibold text-white transition hover:bg-red-600"
                                >
                                    Sair
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="block w-full text-center rounded-full bg-sky-500 px-4 py-2 text-base font-semibold text-white transition hover:bg-sky-600"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}