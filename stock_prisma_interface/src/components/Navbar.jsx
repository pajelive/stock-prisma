"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center justify-between px-8 h-20 border-b border-zinc-200 bg-white">
            <Image
                src="/logo_nav.png"
                alt="Stock Prisma"
                width={320}
                height={80}
                priority
                className="h-12 w-auto"
            />

            <div className="flex items-center gap-8">
                <Link
                    href="/"
                    className={`font-medium transition-colors ${
                        pathname === "/"
                            ? "text-sky-500"
                            : "text-zinc-500 hover:text-zinc-800"
                    }`}
                >
                    Início
                </Link>

                <Link
                    href="/movimentacoes"
                    className={`font-medium transition-colors ${
                        pathname === "/movimentacoes"
                            ? "text-sky-500"
                            : "text-zinc-500 hover:text-zinc-800"
                    }`}
                >
                    Movimentações
                </Link>
            </div>
        </nav>
    );
}