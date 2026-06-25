export default function Home() {
    return (
        <main
            className="relative flex h-screen w-screen items-start justify-center overflow-hidden z-0"
            // Fundo em gradiente radial para imitar o estúdio 3D do vídeo
            style={{
                background: 'radial-gradient(circle at 50% 30%, #ffffff 0%, #e6e8eb 60%, #d1d5db 100%)'
            }}
        >
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 h-full w-full object-contain md:object-cover z-0 pointer-events-none md:object-center"
            >
                <source src="/logo-loop.mp4" type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
            </video>
        </main>
    )
}