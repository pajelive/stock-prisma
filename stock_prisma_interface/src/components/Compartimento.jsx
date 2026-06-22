"use client";

export default function Compartimento({ compartimento, onClick }) {
    const estaVazio = !compartimento.insumo_nome;

    return (
        <button
            onClick={onClick}
            className="group relative flex h-44 w-full flex-col justify-between rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/80 p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1.5 hover:border-sky-500 hover:from-white hover:to-sky-50/30 hover:shadow-xl hover:shadow-sky-100/60"
        >
            {/* Vinco superior da gaveta */}
            <div className="absolute top-0 left-4 right-4 h-[1px] bg-white group-hover:bg-sky-200/50 transition-colors" />

            {/* Topo: Identificação do Compartimento e LED de Status */}
            <div className="flex w-full items-center justify-between">
                <span className="inline-block rounded-lg bg-slate-200/80 px-2.5 py-1 text-xs font-bold font-mono tracking-wider text-slate-700 group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-sm">
                    {compartimento.nome}
                </span>

                {/* LED de Status Industrial */}
                <div className="flex items-center gap-1.5 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200/60 group-hover:border-sky-200">
                    <span className={`h-2 w-2 rounded-full transition-all ${
                        estaVazio 
                            ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-200' 
                            : 'bg-amber-500 shadow-sm shadow-amber-200'
                    }`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                        {estaVazio ? 'Livre' : 'Ocupado'}
                    </span>
                </div>
            </div>

            {/* Centro: Puxador Embutido Centralizado (Estética de Gaveteiro de Oficina) */}
            <div className="w-full flex justify-center my-2">
                <div className="h-2.5 w-16 rounded-full bg-slate-300/70 border-b border-white shadow-inner group-hover:bg-sky-300/60 group-hover:w-20 transition-all duration-200" />
            </div>

            {/* Base: Informação do Insumo (Bem maior e legível) */}
            <div className="w-full rounded-xl bg-white p-3 border border-slate-200 shadow-inner group-hover:border-sky-200 transition-all">
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 group-hover:text-sky-600 transition-colors">
                    Conteúdo Atual
                </p>
                <p className={`text-base font-extrabold mt-0.5 truncate tracking-tight ${
                    estaVazio ? 'text-slate-400 italic font-normal' : 'text-slate-800'
                }`}>
                    {compartimento.insumo_nome || "Disponível / Vazio"}
                </p>
            </div>
        </button>
    );
}