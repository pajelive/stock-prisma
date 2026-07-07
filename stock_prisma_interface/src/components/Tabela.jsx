import { useState } from "react"
import TipoPill from "./TipoPill"

export default function Tabela({
    titulo,
    dados = [],
    paginaAtual = 1,
    totalPaginas = 1,
    onPageChange
}) {
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

    function handleFiltro(campo, valor) {
        setFiltros(prev => ({ ...prev, [campo]: valor }))
    }

    function limparData() {
        setFiltros(prev => ({ ...prev, dataInicio: '', dataFim: '' }))
        setMostrarData(false)
    }

    // Mantenha estático ou idealmente envie os filtros para a API buscar.
    // Para evitar loops, calculamos apenas se existirem dados.
    const tipos = [...new Set(dados.map(m => m.tipo).filter(Boolean))]
    const origens = [...new Set(dados.map(m => m.origem_leitura).filter(Boolean))]
    const etapas = [...new Set(dados.map(m => m.etapa).filter(Boolean))]

    const temFiltroData = filtros.dataInicio || filtros.dataFim

    function irParaPagina(pagina) {
        if (pagina < 1 || pagina > totalPaginas || pagina === paginaAtual) return
        onPageChange?.(pagina)
    }

    function getNumerosPagina() {
        const numeros = []
        const delta = 1

        for (let i = 1; i <= totalPaginas; i++) {
            if (
                i === 1 ||
                i === totalPaginas ||
                (i >= paginaAtual - delta && i <= paginaAtual + delta)
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
            
            {/* Cabeçalho */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-800">{titulo}</h2>
                <span className="text-xs bg-gray-100 text-gray-600 font-medium px-3 py-1 rounded-full">
                    {dados.length} registros nesta página
                </span>
            </div>

            {/* Tabela */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-600">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Tipo</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Categoria</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Nome</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Qtd</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Responsável</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Data</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Origem</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">OP</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Etapa</th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500">Observação</th>
                        </tr>

                        {/* Filtros */}
                        <tr className="bg-white border-b border-gray-200">
                            <th></th>
                            <th className="px-3 py-2">
                                <select
                                    value={filtros.tipo}
                                    onChange={(e) => handleFiltro('tipo', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none"
                                >
                                    <option value="">Todos</option>
                                    {tipos.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </th>
                            <th className="px-3 py-2">
                                <select
                                    value={filtros.categoria}
                                    onChange={(e) => handleFiltro('categoria', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none"
                                >
                                    <option value="">Todas</option>
                                    <option value="Ferramenta">Ferramenta</option>
                                    <option value="Compartimento">Compartimento</option>
                                </select>
                            </th>
                            <th className="px-3 py-2">
                                <input
                                    type="text"
                                    placeholder="Filtrar..."
                                    value={filtros.nome}
                                    onChange={(e) => handleFiltro('nome', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none"
                                />
                            </th>
                            <th className="px-3 py-2">
                                <input
                                    type="number"
                                    placeholder="Qtd"
                                    value={filtros.quantidade}
                                    onChange={(e) => handleFiltro('quantidade', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none"
                                />
                            </th>
                            <th className="px-3 py-2">
                                <input
                                    type="text"
                                    placeholder="Filtrar..."
                                    value={filtros.usuario}
                                    onChange={(e) => handleFiltro('usuario', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none"
                                />
                            </th>
                            <th className="px-3 py-2 relative">
                                <button
                                    onClick={() => setMostrarData(!mostrarData)}
                                    className={`w-full border rounded-lg px-2 py-1 text-xs text-left font-normal ${
                                        temFiltroData
                                            ? 'border-sky-300 bg-sky-50 text-sky-600 font-medium'
                                            : 'border-gray-200 text-gray-500'
                                    }`}
                                >
                                    {temFiltroData
                                        ? `${filtros.dataInicio || '...'} → ${filtros.dataFim || '...'}`
                                        : 'Período'}
                                </button>

                                {mostrarData && (
                                    <div className="absolute z-10 top-10 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-3 flex flex-col gap-2 min-w-48">
                                        <input type="date" value={filtros.dataInicio}
                                            onChange={(e) => handleFiltro('dataInicio', e.target.value)}
                                            className="border rounded px-2 py-1 text-xs" />
                                        <input type="date" value={filtros.dataFim}
                                            onChange={(e) => handleFiltro('dataFim', e.target.value)}
                                            className="border rounded px-2 py-1 text-xs" />
                                        <button onClick={limparData}
                                            className="text-xs text-red-500 font-medium text-left pt-1">
                                            Limpar Filtro
                                        </button>
                                    </div>
                                )}
                            </th>
                            <th className="px-3 py-2">
                                <select
                                    value={filtros.origem}
                                    onChange={(e) => handleFiltro('origem', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none"
                                >
                                    <option value="">Todas</option>
                                    {origens.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </th>
                            <th className="px-3 py-2">
                                <input
                                    type="text"
                                    placeholder="Filtrar..."
                                    value={filtros.op}
                                    onChange={(e) => handleFiltro('op', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none"
                                />
                            </th>
                            <th className="px-3 py-2">
                                <select
                                    value={filtros.etapa}
                                    onChange={(e) => handleFiltro('etapa', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none"
                                >
                                    <option value="">Todas</option>
                                    {etapas.map(e => <option key={e} value={e}>{e}</option>)}
                                </select>
                            </th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {dados.map((m) => (
                            <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                                <td className="px-4 py-3">
                                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                        #{m.id}
                                    </span>
                                </td>
                                <td className="px-4 py-3"><TipoPill tipo={m.tipo} /></td>
                                <td className="px-4 py-3 text-gray-600">{m.ferramenta ? 'Ferramenta' : 'Compartimento'}</td>
                                <td className="px-4 py-3 font-medium text-gray-800">{m.ferramenta || m.compartimento}</td>
                                <td className="px-4 py-3 font-mono">{m.quantidade}</td>
                                <td className="px-4 py-3 text-gray-700 font-medium">{m.usuario}</td>
                                <td className="px-4 py-3 text-gray-400 text-xs font-mono">{m.data_hora}</td>
                                <td className="px-4 py-3 text-gray-500 text-xs">{m.origem_leitura}</td>
                                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{m.op || '—'}</td>
                                <td className="px-4 py-3 text-gray-600">{m.etapa || '—'}</td>
                                <td className="px-4 py-3 text-gray-400 italic text-xs max-w-xs truncate">{m.observacao || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Nova Paginação Refinada e Elegante */}
            {totalPaginas > 1 && (
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200 flex items-center justify-between select-none">
                    <div className="text-sm text-gray-500">
                        Mostrando página <span className="font-semibold text-gray-700">{paginaAtual}</span> de <span className="font-semibold text-gray-700">{totalPaginas}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {/* Botão Anterior */}
                        <button
                            onClick={() => irParaPagina(paginaAtual - 1)}
                            disabled={paginaAtual === 1}
                            className="p-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 bg-white shadow-sm
                                       hover:bg-gray-50 active:bg-gray-100 transition flex items-center gap-1
                                       disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Anterior
                        </button>

                        {/* Números das Páginas */}
                        <div className="flex items-center gap-1 px-1">
                            {getNumerosPagina().map((num, idx) =>
                                num === '...' ? (
                                    <span key={idx} className="w-8 text-center text-sm font-medium text-gray-400">...</span>
                                ) : (
                                    <button
                                        key={num}
                                        onClick={() => irParaPagina(num)}
                                        className={`w-8 h-8 text-xs font-semibold rounded-lg border transition-all ${
                                            num === paginaAtual
                                                ? 'bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-100'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 active:bg-gray-100'
                                        }`}
                                    >
                                        {num}
                                    </button>
                                )
                            )}
                        </div>

                        {/* Botão Próxima */}
                        <button
                            onClick={() => irParaPagina(paginaAtual + 1)}
                            disabled={paginaAtual === totalPaginas}
                            className="p-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 bg-white shadow-sm
                                       hover:bg-gray-50 active:bg-gray-100 transition flex items-center gap-1
                                       disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed"
                        >
                            Próxima
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}