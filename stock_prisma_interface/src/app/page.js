export default function Home() {
    return (
        <main className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#E8E8E8]">
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 h-[60%] w-full object-contain md:h-full md:object-cover z-0 pointer-events-none md:object-center">
                <source src="/logo-loop.mp4" type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
            </video>
        </main>
    )
}