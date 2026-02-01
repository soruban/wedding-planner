export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  relationship: string[];
  dietaryRequirements: string | null;
  createdAt: Date;
  updatedAt: Date;
};
