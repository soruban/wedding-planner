import { NextResponse } from 'next/server';
import { deleteVenue } from '@/lib/data/venues';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteVenue(id);
  return NextResponse.json({ ok: true });
}
