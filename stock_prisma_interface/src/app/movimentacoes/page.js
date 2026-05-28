'use client'

import Tabela from '../../components/Tabela'
import {useState} from "react";
import {useEffect} from "react";
import api from "../../services/api";
import FiltrosMovimentacao from '../../components/FiltrosMovimentacao'


export default function Movimentacoes() {

    const [movimentacoes, setMovimentacoes] = useState([])

    const [filtros, setFiltros] = useState({
        tipo: '',
        categoria: '',
        usuario: '',
        op: '',
        origem: '',
        etapa: '',
        dataInicio: '',
        dataFim: '',
    })

    useEffect(() => {
        async function buscarMovimentacoes() {
            const resposta = await api.get('/public/movimentacoes')
            setMovimentacoes(resposta.data)
        }
        buscarMovimentacoes()
    }, [])

     function handleFiltro(campo, valor) {
        setFiltros(prev => ({ ...prev, [campo]: valor }))
    }

    const dadosFiltrados = movimentacoes.filter((m) => {
        if (filtros.tipo && m.tipo !== filtros.tipo) return false
        if (filtros.categoria) {
            const cat = m.ferramenta ? 'Ferramenta' : 'Compartimento'
            if (cat !== filtros.categoria) return false
        }
        if (filtros.usuario && !m.usuario?.toLowerCase().includes(filtros.usuario.toLowerCase())) return false
        if (filtros.op && !m.op?.toLowerCase().includes(filtros.op.toLowerCase())) return false
        if (filtros.origem && m.origem_leitura !== filtros.origem) return false
        if (filtros.etapa && m.etapa !== filtros.etapa) return false
        if (filtros.dataInicio && m.data_hora < filtros.dataInicio) return false
        if (filtros.dataFim && m.data_hora > filtros.dataFim + ' 23:59:59') return false
        return true
    })

    return (
         <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-medium text-gray-800 mb-6">Stock Prisma</h1>

            <FiltrosMovimentacao
                filtros={filtros}
                onChange={handleFiltro}
                movimentacoes={movimentacoes}
            />

            <Tabela
                titulo="Histórico"
                dados={dadosFiltrados}
            />
        </div>
    )
}