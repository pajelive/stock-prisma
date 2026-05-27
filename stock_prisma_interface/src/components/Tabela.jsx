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
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}