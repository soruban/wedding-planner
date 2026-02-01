import { NextResponse } from 'next/server';
import { getVenues, addVenue } from '@/lib/data/venues';

export async function GET() {
  return NextResponse.json(getVenues());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (!body?.location) {
    return NextResponse.json({ error: 'location is required' }, { status: 400 });
  }
  const venue = addVenue({ name: body.name, location: body.location });
  return NextResponse.json(venue, { status: 201 });
}
