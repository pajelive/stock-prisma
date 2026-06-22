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
            <div className="w-full max-w-6xl grid grid-cols-4 gap-2">
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