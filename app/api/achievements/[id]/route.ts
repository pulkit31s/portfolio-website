import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Achievement from '@/lib/models/Achievement';

interface Params { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Achievement.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await dbConnect();
    await Achievement.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
