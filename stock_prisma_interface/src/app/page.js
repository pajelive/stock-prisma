// Substitua o conteúdo do seu arquivo Home por este:

export default function Home() {
    return (
        <main className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-slate-950 text-white font-sans">
            {/* 🎥 Vídeo de Fundo Responsivo e em Loop */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover pointer-events-none z-0"
                
            >
                <source src="../../public/logo-loop.mp4" type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
            </video>

            {/* 🌌 Camada de Sobreposição para contraste (Escurece o vídeo) */}
            <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none"></div>

            {/* 📝 Conteúdo por cima do vídeo */}
            <div className="relative z-20 text-center flex flex-col items-center gap-6 p-6 max-w-4xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg leading-tight">
                    <span className="text-white">STOCK</span> <span className="text-sky-400">PRISMA</span>
                </h1>
                <p className="text-slate-200 text-lg sm:text-xl font-medium tracking-wide max-w-2xl drop-shadow">
                    Sistema de Armário Inteligente: Automação e precisão no seu almoxarifado.
                </p>
                <p className="text-sky-100 text-sm font-semibold uppercase tracking-widest bg-white/10 px-4 py-1 rounded-full border border-sky-400/20 shadow-inner">
                    Aproxime sua tag RFID para começar
                </p>
                
                {/* Botão de ação rápida se desejar */}
                <button className="mt-8 px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 transition-all active:scale-95 text-base">
                    Acessar Dashboard
                </button>
            </div>
        </main>
    )
}