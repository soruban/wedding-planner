'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Venue = { id: string; name: string; location: string };
type Event = { id: string; name: string; date: string; venues: Venue[] };

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    const res = await fetch('/api/events');
    const data = (await res.json()) as Event[];
    setEvents(data);
  };

  const fetchVenues = async () => {
    const res = await fetch('/api/venues');
    const data = (await res.json()) as Venue[];
    setVenues(data);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      await Promise.all([
        (async () => {
          const res = await fetch('/api/events');
          const data = (await res.json()) as Event[];
          if (mounted) setEvents(data);
        })(),
        (async () => {
          const res = await fetch('/api/venues');
          const data = (await res.json()) as Venue[];
          if (mounted) setVenues(data);
        })(),
      ]);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !date) return;
    setLoading(true);
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, date }),
    });
    if (res.ok) {
      setName('');
      setDate('');
      await fetchEvents();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchEvents();
    setLoading(false);
  }

  async function handleAddVenue(eventId: string, venueId: string) {
    setLoading(true);
    const res = await fetch(`/api/events/${eventId}/venues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ venueId }),
    });
    if (res.ok) await fetchEvents();
    setLoading(false);
  }

  async function handleRemoveVenue(eventId: string, venueId: string) {
    setLoading(true);
    const res = await fetch(`/api/events/${eventId}/venues`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ venueId }),
    });
    if (res.ok) await fetchEvents();
    setLoading(false);
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Events</h2>

      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="date"
          className="flex-1 rounded border px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button asChild>
          <button className="h-9">{loading ? 'Saving...' : 'Add Event'}</button>
        </Button>
      </form>

      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="rounded-md border p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-medium text-lg">{event.name}</div>
                <div className="text-sm text-zinc-500">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
              <Button
                onClick={() => void handleDelete(event.id)}
                className="h-8"
                variant="destructive"
              >
                Delete
              </Button>
            </div>

            <div className="mt-3 pt-3 border-t">
              <div className="text-sm font-medium mb-2">Venues:</div>
              {event.venues.length > 0 ? (
                <ul className="space-y-2 mb-3">
                  {event.venues.map((venue) => (
                    <li
                      key={venue.id}
                      className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 rounded px-3 py-2"
                    >
                      <div>
                        <div className="text-sm font-medium">{venue.name}</div>
                        <div className="text-xs text-zinc-500">{venue.location}</div>
                      </div>
                      <Button
                        onClick={() => void handleRemoveVenue(event.id, venue.id)}
                        className="h-7 text-xs"
                        variant="outline"
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500 mb-3">No venues added yet</p>
              )}

              <div className="flex gap-2">
                <select
                  className="flex-1 rounded border px-3 py-2 text-sm"
                  onChange={(e) => {
                    if (e.target.value) {
                      void handleAddVenue(event.id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  disabled={loading}
                >
                  <option value="">Add a venue...</option>
                  {venues
                    .filter((v) => !event.venues.some((ev) => ev.id === v.id))
                    .map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {events.length === 0 && (
        <p className="text-center text-zinc-500 py-8">No events yet. Add your first event above!</p>
      )}
    </main>
  );
}
