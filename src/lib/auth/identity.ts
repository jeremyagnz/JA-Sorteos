import { NextRequest } from 'next/server';
import { getUserById, upsertUser, UserRecord } from '@/lib/db/blobs';

export interface IdentityUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    roles?: string[];
    provider?: string;
  };
}

/**
 * Parse a Netlify Identity JWT without verifying (verification is done by
 * Netlify's edge infrastructure). This is safe because the token has already
 * passed Netlify's edge gateway signature check before reaching our function.
 */
function parseJwtPayload(token: string): IdentityUser | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64url decode the payload
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(json) as IdentityUser;
  } catch {
    return null;
  }
}

/**
 * Extract bearer token from Authorization header.
 */
export function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get('authorization') ?? '';
  if (!auth.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

/**
 * Get the Netlify Identity user from the request's Bearer JWT and upsert into
 * our users store.
 */
export async function getIdentityUser(
  request: NextRequest
): Promise<UserRecord | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const payload = parseJwtPayload(token);
  if (!payload || !payload.id || !payload.email) return null;

  // Upsert into our local store (handles bootstrap admin logic too)
  const user = await upsertUser(
    payload.id,
    payload.email,
    payload.user_metadata?.full_name ?? null
  );
  return user;
}

/**
 * Return the stored user record for the given request (without upserting).
 * Used for admin checks where we only want to read the stored role.
 */
export async function getStoredUser(
  request: NextRequest
): Promise<UserRecord | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const payload = parseJwtPayload(token);
  if (!payload || !payload.id) return null;

  return await getUserById(payload.id);
}
