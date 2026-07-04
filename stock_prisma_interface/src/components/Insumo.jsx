export function Insumo({ insumo, onClick }) {
    return (
        <div
            onClick={onClick}
            className="p-4 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between gap-2"
        >
            <div>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-800 text-base line-clamp-1">{insumo.nome}</h3>
                    <span className="text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-md">
                        {insumo.unidade}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    <span className="font-medium text-gray-500">Categoria:</span> {insumo.categoria || "Geral"}
                </p>
                
                {/* 4. ADICIONADO: Exibição opcional do peso unitário caso exista no card */}
                {insumo.peso_unitario !== undefined && (
                    <p className="text-xs text-gray-400 mt-0.5">
                        <span className="font-medium text-gray-500">Peso Unit.:</span> {insumo.peso_unitario}g
                    </p>
                )}
            </div>
        </div>
    );
}