import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const vendors = await prisma.vendor.findMany();
  return NextResponse.json(vendors);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  const vendor = await prisma.vendor.create({
    data: {
      name: body.name,
      category: body.category,
      contact: body.contact,
      booked: !!body.booked,
    },
  });
  return NextResponse.json(vendor, { status: 201 });
}
