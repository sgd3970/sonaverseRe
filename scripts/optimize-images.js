/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImage(inputPath, outputPath, quality = 85) {
  try {
    const info = await sharp(inputPath)
      .png({ quality, compressionLevel: 9 })
      .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const newSize = info.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);

    console.log(`✅ ${path.basename(inputPath)}`);
    console.log(`   원본: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   압축: ${(newSize / 1024).toFixed(2)} KB`);
    console.log(`   감소: ${reduction}%\n`);
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message);
  }
}

async function main() {
  const logoDir = path.join(__dirname, '../public/logo');

  console.log('🖼️  이미지 최적화 시작...\n');

  // en_logo.png 최적화 (1.49 MB → 목표: 50KB 이하)
  await optimizeImage(
    path.join(logoDir, 'en_logo.png'),
    path.join(logoDir, 'en_logo_optimized.png'),
    80
  );

  // ko_logo.png 최적화
  await optimizeImage(
    path.join(logoDir, 'ko_logo.png'),
    path.join(logoDir, 'ko_logo_optimized.png'),
    85
  );

  // symbol_logo.png 최적화
  await optimizeImage(
    path.join(logoDir, 'symbol_logo.png'),
    path.join(logoDir, 'symbol_logo_optimized.png'),
    85
  );

  console.log('✨ 최적화 완료!');
  console.log('\n📝 다음 단계:');
  console.log('1. 최적화된 이미지 확인');
  console.log('2. 원본 파일 백업');
  console.log('3. _optimized 파일을 원본 파일명으로 변경');
}

main();
