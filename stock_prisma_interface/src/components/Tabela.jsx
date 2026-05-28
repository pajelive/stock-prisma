export default function Tabela(props) {
    return (
        <div>
            <h2>{props.titulo}</h2>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Categoria</th>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Responsável</th>
                        <th>Data</th>
                        <th>Origem</th>
                        <th>Ordem Produção</th>
                        <th>Etapa</th>
                        <th>Observação</th>
                    </tr>
                </thead>

                <tbody>
                {props.data.map((movimentacao) => (
                    <tr>
                        <td>{movimentacao.id}</td>
                        <td>{movimentacao.ferramenta || movimentacao.compartimento}</td>
                        <td>{movimentacao.nome}</td>
                        <td>{movimentacao.quantidade}</td>
                        <td>{movimentacao.usuario}</td>
                        <td>{movimentacao.data}</td>
                        <td>{movimentacao.origem}</td>
                        <td>{movimentacao.op}</td>
                        <td>{movimentacao.etapa}</td>
                        <td>{movimentacao.observacao}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}