import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: session,
      },
    });
  } catch (error) {
    console.error('Auth Me API Error:', error);
    return NextResponse.json(
      { success: false, error: '인증 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

