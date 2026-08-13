import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Education from '@/lib/models/Education';

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  try {
    await dbConnect();
    const edu = await Education.findById(params.id);
    if (!edu) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(edu);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Education.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await dbConnect();
    await Education.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
