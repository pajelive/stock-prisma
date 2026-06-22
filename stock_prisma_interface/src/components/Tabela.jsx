import { useState } from "react"
import TipoPill from "./TipoPill"

export default function Tabela({
    titulo,
    dados,
    pagina,
    totalPaginas,
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
        onPageChange(1) // reset backend page
    }

    function limparData() {
        setFiltros(prev => ({ ...prev, dataInicio: '', dataFim: '' }))
        setMostrarData(false)
        onPageChange(1)
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

    function irParaPagina(p) {
        if (p < 1 || p > totalPaginas) return
        onPageChange(p)
    }

    function getNumerosPagina() {
        const numeros = []
        const delta = 1

        for (let i = 1; i <= totalPaginas; i++) {
            if (
                i === 1 ||
                i === totalPaginas ||
                (i >= pagina - delta && i <= pagina + delta)
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
                    {dadosFiltrados.length} registros (página {pagina})
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <tbody>
                        {dados.map((m) => (
                            <tr key={m.id}>
                                <td>{m.id}</td>
                                <td>{m.tipo}</td>
                                <td>{m.usuario}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINAÇÃO BACKEND */}
            {totalPaginas > 1 && (
                <div className="px-5 py-4 border-t flex items-center justify-between">

                    <span>
                        Página {pagina} de {totalPaginas}
                    </span>

                    <div className="flex gap-2">
                        <button
                            onClick={() => irParaPagina(pagina - 1)}
                            disabled={pagina === 1}
                        >
                            Anterior
                        </button>

                        {getNumerosPagina().map((num, idx) =>
                            num === '...' ? (
                                <span key={idx}>...</span>
                            ) : (
                                <button
                                    key={num}
                                    onClick={() => irParaPagina(num)}
                                    style={{
                                        fontWeight: num === pagina ? 'bold' : 'normal'
                                    }}
                                >
                                    {num}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => irParaPagina(pagina + 1)}
                            disabled={pagina === totalPaginas}
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}