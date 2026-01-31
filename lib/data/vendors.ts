import { Vendor } from '../models/vendor';

let vendors: Vendor[] = [
  {
    id: '1',
    name: 'Perfect Photography',
    category: 'Photographer',
    contact: 'photo@example.com',
    booked: true,
  },
  {
    id: '2',
    name: 'Bloom Florals',
    category: 'Florist',
    contact: 'bloom@example.com',
    booked: false,
  },
];

export function getVendors() {
  return vendors;
}

export function addVendor(v: Omit<Vendor, 'id'>) {
  const vendor: Vendor = { ...v, id: String(Date.now()) };
  vendors.push(vendor);
  return vendor;
}

export function deleteVendor(id: string) {
  vendors = vendors.filter((v) => v.id !== id);
  return { ok: true };
}
