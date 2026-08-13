import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import TerminalCommand from '@/lib/models/TerminalCommand';

export const dynamic = 'force-dynamic';

const defaultCommands = [
  { command: 'whoami', output: 'PULKIT SINGHROHA — B.Tech CSE @ VIT Chennai (CGPA 9.02). Full Stack Developer & ML Engineer.', category: 'system', order: 1 },
  { command: 'skills', output: 'Python, JS, TS, C++, React, Next.js, Node.js, PyTorch, Azure, Docker, MongoDB.', category: 'system', order: 2 },
  { command: 'projects', output: '1. Med-Scribe AI  2. DevPulse Analytics  3. GraphNet ML  4. Skill-Bridge  5. CloudSave', category: 'system', order: 3 },
  { command: 'education', output: 'VIT Chennai — B.Tech Computer Science & Engineering (2023–2027) | CGPA: 9.02/10.0', category: 'system', order: 4 },
  { command: 'contact', output: 'Email: pulkit.singhroha31@gmail.com | GitHub: github.com/pulkit31s | LeetCode: leetcode.com/pulkit31s', category: 'system', order: 5 },
  { command: 'hire', output: 'Open to internships, full-stack developer roles, research collaborations & hackathons!', category: 'custom', order: 6 },
];

export async function GET() {
  try {
    await dbConnect();
    let commands = await TerminalCommand.find().sort({ order: 1, command: 1 });

    if (commands.length === 0) {
      await TerminalCommand.insertMany(defaultCommands);
      commands = await TerminalCommand.find().sort({ order: 1, command: 1 });
    }

    return NextResponse.json(commands);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch commands' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const cmd = await TerminalCommand.create(body);
    return NextResponse.json(cmd, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create command' }, { status: 500 });
  }
}
