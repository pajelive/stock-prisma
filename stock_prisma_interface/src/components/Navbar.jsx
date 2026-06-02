"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-200">
            <div>
                <Image
                    src="/logo_nav.svg"
                    alt="Stock Prisma"
                    width={140}
                    height={40}
                    priority
                />
            </div>

            <div className="flex items-center gap-8 text-sm font-medium">
                <Link
                    href="/"
                    className={`transition-colors ${
                        pathname === "/"
                            ? "text-zinc-900"
                            : "text-zinc-500 hover:text-zinc-800"
                    }`}
                >
                    Início
                </Link>

                <Link
                    href="/movimentacoes"
                    className={`transition-colors ${
                        pathname === "/movimentacoes"
                            ? "text-zinc-900"
                            : "text-zinc-500 hover:text-zinc-800"
                    }`}
                >
                    Movimentações
                </Link>
            </div>
        </nav>
    );
}