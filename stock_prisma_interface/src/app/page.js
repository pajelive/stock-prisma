export default function Home() {
   return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <video
        className="w-full h-auto rounded-lg"
        controls
        autoPlay
        muted
        loop
      >
        <source src="/video.mp4" type="video/mp4" />
        Seu navegador não suporta vídeo.
      </video>
    </div>
  )
}