'use client'

import { useState, useEffect } from "react"
import api from "../../services/api"
import Tabela from '../../components/Tabela'

export default function Movimentacoes() {

    const [data, setData] = useState({
        items: [],
        page: 1,
        pages: 1,
        total: 0
    })

    const [pagina, setPagina] = useState(1)

    async function buscarMovimentacoes(page = 1) {
        try {
            const resposta = await api.get(`/public/movimentacoes?page=${page}`)

            setData(resposta.data)
            setPagina(resposta.data.page)

        } catch (erro) {
            console.error('Erro ao buscar movimentações:', erro)
        }
    }

    useEffect(() => {
        buscarMovimentacoes(pagina)

        const intervalo = setInterval(() => {
            buscarMovimentacoes(pagina)
        }, 5000)

        return () => clearInterval(intervalo)

    }, [pagina])

    return (
        <div className="p-6 bg-gray-50 min-h-screen">

            <Tabela
                titulo="Histórico"
                dados={data.items}
                paginaAtual={data.page}
                totalPaginas={data.pages}
                onPageChange={setPagina}
            />

        </div>
    )
}