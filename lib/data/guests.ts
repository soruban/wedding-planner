import { Guest } from '../models/guest';

let guests: Guest[] = [
  { id: '1', name: 'Alice Smith', email: 'alice@example.com', invited: true },
  { id: '2', name: 'Bob Johnson', email: 'bob@example.com', invited: false },
];

export function getGuests() {
  return guests;
}

export function addGuest(g: Omit<Guest, 'id'>) {
  const guest: Guest = { ...g, id: String(Date.now()) };
  guests.push(guest);
  return guest;
}

export function deleteGuest(id: string) {
  guests = guests.filter((g) => g.id !== id);
  return { ok: true };
}
