"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-gray-700">
            <div className="flex items-center gap-3">
                <Image
                    src="/logo_nav.png"
                    alt="Stock Prisma"
                    width={40}
                    height={40}
                />

                <span className="text-xl font-bold text-cyan-400">
                    STOCK PRISMA
                </span>
            </div>

            <div className="flex gap-6">
                <Link
                    href="/"
                    className={
                        pathname === "/"
                            ? "text-cyan-400 font-semibold"
                            : "text-gray-300"
                    }
                >
                    Início
                </Link>

                <Link
                    href="/movimentacoes"
                    className={
                        pathname === "/movimentacoes"
                            ? "text-cyan-400 font-semibold"
                            : "text-gray-300"
                    }
                >
                    Movimentações
                </Link>
            </div>
        </nav>
    );
}