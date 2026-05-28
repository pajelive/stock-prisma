export default function Tabela(props) {
    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-zinc-800">
                {props.titulo}
            </h2>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-zinc-200">
                <table className="w-full">
                    <thead className="bg-zinc-50 border-b border-zinc-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">ID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">Tipo</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">Categoria</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">Nome</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">Quantidade</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">Responsável</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">Data</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">Origem</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">OP</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">Etapa</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-600">Observação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {props.dados.map((movimentacao) => (
                            <tr
                                key={movimentacao.id}
                                className="border-b border-zinc-100 hover:bg-zinc-50 transition"
                            >
                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.id}
                                </td>

                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.tipo || '-'}
                                </td>

                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.ferramenta
                                        ? 'Ferramenta'
                                        : 'Compartimento'}
                                </td>

                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.ferramenta ||
                                        movimentacao.compartimento}
                                </td>

                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.quantidade}
                                </td>

                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.usuario}
                                </td>

                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.data_hora || '-'}
                                </td>

                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.origem_leitura}
                                </td>

                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.op || '-'}
                                </td>

                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.etapa || '-'}
                                </td>

                                <td className="px-6 py-4 text-sm text-zinc-700">
                                    {movimentacao.observacao || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}