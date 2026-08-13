import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import ContactMessage from '@/lib/models/ContactMessage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
