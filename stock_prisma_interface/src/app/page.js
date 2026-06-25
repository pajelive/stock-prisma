export default function Home() {
    return (
        <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#F1F1F1]">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none md:object-center"
            >
                <source src="/logo-loop.mp4" type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
            </video>
        </main>
    )
}