import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.checklistItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Checklist GET Error:', error);
    return NextResponse.json(
      { error: (error as Error).message, stack: (error as Error).stack },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  const item = await prisma.checklistItem.create({
    data: {
      title: body.title,
      done: !!body.done,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
