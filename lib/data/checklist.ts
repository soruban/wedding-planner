import { ChecklistItem } from './models/checklist';

let items: ChecklistItem[] = [
  { id: '1', title: 'Book venue', done: true },
  { id: '2', title: 'Send invites', done: false },
];

export function getItems() {
  return items;
}

export function addItem(payload: Omit<ChecklistItem, 'id'>) {
  const item: ChecklistItem = { ...payload, id: String(Date.now()) };
  items.push(item);
  return item;
}

export function updateItem(id: string, payload: Partial<ChecklistItem>) {
  items = items.map((it) => (it.id === id ? { ...it, ...payload } : it));
  return items.find((it) => it.id === id);
}

export function deleteItem(id: string) {
  items = items.filter((it) => it.id !== id);
  return { ok: true };
}
