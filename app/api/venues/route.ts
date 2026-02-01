import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const venues = await prisma.venue.findMany();
  return NextResponse.json(venues);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (!body?.location) {
    return NextResponse.json({ error: 'location is required' }, { status: 400 });
  }

  const venue = await prisma.venue.create({
    data: {
      name: body.name,
      location: body.location,
    },
  });

  return NextResponse.json(venue, { status: 201 });
}
