import { NextRequest, NextResponse } from 'next/server';
import { getIdentityUser } from '@/lib/auth/identity';

export async function GET(request: NextRequest) {
  const user = await getIdentityUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ user });
}
