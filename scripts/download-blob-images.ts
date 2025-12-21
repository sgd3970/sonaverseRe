/**
 * Vercel Blob Storage에서 이미지 파일들을 다운로드하는 스크립트
 * 
 * 사용법:
 * 1. 백업 파일에서 이미지 URL 목록을 추출
 * 2. 각 URL에서 파일을 다운로드
 * 3. 로컬 디렉토리에 저장
 */

import * as fs from 'fs';
import * as path from 'path';
import https from 'https';
import http from 'http';

// Helper: URL에서 파일 다운로드
async function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // 리다이렉트 처리
        if (response.headers.location) {
          return downloadFile(response.headers.location, filepath)
            .then(resolve)
            .catch(reject);
        }
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Helper: URL에서 이미지 URL 추출
function extractImageUrls(content: string): string[] {
  const urls: string[] = [];
  
  // img src 태그에서 URL 추출
  const imgSrcRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgSrcRegex.exec(content)) !== null) {
    const url = match[1];
    if (url.includes('blob.vercel-storage.com')) {
      urls.push(url);
    }
  }
  
  // background-image 스타일에서 URL 추출
  const bgImageRegex = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
  while ((match = bgImageRegex.exec(content)) !== null) {
    const url = match[1];
    if (url.includes('blob.vercel-storage.com')) {
      urls.push(url);
    }
  }
  
  return [...new Set(urls)]; // 중복 제거
}

// Helper: URL에서 파일명 추출
function extractFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = path.basename(pathname.split('?')[0]); // 쿼리 파라미터 제거
    return filename || `image_${Date.now()}.jpg`;
  } catch {
    // URL 파싱 실패 시 기본 파일명
    const match = url.match(/\/([^\/?]+\.(jpg|jpeg|png|gif|webp|svg|avif))/i);
    return match ? match[1] : `image_${Date.now()}.jpg`;
  }
}

