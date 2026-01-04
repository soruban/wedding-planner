import { NextResponse } from 'next/server';
import { getGuests, addGuest } from '@/lib/data/guests';

export async function GET() {
  return NextResponse.json(getGuests());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const guest = addGuest({ name: body.name, email: body.email, invited: !!body.invited });
  return NextResponse.json(guest, { status: 201 });
}
