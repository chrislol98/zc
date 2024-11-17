export default function Page() {
  return (
    <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <h1
        className="text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent 
          hover:scale-110 transition-transform duration-300
          [text-shadow:_0_0_30px_rgba(59,130,246,0.3)] cursor-pointer
          hover:[text-shadow:_0_0_50px_rgba(59,130,246,0.5)]
          font-['Comic_Sans_MS'] rounded-3xl"
      >
        HOWDY！
      </h1>
    </div>
  );
}
