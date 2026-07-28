import type { Metadata, Viewport } from 'next';
import { Outfit, Space_Mono } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/LanguageContext';
import ThemeProvider from '@/components/ThemeProvider';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { SchoolConfig } from '@/config/school.config';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vidya Setu Workspace',
  description: 'Command Desk for Institution Management',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden w-full">
        <LanguageProvider>
          {/* Inject dynamic white-label theme */}
          <style dangerouslySetInnerHTML={{ __html: `
            :root {
              --vs-primary: ${SchoolConfig.theme.primaryLight};
              --vs-secondary: ${SchoolConfig.theme.secondaryLight};
              --vs-accent: #FF9500;
              --color-primary-rgb: 0, 122, 255;
            }
            .dark {
              --vs-primary: ${SchoolConfig.theme.primaryDark};
              --vs-secondary: ${SchoolConfig.theme.secondaryDark};
            }
          `}} />
          {/* Unregister any stale service workers */}
          <script dangerouslySetInnerHTML={{ __html: `
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(function(registrations) {
                for (var r of registrations) r.unregister();
              });
            }
          `}} />
          {/*
            ThemeProvider runs the theme init sequence on the client:
              1. Immediately applies any cached school theme (zero-flash).
              2. Background-refreshes if the cache is stale.
              3. Redirects to /school-setup on first launch (no code stored).
          */}
          <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </NextThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
