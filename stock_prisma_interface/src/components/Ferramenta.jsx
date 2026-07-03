export default function Ferramenta({ ferramenta, onClick }) {
    const statusStyles = {
        DISPONIVEL: "bg-emerald-100 text-emerald-800 border-emerald-200",
        EM_USO: "bg-amber-100 text-amber-800 border-amber-200",
        MANUTENCAO: "bg-red-100 text-red-800 border-red-200"
    };

    return (
        <div
            onClick={onClick}
            className="p-4 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between gap-3"
        >
            <div>
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-slate-800 text-base line-clamp-1">{ferramenta.nome}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyles[ferramenta.status] || "bg-gray-100 text-gray-800"}`}>
                        {ferramenta.status}
                    </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{ferramenta.categoria || "Sem categoria"}</p>
                <p className="text-xs text-gray-600 mt-2 line-clamp-2 italic">
                    {ferramenta.descricao ? `"${ferramenta.descricao}"` : "Nenhuma descrição informada."}
                </p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex flex-col gap-1 text-[11px] text-gray-500">
                <div className="flex justify-between">
                    <span className="font-medium">RFID UID:</span>
                    <span className="font-mono text-slate-700 bg-gray-100 px-1 rounded">{ferramenta.uid_rfid}</span>
                </div>
            </div>
        </div>
    );
}