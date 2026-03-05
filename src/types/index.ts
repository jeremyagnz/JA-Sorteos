export type UserRole = 'admin' | 'user';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Event {
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
  organizer?: Profile;
  registrations_count?: number;
  is_registered?: boolean;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
  event?: Event;
  user?: Profile;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  event_date: string;
  end_date: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  max_participants: string;
  price: string;
  status: 'draft' | 'published' | 'cancelled';
  image?: File | null;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  pageSize: number;
}
