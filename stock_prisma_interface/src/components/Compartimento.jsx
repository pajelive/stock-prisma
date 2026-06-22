"use client";

export default function Compartimento({ compartimento, onClick }) {
    const estaVazio = !compartimento.insumo_nome;

    return (
        <button
            onClick={onClick}
            className="group relative flex h-36 w-full flex-col justify-between rounded-xl border border-slate-300/80 bg-gradient-to-b from-slate-50 to-slate-100/70 p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-400 hover:from-white hover:to-sky-50/40 hover:shadow-lg hover:shadow-sky-100/50"
        >
            {/* Detalhe estético: Linha superior que simula o encaixe/fresta da gaveta no armário */}
            <div className="absolute top-0 left-3 right-3 h-[1px] bg-white group-hover:bg-sky-200/50 transition-colors" />

            {/* Cabeçalho da Gaveta + "Puxador/Tag" Simbólico */}
            <div className="flex w-full items-start justify-between">
                <div>
                    <span className="inline-block rounded-md bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold font-mono tracking-wider text-slate-600 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                        {compartimento.nome}
                    </span>
                </div>
                
                {/* Puxador Embutido Emulado (Visual de fenda/friso de armário moderno) */}
                <div className="h-2 w-10 rounded-full bg-slate-200 group-hover:bg-sky-300/70 transition-all group-hover:w-12 shadow-inner" />
            </div>

            {/* Conteúdo da Gaveta (O que está guardado lá dentro) */}
            <div className="w-full rounded-lg bg-white/60 p-2.5 border border-slate-200/50 shadow-inner group-hover:border-sky-200/60 group-hover:bg-white transition-all">
                <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400/90 group-hover:text-sky-500/80 transition-colors">
                    Insumo Armazenado
                </p>
                <p className={`text-xs font-bold mt-0.5 truncate ${
                    estaVazio ? 'text-slate-400 italic font-normal' : 'text-slate-700'
                }`}>
                    {compartimento.insumo_nome || "Disponível / Vazio"}
                </p>
            </div>

            {/* Indicador LED sutil no rodapé (Estilo armário inteligente/RFID) */}
            <div className="absolute bottom-2 right-3 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full transition-all ${
                    estaVazio 
                        ? 'bg-emerald-400 animate-pulse' 
                        : 'bg-slate-300 group-hover:bg-sky-400'
                }`} />
            </div>
        </button>
    );
}