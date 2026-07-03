"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Ferramenta from "../../components/Ferramenta";
import Modal from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";

const INITIAL_FORM = {
    nome: "",
    categoria: "",
    descricao: "",
    uid_rfid: "",
    status: "DISPONIVEL"
};

export default function Ferramentas() {
    const [ferramentas, setFerramentas] = useState([]);
    const [selecionado, setSelecionado] = useState(null);
    const [isCriando, setIsCriando] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [salvando, setSalvando] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { usuario } = useAuth();
    const isAdmin = usuario?.perfil === "Administrador";

    // Carrega todas as ferramentas ativas do sistema
    useEffect(() => {
        async function loadFerramentas() {
            try {
                const res = await api.get("/admin/ferramentas");
                setFerramentas(res.data ?? []);
            } catch (err) {
                console.error("Erro ao carregar ferramentas:", err);
                setFerramentas([]);
            }
        }
        loadFerramentas();
    }, []);

    // Monitora a seleção para preenchimento de edição
    useEffect(() => {
        if (selecionado) {
            setForm({
                nome: selecionado.nome ?? "",
                categoria: selecionado.categoria ?? "",
                descricao: selecionado.descricao ?? "",
                uid_rfid: selecionado.uid_rfid ?? "",
                status: selecionado.status ?? "DISPONIVEL",
            });
            setConfirmDelete(false);
            setIsCriando(false);
        }
    }, [selecionado]);

    function selecionarFerramenta(item) {
        if (!isAdmin) return; // Apenas admin abre o modal para gerenciar
        setSelecionado(item);
    }

    function handleNovaFerramenta() {
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
        try {
            if (isCriando) {
                // POST cria uma ferramenta nova retornando a mensagem e o ID gerado
                const res = await api.post("/admin/ferramentas", form);

                // Mescla os dados do formulário com o ID retornado pelo backend
                const novaFerramentaCompleta = {
                    ...form,
                    id: res.data.id,
                    created_at: new Date().toISOString()
                };
                setFerramentas((prev) => [...prev, novaFerramentaCompleta]);
            } else {
                // PUT atualiza os campos editados
                await api.put(`/admin/ferramentas/${selecionado.id}`, form);
                setFerramentas((prev) =>
                    prev.map((f) => f.id === selecionado.id ? { ...f, ...form } : f)
                );
            }
            fecharModal();
        } catch (err) {
            console.error("Erro ao salvar ferramenta:", err);
            alert(err.response?.data?.erro || "Erro interno ao processar requisição.");
        } finally {
            setSalvando(false);
        }
    }

    async function handleDeletar() {
        setSalvando(true);
        try {
            // DELETE desativa logicamente a ferramenta definindo ativo=False no banco
            await api.delete(`/admin/ferramentas/${selecionado.id}`);
            setFerramentas((prev) => prev.filter((f) => f.id !== selecionado.id));
            fecharModal();
        } catch (err) {
            console.error("Erro ao desativar ferramenta:", err);
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-start gap-4">
            <div className="w-full max-w-5xl mx-auto bg-white p-6 rounded-3xl shadow-xl border-4 border-slate-300">

                {/* Cabeçalho alinhado com o botão azul padrão do site */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-slate-800">Ferramentas</h1>
                    {isAdmin && (
                        <button
                            onClick={handleNovaFerramenta}
                            className="px-4 py-2 bg-sky-600 text-white rounded-xl text-sm font-semibold shadow hover:bg-sky-700 transition-colors"
                        >
                            + Nova Ferramenta
                        </button>
                    )}
                </div>

                {/* Grid Responsivo de Exibição */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ferramentas.map((item) => (
                        <Ferramenta
                            key={item.id}
                            ferramenta={item}
                            onClick={() => selecionarFerramenta(item)}
                        />
                    ))}
                    {ferramentas.length === 0 && (
                        <p className="text-sm text-gray-400 col-span-full text-center py-8">Nenhuma ferramenta encontrada.</p>
                    )}
                </div>
            </div>

            {/* Modal de gerenciamento */}
            <Modal
                aberto={selecionado !== null || isCriando}
                onFechar={fecharModal}
                titulo={isCriando ? "Nova Ferramenta" : `Editar: ${selecionado?.nome ?? ""}`}
                footer={
                    <>
                        {confirmDelete ? (
                            <>
                                <span className="text-sm text-red-600 mr-auto font-medium">Tem certeza?</span>
                                <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">Cancelar</button>
                                <button onClick={handleDeletar} disabled={salvando} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50">
                                    {salvando ? "Removendo..." : "Confirmar remoção"}
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
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome da Ferramenta</label>
                        <input
                            value={form.nome}
                            onChange={(e) => setForm({ ...form, nome: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="Ex: Chave de Fenda Pneumática"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Código UID RFID</label>
                        <input
                            value={form.uid_rfid}
                            onChange={(e) => setForm({ ...form, uid_rfid: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="Ex: FA32B8C1"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categoria</label>
                        <input
                            value={form.categoria}
                            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                            placeholder="Ex: Manuais, Elétricas, Hidráulicas"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status Operacional</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                        >
                            <option value="DISPONIVEL">Disponível</option>
                            <option value="EM_USO">Em Uso</option>
                            <option value="MANUTENCAO">Em Manutenção</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Descrição / Observações</label>
                        <textarea
                            rows={3}
                            value={form.descricao}
                            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
                            placeholder="Detalhes sobre calibração, restrições de uso, etc..."
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}