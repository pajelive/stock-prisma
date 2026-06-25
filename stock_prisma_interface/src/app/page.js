export default function Home() {
    return (
        <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#F1F1F1]">
            <video
                autoPlay    // Inicia sozinho (obrigatório com muted)
                loop        // Roda infinitamente
                muted       // Sem som (obrigatório para autoplay)
                playsInline // Importante para rodar em navegadores mobile
                className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
                // object-cover garante a responsividade: preenche a tela sem distorcer.
            >
                <source src="/logo-loop.mp4" type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
            </video>

        </main>
    )
}