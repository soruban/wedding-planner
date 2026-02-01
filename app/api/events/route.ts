import { NextResponse } from 'next/server';
import { getEvents, addEvent } from '@/lib/data/events';

export async function GET() {
  return NextResponse.json(getEvents());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (!body?.date) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 });
  }

  const date = new Date(body.date);
  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: 'invalid date format' }, { status: 400 });
  }

  const event = addEvent({ name: body.name, date });
  return NextResponse.json(event, { status: 201 });
}
