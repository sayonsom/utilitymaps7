import localFont from "next/font/local";
import "./globals.css";
import { MapProvider } from '@/context/MapContext';
import { Lexend_Deca } from 'next/font/google'
import Navbar from '@/components/Navbar';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "SRIB-STEnergy - Carbon Agg Service",
  description: "In-house replacement for ElectricityMaps",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${lexendDeca.className}`}
      >
        <MapProvider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </MapProvider>
      </body>
    </html>
  );
}
