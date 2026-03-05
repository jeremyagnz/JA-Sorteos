import { NextRequest, NextResponse } from 'next/server';
import { getIdentityUser } from '@/lib/auth/identity';
import { getEventById, updateEvent, deleteEvent } from '@/lib/db/blobs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const event = await getEventById(id);
  if (!event) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ event });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const user = await getIdentityUser(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await request.json();

  const updated = await updateEvent(id, {
    title: body.title !== undefined ? String(body.title).trim() : undefined,
    description:
      body.description !== undefined
        ? String(body.description).trim()
        : undefined,
    location:
      body.location !== undefined ? String(body.location).trim() : undefined,
    event_date: body.event_date,
    end_date: body.end_date || null,
    category: body.category,
    difficulty: body.difficulty,
    max_participants: body.max_participants
      ? Number(body.max_participants)
      : null,
    price: body.price !== undefined ? Number(body.price) : undefined,
    image_url: body.image_url ?? null,
    status: body.status,
  });

  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ event: updated });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const user = await getIdentityUser(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  const deleted = await deleteEvent(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
