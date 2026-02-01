'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Venue = { id: string; name: string; location: string };

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchVenues = async () => {
    const res = await fetch('/api/venues');
    const data = (await res.json()) as Venue[];
    setVenues(data);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch('/api/venues');
      const data = (await res.json()) as Venue[];
      if (mounted) setVenues(data);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !location) return;
    setLoading(true);
    const res = await fetch('/api/venues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location }),
    });
    if (res.ok) {
      setName('');
      setLocation('');
      await fetchVenues();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const res = await fetch(`/api/venues/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchVenues();
    setLoading(false);
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Venues</h2>

      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Venue Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button asChild>
          <button className="h-9">{loading ? 'Saving...' : 'Add'}</button>
        </Button>
      </form>

      <ul className="space-y-3">
        {venues.map((v) => (
          <li key={v.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">{v.name}</div>
              <div className="text-sm text-zinc-500">{v.location}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => void handleDelete(v.id)} className="h-8">
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
