import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="text-center px-6 py-20">
        <h1 className="text-4xl font-bold mb-4">Hello, Wedding Planner!</h1>
        <p className="mb-6 text-zinc-600">Welcome — start planning your wedding.</p>
        <Button>Get started</Button>
      </div>
    </main>
  );
}
