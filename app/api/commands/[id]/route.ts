import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import TerminalCommand from '@/lib/models/TerminalCommand';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await req.json();
    const cmd = await TerminalCommand.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    return NextResponse.json(cmd);
  } catch {
    return NextResponse.json({ error: 'Failed to update command' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    await TerminalCommand.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete command' }, { status: 500 });
  }
}
