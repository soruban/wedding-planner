import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body?.venueId) {
      return NextResponse.json({ error: 'venueId is required' }, { status: 400 });
    }

    await prisma.event.update({
      where: { id },
      data: {
        venues: {
          connect: { id: body.venueId },
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error adding venue to event:', error);
    return NextResponse.json({ error: 'Failed to add venue to event' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body?.venueId) {
      return NextResponse.json({ error: 'venueId is required' }, { status: 400 });
    }

    await prisma.event.update({
      where: { id },
      data: {
        venues: {
          disconnect: { id: body.venueId },
        },
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error removing venue from event:', error);
    return NextResponse.json({ error: 'Failed to remove venue from event' }, { status: 500 });
  }
}
