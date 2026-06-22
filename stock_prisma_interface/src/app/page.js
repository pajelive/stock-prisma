export default function Home() {
    return (
        <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#F1F1F1]">
            {/* O bg-[#F1F1F1] acima é a cor exata do fundo do seu vídeo, 
                garantindo a integração perfeita. */}

            {/* 🎥 O Vídeo da Logo */}
            <video
                autoPlay    // Inicia sozinho (obrigatório com muted)
                loop        // Roda infinitamente
                muted       // Sem som (obrigatório para autoplay)
                playsInline // Importante para rodar em navegadores mobile
                className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
                // object-cover garante a responsividade: preenche a tela sem distorcer.
            >
                <source src="/public/logo-loop.mp4" type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
            </video>

            {/* Conteúdo Opcional (se quiser colocar texto por cima) */}
            {/* <div className="relative z-10 text-center">
                <h1 className="text-4xl font-bold text-slate-800">
                    Bem-vindo
                </h1>
            </div> 
            */}
        </main>
    )
}