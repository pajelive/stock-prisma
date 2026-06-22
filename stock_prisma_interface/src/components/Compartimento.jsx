"use client";

export default function Compartimento({ compartimento, onClick }) {
    return (
        <button
            onClick={onClick}
            className="group flex h-40 w-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 text-left transition-all duration-200 hover:border-sky-500 hover:shadow-md"
        >
            {/* Código/Nome do compartimento grande e nítido no topo */}
            <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-sky-600 transition-colors">
                    {compartimento.nome}
                </p>
            </div>

            {/* Nome do Insumo gigante e limpo na base */}
            <div className="w-full">
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-0.5">
                    Insumo
                </p>
                <p className="text-xl font-bold text-slate-800 truncate tracking-tight">
                    {compartimento.insumo_nome || "Vazio"}
                </p>
            </div>
        </button>
    );
}