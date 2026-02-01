'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Vendor = { id: string; name: string; category?: string; contact?: string; booked?: boolean };

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchVendors = async () => {
    const res = await fetch('/api/vendors');
    const data = (await res.json()) as Vendor[];
    setVendors(data);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/vendors');
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        if (Array.isArray(data)) {
          if (mounted) setVendors(data);
        } else {
          console.error('Expected array but got:', data);
        }
      } catch (err) {
        console.error('Failed to fetch vendors:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    const res = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, contact }),
    });
    if (res.ok) {
      setName('');
      setCategory('');
      setContact('');
      await fetchVendors();
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const res = await fetch(`/api/vendors/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchVendors();
    setLoading(false);
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Vendors</h2>

      <form onSubmit={handleAdd} className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border px-3 py-2"
            placeholder="Vendor name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="flex-1 rounded border px-3 py-2"
            placeholder="Category (e.g., Photographer)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border px-3 py-2"
            placeholder="Contact (email or phone)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <Button asChild>
            <button className="h-9">{loading ? 'Saving...' : 'Add'}</button>
          </Button>
        </div>
      </form>

      <ul className="space-y-3">
        {vendors.map((v) => (
          <li key={v.id} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium">{v.name}</div>
              {v.category && <div className="text-sm text-zinc-500">{v.category}</div>}
              {v.contact && <div className="text-sm text-zinc-500">{v.contact}</div>}
              {v.booked && <div className="text-xs text-green-600 mt-1">✓ Booked</div>}
            </div>
            <div className="flex items-center gap-2">
              <Button asChild>
                <button onClick={() => void handleDelete(v.id)} className="h-8">
                  Delete
                </button>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
