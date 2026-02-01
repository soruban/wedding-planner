export type Guest = {
  id: string;
  name: string;
  email?: string | null;
  plusOne: boolean;
  dietaryRequirements?: string | null;
  isAttending?: boolean | null;
  createdAt: Date;
  updatedAt: Date;
};
