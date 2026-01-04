'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Item = { id: string; title: string; done?: boolean };

export default function ChecklistPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch('/api/checklist');
      const data = (await res.json()) as Item[];
      if (mounted) setItems(data);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    const res = await fetch('/api/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (res.ok) {
      setTitle('');
      const data = (await res.json()) as Item;
      setItems((s) => [data, ...s]);
    }
    setLoading(false);
  }

  async function toggleDone(item: Item) {
    const res = await fetch(`/api/checklist/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !item.done }),
    });
    if (res.ok) {
      const updated = (await res.json()) as Item;
      setItems((s) => s.map((it) => (it.id === updated.id ? updated : it)));
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const res = await fetch(`/api/checklist/${id}`, { method: 'DELETE' });
    if (res.ok) setItems((s) => s.filter((it) => it.id !== id));
    setLoading(false);
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Checklist</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Add an item"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button asChild>
          <button className="h-9">{loading ? 'Adding...' : 'Add'}</button>
        </Button>
      </form>

      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={!!it.done} onChange={() => void toggleDone(it)} />
              <div className={` ${it.done ? 'line-through text-zinc-500' : ''}`}>{it.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild>
                <button onClick={() => void handleDelete(it.id)} className="h-8">
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
