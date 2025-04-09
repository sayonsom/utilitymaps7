import RegionStatusPage from '@/components/RegionStatusPage';

export default function Page({ params }) {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <RegionStatusPage region={params.region} />
    </main>
  );
} 