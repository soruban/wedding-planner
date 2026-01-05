import { NextResponse } from 'next/server';
import { updateItem, deleteItem } from '@/lib/data/checklist';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const updated = updateItem(id, body);
  if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteItem(id);
  return NextResponse.json({ ok: true });
}
