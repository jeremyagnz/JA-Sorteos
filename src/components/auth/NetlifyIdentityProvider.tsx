'use client';

import { useEffect } from 'react';

/**
 * Initialises the Netlify Identity widget via the npm package so that we can
 * pass an explicit APIUrl (from NEXT_PUBLIC_SITE_URL) instead of relying on
 * the widget to guess it from window.location. This fixes the
 * "Failed to load settings from /.netlify/identity" error when the app is
 * accessed from a domain that differs from the Netlify site URL (e.g. local
 * development or custom domains).
 *
 * Once init completes the component dispatches a "netlify-identity-ready"
 * window event so that other components (e.g. Header) can react to it even
 * when they mount before this provider's effect runs.
 */
export function NetlifyIdentityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let cancelled = false;

    // Dynamic import prevents the widget (which accesses browser globals) from
    // being evaluated during server-side rendering.
    import('netlify-identity-widget').then(({ default: netlifyIdentity }) => {
      if (cancelled) return;

      // Register the init listener BEFORE calling init() to avoid a race
      // condition where the event fires before the listener is attached.
      netlifyIdentity.on('init', () => {
        if (!cancelled) {
          window.dispatchEvent(new CustomEvent('netlify-identity-ready'));
        }
      });

      netlifyIdentity.init({
        // NEXT_PUBLIC_SITE_URL should be set to the deployed Netlify site URL
        // (e.g. https://your-site.netlify.app). When undefined the widget
        // falls back to window.location.origin which is correct on Netlify.
        APIUrl: process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/.netlify/identity`
          : undefined,
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
