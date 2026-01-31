import { Task } from '../models/task';

let tasks: Task[] = [
  { id: '1', title: 'Book photographer', date: '2025-02-15', done: false },
  { id: '2', title: 'Finalize menu', date: '2025-02-20', done: false },
];

export function getTasks() {
  return tasks;
}

export function getTasksByDate(date: string) {
  return tasks.filter((task) => task.date === date);
}

export function addTask(payload: Omit<Task, 'id'>) {
  const task: Task = { ...payload, id: String(Date.now()) };
  tasks.push(task);
  return task;
}

export function updateTask(id: string, payload: Partial<Task>) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, ...payload } : task));
  return tasks.find((task) => task.id === id);
}

export function deleteTask(id: string) {
  tasks = tasks.filter((task) => task.id !== id);
  return { ok: true };
}
