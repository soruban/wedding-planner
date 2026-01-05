import { NextResponse } from 'next/server';
import { deleteGuest } from '@/lib/data/guests';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteGuest(id);
  return NextResponse.json({ ok: true });
}
