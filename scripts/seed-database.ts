/**
 * MongoDB 데이터베이스 시드 스크립트
 *
 * 모든 컬렉션에 테스트 데이터를 삽입합니다.
 * 릴레이션을 고려하여 순차적으로 데이터를 생성합니다.
 *
 * 실행 방법:
 * npx tsx scripts/seed-database.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB 연결
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sonaverse-admin:sqtB1kkDjONgEJeR@sonaverse.zc4opeo.mongodb.net/sonaverseRe?retryWrites=true&w=majority&appName=sonaverse';

// 스키마 정의 (간소화 버전)
const AdminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: String,
  role: { type: String, enum: ['super_admin', 'admin', 'editor', 'viewer'], default: 'admin' },
  is_active: { type: Boolean, default: true },
  is_email_verified: { type: Boolean, default: true },
  two_factor_enabled: { type: Boolean, default: false },
  failed_login_attempts: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const CategorySchema = new mongoose.Schema({
  name: {
    ko: String,
    en: String,
  },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['press', 'story', 'product', 'faq'], required: true },
  order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  is_visible_in_menu: { type: Boolean, default: true },
  item_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const TagSchema = new mongoose.Schema({
  name: {
    ko: String,
    en: String,
  },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ['press', 'story', 'product', 'general'], required: true },
  usage_count: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const ImageSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true },
  original_filename: String,
  storage_provider: { type: String, enum: ['local', 'vercel_blob', 's3', 'cloudinary'], default: 'local' },
  path: String,
  url: String,
  mime_type: String,
  size: Number,
  width: Number,
  height: Number,
  format: { type: String, enum: ['webp', 'avif', 'jpg', 'png', 'gif', 'svg'] },
  category: { type: String, enum: ['hero', 'product', 'story', 'press', 'profile', 'logo', 'icon', 'common'] },
  alt_text: {
    ko: String,
    en: String,
  },
  is_optimized: { type: Boolean, default: false },
  usage_count: { type: Number, default: 0 },
  is_public: { type: Boolean, default: true },
  requires_auth: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: mongoose.Schema.Types.ObjectId,
});

const PressReleaseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  press_id: { type: String, required: true, unique: true },
  title: {
    ko: String,
    en: String,
  },
  press_name: {
    ko: String,
    en: String,
  },
  excerpt: {
    ko: String,
    en: String,
  },
  content: {
    ko: String,
    en: String,
  },
  thumbnail_image_id: mongoose.Schema.Types.ObjectId,
  external_url: String,
  category_id: mongoose.Schema.Types.ObjectId,
  tags: [mongoose.Schema.Types.ObjectId],
  published_date: Date,
  is_published: { type: Boolean, default: true },
  is_featured: { type: Boolean, default: false },
  featured_order: Number,
  view_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: mongoose.Schema.Types.ObjectId,
});

const SonaverseStorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  story_id: { type: String, required: true, unique: true },
  category: { type: String, enum: ['product_story', 'usage', 'health_info', 'welfare_info', 'company_news', 'interview'] },
  title: {
    ko: String,
    en: String,
  },
  subtitle: {
    ko: String,
    en: String,
  },
  excerpt: {
    ko: String,
    en: String,
  },
  content: {
    ko: { body: String },
    en: { body: String },
  },
  thumbnail_image_id: mongoose.Schema.Types.ObjectId,
  youtube_url: String,
  youtube_video_id: String,
  related_product_ids: [mongoose.Schema.Types.ObjectId],
  tags: [mongoose.Schema.Types.ObjectId],
  is_main_story: { type: Boolean, default: false },
  is_published: { type: Boolean, default: true },
  is_featured: { type: Boolean, default: false },
  display_priority: { type: Number, default: 0 },
  published_date: { type: Date, required: true },
  published_at: Date,
  view_count: { type: Number, default: 0 },
  read_time_minutes: { type: Number, default: 5 },
  author_name: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: mongoose.Schema.Types.ObjectId,
});

const ProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  product_id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['manbo', 'bodeum', 'accessory', 'other'], required: true },
  name: {
    ko: String,
    en: String,
  },
  subtitle: {
    ko: String,
    en: String,
  },
  short_description: {
    ko: String,
    en: String,
  },
  description: {
    ko: String,
    en: String,
  },
  content: {
    ko: String,
    en: String,
  },
  hero_image_id: mongoose.Schema.Types.ObjectId,
  thumbnail_image_id: mongoose.Schema.Types.ObjectId,
  gallery_image_ids: [mongoose.Schema.Types.ObjectId],
  features: {
    ko: [String],
    en: [String],
  },
  specifications: [{
    key: String,
    value_ko: String,
    value_en: String,
    unit: String,
    order: Number,
  }],
  is_active: { type: Boolean, default: true },
  is_featured: { type: Boolean, default: false },
  display_order: { type: Number, default: 0 },
  view_count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: mongoose.Schema.Types.ObjectId,
});

const InquirySchema = new mongoose.Schema({
  inquiry_number: { type: String, required: true, unique: true },
  inquiry_type: {
    type: String,
    enum: ['service_introduction', 'product_inquiry', 'quote_request', 'demo_request', 'partnership_proposal', 'other'],
    required: true,
  },
  inquirer: {
    name: String,
    company_name: String,
    phone_number: String,
    email: String,
    language: { type: String, enum: ['ko', 'en'], default: 'ko' },
  },
  message: String,
  status: { type: String, enum: ['pending', 'in_progress', 'resolved', 'closed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  privacy_consented: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const CompanyHistorySchema = new mongoose.Schema({
  year: { type: Number, required: true },
  month: Number,
  event_type: {
    type: String,
    enum: ['founding', 'award', 'certification', 'product_launch', 'partnership', 'funding', 'milestone', 'other'],
    required: true,
  },
  title: {
    ko: String,
    en: String,
  },
  description: {
    ko: String,
    en: String,
  },
  order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  is_major_event: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// 모델 생성
const AdminUser = mongoose.model('AdminUser', AdminUserSchema);
const Category = mongoose.model('Category', CategorySchema);
const Tag = mongoose.model('Tag', TagSchema);
const Image = mongoose.model('Image', ImageSchema);
const PressRelease = mongoose.model('PressRelease', PressReleaseSchema);
const SonaverseStory = mongoose.model('SonaverseStory', SonaverseStorySchema);
const Product = mongoose.model('Product', ProductSchema);
const Inquiry = mongoose.model('Inquiry', InquirySchema);
const CompanyHistory = mongoose.model('CompanyHistory', CompanyHistorySchema);

// 시드 데이터 함수
async function seedDatabase() {
  try {
    console.log('🔌 MongoDB 연결 중...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 연결 성공!');

    // 기존 데이터 삭제
    console.log('\n🗑️  기존 데이터 삭제 중...');
    await AdminUser.deleteMany({});
    await Category.deleteMany({});
    await Tag.deleteMany({});
    await Image.deleteMany({});
    await PressRelease.deleteMany({});
    await SonaverseStory.deleteMany({});
    await Product.deleteMany({});
    await Inquiry.deleteMany({});
    await CompanyHistory.deleteMany({});
    console.log('✅ 기존 데이터 삭제 완료!');

    // 1. 관리자 계정 생성
    console.log('\n👤 관리자 계정 생성 중...');
    const adminPassword = await bcrypt.hash('admin123!', 10);
    const adminUser = await AdminUser.create({
      email: 'admin@sonaverse.kr',
      password_hash: adminPassword,
      name: '소나버스 관리자',
      role: 'super_admin',
      is_active: true,
      is_email_verified: true,
    });
    console.log(`✅ 관리자 생성: ${adminUser.email}`);

    // 2. 카테고리 생성
    console.log('\n📁 카테고리 생성 중...');
    const categories = await Category.insertMany([
      {
        name: { ko: '제품 스토리', en: 'Product Story' },
        slug: 'product-story',
        type: 'story',
        order: 1,
        is_active: true,
      },
      {
        name: { ko: '사용 후기', en: 'User Review' },
        slug: 'usage',
        type: 'story',
        order: 2,
        is_active: true,
      },
      {
        name: { ko: '건강 정보', en: 'Health Info' },
        slug: 'health-info',
        type: 'story',
        order: 3,
        is_active: true,
      },
      {
        name: { ko: '복지 정보', en: 'Welfare Info' },
        slug: 'welfare-info',
        type: 'story',
        order: 4,
        is_active: true,
      },
      {
        name: { ko: '일반 소식', en: 'General News' },
        slug: 'general-news',
        type: 'press',
        order: 1,
        is_active: true,
      },
    ]);
    console.log(`✅ ${categories.length}개 카테고리 생성 완료`);

    // 3. 태그 생성
    console.log('\n🏷️  태그 생성 중...');
    const tags = await Tag.insertMany([
      { name: { ko: '시니어', en: 'Senior' }, slug: 'senior', type: 'general', is_active: true },
      { name: { ko: '보행보조', en: 'Walking Aid' }, slug: 'walking-aid', type: 'product', is_active: true },
      { name: { ko: '스마트기기', en: 'Smart Device' }, slug: 'smart-device', type: 'product', is_active: true },
      { name: { ko: '기저귀', en: 'Diaper' }, slug: 'diaper', type: 'product', is_active: true },
      { name: { ko: '건강관리', en: 'Health Care' }, slug: 'health-care', type: 'story', is_active: true },
      { name: { ko: '낙상예방', en: 'Fall Prevention' }, slug: 'fall-prevention', type: 'story', is_active: true },
      { name: { ko: 'AI기술', en: 'AI Technology' }, slug: 'ai-tech', type: 'general', is_active: true },
      { name: { ko: '복지', en: 'Welfare' }, slug: 'welfare', type: 'story', is_active: true },
    ]);
    console.log(`✅ ${tags.length}개 태그 생성 완료`);

    // 4. 이미지 생성 (플레이스홀더)
    console.log('\n🖼️  이미지 생성 중...');
    const images = await Image.insertMany([
      {
        filename: 'hero-home-1920.webp',
        original_filename: 'hero-home.jpg',
        storage_provider: 'local',
        path: '/images/hero/hero-home-1920.webp',
        url: '/images/hero/hero-home-1920.webp',
        mime_type: 'image/webp',
        size: 245000,
        width: 1920,
        height: 1080,
        format: 'webp',
        category: 'hero',
        alt_text: { ko: '소나버스 홈페이지 히어로 이미지', en: 'Sonaverse Homepage Hero Image' },
        is_optimized: true,
        is_public: true,
        created_by: adminUser._id,
      },
      {
        filename: 'manbo-hero-1920.webp',
        original_filename: 'manbo-hero.jpg',
        storage_provider: 'local',
        path: '/images/products/manbo-hero-1920.webp',
        url: '/images/products/manbo-hero-1920.webp',
        mime_type: 'image/webp',
        size: 180000,
        width: 1920,
        height: 1080,
        format: 'webp',
        category: 'product',
        alt_text: { ko: '만보 워크메이트 메인 이미지', en: 'Manbo Walker Main Image' },
        is_optimized: true,
        is_public: true,
        created_by: adminUser._id,
      },
      {
        filename: 'bodeum-hero-1920.webp',
        original_filename: 'bodeum-hero.jpg',
        storage_provider: 'local',
        path: '/images/products/bodeum-hero-1920.webp',
        url: '/images/products/bodeum-hero-1920.webp',
        mime_type: 'image/webp',
        size: 165000,
        width: 1920,
        height: 1080,
        format: 'webp',
        category: 'product',
        alt_text: { ko: '보듬 기저귀 메인 이미지', en: 'Bodeum Diaper Main Image' },
        is_optimized: true,
        is_public: true,
        created_by: adminUser._id,
      },
      {
        filename: 'story-thumb-1.webp',
        original_filename: 'story-1.jpg',
        storage_provider: 'local',
        path: '/images/stories/story-thumb-1.webp',
        url: '/images/stories/story-thumb-1.webp',
        mime_type: 'image/webp',
        size: 85000,
        width: 800,
        height: 600,
        format: 'webp',
        category: 'story',
        alt_text: { ko: '스토리 썸네일', en: 'Story Thumbnail' },
        is_optimized: true,
        is_public: true,
        created_by: adminUser._id,
      },
      {
        filename: 'press-thumb-1.webp',
        original_filename: 'press-1.jpg',
        storage_provider: 'local',
        path: '/images/press/press-thumb-1.webp',
        url: '/images/press/press-thumb-1.webp',
        mime_type: 'image/webp',
        size: 92000,
        width: 800,
        height: 600,
        format: 'webp',
        category: 'press',
        alt_text: { ko: '언론보도 썸네일', en: 'Press Thumbnail' },
        is_optimized: true,
        is_public: true,
        created_by: adminUser._id,
      },
    ]);
    console.log(`✅ ${images.length}개 이미지 생성 완료`);

    // 5. 제품 생성
    console.log('\n📦 제품 생성 중...');
    const products = await Product.insertMany([
      {
        slug: 'manbo-walker',
        product_id: 'PROD-MANBO-001',
        type: 'manbo',
        name: { ko: '만보 (MANBO)', en: 'MANBO Walker' },
        subtitle: { ko: '하이브리드형 스마트 워크메이트', en: 'Hybrid Smart Walkmate' },
        short_description: {
          ko: '시니어의 안전한 보행과 자립적인 생활을 돕는 스마트 보행 보조 로봇',
          en: 'Smart walking assistance robot for safe mobility and independent living',
        },
        description: {
          ko: '만보는 시니어의 일상적인 보행을 안전하게 지원하며, AI 기술을 통해 낙상을 예방하고 스마트한 이동 경험을 제공합니다.',
          en: 'MANBO safely supports seniors\' daily walking, prevents falls through AI technology, and provides a smart mobility experience.',
        },
        content: {
          ko: '<p>만보 워크메이트는 하이브리드형 주행 시스템을 탑재하여 실내외 다양한 환경에서 안전한 보행을 지원합니다.</p><p>경사지 자동 제어, 비상 자동 정지 등 첨단 안전 기능이 내장되어 있습니다.</p>',
          en: '<p>MANBO Walkmate features a hybrid driving system for safe walking in various indoor and outdoor environments.</p><p>Advanced safety features include automatic slope control and emergency stop.</p>',
        },
        hero_image_id: images[1]._id,
        thumbnail_image_id: images[1]._id,
        features: {
          ko: ['하이브리드 주행', '경사지 자동 제어', '비상 자동 정지', 'AI 낙상 예방'],
          en: ['Hybrid Driving', 'Auto Slope Control', 'Emergency Stop', 'AI Fall Prevention'],
        },
        specifications: [
          { key: 'weight', value_ko: '15', value_en: '15', unit: 'kg', order: 1 },
          { key: 'max_load', value_ko: '120', value_en: '120', unit: 'kg', order: 2 },
          { key: 'battery_life', value_ko: '8', value_en: '8', unit: 'hours', order: 3 },
          { key: 'max_speed', value_ko: '6', value_en: '6', unit: 'km/h', order: 4 },
        ],
        is_active: true,
        is_featured: true,
        display_order: 1,
        view_count: 1234,
        created_by: adminUser._id,
      },
      {
        slug: 'bodeum-diaper',
        product_id: 'PROD-BODEUM-001',
        type: 'bodeum',
        name: { ko: '보듬 기저귀', en: 'Bodeum Diaper' },
        subtitle: { ko: '프리미엄 성인용 기저귀', en: 'Premium Adult Diaper' },
        short_description: {
          ko: '피부 자극을 최소화하고 흡수력을 극대화한 프리미엄 성인용 기저귀',
          en: 'Premium adult diaper with minimized skin irritation and maximized absorbency',
        },
        description: {
          ko: '보듬 기저귀는 시니어의 편안함과 존엄성을 최우선으로 고려하여 설계된 프리미엄 제품입니다.',
          en: 'Bodeum Diaper is a premium product designed with seniors\' comfort and dignity as top priorities.',
        },
        content: {
          ko: '<p>3D 입체 재단으로 착용감이 우수하며, 고흡수성 소재로 장시간 사용이 가능합니다.</p><p>피부 자극을 최소화한 천연 소재를 사용합니다.</p>',
          en: '<p>Excellent fit with 3D tailoring and long-lasting use with highly absorbent materials.</p><p>Uses natural materials to minimize skin irritation.</p>',
        },
        hero_image_id: images[2]._id,
        thumbnail_image_id: images[2]._id,
        features: {
          ko: ['3D 입체 재단', '고흡수성 소재', '천연 소재', '냄새 차단'],
          en: ['3D Tailoring', 'High Absorbency', 'Natural Materials', 'Odor Control'],
        },
        specifications: [
          { key: 'type', value_ko: '테이프형/팬티형', value_en: 'Tape/Panty Type', unit: '', order: 1 },
          { key: 'size_range', value_ko: 'S/M/L/XL', value_en: 'S/M/L/XL', unit: '', order: 2 },
          { key: 'absorbency', value_ko: '1200', value_en: '1200', unit: 'ml', order: 3 },
        ],
        is_active: true,
        is_featured: true,
        display_order: 2,
        view_count: 856,
        created_by: adminUser._id,
      },
    ]);
    console.log(`✅ ${products.length}개 제품 생성 완료`);

    // 6. 언론보도 생성 (10개)
    console.log('\n📰 언론보도 생성 중...');
    const pressReleases = await PressRelease.insertMany([
      {
        slug: 'sonaverse-ai-walker-ces-2024',
        press_id: 'PR-2024-001',
        title: {
          ko: '소나버스, CES 2024서 AI 워커 \'만보\' 공개',
          en: 'Sonaverse Unveils AI Walker "MANBO" at CES 2024',
        },
        press_name: { ko: 'TechCrunch Korea', en: 'TechCrunch Korea' },
        excerpt: {
          ko: '시니어 테크 스타트업 소나버스가 CES 2024에서 AI 기반 스마트 워커를 선보였다.',
          en: 'Senior tech startup Sonaverse showcased AI-powered smart walker at CES 2024.',
        },
        content: {
          ko: '<p>소나버스(대표 김규동)는 1월 9일부터 12일까지 미국 라스베이거스에서 열린 CES 2024에 참가해 AI 기반 스마트 워커 \'만보\'를 공개했다고 밝혔다.</p><p>만보는 낙상 감지 AI, 자동 경사 제어 등 첨단 기술을 탑재한 차세대 보행 보조 기구로, 전 세계 바이어들의 큰 관심을 받았다.</p>',
          en: '<p>Sonaverse (CEO Kim Gyu-dong) announced that it participated in CES 2024 held in Las Vegas from January 9 to 12 and unveiled MANBO, an AI-powered smart walker.</p><p>MANBO is a next-generation walking aid equipped with advanced technologies such as fall detection AI and automatic slope control, receiving significant interest from global buyers.</p>',
        },
        thumbnail_image_id: images[4]._id,
        external_url: 'https://techcrunch.com/korea/article/2024010900001',
        category_id: categories[4]._id,
        tags: [tags[0]._id, tags[1]._id, tags[6]._id],
        published_date: new Date('2024-01-10'),
        is_published: true,
        is_featured: true,
        featured_order: 1,
        view_count: 2345,
        created_by: adminUser._id,
      },
      {
        slug: 'sonaverse-series-a-funding',
        press_id: 'PR-2024-002',
        title: {
          ko: '소나버스, 시리즈 A 라운드서 50억 투자 유치',
          en: 'Sonaverse Raises 5 Billion Won in Series A Funding',
        },
        press_name: { ko: 'Economic Daily', en: 'Economic Daily' },
        excerpt: {
          ko: '시니어 케어 솔루션 전문 기업 소나버스가 시리즈 A 라운드에서 50억원 규모의 투자를 유치했다.',
          en: 'Senior care solution company Sonaverse raised 5 billion won in Series A funding.',
        },
        content: {
          ko: '<p>소나버스는 여러 벤처캐피탈로부터 총 50억원 규모의 시리즈 A 투자를 유치했다고 3월 15일 밝혔다.</p><p>이번 투자금은 만보 워커의 양산 체제 구축과 보듬 기저귀 라인 확대에 사용될 예정이다.</p>',
          en: '<p>Sonaverse announced on March 15 that it raised 5 billion won in Series A investment from multiple venture capitals.</p><p>The investment will be used to establish mass production for MANBO Walker and expand the Bodeum Diaper line.</p>',
        },
        thumbnail_image_id: images[4]._id,
        external_url: 'https://www.edaily.co.kr/article/2024031500001',
        category_id: categories[4]._id,
        tags: [tags[0]._id],
        published_date: new Date('2024-03-15'),
        is_published: true,
        is_featured: false,
        view_count: 1876,
        created_by: adminUser._id,
      },
      {
        slug: 'manbo-walker-medical-device-approval',
        press_id: 'PR-2024-003',
        title: {
          ko: '만보 워커, 식약처 의료기기 인증 획득',
          en: 'MANBO Walker Receives MFDS Medical Device Approval',
        },
        press_name: { ko: 'AI Times', en: 'AI Times' },
        excerpt: {
          ko: '소나버스의 만보 워커가 식품의약품안전처로부터 2등급 의료기기 인증을 받았다.',
          en: 'Sonaverse\'s MANBO Walker received Class 2 medical device certification from MFDS.',
        },
        content: {
          ko: '<p>소나버스는 만보 워커가 식품의약품안전처로부터 2등급 의료기기 인증을 받았다고 5월 20일 발표했다.</p><p>이로써 만보 워커는 의료기관 및 요양시설에서 공식적으로 사용할 수 있게 되었다.</p>',
          en: '<p>Sonaverse announced on May 20 that MANBO Walker received Class 2 medical device certification from MFDS.</p><p>This allows MANBO Walker to be officially used in medical institutions and care facilities.</p>',
        },
        thumbnail_image_id: images[4]._id,
        external_url: 'https://www.aitimes.com/article/2024052000001',
        category_id: categories[4]._id,
        tags: [tags[1]._id, tags[2]._id],
        published_date: new Date('2024-05-20'),
        is_published: true,
        is_featured: false,
        view_count: 1543,
        created_by: adminUser._id,
      },
      {
        slug: 'sonaverse-innovation-award-2024',
        press_id: 'PR-2024-004',
        title: {
          ko: '소나버스, 혁신기업 100선 선정',
          en: 'Sonaverse Selected as Top 100 Innovative Companies',
        },
        press_name: { ko: 'Startup Today', en: 'Startup Today' },
        excerpt: {
          ko: '시니어 테크 기업 소나버스가 2024년 혁신기업 100선에 선정되었다.',
          en: 'Senior tech company Sonaverse was selected as one of the top 100 innovative companies in 2024.',
        },
        content: {
          ko: '<p>소나버스는 사회적 문제를 기술로 해결하는 혁신 기업으로 인정받아 2024년 혁신기업 100선에 선정되었다고 6월 5일 발표했다.</p><p>특히 만보 워커와 보듬 기저귀가 시니어의 삶의 질 향상에 기여한 점이 높이 평가되었다.</p>',
          en: '<p>Sonaverse announced on June 5 that it was selected as one of the top 100 innovative companies in 2024, recognized for solving social problems through technology.</p><p>MANBO Walker and Bodeum Diaper were highly praised for contributing to improving seniors\' quality of life.</p>',
        },
        thumbnail_image_id: images[4]._id,
        external_url: 'https://www.startuptoday.co.kr/article/2024060500001',
        category_id: categories[4]._id,
        tags: [tags[0]._id, tags[6]._id],
        published_date: new Date('2024-06-05'),
        is_published: true,
        is_featured: false,
        view_count: 1324,
        created_by: adminUser._id,
      },
      {
        slug: 'bodeum-diaper-launch',
        press_id: 'PR-2024-005',
        title: {
          ko: '보듬 기저귀, 프리미엄 시니어 케어 시장 진출',
          en: 'Bodeum Diaper Enters Premium Senior Care Market',
        },
        press_name: { ko: '헬스케어뉴스', en: 'Healthcare News' },
        excerpt: {
          ko: '소나버스가 프리미엄 성인용 기저귀 브랜드 \'보듬\'을 공식 출시했다.',
          en: 'Sonaverse officially launched premium adult diaper brand "Bodeum".',
        },
        content: {
          ko: '<p>소나버스는 7월 1일 프리미엄 성인용 기저귀 브랜드 \'보듬\'을 공식 출시했다고 발표했다.</p><p>보듬 기저귀는 피부 자극을 최소화하고 흡수력을 극대화한 제품으로, 시니어의 편안함과 존엄성을 최우선으로 설계되었다.</p>',
          en: '<p>Sonaverse announced on July 1 that it officially launched the premium adult diaper brand "Bodeum".</p><p>Bodeum Diaper is designed to minimize skin irritation and maximize absorbency, prioritizing seniors\' comfort and dignity.</p>',
        },
        thumbnail_image_id: images[4]._id,
        external_url: 'https://www.healthcarenews.co.kr/article/2024070100001',
        category_id: categories[4]._id,
        tags: [tags[0]._id, tags[3]._id],
        published_date: new Date('2024-07-01'),
        is_published: true,
        is_featured: false,
        view_count: 1123,
        created_by: adminUser._id,
      },
      {
        slug: 'sonaverse-global-expansion',
        press_id: 'PR-2024-006',
        title: {
          ko: '소나버스, 북미 시장 진출 계획 발표',
          en: 'Sonaverse Announces North American Market Entry',
        },
        press_name: { ko: '한국경제', en: 'Korea Economic Daily' },
        excerpt: {
          ko: '소나버스가 만보 워커와 보듬 기저귀의 북미 시장 진출을 준비 중이다.',
          en: 'Sonaverse is preparing to enter the North American market with MANBO Walker and Bodeum Diaper.',
        },
        content: {
          ko: '<p>소나버스는 8월 15일 만보 워커와 보듬 기저귀의 북미 시장 진출 계획을 발표했다.</p><p>미국과 캐나다의 주요 의료기관 및 요양시설과 파트너십을 체결하며 글로벌 시장 공략에 나선다.</p>',
          en: '<p>Sonaverse announced on August 15 its plan to enter the North American market with MANBO Walker and Bodeum Diaper.</p><p>The company is forming partnerships with major medical institutions and care facilities in the US and Canada to target the global market.</p>',
        },
        thumbnail_image_id: images[4]._id,
        external_url: 'https://www.hankyung.com/article/2024081500001',
        category_id: categories[4]._id,
        tags: [tags[0]._id],
        published_date: new Date('2024-08-15'),
        is_published: true,
        is_featured: false,
        view_count: 987,
        created_by: adminUser._id,
      },
      {
        slug: 'manbo-walker-user-testimonial',
        press_id: 'PR-2024-007',
        title: {
          ko: '만보 워커 사용자 만족도 95% 달성',
          en: 'MANBO Walker Achieves 95% User Satisfaction',
        },
        press_name: { ko: '메디컬투데이', en: 'Medical Today' },
        excerpt: {
          ko: '만보 워커 사용자 만족도 조사에서 95%의 높은 만족도를 기록했다.',
          en: 'MANBO Walker achieved 95% satisfaction in user satisfaction survey.',
        },
        content: {
          ko: '<p>소나버스는 만보 워커 사용자 200명을 대상으로 실시한 만족도 조사에서 95%의 높은 만족도를 기록했다고 9월 10일 발표했다.</p><p>특히 안전성과 사용 편의성에서 높은 점수를 받았으며, 90% 이상의 사용자가 추천 의향을 밝혔다.</p>',
          en: '<p>Sonaverse announced on September 10 that MANBO Walker achieved 95% satisfaction in a survey of 200 users.</p><p>It received high scores particularly in safety and ease of use, with over 90% of users expressing intent to recommend.</p>',
        },
        thumbnail_image_id: images[4]._id,
        external_url: 'https://www.mdtoday.co.kr/article/2024091000001',
        category_id: categories[4]._id,
        tags: [tags[1]._id, tags[0]._id],
        published_date: new Date('2024-09-10'),
        is_published: true,
        is_featured: false,
        view_count: 876,
        created_by: adminUser._id,
      },
      {
        slug: 'sonaverse-ai-technology',
        press_id: 'PR-2024-008',
        title: {
          ko: 'AI가 결합된 실버 케어의 미래',
          en: 'The Future of Silver Care Combined with AI',
        },
        press_name: { ko: 'AI Times', en: 'AI Times' },
        excerpt: {
          ko: '소나버스의 AI 기술이 실버 케어 산업의 미래를 이끌고 있다.',
          en: 'Sonaverse\'s AI technology is leading the future of the silver care industry.',
        },
        content: {
          ko: '<p>소나버스의 CTO를 만나 AI가 그리는 돌봄의 미래에 대해 들어보았다.</p><p>만보 워커에 탑재된 AI 기술은 사용자의 보행 패턴을 분석하여 낙상 위험을 예측하고, 건강 이상 징후를 조기 발견하는 데 활용된다.</p>',
          en: '<p>We met with Sonaverse\'s CTO to learn about the future of care that AI is drawing.</p><p>The AI technology embedded in MANBO Walker analyzes users\' walking patterns to predict fall risks and detect early signs of health abnormalities.</p>',
        },
        thumbnail_image_id: images[4]._id,
        external_url: 'https://www.aitimes.com/article/2024102000001',
        category_id: categories[4]._id,
        tags: [tags[6]._id, tags[0]._id],
        published_date: new Date('2024-10-20'),
        is_published: true,
        is_featured: false,
        view_count: 765,
        created_by: adminUser._id,
      },
      {
        slug: 'sonaverse-ces-2024-innovation-award',
        press_id: 'PR-2024-009',
        title: {
          ko: 'CES 2024 혁신상 수상 기대작',
          en: 'Expected to Win Innovation Award at CES 2024',
        },
        press_name: { ko: 'Startup Today', en: 'Startup Today' },
        excerpt: {
          ko: '소나버스의 만보 워커가 CES 2024 혁신상 수상 유력 후보로 거론되고 있다.',
          en: 'Sonaverse\'s MANBO Walker is being mentioned as a strong candidate for the CES 2024 Innovation Award.',
        },
        content: {
          ko: '<p>오는 1월 라스베이거스에서 열리는 CES 2024를 앞두고, 한국 스타트업 소나버스가 혁신상 유력 후보로 거론되고 있다.</p><p>소나버스는 이번 CES에서 차세대 보행 보조 로봇과 스마트 기저귀 케어 시스템을 선보일 예정이다.</p>',
          en: '<p>Ahead of CES 2024 to be held in Las Vegas in January, Korean startup Sonaverse is being mentioned as a strong candidate for the Innovation Award.</p><p>Sonaverse plans to showcase next-generation walking assistance robots and smart diaper care systems at this CES.</p>',
        },
        thumbnail_image_id: images[4]._id,
        external_url: 'https://www.startuptoday.co.kr/article/2024120500001',
        category_id: categories[4]._id,
        tags: [tags[1]._id, tags[6]._id],
        published_date: new Date('2024-12-05'),
        is_published: true,
        is_featured: false,
        view_count: 654,
        created_by: adminUser._id,
      },
      {
        slug: 'sonaverse-senior-tech-leader',
        press_id: 'PR-2024-010',
        title: {
          ko: '소나버스, 시니어 테크의 새로운 지평을 열다',
          en: 'Sonaverse Opens New Horizons in Senior Tech',
        },
        press_name: { ko: 'TechCrunch Korea', en: 'TechCrunch Korea' },
        excerpt: {
          ko: '하이브리드 보행 보조기 만보 출시로 업계의 주목을 받고 있는 스타트업 소나버스가 시리즈A 투자를 유치하며 본격적인 성장을 예고했다.',
          en: 'Startup Sonaverse, which has been attracting industry attention with the launch of hybrid walking aid MANBO, has raised Series A investment, signaling full-scale growth.',
        },
        content: {
          ko: '<p>시니어 테크 스타트업 소나버스가 100억 원 규모의 시리즈 A 투자를 성공적으로 유치하며 글로벌 시장 진출의 신호탄을 쏘아 올렸다.</p><p>소나버스는 하이브리드 보행 보조기 \'만보 워크메이트\'를 통해 고령화 사회의 핵심 문제인 이동성 저하와 낙상 사고 예방 솔루션을 제시하고 있다.</p>',
          en: '<p>Senior tech startup Sonaverse successfully raised 10 billion won in Series A investment, signaling its entry into the global market.</p><p>Sonaverse presents solutions for mobility decline and fall accident prevention, key issues in an aging society, through the hybrid walking aid "MANBO Walkmate".</p>',
        },
        thumbnail_image_id: images[4]._id,
        external_url: 'https://techcrunch.com/korea/article/2024091500001',
        category_id: categories[4]._id,
        tags: [tags[0]._id, tags[1]._id],
        published_date: new Date('2024-09-15'),
        is_published: true,
        is_featured: false,
        view_count: 543,
        created_by: adminUser._id,
      },
    ]);
    console.log(`✅ ${pressReleases.length}개 언론보도 생성 완료`);

    // 7. 소나버스 스토리 생성 (10개)
    console.log('\n📝 소나버스 스토리 생성 중...');
    const stories = await SonaverseStory.insertMany([
      {
        slug: 'why-we-started-sonaverse',
        story_id: 'STORY-2024-001',
        category: 'company_news',
        title: {
          ko: '우리가 소나버스를 시작한 이유',
          en: 'Why We Started Sonaverse',
        },
        subtitle: {
          ko: '시니어의 더 나은 일상을 위한 여정',
          en: 'A Journey for Better Senior Living',
        },
        excerpt: {
          ko: '할머니의 낙상 사고를 목격한 후, 우리는 시니어를 위한 진짜 해결책을 만들기로 결심했습니다.',
          en: 'After witnessing our grandmother\'s fall accident, we decided to create real solutions for seniors.',
        },
        content: {
          ko: {
            body: '<h2>시작</h2><p>2020년 겨울, 대표 김규동의 할머니가 집 앞 계단에서 넘어지는 사고가 있었습니다. 다행히 큰 부상은 없었지만, 이 사건은 우리 팀에게 큰 충격을 주었습니다.</p><h2>문제 발견</h2><p>조사 결과, 대한민국에서는 매년 약 10만 명의 시니어가 낙상 사고로 응급실을 찾는다는 사실을 알게 되었습니다. 하지만 시장에 나와 있는 보행 보조 기구들은 무겁고, 불편하며, 실제 낙상 예방에는 큰 도움이 되지 않았습니다.</p><h2>해결책 개발</h2><p>우리는 AI 기술과 로봇공학을 결합하여, 실제로 시니어의 안전한 보행을 도울 수 있는 \'만보 워커\'를 개발하기 시작했습니다.</p>',
          },
          en: {
            body: '<h2>Beginning</h2><p>In winter 2020, CEO Kim Gyu-dong\'s grandmother had an accident falling down the stairs in front of her house. Fortunately, there were no serious injuries, but this incident shocked our team.</p><h2>Problem Discovery</h2><p>Our research revealed that approximately 100,000 seniors visit emergency rooms due to fall accidents each year in South Korea. However, the walking aids available in the market were heavy, inconvenient, and did not provide significant help in preventing falls.</p><h2>Solution Development</h2><p>We began developing the MANBO Walker, combining AI technology and robotics to truly help seniors walk safely.</p>',
          },
        },
        thumbnail_image_id: images[3]._id,
        related_product_ids: [products[0]._id],
        tags: [tags[0]._id, tags[1]._id, tags[5]._id],
        is_main_story: true,
        is_published: true,
        is_featured: true,
        display_priority: 100,
        published_date: new Date('2024-02-01'),
        published_at: new Date('2024-02-01'),
        view_count: 5678,
        read_time_minutes: 8,
        author_name: '김규동',
        created_by: adminUser._id,
      },
      {
        slug: 'senior-health-walking-guide',
        story_id: 'STORY-2024-002',
        category: 'health_info',
        title: {
          ko: '시니어를 위한 안전한 걷기 가이드',
          en: 'Safe Walking Guide for Seniors',
        },
        subtitle: {
          ko: '낙상 없이 건강하게 걷는 법',
          en: 'Walking Healthy Without Falls',
        },
        excerpt: {
          ko: '매일 30분 걷기, 시니어 건강의 기본입니다. 안전하게 걷는 방법을 알아봅니다.',
          en: 'Walking 30 minutes daily is fundamental for senior health. Learn how to walk safely.',
        },
        content: {
          ko: {
            body: '<h2>왜 걷기가 중요한가?</h2><p>규칙적인 걷기는 심혈관 건강을 증진시키고, 근력을 유지하며, 균형감각을 향상시킵니다.</p><h2>안전한 걷기 5원칙</h2><ol><li>적절한 신발 착용</li><li>보행 보조 기구 사용 고려</li><li>밝은 곳에서 걷기</li><li>규칙적인 휴식</li><li>동행인과 함께 걷기</li></ol>',
          },
          en: {
            body: '<h2>Why is Walking Important?</h2><p>Regular walking improves cardiovascular health, maintains muscle strength, and enhances balance.</p><h2>5 Principles of Safe Walking</h2><ol><li>Wear appropriate shoes</li><li>Consider using walking aids</li><li>Walk in well-lit areas</li><li>Take regular breaks</li><li>Walk with a companion</li></ol>',
          },
        },
        thumbnail_image_id: images[3]._id,
        related_product_ids: [products[0]._id],
        tags: [tags[0]._id, tags[4]._id, tags[5]._id],
        is_main_story: false,
        is_published: true,
        is_featured: true,
        display_priority: 90,
        published_date: new Date('2024-03-10'),
        published_at: new Date('2024-03-10'),
        view_count: 4321,
        read_time_minutes: 6,
        author_name: '건강팀',
        created_by: adminUser._id,
      },
      {
        slug: 'manbo-walker-development-story',
        story_id: 'STORY-2024-003',
        category: 'product_story',
        title: {
          ko: '만보 워커 개발 스토리',
          en: 'MANBO Walker Development Story',
        },
        subtitle: {
          ko: '100번의 실패 끝에 찾은 완벽한 균형',
          en: 'Perfect Balance Found After 100 Failures',
        },
        excerpt: {
          ko: '만보 워커가 완성되기까지의 2년간의 개발 여정을 소개합니다.',
          en: 'Introducing the 2-year development journey of MANBO Walker.',
        },
        content: {
          ko: {
            body: '<h2>프로토타입 1호</h2><p>첫 프로토타입은 너무 무거워서 시니어가 사용할 수 없었습니다.</p><h2>100번의 반복</h2><p>우리는 100번 이상의 프로토타입을 제작하며, 무게, 안정성, 사용성을 개선했습니다.</p><h2>사용자 테스트</h2><p>50명 이상의 시니어와 함께 실제 환경에서 테스트하며 피드백을 반영했습니다.</p>',
          },
          en: {
            body: '<h2>Prototype 1</h2><p>The first prototype was too heavy for seniors to use.</p><h2>100 Iterations</h2><p>We created over 100 prototypes, improving weight, stability, and usability.</p><h2>User Testing</h2><p>We tested in real environments with over 50 seniors and incorporated their feedback.</p>',
          },
        },
        thumbnail_image_id: images[3]._id,
        youtube_url: 'https://www.youtube.com/watch?v=example123',
        youtube_video_id: 'example123',
        related_product_ids: [products[0]._id],
        tags: [tags[1]._id, tags[2]._id, tags[6]._id],
        is_main_story: false,
        is_published: true,
        is_featured: false,
        display_priority: 80,
        published_date: new Date('2024-04-15'),
        published_at: new Date('2024-04-15'),
        view_count: 3456,
        read_time_minutes: 10,
        author_name: '개발팀',
        created_by: adminUser._id,
      },
      {
        slug: 'senior-welfare-benefits-2024',
        story_id: 'STORY-2024-004',
        category: 'welfare_info',
        title: {
          ko: '2024년 시니어 복지 혜택 총정리',
          en: '2024 Senior Welfare Benefits Overview',
        },
        subtitle: {
          ko: '놓치면 안 되는 정부 지원 제도',
          en: 'Government Support Programs You Shouldn\'t Miss',
        },
        excerpt: {
          ko: '시니어가 받을 수 있는 다양한 복지 혜택을 한눈에 정리했습니다.',
          en: 'Various welfare benefits available for seniors at a glance.',
        },
        content: {
          ko: {
            body: '<h2>건강 관련 혜택</h2><ul><li>무료 건강검진</li><li>의료비 지원</li><li>보행 보조 기구 구매 지원</li></ul><h2>생활 지원</h2><ul><li>기초연금</li><li>에너지 바우처</li><li>통신비 할인</li></ul>',
          },
          en: {
            body: '<h2>Health Benefits</h2><ul><li>Free health checkups</li><li>Medical expense support</li><li>Walking aid purchase support</li></ul><h2>Living Support</h2><ul><li>Basic pension</li><li>Energy vouchers</li><li>Communication fee discounts</li></ul>',
          },
        },
        thumbnail_image_id: images[3]._id,
        related_product_ids: [products[0]._id],
        tags: [tags[0]._id, tags[7]._id],
        is_main_story: false,
        is_published: true,
        is_featured: false,
        display_priority: 70,
        published_date: new Date('2024-05-01'),
        published_at: new Date('2024-05-01'),
        view_count: 2987,
        read_time_minutes: 7,
        author_name: '복지팀',
        created_by: adminUser._id,
      },
      {
        slug: 'bodeum-diaper-user-story',
        story_id: 'STORY-2024-005',
        category: 'usage',
        title: {
          ko: '사용자와 함께 만든 혁신, BO DUME 기저귀',
          en: 'Innovation Made with Users: BO DUME Diaper',
        },
        subtitle: {
          ko: '실제 요양 현장의 목소리를 담아 만든 BO DUME 기저귀 개발 인터뷰',
          en: 'BO DUME Diaper Development Interview with Real Care Facility Voices',
        },
        excerpt: {
          ko: '실제 요양원에서 일하는 간병인들과 시니어들의 피드백을 바탕으로 개발된 보듬 기저귀의 스토리를 소개합니다.',
          en: 'Introducing the story of Bodeum Diaper developed based on feedback from caregivers and seniors working in actual care facilities.',
        },
        content: {
          ko: {
            body: '<h2>요양원 방문</h2><p>우리는 전국 20개 요양원을 방문하여 간병인과 시니어들의 실제 사용 경험을 듣고, 문제점을 파악했습니다.</p><h2>핵심 문제</h2><p>기존 기저귀의 가장 큰 문제는 피부 자극과 냄새였습니다. 우리는 이 두 가지 문제를 해결하는 데 집중했습니다.</p><h2>해결책</h2><p>천연 소재와 고흡수성 기술을 결합하여 피부 자극을 최소화하고, 냄새 차단 기능을 강화했습니다.</p>',
          },
          en: {
            body: '<h2>Care Facility Visits</h2><p>We visited 20 care facilities nationwide to hear about the actual usage experiences of caregivers and seniors and identify problems.</p><h2>Core Problems</h2><p>The biggest problems with existing diapers were skin irritation and odor. We focused on solving these two issues.</p><h2>Solutions</h2><p>We combined natural materials with high-absorbency technology to minimize skin irritation and enhanced odor-blocking functionality.</p>',
          },
        },
        thumbnail_image_id: images[3]._id,
        related_product_ids: [products[1]._id],
        tags: [tags[0]._id, tags[3]._id],
        is_main_story: false,
        is_published: true,
        is_featured: false,
        display_priority: 60,
        published_date: new Date('2024-06-10'),
        published_at: new Date('2024-06-10'),
        view_count: 2345,
        read_time_minutes: 8,
        author_name: '제품팀',
        created_by: adminUser._id,
      },
      {
        slug: 'senior-nutrition-guide',
        story_id: 'STORY-2024-006',
        category: 'health_info',
        title: {
          ko: '시니어를 위한 올바른 영양 섭취 가이드',
          en: 'Proper Nutrition Guide for Seniors',
        },
        subtitle: {
          ko: '건강한 노후를 위한 식단 관리',
          en: 'Diet Management for Healthy Aging',
        },
        excerpt: {
          ko: '시니어의 건강을 위한 필수 영양소와 올바른 식단 관리 방법을 알아봅니다.',
          en: 'Learn about essential nutrients and proper diet management for senior health.',
        },
        content: {
          ko: {
            body: '<h2>필수 영양소</h2><p>시니어에게 특히 중요한 단백질, 칼슘, 비타민 D, 비타민 B12 등을 충분히 섭취해야 합니다.</p><h2>식단 구성</h2><p>균형 잡힌 식단은 곡물, 채소, 과일, 단백질, 유제품을 골고루 포함해야 합니다.</p><h2>주의사항</h2><p>과도한 염분 섭취를 피하고, 충분한 수분 섭취를 유지하는 것이 중요합니다.</p>',
          },
          en: {
            body: '<h2>Essential Nutrients</h2><p>Seniors need to consume sufficient amounts of protein, calcium, vitamin D, vitamin B12, which are particularly important.</p><h2>Diet Composition</h2><p>A balanced diet should include grains, vegetables, fruits, protein, and dairy products in appropriate proportions.</p><h2>Precautions</h2><p>It is important to avoid excessive salt intake and maintain adequate hydration.</p>',
          },
        },
        thumbnail_image_id: images[3]._id,
        tags: [tags[0]._id, tags[4]._id],
        is_main_story: false,
        is_published: true,
        is_featured: false,
        display_priority: 50,
        published_date: new Date('2024-07-05'),
        published_at: new Date('2024-07-05'),
        view_count: 1876,
        read_time_minutes: 6,
        author_name: '건강팀',
        created_by: adminUser._id,
      },
      {
        slug: 'manbo-walker-user-review',
        story_id: 'STORY-2024-007',
        category: 'usage',
        title: {
          ko: '만보 워커 사용 후기: 할머니의 새로운 자유',
          en: 'MANBO Walker User Review: Grandmother\'s New Freedom',
        },
        subtitle: {
          ko: '실제 사용자가 전하는 만보 워커의 경험담',
          en: 'MANBO Walker Experience from Real Users',
        },
        excerpt: {
          ko: '만보 워커를 사용한 지 6개월이 된 김 할머니의 생생한 후기를 들어봅니다.',
          en: 'Hear the vivid review from Grandmother Kim, who has been using MANBO Walker for 6 months.',
        },
        content: {
          ko: {
            body: '<h2>처음 만난 만보</h2><p>처음에는 새로운 기계를 사용하는 것이 두려웠지만, 사용법이 간단해서 금방 익숙해졌습니다.</p><h2>일상의 변화</h2><p>만보 워커 덕분에 혼자서도 마트에 갈 수 있게 되었고, 친구들과 산책을 나갈 수 있게 되었습니다.</p><h2>안심</h2><p>낙상 걱정 없이 안전하게 걸을 수 있어서 가족들도 안심하고 있습니다.</p>',
          },
          en: {
            body: '<h2>First Meeting with MANBO</h2><p>At first, I was afraid to use the new machine, but I quickly got used to it because it was simple to use.</p><h2>Changes in Daily Life</h2><p>Thanks to MANBO Walker, I can now go to the supermarket alone and take walks with friends.</p><h2>Peace of Mind</h2><p>I can walk safely without worrying about falls, and my family is also at ease.</p>',
          },
        },
        thumbnail_image_id: images[3]._id,
        related_product_ids: [products[0]._id],
        tags: [tags[0]._id, tags[1]._id],
        is_main_story: false,
        is_published: true,
        is_featured: false,
        display_priority: 40,
        published_date: new Date('2024-08-20'),
        published_at: new Date('2024-08-20'),
        view_count: 1654,
        read_time_minutes: 5,
        author_name: '사용자 후기',
        created_by: adminUser._id,
      },
      {
        slug: 'senior-exercise-routine',
        story_id: 'STORY-2024-008',
        category: 'health_info',
        title: {
          ko: '시니어를 위한 맞춤형 운동 루틴',
          en: 'Customized Exercise Routine for Seniors',
        },
        subtitle: {
          ko: '나이에 맞는 안전한 운동법',
          en: 'Safe Exercise Methods Suitable for Age',
        },
        excerpt: {
          ko: '시니어의 건강을 위한 효과적이고 안전한 운동 방법을 소개합니다.',
          en: 'Introducing effective and safe exercise methods for senior health.',
        },
        content: {
          ko: {
            body: '<h2>유산소 운동</h2><p>걷기, 수영, 자전거 타기 등은 심혈관 건강에 좋습니다. 주 3-5회, 30분씩 하는 것이 적당합니다.</p><h2>근력 운동</h2><p>가벼운 덤벨이나 밴드를 사용한 근력 운동은 근육량 유지에 도움이 됩니다.</p><h2>균형 운동</h2><p>요가나 타이치 같은 균형 운동은 낙상 예방에 효과적입니다.</p>',
          },
          en: {
            body: '<h2>Aerobic Exercise</h2><p>Walking, swimming, and cycling are good for cardiovascular health. 3-5 times a week for 30 minutes is appropriate.</p><h2>Strength Training</h2><p>Strength training with light dumbbells or bands helps maintain muscle mass.</p><h2>Balance Exercise</h2><p>Balance exercises like yoga or tai chi are effective in preventing falls.</p>',
          },
        },
        thumbnail_image_id: images[3]._id,
        tags: [tags[0]._id, tags[4]._id, tags[5]._id],
        is_main_story: false,
        is_published: true,
        is_featured: false,
        display_priority: 30,
        published_date: new Date('2024-09-15'),
        published_at: new Date('2024-09-15'),
        view_count: 1432,
        read_time_minutes: 7,
        author_name: '건강팀',
        created_by: adminUser._id,
      },
      {
        slug: 'long-term-care-insurance-guide',
        story_id: 'STORY-2024-009',
        category: 'welfare_info',
        title: {
          ko: '2024년 노인장기요양보험 혜택',
          en: '2024 Long-Term Care Insurance Benefits',
        },
        subtitle: {
          ko: '새로워진 복지 혜택, 놓치지 말고 꼭 확인하세요',
          en: 'New Welfare Benefits, Don\'t Miss Out',
        },
        excerpt: {
          ko: '2024년을 맞아 노인장기요양보험 제도가 더욱 강화되었습니다. 변경된 주요 내용을 정리해 드립니다.',
          en: 'As we enter 2024, the long-term care insurance system has been further strengthened. Here are the main changes.',
        },
        content: {
          ko: {
            body: '<h2>재가급여 한도액 인상</h2><p>가정에서 돌봄 서비스를 받을 수 있는 재가급여 월 한도액이 인상되었습니다.</p><h2>본인부담금 감경 대상 확대</h2><p>소득 수준에 따른 본인부담금 감경 대상이 확대되어, 더 많은 분들이 비용 부담 없이 장기요양 서비스를 이용할 수 있게 되었습니다.</p><h2>가족요양비 지원 강화</h2><p>도서/벽지 등 요양기관이 부족한 지역에 거주하거나, 천재지변 등으로 인해 가족으로부터 요양을 받는 경우 지급되는 가족요양비가 인상되었습니다.</p>',
          },
          en: {
            body: '<h2>Increase in Home Care Benefit Limit</h2><p>The monthly limit for home care benefits that can be received at home has been increased.</p><h2>Expansion of Copayment Reduction Eligibility</h2><p>The eligibility for copayment reduction based on income level has been expanded, allowing more people to use long-term care services without financial burden.</p><h2>Strengthening Family Care Allowance</h2><p>The family care allowance paid when receiving care from family due to lack of care facilities in remote areas or natural disasters has been increased.</p>',
          },
        },
        thumbnail_image_id: images[3]._id,
        tags: [tags[0]._id, tags[7]._id],
        is_main_story: false,
        is_published: true,
        is_featured: false,
        display_priority: 20,
        published_date: new Date('2024-10-10'),
        published_at: new Date('2024-10-10'),
        view_count: 1234,
        read_time_minutes: 6,
        author_name: '복지팀',
        created_by: adminUser._id,
      },
      {
        slug: 'sonaverse-future-vision',
        story_id: 'STORY-2024-010',
        category: 'company_news',
        title: {
          ko: '시니어를 위한 기술, 어디까지 왔나?',
          en: 'Technology for Seniors: How Far Have We Come?',
        },
        subtitle: {
          ko: '최신 시니어 테크 트렌드와 소나버스가 그리는 미래의 청사진',
          en: 'Latest Senior Tech Trends and Sonaverse\'s Vision for the Future',
        },
        excerpt: {
          ko: '최신 시니어 테크 트렌드와 소나버스가 그리는 미래의 청사진을 소개합니다.',
          en: 'Introducing the latest senior tech trends and Sonaverse\'s vision for the future.',
        },
        content: {
          ko: {
            body: '<h2>시니어 테크의 현재</h2><p>AI, IoT, 로봇 기술이 시니어 케어 분야에 접목되며 혁신적인 변화가 일어나고 있습니다.</p><h2>소나버스의 미래</h2><p>우리는 만보 워커와 보듬 기저귀를 시작으로, 시니어의 전 생애를 지원하는 통합 케어 플랫폼을 구축하고 있습니다.</p><h2>글로벌 확장</h2><p>2025년부터 북미와 유럽 시장 진출을 목표로 하고 있으며, 전 세계 시니어에게 더 나은 일상을 제공하겠습니다.</p>',
          },
          en: {
            body: '<h2>Current State of Senior Tech</h2><p>AI, IoT, and robotics technologies are being integrated into senior care, bringing about innovative changes.</p><h2>Sonaverse\'s Future</h2><p>Starting with MANBO Walker and Bodeum Diaper, we are building an integrated care platform that supports seniors throughout their entire lives.</p><h2>Global Expansion</h2><p>We aim to enter the North American and European markets from 2025, providing better daily lives for seniors worldwide.</p>',
          },
        },
        thumbnail_image_id: images[3]._id,
        related_product_ids: [products[0]._id, products[1]._id],
        tags: [tags[0]._id, tags[6]._id],
        is_main_story: false,
        is_published: true,
        is_featured: true,
        display_priority: 10,
        published_date: new Date('2024-11-25'),
        published_at: new Date('2024-11-25'),
        view_count: 987,
        read_time_minutes: 9,
        author_name: '기획팀',
        created_by: adminUser._id,
      },
    ]);
    console.log(`✅ ${stories.length}개 스토리 생성 완료`);

    // 8. 문의 생성
    console.log('\n💬 문의 생성 중...');
    const inquiries = await Inquiry.insertMany([
      {
        inquiry_number: 'INQ-2024-00001',
        inquiry_type: 'product_inquiry',
        inquirer: {
          name: '김철수',
          company_name: '행복요양원',
          phone_number: '010-1234-5678',
          email: 'chulsoo@example.com',
          language: 'ko',
        },
        message: '만보 워커 10대 구매를 희망합니다. 견적서 부탁드립니다.',
        status: 'pending',
        priority: 'high',
        privacy_consented: true,
        created_at: new Date('2024-06-01'),
      },
      {
        inquiry_number: 'INQ-2024-00002',
        inquiry_type: 'partnership_proposal',
        inquirer: {
          name: 'John Smith',
          company_name: 'Global Health Care',
          phone_number: '+1-555-1234',
          email: 'john@globalhealth.com',
          language: 'en',
        },
        message: 'We are interested in distributing MANBO Walker in the US market. Please contact us for partnership discussion.',
        status: 'in_progress',
        priority: 'high',
        privacy_consented: true,
        created_at: new Date('2024-06-05'),
      },
      {
        inquiry_number: 'INQ-2024-00003',
        inquiry_type: 'demo_request',
        inquirer: {
          name: '이영희',
          company_name: '서울시 노인복지관',
          phone_number: '010-9876-5432',
          email: 'younghee@seoul.go.kr',
          language: 'ko',
        },
        message: '만보 워커 데모 시연을 요청드립니다. 복지관 방문 가능하신가요?',
        status: 'resolved',
        priority: 'medium',
        privacy_consented: true,
        created_at: new Date('2024-05-20'),
      },
    ]);
    console.log(`✅ ${inquiries.length}개 문의 생성 완료`);

    // 9. 회사 연혁 생성
    console.log('\n📅 회사 연혁 생성 중...');
    const companyHistory = await CompanyHistory.insertMany([
      {
        year: 2020,
        month: 3,
        event_type: 'founding',
        title: {
          ko: '주식회사 소나버스 설립',
          en: 'Sonaverse Inc. Founded',
        },
        description: {
          ko: '시니어 케어 솔루션 전문 기업으로 출발',
          en: 'Started as a senior care solution company',
        },
        order: 1,
        is_active: true,
        is_major_event: true,
      },
      {
        year: 2021,
        month: 6,
        event_type: 'funding',
        title: {
          ko: '시드 투자 10억원 유치',
          en: 'Raised 1 Billion Won in Seed Funding',
        },
        description: {
          ko: '국내 주요 벤처캐피탈로부터 시드 투자 유치',
          en: 'Received seed investment from major domestic venture capitals',
        },
        order: 2,
        is_active: true,
        is_major_event: true,
      },
      {
        year: 2022,
        month: 1,
        event_type: 'product_launch',
        title: {
          ko: '만보 워커 프로토타입 공개',
          en: 'MANBO Walker Prototype Unveiled',
        },
        description: {
          ko: 'AI 기반 스마트 워커 프로토타입 최초 공개',
          en: 'First unveiling of AI-powered smart walker prototype',
        },
        order: 3,
        is_active: true,
        is_major_event: true,
      },
      {
        year: 2023,
        month: 8,
        event_type: 'certification',
        title: {
          ko: 'ISO 13485 인증 획득',
          en: 'ISO 13485 Certification Acquired',
        },
        description: {
          ko: '의료기기 품질경영시스템 국제 인증 획득',
          en: 'Acquired international certification for medical device quality management system',
        },
        order: 4,
        is_active: true,
        is_major_event: false,
      },
      {
        year: 2024,
        month: 1,
        event_type: 'award',
        title: {
          ko: 'CES 2024 혁신상 수상',
          en: 'CES 2024 Innovation Award',
        },
        description: {
          ko: 'CES 2024에서 디지털 헬스 부문 혁신상 수상',
          en: 'Won Innovation Award in Digital Health category at CES 2024',
        },
        order: 5,
        is_active: true,
        is_major_event: true,
      },
      {
        year: 2024,
        month: 3,
        event_type: 'funding',
        title: {
          ko: '시리즈 A 투자 50억원 유치',
          en: 'Raised 5 Billion Won in Series A Funding',
        },
        description: {
          ko: '양산 체제 구축 및 글로벌 진출을 위한 투자 유치',
          en: 'Investment for mass production and global expansion',
        },
        order: 6,
        is_active: true,
        is_major_event: true,
      },
      {
        year: 2024,
        month: 5,
        event_type: 'certification',
        title: {
          ko: '만보 워커 의료기기 인증',
          en: 'MANBO Walker Medical Device Certification',
        },
        description: {
          ko: '식품의약품안전처 2등급 의료기기 인증 획득',
          en: 'Acquired MFDS Class 2 medical device certification',
        },
        order: 7,
        is_active: true,
        is_major_event: true,
      },
      {
        year: 2024,
        month: 7,
        event_type: 'product_launch',
        title: {
          ko: '보듬 기저귀 라인 출시',
          en: 'Bodeum Diaper Line Launch',
        },
        description: {
          ko: '프리미엄 성인용 기저귀 브랜드 \'보듬\' 공식 출시',
          en: 'Official launch of premium adult diaper brand "Bodeum"',
        },
        order: 8,
        is_active: true,
        is_major_event: true,
      },
    ]);
    console.log(`✅ ${companyHistory.length}개 연혁 생성 완료`);

    // 완료 메시지
    console.log('\n' + '='.repeat(50));
    console.log('✅ 데이터베이스 시드 완료!');
    console.log('='.repeat(50));
    console.log('\n📊 생성된 데이터 요약:');
    console.log(`  - 관리자: ${await AdminUser.countDocuments()}명`);
    console.log(`  - 카테고리: ${await Category.countDocuments()}개`);
    console.log(`  - 태그: ${await Tag.countDocuments()}개`);
    console.log(`  - 이미지: ${await Image.countDocuments()}개`);
    console.log(`  - 제품: ${await Product.countDocuments()}개`);
    console.log(`  - 언론보도: ${await PressRelease.countDocuments()}개`);
    console.log(`  - 스토리: ${await SonaverseStory.countDocuments()}개`);
    console.log(`  - 문의: ${await Inquiry.countDocuments()}개`);
    console.log(`  - 회사 연혁: ${await CompanyHistory.countDocuments()}개`);
    console.log('\n🔑 관리자 로그인 정보:');
    console.log('  - 이메일: admin@sonaverse.kr');
    console.log('  - 비밀번호: admin123!');

  } catch (error) {
    console.error('❌ 에러 발생:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB 연결 종료');
  }
}

// 스크립트 실행
seedDatabase()
  .then(() => {
    console.log('\n✅ 시드 스크립트 정상 종료');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ 시드 스크립트 실패:', error);
    process.exit(1);
  });
