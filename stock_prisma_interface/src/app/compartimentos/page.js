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
        <div className="min-h-screen bg-gray-50 flex justify-center p-6">
           <div className="w-full max-w-6xl mx-auto grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                {compartimentos.map((comp) => (
                    <Compartimento
                        key={comp.id}
                        compartimento={comp}
                        onClick={() => selecionarCompartimento(comp)}
                    />
                ))}
            </div>
        </div>
    );
}