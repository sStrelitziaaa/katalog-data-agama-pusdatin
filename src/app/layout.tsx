import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Katalog & Repositori Data Agama - Pusdatin Kemenag RI',
  description: 'Aplikasi Web Katalog dan Repositori Data Agama dan Keagamaan Pusdatin Kementerian Agama RI. Klasifikasi Satu Data Agama, Bimas, dan Kerukunan.',
  keywords: ['Kemenag', 'Pusdatin', 'Data Agama', 'Satu Data', 'Bimas Islam', 'Bimas Kristen', 'Bimas Katolik', 'Bimas Hindu', 'Bimas Buddha', 'Khonghucu'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen antialiased bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
