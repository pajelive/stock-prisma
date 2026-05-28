import TipoPill from "./TipoPill";

export default function Tabela({ titulo, dados }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">{titulo}</h2>

        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          {dados.length} registros
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Categoria</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Qtd</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Responsável</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Data</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Origem</th>
              <th className="px-4 py-3 text-left text-gray-500">OP</th>
              <th className="px-4 py-3 text-left text-gray-500">Etapa</th>
              <th className="px-4 py-3 text-left text-gray-500">Observação</th>
            </tr>
          </thead>

          <tbody>
            {dados.map((m) => (
              <tr
                key={m.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-gray-400">#{m.id}</td>
                <td className="px-4 py-3">
                  <TipoPill tipo={m.tipo} />
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {m.ferramenta ? "Ferramenta" : "Compartimento"}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {m.ferramenta || m.compartimento}
                </td>
                <td className="px-4 py-3 text-gray-700">{m.quantidade}</td>
                <td className="px-4 py-3 text-gray-700">{m.usuario}</td>
                <td className="px-4 py-3 text-gray-500">{m.data_hora}</td>
                <td className="px-4 py-3 text-gray-500">{m.origem_leitura}</td>
                <td className="px-4 py-3 text-gray-700">{m.op || "—"}</td>
                <td className="px-4 py-3 text-gray-700">{m.etapa || "—"}</td>
                <td className="px-4 py-3 text-gray-400">{m.observacao || "—"}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}