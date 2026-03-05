import { NextRequest, NextResponse } from 'next/server';
import { getIdentityUser } from '@/lib/auth/identity';
import { getAllEvents, createEvent } from '@/lib/db/blobs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const difficulty = searchParams.get('difficulty');
  const search = searchParams.get('search');
  const all = searchParams.get('all'); // admin: include all statuses

  let events = await getAllEvents();

  if (!all) {
    const now = new Date().toISOString();
    events = events.filter(
      (e) => e.status === 'published' && e.event_date >= now
    );
  }

  if (category) {
    events = events.filter((e) => e.category === category);
  }
  if (difficulty) {
    events = events.filter((e) => e.difficulty === difficulty);
  }
  if (search) {
    const q = search.toLowerCase();
    events = events.filter((e) => e.title.toLowerCase().includes(q));
  }

  // Sort by event_date ascending (or created_at desc for admin)
  if (all) {
    events = events.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } else {
    events = events.sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
    );
  }

  return NextResponse.json({ events });
}

export async function POST(request: NextRequest) {
  const user = await getIdentityUser(request);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const event = await createEvent({
    title: String(body.title ?? '').trim(),
    description: String(body.description ?? '').trim(),
    location: String(body.location ?? '').trim(),
    event_date: body.event_date,
    end_date: body.end_date || null,
    category: body.category,
    difficulty: body.difficulty,
    max_participants: body.max_participants ? Number(body.max_participants) : null,
    price: Number(body.price) || 0,
    image_url: body.image_url ?? null,
    organizer_id: user.id,
    status: body.status ?? 'draft',
  });

  return NextResponse.json({ event }, { status: 201 });
}
