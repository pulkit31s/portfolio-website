import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Project from '@/lib/models/Project';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    await dbConnect();
    const project = await Project.findOne({ slug: params.slug });
    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
