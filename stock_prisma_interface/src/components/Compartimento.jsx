"use client";

export default function Compartimento({ compartimento, onClick }) {
    return (
        <button
            onClick={onClick}
            className="
                group flex h-28 w-full flex-col justify-between
                rounded-sm border border-slate-300/40
                bg-slate-200/40
                p-3 text-left
                transition
                hover:bg-slate-300/40
                active:scale-[0.99]
                shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]
            "
        >
            <div>
                <p className="text-[9px] uppercase tracking-widest text-slate-600">
                    COMPARTIMENTO
                </p>

                <h2 className="mt-1 text-sm font-semibold text-slate-800">
                    {compartimento.nome}
                </h2>
            </div>

            <div>
                <p className="text-[9px] text-slate-500">INSUMO</p>

                <p className="text-xs font-medium text-slate-700">
                    {compartimento.insumo_nome || "Vazio"}
                </p>
            </div>
        </button>
    );
}