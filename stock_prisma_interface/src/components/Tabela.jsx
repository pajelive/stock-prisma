'use client'

import { useState } from "react"
import TipoPill from "./TipoPill"

export default function Tabela({ titulo, dados = [], itensPorPagina = 12 }) {

    const [filtros, setFiltros] = useState({
        tipo: '',
        categoria: '',
        usuario: '',
        op: '',
        origem: '',
        etapa: '',
        nome: '',
        quantidade: '',
        dataInicio: '',
        dataFim: ''
    })

    const [mostrarData, setMostrarData] = useState(false)
    const [paginaAtual, setPaginaAtual] = useState(1)

    function handleFiltro(campo, valor) {
        setFiltros(prev => ({ ...prev, [campo]: valor }))
        setPaginaAtual(1)
    }

    function limparData() {
        setFiltros(prev => ({ ...prev, dataInicio: '', dataFim: '' }))
        setMostrarData(false)
        setPaginaAtual(1)
    }

    const tipos = [...new Set((dados || []).map(m => m.tipo).filter(Boolean))]
    const origens = [...new Set((dados || []).map(m => m.origem_leitura).filter(Boolean))]
    const etapas = [...new Set((dados || []).map(m => m.etapa).filter(Boolean))]

    const dadosFiltrados = (dados || []).filter((m) => {

        if (filtros.tipo && m.tipo !== filtros.tipo) return false

        if (filtros.categoria) {
            const cat = m.ferramenta ? 'Ferramenta' : 'Compartimento'
            if (cat !== filtros.categoria) return false
        }

        if (filtros.nome) {
            const nome = m.ferramenta || m.compartimento || ''
            if (!nome.toLowerCase().includes(filtros.nome.toLowerCase())) return false
        }

        if (filtros.quantidade && m.quantidade !== Number(filtros.quantidade)) return false

        if (filtros.usuario &&
            !m.usuario?.toLowerCase().includes(filtros.usuario.toLowerCase())
        ) return false

        // DATA CORRIGIDA (comparação por YYYY-MM-DD)
        const dataItem = m.data_hora?.slice(0, 10)

        if (filtros.dataInicio && dataItem < filtros.dataInicio) return false
        if (filtros.dataFim && dataItem > filtros.dataFim) return false

        if (filtros.origem && m.origem_leitura !== filtros.origem) return false
        if (filtros.op && !m.op?.toLowerCase().includes(filtros.op.toLowerCase())) return false
        if (filtros.etapa && m.etapa !== filtros.etapa) return false

        return true
    })

    const totalPaginas = Math.max(1, Math.ceil(dadosFiltrados.length / itensPorPagina))
    const paginaCorrigida = Math.min(paginaAtual, totalPaginas)

    const inicio = (paginaCorrigida - 1) * itensPorPagina
    const dadosPaginados = dadosFiltrados.slice(inicio, inicio + itensPorPagina)

    function irParaPagina(pagina) {
        if (pagina < 1 || pagina > totalPaginas) return
        setPaginaAtual(pagina)
    }

    function getNumerosPagina() {
        const numeros = []
        const delta = 1

        for (let i = 1; i <= totalPaginas; i++) {
            if (
                i === 1 ||
                i === totalPaginas ||
                (i >= paginaCorrigida - delta && i <= paginaCorrigida + delta)
            ) {
                numeros.push(i)
            } else if (numeros[numeros.length - 1] !== '...') {
                numeros.push('...')
            }
        }
        return numeros
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-800">{titulo}</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                    {dadosFiltrados.length} registros
                </span>
            </div>

            {/* TABELA */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">

                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Tipo</th>
                            <th className="px-4 py-3 text-left">Categoria</th>
                            <th className="px-4 py-3 text-left">Nome</th>
                            <th className="px-4 py-3 text-left">Qtd</th>
                            <th className="px-4 py-3 text-left">Responsável</th>
                            <th className="px-4 py-3 text-left">Data</th>
                            <th className="px-4 py-3 text-left">Origem</th>
                            <th className="px-4 py-3 text-left">OP</th>
                            <th className="px-4 py-3 text-left">Etapa</th>
                            <th className="px-4 py-3 text-left">Observação</th>
                        </tr>

                        {/* FILTROS */}
                        <tr className="bg-white border-b border-gray-200">

                            <th></th>

                            <th>
                                <select value={filtros.tipo}
                                    onChange={(e) => handleFiltro('tipo', e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {tipos.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </th>

                            <th>
                                <select value={filtros.categoria}
                                    onChange={(e) => handleFiltro('categoria', e.target.value)}
                                >
                                    <option value="">Todas</option>
                                    <option value="Ferramenta">Ferramenta</option>
                                    <option value="Compartimento">Compartimento</option>
                                </select>
                            </th>

                            <th>
                                <input
                                    value={filtros.nome}
                                    onChange={(e) => handleFiltro('nome', e.target.value)}
                                    placeholder="Nome"
                                />
                            </th>

                            <th>
                                <input
                                    type="number"
                                    value={filtros.quantidade}
                                    onChange={(e) => handleFiltro('quantidade', e.target.value)}
                                    placeholder="Qtd"
                                />
                            </th>

                            <th>
                                <input
                                    value={filtros.usuario}
                                    onChange={(e) => handleFiltro('usuario', e.target.value)}
                                    placeholder="Usuário"
                                />
                            </th>

                            {/* DATA */}
                            <th>
                                <button onClick={() => setMostrarData(!mostrarData)}>
                                    Período
                                </button>

                                {mostrarData && (
                                    <div>
                                        <input
                                            type="date"
                                            value={filtros.dataInicio}
                                            onChange={(e) => handleFiltro('dataInicio', e.target.value)}
                                        />
                                        <input
                                            type="date"
                                            value={filtros.dataFim}
                                            onChange={(e) => handleFiltro('dataFim', e.target.value)}
                                        />
                                        <button onClick={limparData}>Limpar</button>
                                    </div>
                                )}
                            </th>

                            <th>
                                <select value={filtros.origem}
                                    onChange={(e) => handleFiltro('origem', e.target.value)}
                                >
                                    <option value="">Todas</option>
                                    {origens.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </th>

                            <th>
                                <input
                                    value={filtros.op}
                                    onChange={(e) => handleFiltro('op', e.target.value)}
                                    placeholder="OP"
                                />
                            </th>

                            <th>
                                <select value={filtros.etapa}
                                    onChange={(e) => handleFiltro('etapa', e.target.value)}
                                >
                                    <option value="">Todas</option>
                                    {etapas.map(e => <option key={e}>{e}</option>)}
                                </select>
                            </th>

                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {dadosPaginados.map((m) => (
                            <tr key={m.id} className="border-b hover:bg-gray-50">

                                <td>#{m.id}</td>

                                <td><TipoPill tipo={m.tipo} /></td>

                                <td>{m.ferramenta ? 'Ferramenta' : 'Compartimento'}</td>

                                <td>{m.ferramenta || m.compartimento || '—'}</td>

                                <td>{m.quantidade}</td>

                                <td>{m.usuario}</td>

                                <td>{m.data_hora}</td>

                                <td>{m.origem_leitura}</td>

                                <td>{m.op || '—'}</td>

                                <td>{m.etapa || '—'}</td>

                                <td>{m.observacao || '—'}</td>

                            </tr>
                        ))}

                        {dadosPaginados.length === 0 && (
                            <tr>
                                <td colSpan={11} className="text-center py-6 text-gray-400">
                                    Nenhum registro encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

        </div>
    )
}