'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { GuestForm, GuestFormData } from '@/components/guest-form';
import { Plus, Search, Trash2 } from 'lucide-react';

type Event = {
  id: string;
  name: string;
};

type GuestEvent = {
  id: string;
  eventId: string;
  rsvp: 'INVITED' | 'NOT_INVITED' | 'ACCEPTED' | 'DECLINED';
  extras: number;
  event: Event;
};

type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  relationship: string[];
  dietaryRequirements: string | null;
  events: GuestEvent[];
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [guestsRes, eventsRes] = await Promise.all([
        fetch('/api/guests'),
        fetch('/api/events'),
      ]);
      const guestsData = await guestsRes.json();
      const eventsData = await eventsRes.json();
      setGuests(guestsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddGuest = async (data: GuestFormData) => {
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchData();
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error adding guest', error);
    }
  };

  const handleDelete = async (id: string) => {
    // if (!confirm('Are you sure you want to delete this guest?')) return;
    try {
      const res = await fetch(`/api/guests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error deleting guest', error);
    }
  };

  const filteredGuests = guests.filter((guest) => {
    const searchLower = search.toLowerCase();
    return (
      guest.firstName.toLowerCase().includes(searchLower) ||
      guest.lastName.toLowerCase().includes(searchLower) ||
      (guest.email && guest.email.toLowerCase().includes(searchLower))
    );
  });

  const getRsvpBadgeColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-500 hover:bg-green-600';
      case 'DECLINED':
        return 'bg-red-500 hover:bg-red-600';
      case 'INVITED':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-zinc-500 hover:bg-zinc-600';
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guests</h2>
          <p className="text-muted-foreground">Manage your wedding guest list.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Guest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
            </DialogHeader>
            <GuestForm
              availableEvents={events}
              onSubmit={handleAddGuest}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guests..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Relationships</TableHead>
              <TableHead>Dietary</TableHead>
              {events.map((event) => (
                <TableHead key={event.id}>{event.name}</TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5 + events.length} className="text-center py-8">
                  Loading guests...
                </TableCell>
              </TableRow>
            ) : filteredGuests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5 + events.length} className="text-center py-8">
                  No guests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredGuests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">
                    {guest.firstName} {guest.lastName}
                  </TableCell>
                  <TableCell>{guest.email || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {guest.relationship.map((rel) => (
                        <Badge key={rel} variant="outline" className="text-xs">
                          {rel}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{guest.dietaryRequirements || '-'}</TableCell>
                  {events.map((event) => {
                    const guestEvent = guest.events.find((ge) => ge.eventId === event.id);
                    return (
                      <TableCell key={event.id}>
                        {guestEvent ? (
                          <div className="flex flex-col gap-1">
                            <Badge className={getRsvpBadgeColor(guestEvent.rsvp)}>
                              {guestEvent.rsvp}
                            </Badge>
                            {guestEvent.extras > 0 && (
                              <span className="text-xs text-muted-foreground">
                                +{guestEvent.extras} extra(s)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Not Invited</span>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(guest.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
