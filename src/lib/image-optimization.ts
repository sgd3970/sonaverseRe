import sharp from 'sharp';
import { getPlaiceholder } from 'plaiceholder';
import { readFile } from 'fs/promises';
import path from 'path';

export interface OptimizedImageResult {
  buffer: Buffer;
  width: number;
  height: number;
  format: 'webp' | 'avif' | 'jpg' | 'png';
  size: number;
  blurDataURL?: string;
  dominantColor?: string;
}

/**
 * 이미지를 WebP로 변환하고 최적화
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  options: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
  } = {}
): Promise<OptimizedImageResult> {
  const {
    quality = 85,
    maxWidth = 1920,
    maxHeight = 1920,
    format = 'webp',
  } = options;

  let pipeline = sharp(inputBuffer);

  // 메타데이터 가져오기
  const metadata = await pipeline.metadata();
  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;

  // 리사이즈 (필요한 경우)
  if (originalWidth > maxWidth || originalHeight > maxHeight) {
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // 포맷 변환 및 최적화
  let optimizedBuffer: Buffer;
  let finalFormat: 'webp' | 'avif' | 'jpg' | 'png';

  switch (format) {
    case 'webp':
      optimizedBuffer = await pipeline
        .webp({ quality, effort: 6 })
        .toBuffer();
      finalFormat = 'webp';
      break;
    case 'avif':
      optimizedBuffer = await pipeline
        .avif({ quality, effort: 4 })
        .toBuffer();
      finalFormat = 'avif';
      break;
    case 'jpg':
      optimizedBuffer = await pipeline
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();
      finalFormat = 'jpg';
      break;
    case 'png':
      optimizedBuffer = await pipeline
        .png({ quality, compressionLevel: 9 })
        .toBuffer();
      finalFormat = 'png';
      break;
    default:
      optimizedBuffer = await pipeline.webp({ quality }).toBuffer();
      finalFormat = 'webp';
  }

  // 최종 메타데이터
  const finalMetadata = await sharp(optimizedBuffer).metadata();
  const finalWidth = finalMetadata.width || originalWidth;
  const finalHeight = finalMetadata.height || originalHeight;

  // Blur placeholder 생성
  let blurDataURL: string | undefined;
  let dominantColor: string | undefined;

  try {
    const { base64, color } = await getPlaiceholder(optimizedBuffer, {
      size: 10,
    });
    blurDataURL = `data:image/${finalFormat};base64,${base64}`;
    dominantColor = color.hex;
  } catch (error) {
    console.warn('Failed to generate blur placeholder:', error);
  }

  return {
    buffer: optimizedBuffer,
    width: finalWidth,
    height: finalHeight,
    format: finalFormat,
    size: optimizedBuffer.length,
    blurDataURL,
    dominantColor,
  };
}

/**
 * 이미지 파일에서 최적화된 이미지 생성
 */
export async function optimizeImageFromFile(
  filePath: string,
  options?: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
  }
): Promise<OptimizedImageResult> {
  const buffer = await readFile(filePath);
  return optimizeImage(buffer, options);
}

