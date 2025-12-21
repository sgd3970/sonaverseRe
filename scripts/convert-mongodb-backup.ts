/**
 * MongoDB 백업 파일 변환 스크립트
 * 
 * 기존 백업 데이터를 현재 데이터베이스 스키마에 맞게 변환하고,
 * en이 없는 경우 ko를 fallback으로 사용하도록 처리합니다.
 */

import * as fs from 'fs';
import * as path from 'path';

// Helper: en이 없으면 ko를 반환
function getWithFallback<T>(obj: { ko: T; en?: T } | undefined, fallback: T): { ko: T; en: T } {
  if (!obj) {
    return { ko: fallback, en: fallback };
  }
  return {
    ko: obj.ko,
    en: obj.en ?? obj.ko, // en이 없으면 ko 사용
  };
}

// Helper: 배열의 en이 없으면 ko를 반환
function getArrayWithFallback(obj: { ko: string[]; en?: string[] } | undefined): { ko: string[]; en: string[] } {
  if (!obj) {
    return { ko: [], en: [] };
  }
  return {
    ko: obj.ko || [],
    en: obj.en ?? obj.ko ?? [], // en이 없으면 ko 사용
  };
}

// Helper: 날짜 문자열을 Date 객체로 변환
function parseDate(dateStr: string | Date): Date {
  if (dateStr instanceof Date) {
    return dateStr;
  }
  // "2024-01-31 00:00:00" 형식 처리
  if (typeof dateStr === 'string') {
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }
  return new Date();
}

// 1. AdminUser 변환
function convertAdminUsers(data: any[]) {
  return data.map((item) => {
    const adminId = item._id || '689b5340bfb04216ae60c8b6';
    
    return {
      _id: item._id,
      email: item.email,
      password_hash: item.password_hash,
      name: item.name || item.username || 'Admin', // username이 있으면 name으로 사용
      role: item.role || 'admin',
      permissions: item.permissions || {
        press_releases: ['create', 'read', 'update', 'delete'],
        stories: ['create', 'read', 'update', 'delete'],
        products: ['create', 'read', 'update', 'delete'],
        inquiries: ['read', 'update', 'delete'],
        analytics: ['read'],
        settings: ['read', 'update'],
        users: ['create', 'read', 'update', 'delete'],
      },
      is_active: item.is_active !== false,
      is_email_verified: item.is_email_verified ?? true,
      email_verified_at: item.email_verified_at ? parseDate(item.email_verified_at) : parseDate(item.created_at),
      two_factor_enabled: item.two_factor_enabled ?? false,
      failed_login_attempts: item.failed_login_attempts ?? 0,
      last_login_at: item.last_login_at ? parseDate(item.last_login_at) : undefined,
      created_at: parseDate(item.created_at),
      updated_at: parseDate(item.last_updated || item.updated_at || item.created_at),
      updated_by: item.updated_by,
    };
  });
}

// 2. Press 변환
function convertPress(data: any[]) {
  return data.map((item, index) => {
    const adminId = '689b5340bfb04216ae60c8b6';
    
    // content 구조 변환: content.ko.title -> title.ko
    const contentKo = item.content?.ko || {};
    const contentEn = item.content?.en || {};
    
    // press_name fallback 처리
    const pressName = getWithFallback(item.press_name, '');
    
    // title 추출 (content에서 또는 별도 필드)
    const titleKo = contentKo.title || item.title?.ko || '';
    const titleEn = contentEn.title || item.title?.en || titleKo;
    
    // excerpt/subtitle 추출
    const excerptKo = contentKo.subtitle || item.excerpt?.ko || '';
    const excerptEn = contentEn.subtitle || item.excerpt?.en || excerptKo;
    
    // body 추출
    const bodyKo = contentKo.body || '';
    const bodyEn = contentEn.body || bodyKo;
    
    // tags 변환 (일단 빈 배열로, 나중에 수동으로 Tag 컬렉션에 연결)
    // tags는 현재 ObjectId 배열이므로 빈 배열로 설정
    const tags: any[] = [];
    
    // published_date 변환
    const publishedDate = parseDate(item.created_at || item.published_date || new Date());
    
    // press_id 생성 (slug 기반 또는 자동 생성)
    const pressId = item.press_id || `PR-${publishedDate.getFullYear()}-${String(index + 1).padStart(3, '0')}`;
    
    return {
      _id: item._id,
      slug: item.slug,
      press_id: pressId,
      title: {
        ko: titleKo,
        en: titleEn,
      },
      press_name: pressName,
      excerpt: {
        ko: excerptKo || undefined,
        en: excerptEn || undefined,
      },
      content: {
        ko: bodyKo,
        en: bodyEn || undefined, // en이 없으면 undefined (API에서 ko를 fallback으로 사용)
      },
      thumbnail_image_id: null, // 나중에 Image 컬렉션과 연결 필요
      featured_image_id: null,
      gallery_image_ids: [],
      external_url: item.external_link || undefined,
      tags: tags,
      published_date: publishedDate,
      is_published: item.is_published !== false,
      is_featured: item.is_featured ?? false,
      featured_order: item.featured_order,
      published_at: item.is_published ? publishedDate : undefined,
      view_count: item.view_count ?? 0,
      like_count: item.like_count ?? 0,
      share_count: item.share_count ?? 0,
      version: 1,
      is_latest_version: true,
      created_at: parseDate(item.created_at),
      updated_at: parseDate(item.last_updated || item.updated_at || item.created_at),
      created_by: item.created_by || adminId,
      updated_by: item.updated_by || adminId,
    };
  });
}

