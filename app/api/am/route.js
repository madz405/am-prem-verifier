import { NextResponse } from 'next/server';
import { link, auth, pro } from '@/lib/alightMotion';

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, email, linkOrCode } = body;

    if (action === 'send-link') {
      if (!email) return NextResponse.json({ ok: false, why: 'Email wajib diisi' }, { status: 400 });
      const res = await link(email);
      return NextResponse.json(res);
    }

    if (action === 'verify-and-upgrade') {
      if (!email || !linkOrCode) {
        return NextResponse.json({ ok: false, why: 'Email dan link/kode verifikasi wajib diisi' }, { status: 400 });
      }

      const authRes = await auth(email, linkOrCode);
      if (!authRes.ok) return NextResponse.json(authRes, { status: 400 });

      const proRes = await pro(authRes.idToken);
      if (!proRes.ok) return NextResponse.json(proRes, { status: 400 });

      return NextResponse.json({
        ok: true,
        email: authRes.email,
        uid: authRes.uid,
        isNewUser: authRes.isNewUser,
        orderId: proRes.orderId,
        idToken: authRes.idToken
      });
    }

    return NextResponse.json({ ok: false, why: 'Aksi tidak dikenal' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ ok: false, why: e.message }, { status: 500 });
  }
}
