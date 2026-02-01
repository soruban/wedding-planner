import { prisma } from '@/lib/prisma';
import { Guest } from '@/lib/models/guest';

export async function getGuests(): Promise<Guest[]> {
  const guests = await prisma.guest.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return guests;
}

export async function addGuest(g: Pick<Guest, 'name' | 'email'>): Promise<Guest> {
  const guest = await prisma.guest.create({
    data: {
      name: g.name,
      email: g.email || null,
    },
  });
  return guest;
}

export async function deleteGuest(id: string): Promise<{ ok: boolean }> {
  await prisma.guest.delete({
    where: { id },
  });
  return { ok: true };
}
