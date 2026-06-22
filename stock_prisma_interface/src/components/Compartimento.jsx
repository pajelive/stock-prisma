"use client";

export default function Compartimento({ compartimento, onClick }) {
    return (
        <button
            onClick={onClick}
            className="group flex h-36 w-full flex-col justify-between rounded-lg border-2 border-slate-200 bg-slate-50 p-4 text-left transition-all duration-200 hover:scale-[1.02] hover:border-sky-500 hover:bg-sky-50 hover:shadow-md"
        >
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-sky-600 transition-colors">
                    {compartimento.nome}
                </p>
                {/* Linha divisória sutil interna da gaveta */}
                <div className="mt-1 h-[2px] w-8 bg-slate-200 group-hover:bg-sky-300 transition-colors" />
            </div>

            <div className="mt-4">
                <p className="text-[10px] uppercase font-semibold text-gray-400">Insumo</p>
                <p className="text-sm font-bold text-slate-700 truncate">
                    {compartimento.insumo_nome || "Vazio"}
                </p>
            </div>
        </button>
    );
}