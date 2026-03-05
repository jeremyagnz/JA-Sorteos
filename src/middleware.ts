import { NextResponse } from 'next/server';

// Admin route protection is handled client-side by AdminGuard component.
// This middleware is kept minimal — it just passes requests through.
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
