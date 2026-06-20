"use client";

export default function Compartimento({ compartimento, onClick }) {
    return (
        <button
            onClick={onClick}
            className="
                group
                flex
                h-40
                w-full
                flex-col
                justify-between
                rounded-2xl
                border
                border-sky-200
                bg-sky-500/10
                p-5
                text-left
                transition-all
                duration-200
                hover:scale-105
                hover:border-sky-400
                hover:bg-sky-500/20
                hover:shadow-xl
            "
        >
            <div>
                <p className="text-xs uppercase tracking-widest text-sky-700">
                    Compartimento
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-800">
                    {compartimento.nome}
                </h2>
            </div>

            <div>
                <p className="text-xs text-gray-500">
                    Insumo
                </p>

                <p className="font-medium text-gray-800">
                    {compartimento.insumo?.nome || "Vazio"}
                </p>
            </div>
        </button>
    );
}