import { NextResponse } from 'next/server';
import { getVendors, addVendor } from '@/lib/data/vendors';

export async function GET() {
  return NextResponse.json(getVendors());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const vendor = addVendor({
    name: body.name,
    category: body.category,
    contact: body.contact,
    booked: !!body.booked,
  });
  return NextResponse.json(vendor, { status: 201 });
}
