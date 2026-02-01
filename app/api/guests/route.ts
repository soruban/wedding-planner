import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RsvpStatus } from '@prisma/client';

export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      include: {
        events: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, relationship, dietaryRequirements, events } = body;

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First and last name are required' }, { status: 400 });
    }

    const guest = await prisma.guest.create({
      data: {
        firstName,
        lastName,
        email: email || null,
        relationship: relationship || [],
        dietaryRequirements: dietaryRequirements || null,
        events: {
          create:
            events?.map((e: { eventId: string; rsvp: string; extras: number }) => ({
              event: { connect: { id: e.eventId } },
              rsvp: e.rsvp as RsvpStatus,
              extras: e.extras,
            })) || [],
        },
      },
      include: {
        events: true,
      },
    });

    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error('Error creating guest:', error);
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
  }
}
