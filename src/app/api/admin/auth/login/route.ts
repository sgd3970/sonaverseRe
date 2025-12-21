import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { setSessionCookie } from '@/lib/auth';

// 기존 DB 구조에 맞는 스키마 정의
const LegacyAdminUserSchema = new mongoose.Schema({
  email: String,
  password_hash: String,  // snake_case로 변경
  name: String,
  role: String,
  is_active: { type: Boolean, default: true },
  failed_login_attempts: { type: Number, default: 0 },
  locked_until: Date,
  last_login: Date,
}, { 
  collection: 'adminusers',
  timestamps: false 
});

const AdminUser = mongoose.models.LegacyAdminUser || mongoose.model('LegacyAdminUser', LegacyAdminUserSchema);

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // 이메일 검증
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 찾기
    const user = await AdminUser.findOne({ 
      email: email.toLowerCase(),
      is_active: true 
    }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userData = user as any;

    // 계정 잠금 확인
    if (userData.locked_until && new Date(userData.locked_until) > new Date()) {
      return NextResponse.json(
        { success: false, error: '계정이 일시적으로 잠겼습니다. 잠시 후 다시 시도해주세요.' },
        { status: 423 }
      );
    }

    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, userData.password_hash);

    if (!isValidPassword) {
      // 실패 횟수 증가
      await AdminUser.updateOne(
        { _id: userData._id },
        { 
          $inc: { failed_login_attempts: 1 },
          // 5회 실패 시 15분 잠금
          ...(userData.failed_login_attempts >= 4 ? { 
            locked_until: new Date(Date.now() + 15 * 60 * 1000) 
          } : {})
        }
      );

      return NextResponse.json(
        { success: false, error: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      );
    }

    // 로그인 성공 - 실패 횟수 초기화, 마지막 로그인 시간 업데이트
    await AdminUser.updateOne(
      { _id: userData._id },
      { 
        failed_login_attempts: 0,
        locked_until: null,
        last_login: new Date(),
      }
    );

    // 세션 생성
    await setSessionCookie({
      userId: userData._id.toString(),
      email: userData.email,
      name: userData.name || '관리자',
      role: userData.role || 'admin',
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userData._id.toString(),
          email: userData.email,
          name: userData.name || '관리자',
          role: userData.role || 'admin',
        },
      },
    });

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, error: '로그인 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

