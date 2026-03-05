import { NextRequest, NextResponse } from 'next/server';
import { getIdentityUser } from '@/lib/auth/identity';
import { setUserRole } from '@/lib/db/blobs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const caller = await getIdentityUser(request);
  if (!caller || caller.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await request.json() as { role?: string };
  const role = body.role;

  if (role !== 'admin' && role !== 'user') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const updated = await setUserRole(id, role);
  if (!updated) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: updated });
}
