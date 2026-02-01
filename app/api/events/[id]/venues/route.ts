import { NextResponse } from 'next/server';
import { addVenueToEvent, removeVenueFromEvent } from '@/lib/data/events';
import { getVenues } from '@/lib/data/venues';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const body = await request.json();

  if (!body?.venueId) {
    return NextResponse.json({ error: 'venueId is required' }, { status: 400 });
  }

  // Find the venue to get its full data
  const venues = getVenues();
  const venue = venues.find((v) => v.id === body.venueId);
  if (!venue) {
    return NextResponse.json({ error: 'venue not found' }, { status: 404 });
  }

  const result = addVenueToEvent(eventId, body.venueId, venue);
  if (!result.ok) {
    return NextResponse.json({ error: 'event not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: eventId } = await params;
  const body = await request.json();

  if (!body?.venueId) {
    return NextResponse.json({ error: 'venueId is required' }, { status: 400 });
  }

  const result = removeVenueFromEvent(eventId, body.venueId);
  if (!result.ok) {
    return NextResponse.json({ error: 'event not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
