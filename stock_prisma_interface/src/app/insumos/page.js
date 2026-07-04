"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Insumo from "../../components/Insumo";
import Modal from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";

// 1. ATUALIZADO: Incluídos os novos campos obrigatórios com valores padrão vazios
const INITIAL_FORM = {
    nome: "",
    categoria: "",
    unidade: "kg",
    uid_rfid: "",
    peso_unitario: ""
};

export default function Insumos() {
    const [insumos, setInsumos] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [isCriando, setIsCriando] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [salvando, setSalvando] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { usuario } = useAuth();
    const isAdmin = usuario?.perfil === "Administrador";

    useEffect(() => {
        async function loadInsumos() {
            try {
                const res = await api.get("/admin/insumos");
                setInsumos(res.data ?? []);
            } catch (err) {
                console.error("Erro ao carregar insumos:", err);
                setInsumos([]);
            }
        }
        loadInsumos();
    }, []);

    // 2. ATUALIZADO: Popula os novos campos ao carregar para edição
    useEffect(() => {
        if (selecionado) {
            setForm({
                nome: selecionado.nome ?? "",
                categoria: selecionado.categoria ?? "",
                unidade: selecionado.unidade ?? "kg",
                uid_rfid: selecionado.uid_rfid ?? "",
                peso_unitario: selecionado.peso_unitario ?? "",
            });
            setConfirmDelete(false);
            setIsCriando(false);
        }
    }, [selecionado]);

    function selecionarInsumo(item) {
        if (!isAdmin) return;
        setSelecionado(item);
    }

    function handleNovoInsumo() {
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
        
        // Formata os dados garantindo que o peso seja enviado como número float
        const payload = {
            ...form,
            peso_unitario: parseFloat(form.peso_unitario) || 0
        };

        try {
            if (isCriando) {
                const res = await api.post("/admin/insumos", payload);
                setInsumos((prev) => [...prev, res.data]);
            } else {
                await api.put(`/admin/insumos/${selecionado.id}`, payload);
                setInsumos((prev) =>
                    prev.map((i) => i.id === selecionado.id ? { ...i, ...payload } : i)
                );
            }
            fecharModal();
        } catch (err) {
            console.error("Erro ao salvar insumo:", err);
            alert(err.response?.data?.erro || "Erro ao salvar.");
        } finally {
            setSalvando(false);
        }
    }

    async function handleDeletar() {
        setSalvando(true);
        try {
            await api.delete(`/admin/insumos/${selecionado.id}`);
            setInsumos((prev) => prev.filter((i) => i.id !== selecionado.id));
            fecharModal();
        } catch (err) {
            console.error("Erro ao remover insumo:", err);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-start gap-4">
            <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-3xl shadow-xl border-4 border-slate-300">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-slate-800">Insumos</h1>
                    {isAdmin && (
                        <button
                            onClick={handleNovoInsumo}
                            className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold shadow hover:bg-sky-700 transition-colors"
                        >
                            + Novo Insumo
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {insumos.map((item) => (
                        <Insumo
                            key={item.id}
                            insumo={item}
                            onClick={() => selecionarInsumo(item)}
                        />
                    ))}
                    {insumos.length === 0 && (
                        <p className="text-sm text-gray-400 col-span-full text-center py-8">Nenhum insumo cadastrado.</p>
                    )}
                </div>
            </div>

            <Modal
                aberto={selecionado !== null || isCriando}
                onFechar={fecharModal}
                titulo={isCriando ? "Novo Insumo" : `Editar: ${selecionado?.nome ?? ""}`}
                footer={
                    <>
                        {confirmDelete ? (
                            <>
                                <span className="text-sm text-red-600 mr-auto font-medium">Confirma a remoção?</span>
                                <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Cancelar</button>
                                <button onClick={handleDeletar} disabled={salvando} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50">
                                    {salvando ? "Removendo..." : "Confirmar"}
                                </button>
                            </>
                        ) : (
                            <>
                                {!isCriando && (
                                    <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 rounded-lg border border-red-300 text-red-600 text-sm hover:bg-red-50 mr-auto">Excluir</button>
                                )}
                                <button onClick={fecharModal} className={`px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 ${isCriando ? "ml-auto" : ""}`}>Cancelar</button>
                                <button onClick={handleSalvar} disabled={salvando} className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm hover:bg-sky-700 disabled:opacity-50">
                                    {salvando ? "Salvando..." : "Salvar"}
                                </button>
                            </>
                        )}
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome do Insumo</label>
                        <input
                            value={form.nome}
                            onChange={(e) => setForm({ ...form, nome: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="Ex: Resina Epóxi, Parafuso M6"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoria</label>
                        <input
                            value={form.categoria}
                            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="Ex: Químicos, Fixadores, Matéria-prima"
                        />
                    </div>

                    {/* 3. ADICIONADO: Inputs lado a lado para Peso Unitário e UID RFID */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Peso Unitário (g)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.peso_unitario}
                                onChange={(e) => setForm({ ...form, peso_unitario: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                                placeholder="Ex: 12.50"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">UID RFID</label>
                            <input
                                value={form.uid_rfid}
                                onChange={(e) => setForm({ ...form, uid_rfid: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                                placeholder="Ex: AB12CD34"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Unidade de Medida</label>
                        <select
                            value={form.unidade}
                            onChange={(e) => setForm({ ...form, unidade: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="kg">Quilograma (kg)</option>
                            <option value="g">Gramas (g)</option>
                            <option value="L">Litros (L)</option>
                            <option value="mL">Mililitros (mL)</option>
                            <option value="un">Unidade (un)</option>
                            <option value="m">Metros (m)</option>
                        </select>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

// Componente do Card de exibição ajustado para exibir o peso unitário
export function Insumo({ insumo, onClick }) {
    return (
        <div
            onClick={onClick}
            className="p-4 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between gap-2"
        >
            <div>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-800 text-base line-clamp-1">{insumo.nome}</h3>
                    <span className="text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-md">
                        {insumo.unidade}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    <span className="font-medium text-gray-500">Categoria:</span> {insumo.categoria || "Geral"}
                </p>
                
                {/* 4. ADICIONADO: Exibição opcional do peso unitário caso exista no card */}
                {insumo.peso_unitario !== undefined && (
                    <p className="text-xs text-gray-400 mt-0.5">
                        <span className="font-medium text-gray-500">Peso Unit.:</span> {insumo.peso_unitario}g
                    </p>
                )}
            </div>
        </div>
    );
}