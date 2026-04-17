import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import AuthProvider from '@/providers/AuthProvider';
import GeolocationProvider from '@/providers/GeolocationProvider';
import MSWProvider from '@/components/MSWProvider';
import { Toaster } from '@/components/ui/sonner';
import NavigationProgress from '@/components/NavigationProgress';

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MSWProvider>
            <NavigationProgress />
            <AuthProvider>
              <GeolocationProvider>
                {children}
                <Toaster />
              </GeolocationProvider>
            </AuthProvider>
          </MSWProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
