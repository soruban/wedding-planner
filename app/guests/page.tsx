'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Guest = { id: string; name: string; email?: string; invited?: boolean };

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchGuests = async () => {
    const res = await fetch('/api/guests');
    const data = (await res.json()) as Guest[];
    setGuests(data);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch('/api/guests');
      const data = (await res.json()) as Guest[];
      if (mounted) setGuests(data);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    const res = await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (res.ok) {
      setName('');
      setEmail('');
      await fetchGuests();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const res = await fetch(`/api/guests/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchGuests();
    setLoading(false);
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Guests</h2>

      <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button asChild>
          <button className="h-9">{loading ? 'Saving...' : 'Add'}</button>
        </Button>
      </form>

      <ul className="space-y-3">
        {guests.map((g) => (
          <li key={g.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">{g.name}</div>
              {g.email && <div className="text-sm text-zinc-500">{g.email}</div>}
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => void handleDelete(g.id)} className="h-8">
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
