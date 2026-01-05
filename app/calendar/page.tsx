'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Task = { id: string; title: string; date: string; done?: boolean; description?: string };

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch('/api/tasks');
      const data = (await res.json()) as Task[];
      if (mounted) setTasks(data);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((task) => task.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = formatDate(new Date(year, month, day));
    setSelectedDate(dateStr);
    setShowTaskForm(true);
    setTaskTitle('');
    setTaskDescription('');
  };

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskTitle || !selectedDate) return;
    setLoading(true);
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: taskTitle,
        date: selectedDate,
        description: taskDescription || undefined,
      }),
    });
    if (res.ok) {
      const newTask = (await res.json()) as Task;
      setTasks((s) => [...s, newTask]);
      setTaskTitle('');
      setTaskDescription('');
      setShowTaskForm(false);
    }
    setLoading(false);
  }

  async function toggleDone(task: Task) {
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !task.done }),
    });
    if (res.ok) {
      const updated = (await res.json()) as Task;
      setTasks((s) => s.map((t) => (t.id === updated.id ? updated : t)));
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (res.ok) setTasks((s) => s.filter((t) => t.id !== id));
    setLoading(false);
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const today = formatDate(new Date());

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Calendar</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button onClick={() => navigateMonth('prev')} variant="outline">
                ← Prev
              </Button>
              <h3 className="text-lg font-semibold">
                {monthNames[month]} {year}
              </h3>
              <Button onClick={() => navigateMonth('next')} variant="outline">
                Next →
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-zinc-600 p-2">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {days.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="p-2" />;
                }

                const dateStr = formatDate(new Date(year, month, day));
                const dayTasks = getTasksForDate(dateStr);
                const isToday = dateStr === today;
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`
                      p-2 min-h-[80px] border rounded text-left
                      hover:bg-zinc-50 transition-colors
                      ${isToday ? 'bg-blue-50 border-blue-300' : ''}
                      ${isSelected ? 'ring-2 ring-blue-500' : ''}
                    `}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            task.done
                              ? 'bg-zinc-200 text-zinc-500 line-through'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-zinc-500">+{dayTasks.length - 2} more</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Form & List */}
        <div className="space-y-4">
          {showTaskForm && selectedDate && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-3">
                Add Task for {new Date(selectedDate).toLocaleDateString()}
              </h3>
              <form onSubmit={handleAddTask} className="space-y-3">
                <input
                  className="w-full rounded border px-3 py-2 text-sm"
                  placeholder="Task title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
                <textarea
                  className="w-full rounded border px-3 py-2 text-sm"
                  placeholder="Description (optional)"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Adding...' : 'Add Task'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowTaskForm(false);
                      setSelectedDate(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Tasks for Selected Date */}
          {selectedDate && (
            <div className="bg-white rounded-lg border p-4">
              <h3 className="font-semibold mb-3">
                Tasks for {new Date(selectedDate).toLocaleDateString()}
              </h3>
              <div className="space-y-2">
                {getTasksForDate(selectedDate).length === 0 ? (
                  <p className="text-sm text-zinc-500">No tasks for this date</p>
                ) : (
                  getTasksForDate(selectedDate).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start justify-between rounded-md border p-3"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={!!task.done}
                          onChange={() => void toggleDone(task)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div
                            className={`text-sm ${task.done ? 'line-through text-zinc-500' : ''}`}
                          >
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-xs text-zinc-500 mt-1">{task.description}</div>
                          )}
                        </div>
                      </div>
                      <Button
                        asChild
                        variant="outline"
                        onClick={() => void handleDelete(task.id)}
                        className="h-8"
                      >
                        <button>Delete</button>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {!showTaskForm && !selectedDate && (
            <div className="bg-white rounded-lg border p-4 text-center text-zinc-500 text-sm">
              Click on a date to add or view tasks
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
