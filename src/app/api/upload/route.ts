import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 허용된 이미지 타입
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'uploads';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 없습니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '지원되지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 가능)' },
        { status: 400 }
      );
    }

    // 파일 크기 검증
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: '파일 크기는 10MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 파일명 생성
    const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`;
    const filename = `${uuidv4()}${ext}`;
    
    // 저장 경로 설정
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    
    // 디렉토리가 없으면 생성
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filepath = path.join(uploadDir, filename);
    
    // 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);
    
    // 공개 URL 반환
    const publicUrl = `/uploads/${folder}/${filename}`;
    
    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
      }
    });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { success: false, error: '파일 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}