// 3. SonaverseStory 변환
function convertStories(data: any[]) {
  return data.map((item, index) => {
    const adminId = '689b5340bfb04216ae60c8b6';
    
    // content 구조 분석 (기존: content.title, content.subtitle, content.body 또는 content.ko, content.en)
    const contentData = item.content || {};
    
    // content가 객체이고 title이 있는 경우 (기존 형식)
    let titleKo = '';
    let subtitleKo = '';
    let bodyKo = '';
    
    if (contentData.title) {
      // 기존 형식: content.title, content.subtitle, content.body
      titleKo = contentData.title || '';
      subtitleKo = contentData.subtitle || '';
      bodyKo = contentData.body || '';
    } else if (contentData.ko) {
      // content.ko 형식
      const koContent = contentData.ko;
      titleKo = koContent.title || '';
      subtitleKo = koContent.subtitle || '';
      bodyKo = koContent.body || (typeof koContent === 'string' ? koContent : '');
    } else {
      // 문자열인 경우
      bodyKo = typeof contentData === 'string' ? contentData : '';
    }
    
    // title 처리 (fallback: ko 사용)
    titleKo = titleKo || item.title?.ko || '';
    const titleEn = item.title?.en || contentData.en?.title || titleKo;
    
    // subtitle 처리 (fallback: ko 사용)
    subtitleKo = subtitleKo || item.subtitle?.ko || '';
    const subtitleEn = item.subtitle?.en || contentData.en?.subtitle || subtitleKo;
    
    // body 처리 (fallback: ko 사용)
    const bodyEn = contentData.en?.body || bodyKo;
    
    // category 변환 (문자열 -> enum 값)
    const categoryMap: Record<string, string> = {
      '제품스토리': 'product_story',
      '사용법': 'usage',
      '건강정보': 'health_info',
      '복지정보': 'welfare_info',
      '회사소식': 'company_news',
      '인터뷰': 'interview',
    };
    const category = categoryMap[item.category] || 'product_story';
    
    // published_date 변환
    const publishedDate = parseDate(item.created_at || item.published_date || new Date());
    
    // story_id 생성
    const storyId = item.story_id || `STORY-${publishedDate.getFullYear()}-${String(index + 1).padStart(3, '0')}`;
    
    // tags는 일단 빈 배열로 (나중에 Tag 컬렉션과 연결)
    const tags: any[] = [];
    
    // images 배열 처리 (일단 빈 배열로, 나중에 Image 컬렉션과 연결)
    const galleryImageIds: any[] = [];
    
    return {
      _id: item._id,
      slug: item.slug,
      story_id: storyId,
      category: category,
      title: {
        ko: titleKo,
        en: titleEn || undefined,
      },
      subtitle: subtitleKo ? {
        ko: subtitleKo,
        en: subtitleEn || undefined,
      } : undefined,
      excerpt: item.excerpt?.ko ? {
        ko: item.excerpt.ko,
        en: item.excerpt?.en || item.excerpt?.ko || undefined,
      } : undefined,
      content: {
        ko: {
          body: bodyKo,
          blocks: contentData.ko?.blocks || contentData.blocks || [],
        },
        en: bodyEn ? {
          body: bodyEn,
          blocks: contentData.en?.blocks || [],
        } : undefined, // en이 없으면 undefined (API에서 ko를 fallback으로 사용)
      },
      thumbnail_image_id: null, // 나중에 Image 컬렉션과 연결 필요
      featured_image_id: null,
      gallery_image_ids: galleryImageIds,
      youtube_url: item.youtube_url || undefined,
      youtube_video_id: item.youtube_video_id || undefined,
      youtube_thumbnail_url: item.youtube_thumbnail_url || undefined,
      video_ids: [],
      related_product_ids: item.related_product_ids || [],
      related_story_ids: item.related_story_ids || [],
      tags: tags,
      is_main_story: item.is_main ?? false,
      main_story_order: item.main_story_order,
      published_date: publishedDate,
      is_published: item.is_published !== false,
      is_featured: item.is_featured ?? false,
      featured_order: item.featured_order,
      display_priority: item.display_priority ?? 0,
      published_at: item.is_published ? publishedDate : undefined,
      author_name: item.author_name,
      author_id: item.author || adminId,
      view_count: item.view_count ?? 0,
      like_count: item.like_count ?? 0,
      share_count: item.share_count ?? 0,
      version: 1,
      is_latest_version: true,
      created_at: parseDate(item.created_at || item.createdAt),
      updated_at: parseDate(item.updated_at || item.updatedAt || item.last_updated || item.created_at || item.createdAt),
      created_by: item.author || adminId,
      updated_by: item.updated_by || adminId,
    };
  });
}

