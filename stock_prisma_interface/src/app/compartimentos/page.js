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

                console.log("API:", res.data);

                setCompartimentos(res.data ?? []);
            } catch (err) {
                console.error(err);
                setCompartimentos([]);
            }
        }

        load();
    }, []);

    return (
        <div className="grid grid-cols-4 gap-6">
            {compartimentos.map((comp) => (
                <Compartimento
                    key={comp.id}
                    compartimento={comp}
                    onClick={() => selecionarCompartimento(comp)}
                />
            ))}
        </div>
    );
}