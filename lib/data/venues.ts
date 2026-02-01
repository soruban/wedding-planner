import { Venue } from '../models/venue';

let venues: Venue[] = [
  { id: '1', name: 'Grand Ballroom', location: '123 Main St, New York, NY' },
  { id: '2', name: 'Garden Pavilion', location: '456 Park Ave, Brooklyn, NY' },
];

export function getVenues() {
  return venues;
}

export function addVenue(v: Omit<Venue, 'id'>) {
  const venue: Venue = { ...v, id: String(Date.now()) };
  venues.push(venue);
  return venue;
}

export function deleteVenue(id: string) {
  venues = venues.filter((v) => v.id !== id);
  return { ok: true };
}
