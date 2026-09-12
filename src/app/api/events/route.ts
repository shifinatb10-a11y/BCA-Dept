import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function checkAuth(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match ? match[1] : undefined;
  return verifySessionToken(token);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search')?.toLowerCase();

    let query = supabase.from('events').select('*');

    if (status) {
      query = query.eq('status', status);
    }
    if (category && category !== 'All') {
      query = query.ilike('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;

    let events = data || [];

    if (search) {
      events = events.filter(
        (e: any) =>
          e.title?.toLowerCase().includes(search) ||
          e.description?.toLowerCase().includes(search) ||
          e.coordinator?.toLowerCase().includes(search) ||
          (e.speaker && e.speaker.toLowerCase().includes(search))
      );
    }

    events.sort((a: any, b: any) => {
      if (a.status === 'upcoming' && b.status === 'upcoming') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const newEvent = {
      title: body.title,
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: body.description,
      category: body.category || 'Workshop',
      date: body.date,
      time: body.time || '10:00 AM - 04:00 PM',
      venue: body.venue || 'BCA Seminar Hall',
      status: body.status || 'upcoming',
      coordinator: body.coordinator || 'BCA Faculty Coordinator',
      speaker: body.speaker || null,
      speaker_role: body.speakerRole || null,
      banner_url: body.bannerUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      registration_url: body.registrationUrl || null,
      registration_fee: Number(body.registrationFee) || 0,
      max_seats: body.maxSeats ? Number(body.maxSeats) : null,
      registered_count: 0,
      agenda: body.agenda || [],
      recap: body.recap || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('events').insert([newEvent]).select();
    if (error) throw error;

    return NextResponse.json({ success: true, event: data[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Event ID required for update' }, { status: 400 });
    }

    const { error } = await supabase.from('events').update(updateData).eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Event updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Event ID required' }, { status: 400 });
    }

    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Event deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
