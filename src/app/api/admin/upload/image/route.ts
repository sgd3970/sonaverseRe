import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Image from '@/lib/models/Image';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/api-response';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { optimizeImage } from '@/lib/image-optimization';

// 허용된 이미지 타입
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse('Unauthorized');
    }

    await dbConnect();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'common';
    const altTextKo = formData.get('altTextKo') as string;
    const altTextEn = formData.get('altTextEn') as string;
    const tags = (formData.get('tags') as string)?.split(',').map(t => t.trim()) || [];

    if (!file) {
      return errorResponse(new Error('파일이 없습니다.'), 400, {
        message: '파일이 없습니다.',
      });
    }

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse(new Error('지원되지 않는 파일 형식입니다.'), 400, {
        message: '지원되지 않는 파일 형식입니다. (JPG, PNG, GIF, WebP만 가능)',
      });
    }

    // 파일 크기 검증
    if (file.size > MAX_SIZE) {
      return errorResponse(new Error('파일 크기가 너무 큽니다.'), 400, {
        message: '파일 크기는 10MB 이하여야 합니다.',
      });
    }

    // 파일명 생성
    const ext = path.extname(file.name) || `.${file.type.split('/')[1]}`;
    const filename = `${uuidv4()}${ext}`;
    
    // 저장 경로 설정
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
    
    // 디렉토리가 없으면 생성
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filepath = path.join(uploadDir, filename);
    
    // 파일 읽기
    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(bytes);
    const originalSize = originalBuffer.length;

    // 이미지 최적화 (WebP로 변환)
    const optimized = await optimizeImage(originalBuffer, {
      quality: 85,
      maxWidth: 1920,
      maxHeight: 1920,
      format: 'webp',
    });

    // 최적화된 파일 저장
    const optimizedExt = '.webp';
    const optimizedFilename = `${uuidv4()}${optimizedExt}`;
    const optimizedFilepath = path.join(uploadDir, optimizedFilename);
    await writeFile(optimizedFilepath, optimized.buffer);

    // 원본도 저장 (필요한 경우)
    const originalFilepath = path.join(uploadDir, filename);
    await writeFile(originalFilepath, originalBuffer);

    // 공개 URL (최적화된 버전)
    const publicUrl = `/uploads/${category}/${optimizedFilename}`;
    const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${publicUrl}`;

    // 압축률 계산
    const compressionRatio = ((originalSize - optimized.size) / originalSize) * 100;

    // Image 모델에 저장
    const imageDoc = await Image.create({
      filename: optimizedFilename,
      original_filename: file.name,
      storage_provider: 'local',
      path: optimizedFilepath,
      url: fullUrl,
      public_url: publicUrl,
      mime_type: `image/${optimized.format}`,
      size: optimized.size,
      width: optimized.width,
      height: optimized.height,
      aspect_ratio: optimized.width && optimized.height 
        ? `${optimized.width}:${optimized.height}` 
        : '1:1',
      format: optimized.format,
      alt_text: {
        ko: altTextKo,
        en: altTextEn,
      },
      category: category as any,
      tags,
      is_optimized: true,
      optimization_version: 1,
      optimization_details: {
        original_size: originalSize,
        compressed_size: optimized.size,
        compression_ratio: compressionRatio,
        quality: 85,
      },
      dominant_color: optimized.dominantColor,
      is_public: true,
      requires_auth: false,
      usage_count: 0,
      created_by: session.userId,
    });

    return successResponse(
      {
        id: imageDoc._id.toString(),
        url: fullUrl,
        publicUrl,
        filename: imageDoc.filename,
      },
      201,
      {
        message: '이미지가 업로드되었습니다.',
      }
    );
  } catch (error) {
    console.error('Image upload error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Failed to upload image'),
      500,
      {
        message: '이미지 업로드에 실패했습니다.',
      }
    );
  }
}

