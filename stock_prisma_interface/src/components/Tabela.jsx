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

    const safeDados = dados || []

    const tipos = [...new Set(safeDados.map(m => m.tipo).filter(Boolean))]
    const origens = [...new Set(safeDados.map(m => m.origem_leitura).filter(Boolean))]
    const etapas = [...new Set(safeDados.map(m => m.etapa).filter(Boolean))]

    const dadosFiltrados = safeDados.filter((m) => {
        if (filtros.tipo && m.tipo !== filtros.tipo) return false

        if (filtros.categoria) {
            const cat = m.ferramenta ? 'Ferramenta' : 'Compartimento'
            if (cat !== filtros.categoria) return false
        }

        if (filtros.nome) {
            const nome = m.ferramenta || m.compartimento || ''
            if (!String(nome).toLowerCase().includes(filtros.nome.toLowerCase())) return false
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
                    </thead>

                    <tbody>
                        {dadosPaginados.map((m) => (
                            <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">

                                <td className="px-4 py-3 font-mono text-xs">#{m.id}</td>

                                <td className="px-4 py-3">
                                    <TipoPill tipo={m.tipo} />
                                </td>

                                <td className="px-4 py-3">
                                    {m.ferramenta ? 'Ferramenta' : 'Compartimento'}
                                </td>

                                <td className="px-4 py-3">
                                    {m.ferramenta || m.compartimento || '—'}
                                </td>

                                <td className="px-4 py-3">{m.quantidade}</td>
                                <td className="px-4 py-3">{m.usuario}</td>
                                <td className="px-4 py-3 text-gray-500">{m.data_hora}</td>
                                <td className="px-4 py-3">{m.origem_leitura}</td>
                                <td className="px-4 py-3">{m.op || '—'}</td>
                                <td className="px-4 py-3">{m.etapa || '—'}</td>
                                <td className="px-4 py-3 text-gray-400">{m.observacao || '—'}</td>

                            </tr>
                        ))}

                        {dadosPaginados.length === 0 && (
                            <tr>
                                <td colSpan={11} className="px-4 py-8 text-center text-gray-400">
                                    Nenhum registro encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {totalPaginas > 1 && (
                <div className="px-5 py-4 border-t flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                        Página {paginaCorrigida} de {totalPaginas}
                    </span>

                    <div className="flex gap-1">
                        <button onClick={() => irParaPagina(paginaCorrigida - 1)}>
                            Anterior
                        </button>

                        {getNumerosPagina().map((num, idx) =>
                            num === '...' ? (
                                <span key={idx} className="px-2">...</span>
                            ) : (
                                <button
                                    key={num}
                                    onClick={() => irParaPagina(num)}
                                    className={num === paginaCorrigida ? "font-bold" : ""}
                                >
                                    {num}
                                </button>
                            )
                        )}

                        <button onClick={() => irParaPagina(paginaCorrigida + 1)}>
                            Próxima
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}