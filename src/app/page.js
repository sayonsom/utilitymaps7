'use client';
import ZoneMap from '@/components/ZoneMap';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 relative">
        <ZoneMap />
      </div>
    </div>
  );
}