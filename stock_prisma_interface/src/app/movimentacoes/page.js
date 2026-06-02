'use client'

import { useState, useEffect } from "react"
import api from "../../services/api"
import Tabela from '../../components/Tabela'

export default function Movimentacoes() {

    const [movimentacoes, setMovimentacoes] = useState([])

    useEffect(() => {
        async function buscarMovimentacoes() {
            try {
                const resposta = await api.get('/public/movimentacoes')
                setMovimentacoes(resposta.data)
            } catch (erro) {
                console.error('Erro ao buscar movimentações:', erro)
            }
        }
        buscarMovimentacoes()

        // atualização automática
        const intervalo = setInterval(() => {
            buscarMovimentacoes()
        }, 5000)

        // limpeza ao sair da página
        return () => clearInterval(intervalo)


    }, [])

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-medium text-gray-800 mb-6">Stock Prisma</h1>
            <Tabela titulo="Histórico" dados={movimentacoes} />
        </div>
    )
}