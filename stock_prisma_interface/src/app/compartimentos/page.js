"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Compartimento from "../../components/Compartimento";
import Modal from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";

export default function Compartimentos() {
    const [compartimentos, setCompartimentos] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const { usuario } = useAuth();

    const isAdmin = usuario?.perfil === "Administrador";

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

    function selecionarCompartimento(comp) {
        if (!isAdmin) return;
        setSelecionado(comp);
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
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

            <Modal
                aberto={selecionado !== null}
                onFechar={() => setSelecionado(null)}
                titulo={`Compartimento ${selecionado?.nome ?? ""}`}
            >
                <p className="text-gray-600">
                    <span className="font-semibold">Insumo:</span>{" "}
                    {selecionado?.insumo_nome ?? "Vazio"}
                </p>
                {/* coloca aqui o que quiser mostrar/editar no modal */}
            </Modal>
        </div>
    );
}