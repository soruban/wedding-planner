import { Venue } from './venue';

export type Event = {
  id: string;
  name: string;
  date: Date;
  venues?: Venue[];
};

export type EventVenue = {
  id: string;
  eventId: string;
  venueId: string;
};
