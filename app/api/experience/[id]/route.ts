import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Experience from '@/lib/models/Experience';

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  try {
    await dbConnect();
    const exp = await Experience.findById(params.id);
    if (!exp) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(exp);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Experience.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await dbConnect();
    await Experience.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
