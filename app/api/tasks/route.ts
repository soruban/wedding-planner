import { NextResponse } from 'next/server';
import { getTasks, addTask } from '@/lib/data/tasks';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (date) {
    const tasks = getTasks().filter((task) => task.date === date);
    return NextResponse.json(tasks);
  }

  return NextResponse.json(getTasks());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.title || !body?.date) {
    return NextResponse.json({ error: 'title and date are required' }, { status: 400 });
  }
  const task = addTask({
    title: body.title,
    date: body.date,
    done: !!body.done,
    description: body.description,
  });
  return NextResponse.json(task, { status: 201 });
}
