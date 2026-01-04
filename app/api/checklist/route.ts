import { NextResponse } from 'next/server';
import { getItems, addItem } from '@/lib/data/checklist';

export async function GET() {
  return NextResponse.json(getItems());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  const item = addItem({ title: body.title, done: !!body.done });
  return NextResponse.json(item, { status: 201 });
}
