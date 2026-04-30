'use client';

export default function Contact() {
  const links = [
    { label: 'Email',    href: 'mailto:pulkitsinghroha7856@gmail.com', value: 'pulkitsinghroha7856@gmail.com', icon: '✉' },
    { label: 'LinkedIn', href: 'https://linkedin.com',                  value: 'linkedin.com/in/pulkit',        icon: '◈' },
    { label: 'GitHub',   href: 'https://github.com',                    value: 'github.com/pulkit',             icon: '◎' },
    { label: 'Phone',    href: 'tel:+918307902122',                     value: '+91 8307902122',                icon: '◉' },
  ];

  return (
    <section id="contact" className="py-32 px-6 max-w-4xl mx-auto text-center">
      <div className="mb-12">
        <p className="text-[#00d4ff] text-xs font-mono tracking-[0.4em] uppercase mb-3">06 — Contact</p>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-6" style={{ fontFamily: "'Courier New', monospace" }}>
          Let's Build
          <br />
          <span style={{ WebkitTextStroke: '1px rgba(0,212,255,0.5)', color: 'transparent' }}>
            Something.
          </span>
        </h2>
        <p className="text-white/40 max-w-md mx-auto text-sm leading-relaxed">
          Currently open to internships, research collaborations, and full-stack opportunities.
          Let's connect!
        </p>
      </div>

      <a
        href="mailto:pulkitsinghroha7856@gmail.com"
        className="inline-block mb-16 px-10 py-4 text-sm font-mono tracking-widest uppercase text-black font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 40px rgba(0,212,255,0.25)' }}
      >
        Say Hello →
      </a>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
        {links.map(l => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left hover:-translate-y-1"
            style={{
              background: 'rgba(13,13,26,0.6)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <span className="text-lg text-[#00d4ff] w-6 text-center">{l.icon}</span>
            <div>
              <div className="text-xs font-mono text-white/30 mb-0.5">{l.label}</div>
              <div className="text-xs text-white/60 group-hover:text-[#00d4ff] transition-colors font-mono">{l.value}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-24 pt-8 border-t border-white/5">
        <p className="text-white/20 text-xs font-mono tracking-widest">
          PULKIT SINGH · VIT CHENNAI · B.TECH CSE 2027
        </p>
        <p className="text-white/10 text-xs font-mono mt-2">
          Built with Next.js · Three.js · MongoDB
        </p>
      </div>
    </section>
  );
}
