"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Compartimento from "../../components/Compartimento";

export default function Compartimentos({ selecionarCompartimento }) {
    const [compartimentos, setCompartimentos] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/public/compartimentos");
                setCompartimentos(res.data ?? []);
            } catch (err) {
                console.error(err);
                setCompartimentos([]);
            }
        }

        load();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
            {/* O "Armário" em si: Adicionamos uma borda grossa e fundo para parecer um móvel real */}
            <div className="w-full max-w-5xl mx-auto bg-white p-4 rounded-3xl shadow-xl border-4 border-slate-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {compartimentos.map((comp) => (
                        <Compartimento
                            key={comp.id}
                            compartimento={comp}
                            onClick={() => selecionarCompartimento(comp)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}