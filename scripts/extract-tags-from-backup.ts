/**
 * 백업 파일에서 태그 정보를 추출하여 Tag 컬렉션용 JSON 파일 생성
 */

import * as fs from 'fs';
import * as path from 'path';

// Helper: 문자열을 slug로 변환 (한글 포함)
function toSlug(str: string): string {
  let slug = str
    .trim()
    .replace(/#/g, '') // # 제거
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-'); // 연속된 하이픈 제거
  
  // 한글과 영문/숫자만 허용, 특수문자는 제거하되 하이픈은 유지
  slug = slug.replace(/[^\w\u3131-\u318E\uAC00-\uD7A3-]/g, '');
  
  // 앞뒤 하이픈 제거
  slug = slug.replace(/^-+|-+$/g, '');
  
  // 빈 문자열이면 fallback
  if (!slug) {
    // 한글을 인코딩해서 사용
    slug = encodeURIComponent(str.trim().replace(/#/g, ''));
  }
  
  return slug;
}

// Helper: 태그 이름에서 # 제거 및 정리
function cleanTagName(tag: string): string {
  return tag.replace(/^#+/, '').trim();
}

async function extractTags() {
  const backupDir = path.join(process.cwd(), 'mongodb_backup');
  
  // 백업 파일에서 읽기
  const pressBackup = JSON.parse(
    fs.readFileSync(path.join(backupDir, 'press_backup_2025-12-21T07-33-11.json'), 'utf-8')
  );
  
  const storiesBackup = JSON.parse(
    fs.readFileSync(path.join(backupDir, 'sonaversestories_backup_2025-12-21T07-33-11.json'), 'utf-8')
  );
  
  const tagMap = new Map<string, {
    name: { ko: string; en?: string };
    slug: string;
    type: 'press' | 'story' | 'product' | 'general';
    usage_count: number;
    press_ids: string[];
    story_ids: string[];
  }>();
  
  const adminId = '689b5340bfb04216ae60c8b6';
  
  // Press 태그 추출
  pressBackup.forEach((item: any) => {
    if (item.tags && item.tags.ko) {
      const koTags = item.tags.ko || [];
      const enTags = item.tags.en || [];
      
      koTags.forEach((tagKo: string, index: number) => {
        const tagEn = enTags[index] || tagKo;
        const cleanedKo = cleanTagName(tagKo);
        const cleanedEn = cleanTagName(tagEn);
        const slug = toSlug(cleanedKo);
        
        if (!tagMap.has(slug)) {
          tagMap.set(slug, {
            name: { ko: cleanedKo, en: cleanedEn !== cleanedKo ? cleanedEn : undefined },
            slug: slug,
            type: 'press',
            usage_count: 0,
            press_ids: [],
            story_ids: [],
          });
        }
        
        const tag = tagMap.get(slug)!;
        tag.usage_count++;
        if (!tag.press_ids.includes(item._id)) {
          tag.press_ids.push(item._id);
        }
      });
    }
  });
  
  // Stories 태그 추출
  storiesBackup.forEach((item: any) => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tagStr: string) => {
        const cleaned = cleanTagName(tagStr);
        const slug = toSlug(cleaned);
        
        if (!tagMap.has(slug)) {
          tagMap.set(slug, {
            name: { ko: cleaned, en: undefined },
            slug: slug,
            type: 'story',
            usage_count: 0,
            press_ids: [],
            story_ids: [],
          });
        }
        
        const tag = tagMap.get(slug)!;
        tag.usage_count++;
        if (!tag.story_ids.includes(item._id)) {
          tag.story_ids.push(item._id);
        }
        
        // 이미 press 태그가 있으면 type을 general로 변경
        if (tag.type === 'press' && tag.story_ids.length > 0) {
          tag.type = 'general';
        }
      });
    }
  });
  
  // Tag 문서 형태로 변환
  const tags = Array.from(tagMap.values()).map((tag, index) => ({
    _id: `tag_${index + 1}_${Date.now()}`, // 임시 ID, 실제로는 MongoDB가 생성
    name: tag.name,
    slug: tag.slug,
    type: tag.type,
    usage_count: tag.usage_count,
    is_active: true,
    created_at: new Date().toISOString(),
    created_by: adminId,
    // 참조용 (나중에 삭제 가능)
    _press_ids: tag.press_ids,
    _story_ids: tag.story_ids,
  }));
  
  // 파일 저장
  fs.writeFileSync(
    path.join(backupDir, 'tags_extracted.json'),
    JSON.stringify(tags, null, 2),
    'utf-8'
  );
  
  // Press/Story ID와 Tag slug 매핑 파일도 생성 (나중에 연결용)
  const pressTagMapping: Record<string, string[]> = {};
  pressBackup.forEach((item: any) => {
    if (item.tags && item.tags.ko) {
      const koTags = item.tags.ko || [];
      pressTagMapping[item._id] = koTags.map((tag: string) => toSlug(cleanTagName(tag)));
    }
  });
  
  const storyTagMapping: Record<string, string[]> = {};
  storiesBackup.forEach((item: any) => {
    if (item.tags && Array.isArray(item.tags)) {
      storyTagMapping[item._id] = item.tags.map((tag: string) => toSlug(cleanTagName(tag)));
    }
  });
  
  fs.writeFileSync(
    path.join(backupDir, 'tags_mapping.json'),
    JSON.stringify({
      press: pressTagMapping,
      stories: storyTagMapping,
    }, null, 2),
    'utf-8'
  );
  
  console.log(`✅ Extracted ${tags.length} unique tags`);
  console.log(`   - Press tags: ${tags.filter(t => t.type === 'press').length}`);
  console.log(`   - Story tags: ${tags.filter(t => t.type === 'story').length}`);
  console.log(`   - General tags: ${tags.filter(t => t.type === 'general').length}`);
  console.log('\n📁 Generated files:');
  console.log('   - mongodb_backup/tags_extracted.json (Tag 컬렉션용)');
  console.log('   - mongodb_backup/tags_mapping.json (ID 매핑 정보)');
}

extractTags().catch(console.error);

