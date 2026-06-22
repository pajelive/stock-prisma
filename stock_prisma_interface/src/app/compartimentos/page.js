"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Compartimento from "../../components/Compartimento";
import Modal from "../../components/Modal";
import { useAuth } from "@/context/AuthContext";

export default function Compartimentos() {
    const [compartimentos, setCompartimentos] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [form, setForm] = useState({ nome: "", localizacao: "", status: "", peso_tara: 0, sensor_ativo: true });
    const [salvando, setSalvando] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

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

    useEffect(() => {
        if (selecionado) {
            setForm({
                nome: selecionado.nome ?? "",
                localizacao: selecionado.localizacao ?? "",
                status: selecionado.status ?? "ATIVO",
                peso_tara: selecionado.peso_tara ?? 0,
                sensor_ativo: selecionado.sensor_ativo ?? true,
            });
            setConfirmDelete(false);
        }
    }, [selecionado]);

    function selecionarCompartimento(comp) {
        if (!isAdmin) return;
        setSelecionado(comp);
    }

    async function handleSalvar() {
        setSalvando(true);
        try {
            await api.put(`/admin/compartimentos/${selecionado.id}`, form);
            setCompartimentos((prev) =>
                prev.map((c) => c.id === selecionado.id ? { ...c, ...form } : c)
            );
            setSelecionado(null);
        } catch (err) {
            console.error(err);
        } finally {
            setSalvando(false);
        }
    }

    async function handleDeletar() {
        setSalvando(true);
        try {
            await api.delete(`/admin/compartimentos/${selecionado.id}`);
            setCompartimentos((prev) => prev.filter((c) => c.id !== selecionado.id));
            setSelecionado(null);
        } catch (err) {
            console.error(err);
        } finally {
            setSalvando(false);
        }
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
                footer={
                    <>
                        {confirmDelete ? (
                            <>
                                <span className="text-sm text-red-600 mr-auto">Tem certeza?</span>
                                <button
                                    onClick={() => setConfirmDelete(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDeletar}
                                    disabled={salvando}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
                                >
                                    {salvando ? "Deletando..." : "Confirmar exclusão"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setConfirmDelete(true)}
                                    className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50 mr-auto"
                                >
                                    Excluir
                                </button>
                                <button
                                    onClick={() => setSelecionado(null)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSalvar}
                                    disabled={salvando}
                                    className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700 disabled:opacity-50"
                                >
                                    {salvando ? "Salvando..." : "Salvar"}
                                </button>
                            </>
                        )}
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</label>
                        <input
                            value={form.nome}
                            onChange={(e) => setForm({ ...form, nome: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Localização</label>
                        <input
                            value={form.localizacao}
                            onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="ATIVO">Ativo</option>
                            <option value="INATIVO">Inativo</option>
                            <option value="MANUTENCAO">Manutenção</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Peso Tara (kg)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={form.peso_tara}
                            onChange={(e) => setForm({ ...form, peso_tara: parseFloat(e.target.value) })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                        <span className="text-sm text-gray-700">Sensor ativo</span>
                        <button
                            onClick={() => setForm({ ...form, sensor_ativo: !form.sensor_ativo })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                form.sensor_ativo ? "bg-sky-500" : "bg-gray-300"
                            }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                form.sensor_ativo ? "translate-x-6" : "translate-x-1"
                            }`} />
                        </button>
                    </div>
                    <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 flex flex-col gap-1">
                        <span><span className="font-semibold">Insumo:</span> {selecionado?.insumo_nome ?? "—"}</span>
                        <span><span className="font-semibold">Peso atual:</span> {selecionado?.peso_atual ?? 0} kg</span>
                    </div>
                </div>
            </Modal>
        </div>
    );
}