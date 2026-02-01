import { NextResponse } from 'next/server';
import { deleteEvent, updateEvent } from '@/lib/data/events';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteEvent(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updateData: { name?: string; date?: Date } = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.date !== undefined) {
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'invalid date format' }, { status: 400 });
    }
    updateData.date = date;
  }

  const event = updateEvent(id, updateData);
  if (!event) {
    return NextResponse.json({ error: 'event not found' }, { status: 404 });
  }

  return NextResponse.json(event);
}
