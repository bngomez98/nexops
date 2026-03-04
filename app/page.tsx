export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <img 
          src="/nexus-logo.png" 
          alt="Nexus Operations" 
          className="w-48 h-48 mb-8"
        />
        <h1 className="text-5xl font-bold text-center mb-4">Nexus Operations</h1>
        <p className="text-xl text-gray-300 text-center max-w-2xl">
          Connecting homeowners with licensed, insured contractors in Topeka, KS and surrounding regions.
        </p>
      </div>
    </main>
  )
}
