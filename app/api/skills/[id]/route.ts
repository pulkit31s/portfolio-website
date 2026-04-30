import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Skill from '@/lib/models/Skill';

interface Params { params: { id: string } }

export async function PUT(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Skill.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await dbConnect();
    await Skill.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
