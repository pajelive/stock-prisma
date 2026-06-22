import { useState } from "react"
import TipoPill from "./TipoPill"

export default function Tabela({
    titulo,
    dados = [],
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
        if (filtros.origem && m.origem_leitura !== filtros.origem) return false
        if (filtros.op && !m.op?.toLowerCase().includes(filtros.op.toLowerCase())) return false
        if (filtros.etapa && m.etapa !== filtros.etapa) return false
        return true
    })

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-base font-medium text-gray-800">{titulo}</h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                    {dadosFiltrados.length} registros (página)
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">

                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Nome</th>
                            <th>Qtd</th>
                            <th>Usuário</th>
                            <th>Data</th>
                            <th>Origem</th>
                        </tr>
                    </thead>

                    <tbody>
                        {dadosFiltrados.map((m) => (
                            <tr key={m.id}>
                                <td>#{m.id}</td>
                                <td><TipoPill tipo={m.tipo} /></td>
                                <td>{m.ferramenta || m.compartimento}</td>
                                <td>{m.quantidade}</td>
                                <td>{m.usuario}</td>
                                <td>{m.data_hora}</td>
                                <td>{m.origem_leitura}</td>
                            </tr>
                        ))}

                        {dadosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-400">
                                    Nenhum registro encontrado
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINAÇÃO REAL (BACKEND) */}
            <div className="flex items-center justify-between p-4 border-t">

                <button
                    onClick={() => onPageChange(pagina - 1)}
                    disabled={pagina <= 1}
                    className="px-3 py-1 border rounded disabled:opacity-40"
                >
                    Anterior
                </button>

                <span className="text-sm">
                    Página {pagina} de {totalPaginas}
                </span>

                <button
                    onClick={() => onPageChange(pagina + 1)}
                    disabled={pagina >= totalPaginas}
                    className="px-3 py-1 border rounded disabled:opacity-40"
                >
                    Próxima
                </button>

            </div>
        </div>
    )
}