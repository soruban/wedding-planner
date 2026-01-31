import { NextResponse } from 'next/server';
import { updateTask, deleteTask } from '@/lib/data/tasks';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const updated = updateTask(id, body);
  if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteTask(id);
  return NextResponse.json({ ok: true });
}
