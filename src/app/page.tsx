import CalendarGrid from '@/components/Calendar/CalendarGrid';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 animate-gradient">
      <div className="w-full max-w-[1400px] h-[calc(100vh-4rem)]">
        <CalendarGrid />
      </div>
    </main>
  );
}
