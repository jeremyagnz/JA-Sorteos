import { getStore } from '@netlify/blobs';

export interface UserRecord {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  end_date: string | null;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  max_participants: number | null;
  price: number;
  image_url: string | null;
  organizer_id: string;
  status: 'draft' | 'published' | 'cancelled';
  created_at: string;
  updated_at: string;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Users ───────────────────────────────────────────────────────────────────

async function getUsersStore(): Promise<{ users: UserRecord[] }> {
  try {
    const store = getStore('ja-sorteos-db');
    const raw = await store.get('users.json', { type: 'json' });
    if (raw && typeof raw === 'object' && Array.isArray((raw as { users: UserRecord[] }).users)) {
      return raw as { users: UserRecord[] };
    }
  } catch {
    // Store might not exist yet or key doesn't exist
  }
  return { users: [] };
}

async function saveUsersStore(data: { users: UserRecord[] }): Promise<void> {
  const store = getStore('ja-sorteos-db');
  await store.setJSON('users.json', data);
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const data = await getUsersStore();
  return data.users;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const data = await getUsersStore();
  return data.users.find((u) => u.id === id) ?? null;
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const data = await getUsersStore();
  return data.users.find((u) => u.email === email) ?? null;
}

export async function upsertUser(
  id: string,
  email: string,
  fullName?: string | null
): Promise<UserRecord> {
  const data = await getUsersStore();
  const now = new Date().toISOString();

  const existing = data.users.find((u) => u.id === id);

  // Bootstrap admin from env var
  const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const isBootstrapAdmin = bootstrapEmail && email === bootstrapEmail;

  if (existing) {
    existing.updated_at = now;
    if (fullName !== undefined) existing.full_name = fullName ?? null;
    // Grant admin on first upsert if bootstrap
    if (isBootstrapAdmin && existing.role !== 'admin') {
      existing.role = 'admin';
    }
    await saveUsersStore(data);
    return existing;
  }

  const newUser: UserRecord = {
    id,
    email,
    full_name: fullName ?? null,
    role: isBootstrapAdmin ? 'admin' : 'user',
    created_at: now,
    updated_at: now,
  };
  data.users.push(newUser);
  await saveUsersStore(data);
  return newUser;
}

export async function setUserRole(
  id: string,
  role: 'admin' | 'user'
): Promise<UserRecord | null> {
  const data = await getUsersStore();
  const user = data.users.find((u) => u.id === id);
  if (!user) return null;
  user.role = role;
  user.updated_at = new Date().toISOString();
  await saveUsersStore(data);
  return user;
}

// ─── Events ──────────────────────────────────────────────────────────────────

async function getEventsStore(): Promise<{ events: EventRecord[] }> {
  try {
    const store = getStore('ja-sorteos-db');
    const raw = await store.get('events.json', { type: 'json' });
    if (raw && typeof raw === 'object' && Array.isArray((raw as { events: EventRecord[] }).events)) {
      return raw as { events: EventRecord[] };
    }
  } catch {
    // Store might not exist yet or key doesn't exist
  }
  return { events: [] };
}

async function saveEventsStore(data: { events: EventRecord[] }): Promise<void> {
  const store = getStore('ja-sorteos-db');
  await store.setJSON('events.json', data);
}

export async function getAllEvents(): Promise<EventRecord[]> {
  const data = await getEventsStore();
  return data.events;
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  const data = await getEventsStore();
  return data.events.find((e) => e.id === id) ?? null;
}

export async function createEvent(
  eventData: Omit<EventRecord, 'id' | 'created_at' | 'updated_at'>
): Promise<EventRecord> {
  const data = await getEventsStore();
  const now = new Date().toISOString();
  const newEvent: EventRecord = {
    ...eventData,
    id: generateId(),
    created_at: now,
    updated_at: now,
  };
  data.events.push(newEvent);
  await saveEventsStore(data);
  return newEvent;
}

export async function updateEvent(
  id: string,
  updates: Partial<Omit<EventRecord, 'id' | 'created_at'>>
): Promise<EventRecord | null> {
  const data = await getEventsStore();
  const event = data.events.find((e) => e.id === id);
  if (!event) return null;
  Object.assign(event, updates, { updated_at: new Date().toISOString() });
  await saveEventsStore(data);
  return event;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const data = await getEventsStore();
  const idx = data.events.findIndex((e) => e.id === id);
  if (idx === -1) return false;
  data.events.splice(idx, 1);
  await saveEventsStore(data);
  return true;
}
