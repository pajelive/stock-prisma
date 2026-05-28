import { useMemo, useState } from "react";
import TipoPill from "./TipoPill";

export default function Tabela({ titulo, dados }) {
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const dadosFiltrados = useMemo(() => {
    return dados.filter((item) => {
      const matchBusca =
        item.ferramenta?.toLowerCase().includes(busca.toLowerCase()) ||
        item.compartimento?.toLowerCase().includes(busca.toLowerCase()) ||
        item.usuario?.toLowerCase().includes(busca.toLowerCase());

      const matchTipo =
        filtroTipo === "todos" ? true : item.tipo === filtroTipo;

      return matchBusca && matchTipo;
    });
  }, [dados, busca, filtroTipo]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* HEADER */}
      <div className="px-5 py-4 border-b border-gray-200 flex flex-col gap-3">

        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">{titulo}</h2>

          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            {dadosFiltrados.length} / {dados.length}
          </span>
        </div>

        {/* FILTROS */}
        <div className="flex gap-2 flex-wrap">

          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar..."
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
          />

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg"
          >
            <option value="todos">Todos tipos</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="ajuste">Ajuste</option>
          </select>

          <button
            onClick={() => {
              setBusca("");
              setFiltroTipo("todos");
            }}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Limpar
          </button>

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Tipo</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Qtd</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Usuário</th>
              <th className="px-4 py-3 text-left text-gray-500">Data</th>
            </tr>
          </thead>

          <tbody>
            {dadosFiltrados.map((m) => (
              <tr
                key={m.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-gray-400">#{m.id}</td>

                <td className="px-4 py-3">
                  <TipoPill tipo={m.tipo} />
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {m.ferramenta || m.compartimento}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {m.quantidade}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {m.usuario}
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {m.data_hora}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}