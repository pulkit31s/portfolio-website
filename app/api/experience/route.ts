import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Experience from '@/lib/models/Experience';

export async function GET() {
  try {
    await dbConnect();
    const experiences = await Experience.find().sort({ order: 1, startDate: -1 });
    return NextResponse.json(experiences);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const experience = await Experience.create(body);
    return NextResponse.json(experience, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
