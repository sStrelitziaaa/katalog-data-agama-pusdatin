import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Data Agama dan Keagamaan - Pusat Data dan Teknologi Informasi Kemenag RI',
  description: 'Aplikasi Web Katalog dan Repositori Data Agama dan Keagamaan Pusat Data dan Teknologi Informasi (Pusdatin) Kementerian Agama RI. Klasifikasi Satu Data Agama, Ditjen Bimas, Pusbimdik Khonghucu, BMBPSDM, dan Pusat Kerukunan Umat Beragama.',
  keywords: ['Kemenag', 'Pusdatin', 'Pusat Data dan Teknologi Informasi', 'Data Agama', 'Satu Data', 'Bimas Islam', 'Bimas Kristen', 'Bimas Katolik', 'Bimas Hindu', 'Bimas Buddha', 'Pusbimdik Khonghucu', 'BMBPSDM', 'Pusat Kerukunan Umat Beragama'],
  icons: {
    icon: '/logo-kemenag.png',
    shortcut: '/logo-kemenag.png',
    apple: '/logo-kemenag.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen antialiased bg-[#F0EEE9] text-[#181E24]`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
