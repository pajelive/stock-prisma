"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
    aberto,
    onFechar,
    titulo,
    children,
    footer = null,
    largura = "max-w-lg",
}) {

    useEffect(() => {
        if (!aberto) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") {
                onFechar();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [aberto, onFechar]);

    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onFechar}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => e.stopPropagation()}
                className={`
                    w-full
                    ${largura}
                    max-h-[90vh]
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-2xl
                    animate-in
                    fade-in
                    zoom-in-95
                    duration-200
                `}
            >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">

                    <h2
                        id="modal-title"
                        className="text-lg font-semibold text-gray-800"
                    >
                        {titulo}
                    </h2>

                    <button
                        onClick={onFechar}
                        className="
                            rounded-lg
                            p-2
                            text-gray-400
                            transition
                            hover:bg-gray-100
                            hover:text-gray-700
                        "
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Conteúdo */}
                <div className="max-h-[65vh] overflow-y-auto px-6 py-5">

                    {children}

                </div>

                {/* Rodapé */}
                {footer && (
                    <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">

                        {footer}

                    </div>
                )}
            </div>
        </div>
    );
}