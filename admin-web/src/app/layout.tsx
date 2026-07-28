import type { Metadata, Viewport } from 'next';

import './globals.css';
import './login.css';
import { AppBackground } from '@/components/AppBackground';
import { LanguageProvider } from '@/lib/LanguageContext';
import ThemeProvider from '@/components/ThemeProvider';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { SchoolConfig } from '@/config/school.config';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden w-full font-outfit">
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

          {/*
            ThemeProvider runs the theme init sequence on the client:
              1. Immediately applies any cached school theme (zero-flash).
              2. Background-refreshes if the cache is stale.
              3. Redirects to /school-setup on first launch (no code stored).
          */}
          <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ThemeProvider>
              <AppBackground />
              {children}
            </ThemeProvider>
          </NextThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
