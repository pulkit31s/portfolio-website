import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import ExperienceCategory from '@/lib/models/ExperienceCategory';
import Experience from '@/lib/models/Experience';

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  try {
    await dbConnect();
    const category = await ExperienceCategory.findById(params.id);
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await dbConnect();
    const body = await req.json();
    const updated = await ExperienceCategory.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await dbConnect();
    const category = await ExperienceCategory.findById(params.id);
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Safety check: Don't delete if experiences currently use this category slug
    const attachedCount = await Experience.countDocuments({ type: category.slug });
    if (attachedCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category: ${attachedCount} experience(s) are linked to it. Please reassign them first.` },
        { status: 400 }
      );
    }

    await ExperienceCategory.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Deleted category successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
