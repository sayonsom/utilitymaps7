'use client';
import ZoneMap from '@/components/ZoneMap';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen pt-16">
      <Navbar />
      <ZoneMap />
    </main>
  );
}