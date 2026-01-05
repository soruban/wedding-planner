export type Task = {
  id: string;
  title: string;
  date: string; // ISO date string (YYYY-MM-DD)
  done?: boolean;
  description?: string;
};
