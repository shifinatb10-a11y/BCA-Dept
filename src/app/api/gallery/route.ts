import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth';

function checkAuth(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match ? match[1] : undefined;
  return verifySessionToken(token);
}

export async function GET(request: Request) {
  try {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    const items = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // Sort by newest first
    items.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
      type: body.type || 'image', // 'image' or 'video'
      category: body.category || 'Hackathons',
      eventId: body.eventId || null,
      url: body.url || body.imageUrl || '',
      description: body.description || '',
      featured: body.featured || false,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'gallery'), newItem);

    return NextResponse.json({ success: true, item: { id: docRef.id, ...newItem } });
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

    await deleteDoc(doc(db, 'gallery', id));

    return NextResponse.json({ success: true, message: 'Media deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
