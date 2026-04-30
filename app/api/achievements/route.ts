import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Achievement from '@/lib/models/Achievement';

export async function GET() {
  try {
    await dbConnect();
    const achievements = await Achievement.find().sort({ year: -1, order: 1 });
    return NextResponse.json(achievements);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const achievement = await Achievement.create(body);
    return NextResponse.json(achievement, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
  }
}
