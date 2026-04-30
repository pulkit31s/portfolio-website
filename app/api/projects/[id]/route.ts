import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Project from '@/lib/models/Project';

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  try {
    await dbConnect();
    const project = await Project.findById(params.id);
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await Project.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await dbConnect();
    await Project.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
