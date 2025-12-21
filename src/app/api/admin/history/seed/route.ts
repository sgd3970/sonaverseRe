import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import History from '@/lib/models/History';

// 초기 연혁 데이터
const initialHistoryData = [
  {
    year: 2022,
    title: { ko: '㈜소나버스 법인 설립', en: 'Sonaverse Inc. Established' },
    subtitle: { ko: '시니어 케어 시장 진입과 혁신 기술 개발의 시작', en: 'Entry into senior care market and beginning of innovative technology development' },
    items: [
      { text: { ko: '기업부설연구소 설립', en: 'Establishment of Corporate R&D Center' }, order: 0 },
      { text: { ko: '여성기업 인증 취득', en: 'Women-owned Business Certification' }, order: 1 },
    ],
    badge_color: '#ced7e4',
    text_color: '#000000',
    position: 'right',
    order: 0,
  },
  {
    year: 2023,
    title: { ko: '기술력 검증 및 성장 기반 구축', en: 'Technology Verification and Growth Foundation' },
    subtitle: { ko: '정부 지원 사업 선정과 벤처 생태계 진입', en: 'Government support program selection and venture ecosystem entry' },
    items: [
      { text: { ko: '㈜강원대학교 기술지주회사 출자', en: 'Investment from Kangwon National University Technology Holdings' }, order: 0 },
      { text: { ko: 'G-스타트업 예비창업 지원사업 선정', en: 'G-Startup Pre-entrepreneurship Support Program Selection' }, order: 1 },
      { text: { ko: 'LINC 3.0 기술사업화 지원사업 선정', en: 'LINC 3.0 Technology Commercialization Support Program Selection' }, order: 2 },
      { text: { ko: '연구소 기업 승인', en: 'Research Institute Company Approval' }, order: 3 },
      { text: { ko: '벤처기업 인증 취득', en: 'Venture Business Certification' }, order: 4 },
    ],
    badge_color: '#9dafc9',
    text_color: '#000000',
    position: 'left',
    order: 1,
  },
  {
    year: 2024,
    title: { ko: '글로벌 진출 및 품질 인증', en: 'Global Expansion and Quality Certification' },
    subtitle: { ko: '국제 표준 인증과 글로벌 파트너십 구축', en: 'International standard certification and global partnership establishment' },
    items: [
      { text: { ko: 'ISO 인증 취득(9001/14001)', en: 'ISO Certification (9001/14001)' }, order: 0 },
      { text: { ko: '2024 여성창업경진대회 이사장상 수상', en: '2024 Women Entrepreneurship Competition Chairman Award' }, order: 1 },
      { text: { ko: '강소특구 기술이전사업화 R&D 선정', en: 'Strong Special Zone Technology Transfer Commercialization R&D Selection' }, order: 2 },
      { text: { ko: '창업성장기술개발사업(디딤돌)', en: 'Startup Growth Technology Development Project (Stepping Stone)' }, order: 3 },
    ],
    badge_color: '#6d88ad',
    text_color: '#000000',
    position: 'right',
    order: 2,
  },
  {
    year: 2025,
    title: { ko: '제품 상용화 원년', en: 'Year of Product Commercialization' },
    subtitle: { ko: '첫 번째 제품 출시와 본격적인 시장 진입', en: 'First product launch and full-scale market entry' },
    items: [
      { text: { ko: '신용보증기금 Startup-NEST 17기 선정', en: 'Korea Credit Guarantee Fund Startup-NEST 17th Selection' }, order: 0 },
      { text: { ko: '창업중심대학 선정', en: 'Startup-focused University Selection' }, order: 1 },
      { text: { ko: '리틀펭귄 보증 확보', en: 'Little Penguin Guarantee Secured' }, order: 2 },
      { text: { ko: '글로벌 MOU 체결', en: 'Global MOU Agreement' }, order: 3 },
      { text: { ko: 'BO DUME 기저귀 런칭', en: 'BO DUME Diaper Launch' }, order: 4 },
      { text: { ko: '크라우드 펀딩 진행', en: 'Crowdfunding Campaign' }, order: 5 },
      { text: { ko: '알리바바 입점', en: 'Alibaba Store Entry' }, order: 6 },
    ],
    badge_color: '#3c6092',
    text_color: '#ffffff',
    position: 'left',
    order: 3,
  },
  {
    year: 2026,
    title: { ko: '하이브리드 워크메이트 출시', en: 'Hybrid Workmate Launch' },
    subtitle: { ko: '혁신적인 보행 보조 기술의 상용화 달성', en: 'Achievement of innovative walking assistance technology commercialization' },
    items: [
      { text: { ko: '만보 런칭 목표(2026.6)', en: 'MANBO Launch Target (June 2026)' }, order: 0 },
    ],
    badge_color: '#0b3877',
    text_color: '#ffffff',
    position: 'right',
    order: 4,
  },
];

// 연혁 초기 데이터 시딩
export async function POST() {
  try {
    await dbConnect();

    // 기존 데이터 확인
    const existingCount = await History.countDocuments({ deleted_at: { $exists: false } });

    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: '이미 연혁 데이터가 존재합니다. 기존 데이터를 삭제한 후 다시 시도해주세요.',
        existingCount,
      }, { status: 400 });
    }

    // 데이터 삽입
    const result = await History.insertMany(
      initialHistoryData.map(data => ({
        ...data,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );

    return NextResponse.json({
      success: true,
      message: `${result.length}개의 연혁 데이터가 생성되었습니다.`,
      data: result.map(h => ({ id: h._id, year: h.year })),
    }, { status: 201 });
  } catch (error) {
    console.error('Seed History Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed history data' },
      { status: 500 }
    );
  }
}

