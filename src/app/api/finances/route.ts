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
    const { data, error } = await supabase.from('finances').select('*');
    if (error) throw error;

    let transactions = data || [];
    transactions.sort((a: any, b: any) => new Date(b.date || b.transaction_date).getTime() - new Date(a.date || a.transaction_date).getTime());

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
      transaction_type: body.type || 'income',
      amount: Number(body.amount) || 0,
      transaction_date: body.date || new Date().toISOString().split('T')[0],
      category: body.category || 'Event Registration',
      payment_method: body.paymentMethod || 'UPI',
      party_name: body.payer || body.receiver || '',
      reference_no: body.reference || '',
      notes: body.notes || '',
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('finances').insert([newTransaction]).select();
    if (error) throw error;

    return NextResponse.json({ success: true, transaction: data[0] });
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

    const { error } = await supabase.from('finances').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
