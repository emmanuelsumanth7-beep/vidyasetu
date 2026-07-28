'use client';

/**
 * ThemeProvider.tsx
 *
 * Client component that runs the theme initialisation sequence on mount.
 *
 * Responsibilities:
 *   1. On first render, immediately apply whatever is in the localStorage
 *      cache so the app never flashes unstyled (zero-latency path).
 *   2. After mount, call initTheme() which may trigger a background network
 *      refresh if the cache is stale.
 *   3. If initTheme() returns `needsSetup: true` (no school code stored),
 *      redirect to /school-setup unless the user is already there or on
 *      an explicit bypass route (e.g. /school-setup itself).
 *
 * Why not do this in layout.tsx directly?
 *   Next.js layout.tsx is a Server Component — it runs on the server where
 *   localStorage doesn't exist.  This wrapper lets the server component
 *   provide the HTML shell while client-side theme hydration happens after
 *   the first paint.
 */

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { initTheme, loadCachedTheme, setSchoolCode, getSchoolCode } from '@/lib/theme';

// Routes where we must NOT redirect to setup even without a school code.
const SETUP_EXEMPT = ['/school-setup'];

// Default school code pre-seeded for the demo APK so fresh installs go
// straight to the login screen instead of the school-setup wizard.
const DEMO_DEFAULT_SCHOOL_CODE = 'vidyasetu-intl';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const router   = useRouter();
  const pathname = usePathname();

  // ── Synchronous first paint ──────────────────────────────────────────────
  // This runs immediately during client-side hydration (before any useEffect)
  // by virtue of being a module-level side-effect guarded by typeof window.
  // It ensures the CSS variables are set before the browser does a paint.
  if (typeof window !== 'undefined') {
    loadCachedTheme();
  }

  // ── Async initialisation after mount ────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    // Pre-seed the default school code on a fresh install so the demo APK
    // skips the school-setup wizard and goes straight to the login screen.
    if (typeof window !== 'undefined' && !getSchoolCode()) {
      setSchoolCode(DEMO_DEFAULT_SCHOOL_CODE);
    }

    (async () => {
      const { needsSetup } = await initTheme();

      if (cancelled) return;

      if (needsSetup && !SETUP_EXEMPT.includes(pathname)) {
        router.replace('/school-setup');
      }
    })();

    return () => { cancelled = true; };
  // Re-run if the pathname changes so navigating back from settings works.
  // initTheme is idempotent when the cache is fresh, so this is safe.
  }, [pathname, router]);

  return <>{children}</>;
}
