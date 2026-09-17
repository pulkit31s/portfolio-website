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

    // Auto-sync top level fields if positions array is supplied
    if (Array.isArray(body.positions) && body.positions.length > 0) {
      const activePos = body.positions.find((p: any) => p.current) || body.positions[0];
      if (activePos) {
        if (!body.role) body.role = activePos.role;
        if (!body.startDate) body.startDate = activePos.startDate;
        if (body.current === undefined) body.current = activePos.current;
        if (!body.bullets || body.bullets.length === 0) body.bullets = activePos.bullets;
        if (!body.techStack || body.techStack.length === 0) body.techStack = activePos.techStack;
      }
    }

    const updated = await Experience.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
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

