export default function FiltrosMovimentacao({ filtros, onChange, movimentacoes }) {

    // pega valores únicos direto dos dados da API
    const tipos = [...new Set(movimentacoes.map(m => m.tipo).filter(Boolean))]
    const origens = [...new Set(movimentacoes.map(m => m.origem_leitura).filter(Boolean))]
    const etapas = [...new Set(movimentacoes.map(m => m.etapa).filter(Boolean))]

    return (
        <div className="flex flex-wrap gap-3 mb-4">

            <input
                type="text"
                placeholder="Responsável"
                value={filtros.usuario}
                onChange={(e) => onChange('usuario', e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none"
            />

            <input
                type="text"
                placeholder="Ordem de produção"
                value={filtros.op}
                onChange={(e) => onChange('op', e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none"
            />

            <select
                value={filtros.tipo}
                onChange={(e) => onChange('tipo', e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none"
            >
                <option value="">Todos os tipos</option>
                {tipos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select
                value={filtros.categoria}
                onChange={(e) => onChange('categoria', e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none"
            >
                <option value="">Todas as categorias</option>
                <option value="Ferramenta">Ferramenta</option>
                <option value="Compartimento">Compartimento</option>
            </select>

            <select
                value={filtros.origem}
                onChange={(e) => onChange('origem', e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none"
            >
                <option value="">Todas as origens</option>
                {origens.map(o => <option key={o} value={o}>{o}</option>)}
            </select>

            <select
                value={filtros.etapa}
                onChange={(e) => onChange('etapa', e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none"
            >
                <option value="">Todas as etapas</option>
                {etapas.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => onChange('dataInicio', e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none"
            />

            <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => onChange('dataFim', e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none"
            />

        </div>
    )
}