import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Certification from '@/lib/models/Certification';

export async function GET() {
  try {
    await dbConnect();
    const certifications = await Certification.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(certifications);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const certification = await Certification.create(body);
    return NextResponse.json(certification, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
  }
}
