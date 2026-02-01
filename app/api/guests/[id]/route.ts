import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.guest.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json({ error: 'Failed to delete guest' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { firstName, lastName, email, relationship, dietaryRequirements, events } = body;

    const guest = await prisma.guest.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email: email || null,
        relationship: relationship || [],
        dietaryRequirements: dietaryRequirements || null,
        events: {
          deleteMany: {},
          create:
            events?.map((e: { eventId: string; rsvp: string; extras: number }) => ({
              event: { connect: { id: e.eventId } },
              rsvp: e.rsvp,
              extras: e.extras,
            })) || [],
        },
      },
      include: {
        events: true,
      },
    });

    return NextResponse.json(guest);
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
  }
}
