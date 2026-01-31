import { NextResponse } from 'next/server';
import { deleteVendor } from '@/lib/data/vendors';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteVendor(id);
  return NextResponse.json({ ok: true });
}
