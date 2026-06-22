import { useState } from "react"
import TipoPill from "./TipoPill"

export default function Tabela({
    titulo,
    dados,
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

    const tipos = [...new Set(dados.map(m => m.tipo).filter(Boolean))]
    const origens = [...new Set(dados.map(m => m.origem_leitura).filter(Boolean))]
    const etapas = [...new Set(dados.map(m => m.etapa).filter(Boolean))]

    const dadosFiltrados = dados.filter((m) => {
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

        if (filtros.usuario && !m.usuario?.toLowerCase().includes(filtros.usuario.toLowerCase())) return false

        if (filtros.dataInicio && m.data_hora < filtros.dataInicio) return false

        if (filtros.dataFim && m.data_hora > filtros.dataFim + ' 23:59:59') return false

        if (filtros.origem && m.origem_leitura !== filtros.origem) return false

        if (filtros.op && !m.op?.toLowerCase().includes(filtros.op.toLowerCase())) return false

        if (filtros.etapa && m.etapa !== filtros.etapa) return false

        return true
    })

    const temFiltroData = filtros.dataInicio || filtros.dataFim

    // 🔥 AGORA NÃO EXISTE MAIS PAGINAÇÃO LOCAL
    const dadosPaginados = dadosFiltrados

    function irParaPagina(pagina) {
        if (pagina < 1 || pagina > totalPaginas) return
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

            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-800">{titulo}</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                    {dadosFiltrados.length} registros
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
                                    className={`w-full border rounded-lg px-2 py-1 text-xs text-left ${
                                        temFiltroData
                                            ? 'border-blue-300 bg-blue-50 text-blue-600'
                                            : 'border-gray-200 text-gray-600'
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
                                            className="text-xs text-red-400 text-left">
                                            Limpar
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

                    <tbody>
                        {dadosPaginados.map((m) => (
                            <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3">
                                    <span className="font-mono text-xs bg-gray-700 px-2 py-1 rounded-md">
                                        #{m.id}
                                    </span>
                                </td>

                                <td className="px-4 py-3">
                                    <TipoPill tipo={m.tipo} />
                                </td>

                                <td className="px-4 py-3 text-gray-700">
                                    {m.ferramenta ? 'Ferramenta' : 'Compartimento'}
                                </td>

                                <td className="px-4 py-3 text-gray-700">
                                    {m.ferramenta || m.compartimento}
                                </td>

                                <td className="px-4 py-3 text-gray-700">{m.quantidade}</td>
                                <td className="px-4 py-3 text-gray-700">{m.usuario}</td>
                                <td className="px-4 py-3 text-gray-500">{m.data_hora}</td>
                                <td className="px-4 py-3 text-gray-500">{m.origem_leitura}</td>
                                <td className="px-4 py-3 text-gray-700">{m.op || '—'}</td>
                                <td className="px-4 py-3 text-gray-700">{m.etapa || '—'}</td>
                                <td className="px-4 py-3 text-gray-400">{m.observacao || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {totalPaginas > 1 && (
                <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">

                    <span className="text-xs text-gray-500">
                        Página {paginaAtual} de {totalPaginas}
                    </span>

                    <div className="flex gap-1">
                        <button
                            onClick={() => irParaPagina(paginaAtual - 1)}
                            disabled={paginaAtual === 1}
                            className="px-3 py-1 text-xs border rounded-lg"
                        >
                            Anterior
                        </button>

                        {getNumerosPagina().map((num, idx) =>
                            num === '...' ? (
                                <span key={idx} className="px-2 text-xs text-gray-400">...</span>
                            ) : (
                                <button
                                    key={num}
                                    onClick={() => irParaPagina(num)}
                                    className={`px-3 py-1 text-xs rounded-lg ${
                                        num === paginaAtual
                                            ? 'bg-sky-500 text-white'
                                            : 'border'
                                    }`}
                                >
                                    {num}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => irParaPagina(paginaAtual + 1)}
                            disabled={paginaAtual === totalPaginas}
                            className="px-3 py-1 text-xs border rounded-lg"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}