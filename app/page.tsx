import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-4xl px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Hello, Wedding Planner!</h1>
          <p className="text-lg text-muted-foreground">
            Welcome to To The Altar — your all-in-one wedding planning companion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <Link
            href="/guests"
            className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">👥 Guest Management</h2>
            <p className="text-muted-foreground">
              Keep track of your guest list, RSVPs, and seating arrangements all in one place.
            </p>
          </Link>

          <Link
            href="/venues"
            className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">📍 Venue Planning</h2>
            <p className="text-muted-foreground">
              Organize and compare potential venues for your ceremony and reception.
            </p>
          </Link>

          <Link
            href="/events"
            className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">🎉 Event Scheduling</h2>
            <p className="text-muted-foreground">
              Plan all your wedding events from engagement parties to the big day itself.
            </p>
          </Link>

          <Link
            href="/vendors"
            className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">🤝 Vendor Coordination</h2>
            <p className="text-muted-foreground">
              Manage relationships with photographers, caterers, florists, and more.
            </p>
          </Link>

          <Link
            href="/checklist"
            className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">✅ Task Checklist</h2>
            <p className="text-muted-foreground">
              Stay on top of all your wedding to-dos with a comprehensive checklist.
            </p>
          </Link>

          <Link
            href="/calendar"
            className="p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">📅 Calendar View</h2>
            <p className="text-muted-foreground">
              Visualize your wedding timeline and never miss an important date.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
