"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Compartimento from "../../components/Compartimento";
import Modal from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";

const INITIAL_FORM = {
    nome: "",
    localizacao: "",
    status: "ATIVO",
    peso_tara: 0,
    sensor_ativo: true,
    insumo_id: ""
};

export default function Compartimentos() {
    const [compartimentos, setCompartimentos] = useState([]);
    const [insumos, setInsumos] = useState([]); 
    const [selecionado, setSelecionado] = useState(null);
    const [isCriando, setIsCriando] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [salvando, setSalvando] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { usuario } = useAuth();
    const isAdmin = usuario?.perfil === "Administrador";

    useEffect(() => {
        async function loadData() {
            try {
                const resComp = await api.get("/public/compartimentos");
                setCompartimentos(resComp.data ?? []);

                if (isAdmin) {
                    const resInsumos = await api.get("/insumos");
                    setInsumos(resInsumos.data ?? []);
                }
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
            }
        }
        loadData();
    }, [isAdmin]);

    useEffect(() => {
        if (selecionado) {
            setForm({
                nome: selecionado.nome ?? "",
                localizacao: selecionado.localizacao ?? "",
                status: selecionado.status ?? "ATIVO",
                peso_tara: selecionado.peso_tara ?? 0,
                sensor_ativo: selecionado.sensor_ativo ?? true,
                insumo_id: selecionado.insumo_id ?? "", 
            });
            setConfirmDelete(false);
            setIsCriando(false);
        }
    }, [selecionado]);

    function selecionarCompartimento(comp) {
        if (!isAdmin) return;
        setSelecionado(comp);
    }

    function handleNovoCompartimento() {
        setForm(INITIAL_FORM);
        setIsCriando(true);
    }

    function fecharModal() {
        setSelecionado(null);
        setIsCriando(false);
        setConfirmDelete(false);
    }

    async function handleSalvar() {
        setSalvando(true);

        const payload = {
            ...form,
            insumo_id: form.insumo_id ? parseInt(form.insumo_id) : null
        };

        try {
            if (isCriando) {
                const res = await api.post("/admin/compartimentos", payload);
                setCompartimentos((prev) => [...prev, res.data]);
            } else {
                const res = await api.put(`/admin/compartimentos/${selecionado.id}`, payload);

                const insumoSelecionado = insumos.find(i => i.id === payload.insumo_id);

                setCompartimentos((prev) =>
                    prev.map((c) => c.id === selecionado.id ? {
                        ...c,
                        ...payload,
                        peso_atual: res.data.peso_atual ?? c.peso_atual,
                        quantidade: res.data.quantidade ?? c.quantidade, // 🚀 CORRIGIDO: Mapeando 'quantidade' da API
                        insumo_name: insumoSelecionado ? insumoSelecionado.nome : "—"
                    } : c)
                );
            }
            fecharModal();
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
            fecharModal();
        } catch (err) {
            console.error(err);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-start gap-4">
            <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-3xl shadow-xl border-4 border-slate-300">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-slate-800">Compartimentos</h1>
                    {isAdmin && (
                        <button
                            onClick={handleNovoCompartimento}
                            className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold shadow hover:bg-sky-700 transition-colors"
                        >
                            + Novo Compartimento
                        </button>
                    )}
                </div>

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
                aberto={selecionado !== null || isCriando}
                onFechar={fecharModal}
                titulo={isCriando ? "Novo Compartimento" : `${selecionado?.nome ?? ""}`}
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
                                {!isCriando && (
                                    <button
                                        onClick={() => setConfirmDelete(true)}
                                        className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50 mr-auto"
                                    >
                                        Excluir
                                    </button>
                                )}
                                <button
                                    onClick={fecharModal}
                                    className={`px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 ${isCriando ? "ml-auto" : ""}`}
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
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Insumo Vinculado</label>
                        <select
                            value={form.insumo_id}
                            onChange={(e) => setForm({ ...form, insumo_id: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="">Nenhum (Vazio)</option>
                            {insumos.map((insumo) => (
                                <option key={insumo.id} value={insumo.id}>
                                    {insumo.nome} ({insumo.unidade})
                                </option>
                            ))}
                        </select>
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
                            onChange={(e) => setForm({ ...form, peso_tara: parseFloat(e.target.value) || 0 })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
                        <span className="text-sm text-gray-700">Sensor ativo</span>
                        <button
                            type="button"
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

                    {/* 🚀 TELEMETRIA CORRIGIDA: Lendo 'quantidade' diretamente da API */}
                    {!isCriando && isAdmin && (
                        <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 flex flex-col gap-1.5 border border-gray-200">
                            <span>
                                <span className="font-semibold text-gray-600">Peso atual:</span> {selecionado?.peso_atual ?? 0} kg
                            </span>
                            <span className="text-sky-700">
                                <span className="font-semibold">Quantidade em Estoque:</span> {selecionado?.quantidade ?? 0} {selecionado?.insumo?.unidade ?? ""}
                            </span>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}