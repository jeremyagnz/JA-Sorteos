// Shared Netlify Identity type declarations

declare global {
  interface NetlifyIdentityUser {
    id: string;
    email: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
    app_metadata?: { roles?: string[]; provider?: string };
    token?: { access_token?: string; refresh_token?: string };
  }

  interface Window {
    netlifyIdentity?: {
      init: (opts?: { APIUrl?: string; logo?: boolean; locale?: string }) => void;
      open: (tab?: string) => void;
      close: () => void;
      on: (
        event: string,
        cb: (user?: NetlifyIdentityUser) => void
      ) => void;
      off: (
        event: string,
        cb: (user?: NetlifyIdentityUser) => void
      ) => void;
      currentUser: () => NetlifyIdentityUser | null;
      logout: () => void;
    };
  }
}

export {};
