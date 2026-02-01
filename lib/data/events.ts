import { Event } from '../models/event';
import { Venue } from '../models/venue';

type EventWithVenues = Event & { venues: Venue[] };

let events: EventWithVenues[] = [];
let eventVenues: { eventId: string; venueId: string }[] = [];

export function getEvents(): EventWithVenues[] {
  return events;
}

export function getEventById(id: string): EventWithVenues | undefined {
  return events.find((e) => e.id === id);
}

export function addEvent(data: { name: string; date: Date }): Event {
  const event: EventWithVenues = {
    id: String(Date.now()),
    name: data.name,
    date: data.date,
    venues: [],
  };
  events.push(event);
  return event;
}

export function updateEvent(id: string, data: { name?: string; date?: Date }): Event | null {
  const event = events.find((e) => e.id === id);
  if (!event) return null;

  if (data.name !== undefined) event.name = data.name;
  if (data.date !== undefined) event.date = data.date;

  return event;
}

export function deleteEvent(id: string): { ok: boolean } {
  events = events.filter((e) => e.id !== id);
  eventVenues = eventVenues.filter((ev) => ev.eventId !== id);
  return { ok: true };
}

export function addVenueToEvent(eventId: string, venueId: string, venue: Venue): { ok: boolean } {
  const event = events.find((e) => e.id === eventId);
  if (!event) return { ok: false };

  // Check if already associated
  const exists = eventVenues.some((ev) => ev.eventId === eventId && ev.venueId === venueId);
  if (exists) return { ok: true };

  eventVenues.push({ eventId, venueId });
  event.venues.push(venue);

  return { ok: true };
}

export function removeVenueFromEvent(eventId: string, venueId: string): { ok: boolean } {
  const event = events.find((e) => e.id === eventId);
  if (!event) return { ok: false };

  eventVenues = eventVenues.filter((ev) => !(ev.eventId === eventId && ev.venueId === venueId));
  event.venues = event.venues.filter((v) => v.id !== venueId);

  return { ok: true };
}
