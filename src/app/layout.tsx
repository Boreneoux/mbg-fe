import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AuthProvider from '@/providers/AuthProvider';
import GeolocationProvider from '@/providers/GeolocationProvider';
import MSWProvider from '@/components/MSWProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MalesBeliGrocery',
  description: 'Online Grocery Store',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <MSWProvider>
          <AuthProvider>
            <GeolocationProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </GeolocationProvider>
          </AuthProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
