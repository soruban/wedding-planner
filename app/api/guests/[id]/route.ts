import { NextResponse } from 'next/server';
import { deleteGuest } from '@/lib/data/guests';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  deleteGuest(id);
  return NextResponse.json({ ok: true });
}
