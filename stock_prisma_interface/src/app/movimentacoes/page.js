'use client'

import Tabela from '../../components/Tabela'
import {useState} from "react";
import {useEffect} from "react";
import api from "../../services/api";

export default function Movimentacoes() {

    const [movimentacoes, setMovimentacoes] = useState([])

    useEffect(() => {
        async function buscarMovimentacoes() {
            const resposta = await api.get('/movimentacoes')
            setMovimentacoes(resposta.data)
        }
        buscarMovimentacoes()
    }, [])
    console.log(movimentacoes)
    return (
        <div>
            <h1>Stock Prisma</h1>

            <Tabela
                titulo="Histórico"
                dados={movimentacoes}
            />
        </div>
    )
}