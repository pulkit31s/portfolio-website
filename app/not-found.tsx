import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6 text-center"
      style={{
        background: '#050508',
      }}
    >
      {/* Background glow radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(0,212,255,0.08) 0%, rgba(124,58,237,0.04) 50%, transparent 80%)',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto p-8 md:p-12 rounded-3xl" style={{ background: 'rgba(13,13,26,0.7)', border: '1px solid rgba(0,212,255,0.15)', backdropFilter: 'blur(20px)', boxShadow: '0 0 50px rgba(0,212,255,0.08)' }}>
        {/* 404 Title */}
        <div
          className="text-8xl md:text-9xl font-black tracking-widest mb-4"
          style={{
            fontFamily: "'Courier New', monospace",
            background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(0,212,255,0.4)',
          }}
        >
          404
        </div>

        <div className="inline-block px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-6" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
          ERR_DESTINATION_NOT_FOUND
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Courier New', monospace" }}>
          Lost in Hyperspace
        </h1>

        <p className="text-white/40 text-sm font-mono leading-relaxed mb-8">
          The requested path does not exist or has been relocated within the portfolio matrix.
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-3.5 text-xs font-mono tracking-widest uppercase font-bold rounded-2xl text-black transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            boxShadow: '0 0 30px rgba(0,212,255,0.3)',
          }}
        >
          ← Return to Portfolio Home
        </Link>
      </div>
    </div>
  );
}
