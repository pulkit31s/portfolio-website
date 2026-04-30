import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Skill from '@/lib/models/Skill';

export async function GET() {
  try {
    await dbConnect();
    const skills = await Skill.find().sort({ category: 1, order: 1 });
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const skill = await Skill.create(body);
    return NextResponse.json(skill, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
