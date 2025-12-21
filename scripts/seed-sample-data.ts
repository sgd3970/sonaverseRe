/**
 * 샘플 데이터 시드 스크립트
 * 모든 컬렉션에 샘플 데이터를 생성합니다.
 *
 * 사용법: npx tsx scripts/seed-sample-data.ts
 */

import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

// 환경 변수 로드
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sonaverse';

// 모델 임포트 (상대 경로로 수정 필요)
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    process.exit(1);
  }
}

async function seedAdminUsers() {
  const AdminUser = (await import('../src/lib/models/AdminUser')).default;

  const adminCount = await AdminUser.countDocuments();
  if (adminCount > 0) {
    console.log('⏭️  AdminUser 데이터가 이미 존재합니다. 건너뜁니다.');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin1234!', 10);

  const admins = [
    {
      name: '관리자',
      email: 'admin@sonaverse.kr',
      password: hashedPassword,
      role: 'admin',
      is_active: true,
      created_at: new Date(),
    },
    {
      name: '편집자',
      email: 'editor@sonaverse.kr',
      password: hashedPassword,
      role: 'editor',
      is_active: true,
      created_at: new Date(),
    },
  ];

  await AdminUser.insertMany(admins);
  console.log('✅ AdminUser 샘플 데이터 생성 완료 (2개)');
  console.log('   - admin@sonaverse.kr / admin1234!');
  console.log('   - editor@sonaverse.kr / admin1234!');
}

async function seedStories() {
  const SonaverseStory = (await import('../src/lib/models/SonaverseStory')).default;
  const AdminUser = (await import('../src/lib/models/AdminUser')).default;

  const storyCount = await SonaverseStory.countDocuments();
  if (storyCount > 0) {
    console.log('⏭️  SonaverseStory 데이터가 이미 존재합니다. 건너뜁니다.');
    return;
  }

  const admin = await AdminUser.findOne({ role: 'admin' });
  if (!admin) {
    console.log('⚠️  AdminUser가 없어서 Stories를 생성할 수 없습니다.');
    return;
  }

  const stories = [
    {
      story_id: `STR-${uuidv4().substring(0, 8).toUpperCase()}`,
      slug: 'sonaverse-vision-2024',
      category: 'company_news',
      title: {
        ko: '소나버스, 2024년 새로운 비전 발표',
        en: 'Sonaverse Announces New Vision for 2024',
      },
      excerpt: {
        ko: '시니어의 더 나은 일상을 위한 혁신적인 제품 라인업과 서비스를 소개합니다.',
        en: 'Introducing innovative product lineup and services for better senior living.',
      },
      content: {
        ko: {
          body: '소나버스는 2024년을 맞아 시니어 케어 산업의 새로운 표준을 제시합니다. 만보 워크메이트와 보듬 기저귀를 통해 시니어들의 독립적이고 품위있는 생활을 지원하며, 앞으로도 지속적인 혁신을 통해 시니어 케어의 미래를 만들어 갈 것입니다.\n\n우리의 비전은 단순히 제품을 판매하는 것이 아닙니다. 시니어들이 자신감 있고 편안한 삶을 살 수 있도록 돕는 것입니다. 이를 위해 최신 기술과 인간 중심의 디자인을 결합하여, 실질적으로 도움이 되는 제품과 서비스를 제공합니다.',
        },
        en: {
          body: 'Sonaverse presents a new standard for senior care industry in 2024. Through Manbo Walkmate and Bodume diapers, we support independent and dignified living for seniors, and will continue to create the future of senior care through continuous innovation.\n\nOur vision is not simply selling products. It is helping seniors live confident and comfortable lives. To achieve this, we combine cutting-edge technology with human-centered design to provide genuinely helpful products and services.',
        },
      },
      is_published: true,
      published_date: new Date(),
      view_count: 245,
      created_by: admin._id,
      created_at: new Date('2024-01-15'),
      updated_at: new Date('2024-01-15'),
    },
    {
      story_id: `STR-${uuidv4().substring(0, 8).toUpperCase()}`,
      slug: 'manbo-walkmate-innovation',
      category: 'product_story',
      title: {
        ko: '만보 워크메이트, 시니어 보행의 혁신',
        en: 'Manbo Walkmate: Innovation in Senior Mobility',
      },
      excerpt: {
        ko: '듀얼 구동 방식의 하이브리드 보행기로 시니어의 안전하고 편안한 이동을 지원합니다.',
        en: 'Dual-drive hybrid walker supports safe and comfortable mobility for seniors.',
      },
      content: {
        ko: {
          body: '만보 워크메이트는 단순한 보행 보조기가 아닙니다. 시니어들의 활동 반경을 넓히고 독립적인 생활을 가능하게 하는 스마트 모빌리티 솔루션입니다.\n\n듀얼 구동 시스템은 경사로나 험한 길에서도 안정적인 주행을 보장하며, 직관적인 조작 시스템으로 누구나 쉽게 사용할 수 있습니다. 또한 접이식 디자인으로 보관과 이동이 편리합니다.\n\n만보 워크메이트와 함께라면, 나이는 더 이상 활동의 제약이 되지 않습니다.',
        },
        en: {
          body: 'Manbo Walkmate is not just a walking aid. It is a smart mobility solution that expands seniors\' range of activities and enables independent living.\n\nThe dual-drive system ensures stable operation even on slopes and rough terrain, with an intuitive control system that anyone can easily use. The foldable design also makes storage and transport convenient.\n\nWith Manbo Walkmate, age is no longer a limitation on activity.',
        },
      },
      is_published: true,
      published_date: new Date(),
      view_count: 523,
      created_by: admin._id,
      created_at: new Date('2024-02-01'),
      updated_at: new Date('2024-02-01'),
    },
    {
      story_id: `STR-${uuidv4().substring(0, 8).toUpperCase()}`,
      slug: 'bodume-premium-care',
      category: 'product_story',
      title: {
        ko: '보듬, 프리미엄 성인용 기저귀의 새로운 기준',
        en: 'Bodume: New Standard for Premium Adult Diapers',
      },
      excerpt: {
        ko: '최고 품질의 소재와 인체공학적 디자인으로 편안함과 위생을 동시에 제공합니다.',
        en: 'Provides comfort and hygiene with highest quality materials and ergonomic design.',
      },
      content: {
        ko: {
          body: '보듬 기저귀는 프리미엄 품질과 편안함을 추구하는 시니어와 보호자를 위한 최상의 선택입니다.\n\n고흡수성 폴리머와 부드러운 표면 소재로 피부 자극을 최소화하며, 인체공학적 디자인으로 활동 중에도 편안한 착용감을 유지합니다. 또한 냄새 차단 기술로 사용자의 자신감과 품위를 지켜드립니다.\n\n보듬과 함께라면, 일상이 더욱 편안하고 자신감 있게 변화합니다.',
        },
        en: {
          body: 'Bodume diapers are the best choice for seniors and caregivers seeking premium quality and comfort.\n\nWith super-absorbent polymer and soft surface materials, skin irritation is minimized, and the ergonomic design maintains comfortable wear even during activities. Odor-blocking technology also protects users\' confidence and dignity.\n\nWith Bodume, daily life becomes more comfortable and confident.',
        },
      },
      is_published: true,
      published_date: new Date(),
      view_count: 412,
      created_by: admin._id,
      created_at: new Date('2024-02-10'),
      updated_at: new Date('2024-02-10'),
    },
  ];

  await SonaverseStory.insertMany(stories);
  console.log('✅ SonaverseStory 샘플 데이터 생성 완료 (3개)');
}

async function seedPress() {
  const PressRelease = (await import('../src/lib/models/PressRelease')).default;
  const AdminUser = (await import('../src/lib/models/AdminUser')).default;

  const pressCount = await PressRelease.countDocuments();
  if (pressCount > 0) {
    console.log('⏭️  PressRelease 데이터가 이미 존재합니다. 건너뜁니다.');
    return;
  }

  const admin = await AdminUser.findOne({ role: 'admin' });
  if (!admin) {
    console.log('⚠️  AdminUser가 없어서 Press를 생성할 수 없습니다.');
    return;
  }

  const pressReleases = [
    {
      press_id: `PR-${uuidv4().substring(0, 8).toUpperCase()}`,
      slug: 'sonaverse-award-2024',
      category: 'award',
      title: {
        ko: '소나버스, 2024 대한민국 시니어 케어 혁신상 수상',
        en: 'Sonaverse Wins 2024 Korea Senior Care Innovation Award',
      },
      excerpt: {
        ko: '만보 워크메이트가 혁신적인 디자인과 기술력을 인정받아 대상을 수상했습니다.',
        en: 'Manbo Walkmate wins grand prize for innovative design and technology.',
      },
      content: {
        ko: {
          body: '소나버스가 개발한 만보 워크메이트가 2024 대한민국 시니어 케어 혁신상 대상을 수상했습니다.\n\n심사위원단은 "만보 워크메이트는 시니어의 실제 니즈를 정확히 파악하고, 최신 기술을 인간 중심적으로 적용한 혁신적인 제품"이라고 평가했습니다.\n\n이번 수상은 소나버스가 시니어 케어 산업의 선두주자로서의 입지를 다지는 계기가 되었습니다.',
        },
        en: {
          body: 'The Manbo Walkmate developed by Sonaverse won the grand prize at the 2024 Korea Senior Care Innovation Award.\n\nThe judging panel evaluated it as "an innovative product that accurately identifies seniors\' actual needs and applies cutting-edge technology in a human-centered manner."\n\nThis award has solidified Sonaverse\'s position as a leader in the senior care industry.',
        },
      },
      media_outlet: '한국경제',
      publication_date: new Date('2024-03-15'),
      external_link: 'https://example.com/press/sonaverse-award',
      is_published: true,
      view_count: 1250,
      created_by: admin._id,
      created_at: new Date('2024-03-15'),
      updated_at: new Date('2024-03-15'),
    },
    {
      press_id: `PR-${uuidv4().substring(0, 8).toUpperCase()}`,
      slug: 'sonaverse-partnership-announcement',
      category: 'partnership',
      title: {
        ko: '소나버스, 주요 요양 기관과 전략적 파트너십 체결',
        en: 'Sonaverse Forms Strategic Partnership with Major Care Facilities',
      },
      excerpt: {
        ko: '전국 200여 개 요양 기관에 프리미엄 시니어 케어 제품을 공급하기로 했습니다.',
        en: 'Agreement to supply premium senior care products to over 200 care facilities nationwide.',
      },
      content: {
        ko: {
          body: '소나버스가 전국 주요 요양 기관 및 복지 센터와 전략적 파트너십을 체결했습니다.\n\n이번 파트너십을 통해 만보 워크메이트와 보듬 기저귀가 전국 200여 개 기관에 공급되며, 더 많은 시니어들이 프리미엄 케어 제품을 경험할 수 있게 되었습니다.\n\n소나버스는 앞으로도 시니어 케어의 품질 향상을 위해 다양한 기관들과 협력을 확대해 나갈 계획입니다.',
        },
        en: {
          body: 'Sonaverse has signed strategic partnerships with major care facilities and welfare centers nationwide.\n\nThrough this partnership, Manbo Walkmate and Bodume diapers will be supplied to over 200 facilities nationwide, allowing more seniors to experience premium care products.\n\nSonaverse plans to expand cooperation with various institutions to improve the quality of senior care.',
        },
      },
      media_outlet: '헬스조선',
      publication_date: new Date('2024-03-20'),
      external_link: 'https://example.com/press/partnership',
      is_published: true,
      view_count: 890,
      created_by: admin._id,
      created_at: new Date('2024-03-20'),
      updated_at: new Date('2024-03-20'),
    },
  ];

  await PressRelease.insertMany(pressReleases);
  console.log('✅ PressRelease 샘플 데이터 생성 완료 (2개)');
}

async function seedInquiries() {
  const Inquiry = (await import('../src/lib/models/Inquiry')).default;

  const inquiryCount = await Inquiry.countDocuments();
  if (inquiryCount > 0) {
    console.log('⏭️  Inquiry 데이터가 이미 존재합니다. 건너뜁니다.');
    return;
  }

  const inquiries = [
    {
      inquiry_number: `INQ-${Date.now()}-001`,
      inquiry_type: 'product_inquiry',
      name: '김철수',
      email: 'kim@example.com',
      phone_number: '010-1234-5678',
      message: '만보 워크메이트의 가격과 구매 방법에 대해 문의드립니다.',
      status: 'pending',
      privacy_consented: true,
      created_at: new Date('2024-03-25'),
      updated_at: new Date('2024-03-25'),
    },
    {
      inquiry_number: `INQ-${Date.now()}-002`,
      inquiry_type: 'service_introduction',
      name: '이영희',
      email: 'lee@example.com',
      phone_number: '010-9876-5432',
      company: '실버케어센터',
      message: '요양 기관에 제품을 공급받고 싶습니다. 담당자 연결 부탁드립니다.',
      status: 'in_progress',
      privacy_consented: true,
      created_at: new Date('2024-03-22'),
      updated_at: new Date('2024-03-24'),
    },
  ];

  await Inquiry.insertMany(inquiries);
  console.log('✅ Inquiry 샘플 데이터 생성 완료 (2개)');
}

async function seedCompanyHistory() {
  const CompanyHistory = (await import('../src/lib/models/CompanyHistory')).default;
  const AdminUser = (await import('../src/lib/models/AdminUser')).default;

  const historyCount = await CompanyHistory.countDocuments();
  if (historyCount > 0) {
    console.log('⏭️  CompanyHistory 데이터가 이미 존재합니다. 건너뜁니다.');
    return;
  }

  const admin = await AdminUser.findOne({ role: 'admin' });
  if (!admin) {
    console.log('⚠️  AdminUser가 없어서 CompanyHistory를 생성할 수 없습니다.');
    return;
  }

  const histories = [
    {
      year: 2020,
      month: 3,
      order: 1,
      title: { ko: '소나버스 법인 설립', en: 'Sonaverse Corporation Founded' },
      description: {
        ko: '시니어 케어 전문 기업 소나버스 설립',
        en: 'Founded Sonaverse as senior care specialist company',
      },
      category: 'milestone',
      created_by: admin._id,
      created_at: new Date(),
    },
    {
      year: 2021,
      month: 6,
      order: 2,
      title: { ko: '만보 워크메이트 출시', en: 'Manbo Walkmate Launch' },
      description: {
        ko: '하이브리드형 스마트 보행기 만보 워크메이트 출시',
        en: 'Launch of Manbo Walkmate hybrid smart walker',
      },
      category: 'product',
      created_by: admin._id,
      created_at: new Date(),
    },
    {
      year: 2022,
      month: 9,
      order: 3,
      title: { ko: '보듬 기저귀 라인업 런칭', en: 'Bodume Diaper Lineup Launch' },
      description: {
        ko: '프리미엄 성인용 기저귀 보듬 시리즈 출시',
        en: 'Launch of Bodume premium adult diaper series',
      },
      category: 'product',
      created_by: admin._id,
      created_at: new Date(),
    },
    {
      year: 2024,
      month: 3,
      order: 4,
      title: { ko: '시니어 케어 혁신상 수상', en: 'Senior Care Innovation Award' },
      description: {
        ko: '대한민국 시니어 케어 혁신상 대상 수상',
        en: 'Won grand prize at Korea Senior Care Innovation Award',
      },
      category: 'award',
      created_by: admin._id,
      created_at: new Date(),
    },
  ];

  await CompanyHistory.insertMany(histories);
  console.log('✅ CompanyHistory 샘플 데이터 생성 완료 (4개)');
}

async function main() {
  console.log('🌱 샘플 데이터 시드 시작...\n');

  await connectDB();

  await seedAdminUsers();
  await seedStories();
  await seedPress();
  await seedInquiries();
  await seedCompanyHistory();

  console.log('\n✅ 모든 샘플 데이터 생성 완료!');
  console.log('\n📊 생성된 데이터 요약:');
  console.log('   - AdminUser: 2개');
  console.log('   - SonaverseStory: 3개');
  console.log('   - PressRelease: 2개');
  console.log('   - Inquiry: 2개');
  console.log('   - CompanyHistory: 4개');
  console.log('\n💡 관리자 로그인 정보:');
  console.log('   Email: admin@sonaverse.kr');
  console.log('   Password: admin1234!');

  await mongoose.disconnect();
  console.log('\n✅ MongoDB 연결 종료');
}

main().catch((error) => {
  console.error('❌ 에러 발생:', error);
  process.exit(1);
});
