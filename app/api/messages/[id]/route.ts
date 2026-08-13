import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import ContactMessage from '@/lib/models/ContactMessage';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    const message = await ContactMessage.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    return NextResponse.json(message);
  } catch {
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await ContactMessage.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