async function downloadImagesFromBackup() {
  const backupDir = path.join(process.cwd(), 'mongodb_backup');
  const downloadDir = path.join(process.cwd(), 'mongodb_backup', 'downloaded_images');
  
  // 다운로드 디렉토리 생성
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
  
  const imageUrls = new Set<string>();
  const imageMetadata: Array<{ url: string; source: string; slug?: string }> = [];
  
  // 원본 백업 파일 사용 (이미지 URL이 있는 파일)
  const pressBackupFile = path.join(backupDir, 'press_backup_2025-12-21T07-33-11.json');
  const storiesBackupFile = path.join(backupDir, 'sonaversestories_backup_2025-12-21T07-33-11.json');
  
  // Press 파일에서 이미지 URL 추출
  if (fs.existsSync(pressBackupFile)) {
    console.log('Extracting image URLs from press backup file...');
    const pressData = JSON.parse(
      fs.readFileSync(pressBackupFile, 'utf-8')
    );
    
    pressData.forEach((item: any) => {
      // thumbnail URL
      if (item.thumbnail && item.thumbnail.includes('blob.vercel-storage.com')) {
        imageUrls.add(item.thumbnail);
        imageMetadata.push({ url: item.thumbnail, source: 'press', slug: item.slug });
      }
      
      // content에서 이미지 URL 추출
      if (item.content?.ko) {
        const contentKo = item.content.ko;
        if (typeof contentKo === 'string') {
          const urls = extractImageUrls(contentKo);
          urls.forEach(url => {
            imageUrls.add(url);
            imageMetadata.push({ url, source: 'press', slug: item.slug });
          });
        } else if (contentKo.body) {
          const urls = extractImageUrls(contentKo.body);
          urls.forEach(url => {
            imageUrls.add(url);
            imageMetadata.push({ url, source: 'press', slug: item.slug });
          });
        }
        if (contentKo.thumbnail_url && contentKo.thumbnail_url.includes('blob.vercel-storage.com')) {
          imageUrls.add(contentKo.thumbnail_url);
          imageMetadata.push({ url: contentKo.thumbnail_url, source: 'press', slug: item.slug });
        }
      }
      
      if (item.content?.en) {
        const contentEn = item.content.en;
        if (typeof contentEn === 'string') {
          const urls = extractImageUrls(contentEn);
          urls.forEach(url => {
            imageUrls.add(url);
            imageMetadata.push({ url, source: 'press', slug: item.slug });
          });
        } else if (contentEn.body) {
          const urls = extractImageUrls(contentEn.body);
          urls.forEach(url => {
            imageUrls.add(url);
            imageMetadata.push({ url, source: 'press', slug: item.slug });
          });
        }
        if (contentEn.thumbnail_url && contentEn.thumbnail_url.includes('blob.vercel-storage.com')) {
          imageUrls.add(contentEn.thumbnail_url);
          imageMetadata.push({ url: contentEn.thumbnail_url, source: 'press', slug: item.slug });
        }
      }
    });
  }
  
  // Stories 파일에서 이미지 URL 추출
  if (fs.existsSync(storiesBackupFile)) {
    console.log('Extracting image URLs from stories backup file...');
    const storiesData = JSON.parse(
      fs.readFileSync(storiesBackupFile, 'utf-8')
    );
  
  storiesData.forEach((item: any) => {
    // thumbnail_url
    if (item.thumbnail_url && item.thumbnail_url.includes('blob.vercel-storage.com')) {
      imageUrls.add(item.thumbnail_url);
      imageMetadata.push({ url: item.thumbnail_url, source: 'story', slug: item.slug });
    }
    
    // content 구조 파악 (기존: content.title, content.body, content.images 또는 content.ko, content.en)
    const contentData = item.content || {};
    
    // content.body에서 이미지 URL 추출 (기존 형식)
    if (contentData.body) {
      const urls = extractImageUrls(contentData.body);
      urls.forEach(url => {
        if (url.includes('sonaverseStory')) {
          imageUrls.add(url);
          imageMetadata.push({ url, source: 'story', slug: item.slug });
        }
      });
    }
    
    // content.ko.body에서 이미지 URL 추출 (새 형식)
    if (contentData.ko?.body) {
      const urls = extractImageUrls(contentData.ko.body);
      urls.forEach(url => {
        if (url.includes('sonaverseStory')) {
          imageUrls.add(url);
          imageMetadata.push({ url, source: 'story', slug: item.slug });
        }
      });
    }
    
    // content.en.body에서 이미지 URL 추출
    if (contentData.en?.body) {
      const urls = extractImageUrls(contentData.en.body);
      urls.forEach(url => {
        if (url.includes('sonaverseStory')) {
          imageUrls.add(url);
          imageMetadata.push({ url, source: 'story', slug: item.slug });
        }
      });
    }
    
    // images 배열 (기존 형식: content.images)
    if (contentData.images && Array.isArray(contentData.images)) {
      contentData.images.forEach((img: any) => {
        if (img.src && img.src.includes('blob.vercel-storage.com') && img.src.includes('sonaverseStory')) {
          imageUrls.add(img.src);
          imageMetadata.push({ url: img.src, source: 'story', slug: item.slug });
        }
      });
    }
    
    // images 배열 (새 형식: content.ko.images)
    if (contentData.ko?.images && Array.isArray(contentData.ko.images)) {
      contentData.ko.images.forEach((img: any) => {
        if (img.src && img.src.includes('blob.vercel-storage.com') && img.src.includes('sonaverseStory')) {
          imageUrls.add(img.src);
          imageMetadata.push({ url: img.src, source: 'story', slug: item.slug });
        }
      });
    }
    
    // content.thumbnail_url
    if (contentData.thumbnail_url && contentData.thumbnail_url.includes('blob.vercel-storage.com') && contentData.thumbnail_url.includes('sonaverseStory')) {
      imageUrls.add(contentData.thumbnail_url);
      imageMetadata.push({ url: contentData.thumbnail_url, source: 'story', slug: item.slug });
    }
  });
  }
  
  console.log(`Found ${imageUrls.size} unique image URLs`);
  
  // 이미지 메타데이터 저장
  fs.writeFileSync(
    path.join(backupDir, 'image_urls.json'),
    JSON.stringify(Array.from(imageUrls).map(url => {
      const meta = imageMetadata.find(m => m.url === url);
      return {
        url,
        source: meta?.source,
        slug: meta?.slug,
      };
    }), null, 2),
    'utf-8'
  );
  
  // 이미지 다운로드
  console.log('\nDownloading images...');
  const urlsArray = Array.from(imageUrls);
  let successCount = 0;
  let failCount = 0;
  const failedUrls: string[] = [];
  
  for (let i = 0; i < urlsArray.length; i++) {
    const url = urlsArray[i];
    const filename = extractFilename(url);
    const filepath = path.join(downloadDir, filename);
    
    // 이미 다운로드된 파일은 스킵
    if (fs.existsSync(filepath)) {
      console.log(`[${i + 1}/${urlsArray.length}] Skipped (exists): ${filename}`);
      successCount++;
      continue;
    }
    
    try {
      await downloadFile(url, filepath);
      console.log(`[${i + 1}/${urlsArray.length}] Downloaded: ${filename}`);
      successCount++;
      
      // 요청 간 딜레이 (서버 부하 방지)
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`[${i + 1}/${urlsArray.length}] Failed: ${filename} - ${error}`);
      failCount++;
      failedUrls.push(url);
    }
  }
  
  // 실패한 URL 목록 저장
  if (failedUrls.length > 0) {
    fs.writeFileSync(
      path.join(backupDir, 'failed_image_urls.json'),
      JSON.stringify(failedUrls, null, 2),
      'utf-8'
    );
  }
  
  console.log('\n✅ Download completed!');
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Total: ${urlsArray.length}`);
  console.log(`\n📁 Downloaded images: ${downloadDir}`);
  if (failedUrls.length > 0) {
    console.log(`⚠️  Failed URLs saved to: mongodb_backup/failed_image_urls.json`);
  }
}

downloadImagesFromBackup().catch(console.error);

