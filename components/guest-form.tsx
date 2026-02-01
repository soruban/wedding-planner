'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';

type Event = {
  id: string;
  name: string;
};

type GuestEventInput = {
  eventId: string;
  rsvp: 'INVITED' | 'NOT_INVITED' | 'ACCEPTED' | 'DECLINED';
  extras: number;
};

export type GuestFormData = {
  firstName: string;
  lastName: string;
  email: string;
  dietaryRequirements: string;
  relationship: string[];
  events: GuestEventInput[];
};

interface GuestFormProps {
  initialData?: GuestFormData;
  availableEvents: Event[];
  onSubmit: (data: GuestFormData) => Promise<void>;
  onCancel: () => void;
}

export function GuestForm({ initialData, availableEvents, onSubmit, onCancel }: GuestFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<GuestFormData>(
    initialData || {
      firstName: '',
      lastName: '',
      email: '',
      dietaryRequirements: '',
      relationship: [],
      events: availableEvents.map((e) => ({
        eventId: e.id,
        rsvp: 'NOT_INVITED',
        extras: 0,
      })),
    },
  );
  const [newRelationship, setNewRelationship] = useState('');

  const handleRelationshipAdd = () => {
    if (newRelationship && !formData.relationship.includes(newRelationship)) {
      setFormData({ ...formData, relationship: [...formData.relationship, newRelationship] });
      setNewRelationship('');
    }
  };

  const handleRelationshipRemove = (rel: string) => {
    setFormData({
      ...formData,
      relationship: formData.relationship.filter((r) => r !== rel),
    });
  };

  const updateEvent = (eventId: string, updates: Partial<GuestEventInput>) => {
    setFormData({
      ...formData,
      events: formData.events.map((e) => (e.eventId === eventId ? { ...e, ...updates } : e)),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            placeholder="Jane"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="jane@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Relationships</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.relationship.map((rel) => (
            <Badge key={rel} variant="secondary" className="gap-1">
              {rel}
              <button
                type="button"
                onClick={() => handleRelationshipRemove(rel)}
                className="text-zinc-500 hover:text-zinc-900"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newRelationship}
            onChange={(e) => setNewRelationship(e.target.value)}
            placeholder="Add relationship (e.g. Family, Friend)"
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleRelationshipAdd();
              }
            }}
          />
          <Button type="button" onClick={handleRelationshipAdd} variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dietary">Dietary Requirements</Label>
        <Input
          id="dietary"
          value={formData.dietaryRequirements}
          onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
          placeholder="e.g. Vegetarian, Nut allergy"
        />
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">Events RSVP</Label>
        {availableEvents.length === 0 && (
          <p className="text-sm text-zinc-500">No events found. Create events first.</p>
        )}
        {availableEvents.map((event) => {
          const guestEvent = formData.events.find((e) => e.eventId === event.id) || {
            eventId: event.id,
            rsvp: 'NOT_INVITED',
            extras: 0,
          };

          return (
            <div key={event.id} className="border rounded p-3 space-y-3">
              <div className="font-medium">{event.name}</div>
              <div className="flex gap-4 items-end">
                <div className="space-y-1 flex-1">
                  <Label>RSVP</Label>
                  <Select
                    value={guestEvent.rsvp}
                    onValueChange={(val: string) =>
                      updateEvent(event.id, { rsvp: val as GuestEventInput['rsvp'] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOT_INVITED">Not Invited</SelectItem>
                      <SelectItem value="INVITED">Invited</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="DECLINED">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 w-24">
                  <Label>Extras</Label>
                  <Input
                    type="number"
                    min="0"
                    value={guestEvent.extras}
                    onChange={(e) =>
                      updateEvent(event.id, { extras: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Guest'}
        </Button>
      </div>
    </form>
  );
}
