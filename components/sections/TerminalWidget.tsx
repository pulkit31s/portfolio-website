'use client';
import { useState, useRef, useEffect } from 'react';

interface CommandOutput {
  command: string;
  output: React.ReactNode;
}

interface CustomCmd {
  _id: string;
  command: string;
  output: string;
  category?: string;
}

export default function TerminalWidget() {
  const [input, setInput] = useState('');
  const [dbCommands, setDbCommands] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: 'welcome',
      output: (
        <div className="text-white/80 space-y-1">
          <p className="text-cyan-400 font-bold">⚡ Pulkit Portfolio Interactive CLI v1.0.0</p>
          <p className="text-white/40">Type <span className="text-amber-400 font-bold">&apos;help&apos;</span> to list all available commands or try <span className="text-cyan-400">&apos;skills&apos;</span>, <span className="text-cyan-400">&apos;projects&apos;</span>, <span className="text-cyan-400">&apos;whoami&apos;</span>.</p>
        </div>
      ),
    },
  ]);

  useEffect(() => {
    fetch('/api/commands')
      .then(r => r.json())
      .then((data: CustomCmd[]) => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {};
          data.forEach(c => { map[c.command.toLowerCase()] = c.output; });
          setDbCommands(map);
        }
      })
      .catch(() => {});
  }, []);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    let result: React.ReactNode;

    switch (cmd) {
      case 'help':
        const customCmdKeys = Object.keys(dbCommands);
        result = (
          <div className="space-y-2 text-white/70">
            <p className="text-cyan-400 font-bold">Built-in Commands:</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div><span className="text-amber-400 font-bold">whoami</span> — Candidate Summary</div>
              <div><span className="text-amber-400 font-bold">skills</span> — Tech Stack Overview</div>
              <div><span className="text-amber-400 font-bold">projects</span> — Key Systems Built</div>
              <div><span className="text-amber-400 font-bold">education</span> — Degrees & CGPA</div>
              <div><span className="text-amber-400 font-bold">contact</span> — Email & Handles</div>
              <div><span className="text-amber-400 font-bold">clear</span> — Clear Terminal</div>
              <div><span className="text-amber-400 font-bold">sudo</span> — Superuser Privileges</div>
            </div>

            {customCmdKeys.length > 0 && (
              <>
                <p className="text-[#00d4ff] font-bold mt-2">Custom Database Commands:</p>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  {customCmdKeys.map(k => (
                    <span key={k} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                      ${k}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        );
        break;

      case 'whoami':
        result = (
          <div className="text-white/80 space-y-1">
            <p className="text-emerald-400 font-bold">PULKIT SINGHROHA</p>
            <p>B.Tech CSE @ VIT Chennai (CGPA 9.02)</p>
            <p>Full Stack Engineer & Graph Neural Networks Researcher</p>
            <p>Web Development Lead @ Newton School Coding Club (NSCC VIT)</p>
          </div>
        );
        break;

      case 'skills':
        result = (
          <div className="text-white/80 space-y-1">
            <p className="text-cyan-400 font-bold">CORE TECH ARSENAL:</p>
            <p>• Languages: Python, JavaScript, TypeScript, C++, SQL, Java</p>
            <p>• Frontend: React.js, Next.js, Tailwind CSS, Three.js</p>
            <p>• Backend: Node.js, Express, REST APIs, GraphQL, MERN Stack</p>
            <p>• Machine Learning: PyTorch, Graph Neural Networks, Scikit-learn</p>
            <p>• Cloud & DevOps: Microsoft Azure, Docker, Git, Linux</p>
          </div>
        );
        break;

      case 'projects':
        result = (
          <div className="text-white/80 space-y-1">
            <p className="text-cyan-400 font-bold">KEY PROJECTS:</p>
            <p>1. <span className="text-amber-400">Med-Scribe AI</span> — Real-time clinical transcription & SOAP notes (Python, PyTorch)</p>
            <p>2. <span className="text-amber-400">DevPulse Analytics</span> — Developer activity dashboard (Next.js, MongoDB, Azure)</p>
            <p>3. <span className="text-amber-400">GraphNet ML</span> — Graph Neural Networks for node classification (PyTorch Geometric)</p>
          </div>
        );
        break;

      case 'education':
        result = (
          <div className="text-white/80 space-y-1">
            <p className="text-purple-400 font-bold">Vellore Institute of Technology (VIT), Chennai</p>
            <p>B.Tech in Computer Science & Engineering (2023 – 2027)</p>
            <p className="text-emerald-400 font-bold">CGPA: 9.02 / 10.0</p>
          </div>
        );
        break;

      case 'contact':
        result = (
          <div className="text-white/80 space-y-1">
            <p>📧 Email: pulkit.singhroha31@gmail.com</p>
            <p>💻 GitHub: github.com/pulkit31s</p>
            <p>⚡ LeetCode: leetcode.com/pulkit31s</p>
          </div>
        );
        break;

      case 'sudo':
        result = (
          <div className="text-emerald-400 font-bold">
            [ACCESS GRANTED] Welcome Master Pulkit! 🚀 All system protocols operating at 100% efficiency.
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        if (dbCommands[cmd]) {
          result = (
            <div className="text-white/80 whitespace-pre-wrap font-mono">
              {dbCommands[cmd]}
            </div>
          );
        } else {
          result = (
            <div className="text-red-400 font-mono">
              Command not recognized: &apos;{cmd}&apos;. Type &apos;help&apos; for list of commands.
            </div>
          );
        }
    }

    setHistory(prev => [...prev, { command: cmd, output: result }]);
    setInput('');
  };

  return (
    <div className="max-w-3xl mx-auto my-16 p-4">
      <div
        className="rounded-3xl overflow-hidden border shadow-2xl"
        style={{
          background: '#0a0a14',
          borderColor: 'rgba(0,212,255,0.25)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Terminal Header Window Controls */}
        <div className="px-5 py-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-white/40 tracking-wider">pulkit@portfolio:~ (bash)</span>
          <div className="w-12" />
        </div>

        {/* Terminal Body */}
        <div className="p-6 font-mono text-xs space-y-4 h-72 overflow-y-auto">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              {item.command !== 'welcome' && (
                <div className="flex items-center gap-2 text-white/40">
                  <span className="text-cyan-400 font-bold">pulkit@dev:~$</span>
                  <span className="text-white font-bold">{item.command}</span>
                </div>
              )}
              <div>{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Prompt Input Form */}
        <form onSubmit={handleCommand} className="px-6 py-3.5 bg-white/[0.02] border-t border-white/10 flex items-center gap-2 font-mono text-xs">
          <span className="text-cyan-400 font-bold">pulkit@dev:~$</span>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="type 'help'..."
            className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-white/20"
          />
          <button type="submit" className="text-white/40 hover:text-cyan-400 text-xs">Run ↵</button>
        </form>
      </div>
    </div>
  );
}