// 메인 실행 함수
async function main() {
  const backupDir = path.join(process.cwd(), 'mongodb_backup');
  
  // 1. AdminUser 변환
  console.log('Converting adminusers.json...');
  const adminUsersData = JSON.parse(
    fs.readFileSync(path.join(backupDir, 'adminusers.json'), 'utf-8')
  );
  const convertedAdminUsers = convertAdminUsers(adminUsersData);
  console.log(`✓ Converted ${convertedAdminUsers.length} admin users`);
  
  // 2. Press 변환
  console.log('Converting press.json...');
  const pressData = JSON.parse(
    fs.readFileSync(path.join(backupDir, 'press.json'), 'utf-8')
  );
  const convertedPress = convertPress(pressData);
  console.log(`✓ Converted ${convertedPress.length} press releases`);
  
  // 3. Stories 변환
  console.log('Converting sonaversestories.json...');
  const storiesData = JSON.parse(
    fs.readFileSync(path.join(backupDir, 'sonaversestories.json'), 'utf-8')
  );
  const convertedStories = convertStories(storiesData);
  console.log(`✓ Converted ${convertedStories.length} stories`);
  
  // 원본 파일 백업 및 새 파일로 저장
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  
  // AdminUser 백업 및 저장
  if (fs.existsSync(path.join(backupDir, 'adminusers.json'))) {
    fs.copyFileSync(
      path.join(backupDir, 'adminusers.json'),
      path.join(backupDir, `adminusers_backup_${timestamp}.json`)
    );
  }
  fs.writeFileSync(
    path.join(backupDir, 'adminusers.json'),
    JSON.stringify(convertedAdminUsers, null, 2),
    'utf-8'
  );
  
  // Press 백업 및 저장
  if (fs.existsSync(path.join(backupDir, 'press.json'))) {
    fs.copyFileSync(
      path.join(backupDir, 'press.json'),
      path.join(backupDir, `press_backup_${timestamp}.json`)
    );
  }
  fs.writeFileSync(
    path.join(backupDir, 'press.json'),
    JSON.stringify(convertedPress, null, 2),
    'utf-8'
  );
  
  // Stories 백업 및 저장
  if (fs.existsSync(path.join(backupDir, 'sonaversestories.json'))) {
    fs.copyFileSync(
      path.join(backupDir, 'sonaversestories.json'),
      path.join(backupDir, `sonaversestories_backup_${timestamp}.json`)
    );
  }
  fs.writeFileSync(
    path.join(backupDir, 'sonaversestories.json'),
    JSON.stringify(convertedStories, null, 2),
    'utf-8'
  );
  
  console.log('\n✅ All conversions completed!');
  console.log('\nConverted files (original files updated):');
  console.log('  - mongodb_backup/adminusers.json');
  console.log('  - mongodb_backup/press.json');
  console.log('  - mongodb_backup/sonaversestories.json');
  console.log('\n⚠️  Note: Image IDs and Tag IDs need to be manually linked after importing.');
  console.log('⚠️  Original files backed up with timestamp suffix.');
}

main().catch(console.error);

