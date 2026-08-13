import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Profile from '@/lib/models/Profile';

export const dynamic = 'force-dynamic';

// GET /api/profile — returns the single profile document
export async function GET() {
  try {
    await dbConnect();
    // findOne returns null if no document exists yet
    let profile = await Profile.findOne({});
    // If no profile saved yet, return schema defaults by creating a blank one
    if (!profile) {
      profile = new Profile({});
    }
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PUT /api/profile — upserts the single profile document
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const profile = await Profile.findOneAndUpdate(
      {},
      { $set: body },
      { upsert: true, new: true, runValidators: true }
    );
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
