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
    const querySnapshot = await getDocs(collection(db, 'finances'));
    const transactions = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // Sort by date descending
    transactions.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ success: true, transactions });
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

    const newTransaction = {
      title: body.title,
      type: body.type || 'income', // 'income' or 'expense'
      amount: Number(body.amount) || 0,
      date: body.date || new Date().toISOString().split('T')[0],
      category: body.category || 'Event Registration',
      paymentMethod: body.paymentMethod || 'UPI',
      payer: body.payer || body.receiver || '',
      reference: body.reference || '',
      notes: body.notes || '',
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'finances'), newTransaction);

    return NextResponse.json({ success: true, transaction: { id: docRef.id, ...newTransaction } });
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
      return NextResponse.json({ success: false, message: 'Transaction ID required' }, { status: 400 });
    }

    await deleteDoc(doc(db, 'finances', id));

    return NextResponse.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
