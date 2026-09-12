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
    const { data, error } = await supabase.from('gallery').select('*');
    if (error) throw error;

    let items = data || [];
    items.sort((a: any, b: any) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime());

    return NextResponse.json({ success: true, items });
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

    const newItem = {
      title: body.title,
      type: body.type || 'image',
      category: body.category || 'Hackathons',
      event_id: body.eventId || null,
      url: body.url || body.imageUrl || '',
      description: body.description || '',
      featured: body.featured || false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('gallery').insert([newItem]).select();
    if (error) throw error;

    return NextResponse.json({ success: true, item: data[0] });
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
      return NextResponse.json({ success: false, message: 'Media ID required' }, { status: 400 });
    }

    const { error } = await supabase.from('gallery').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Media deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
