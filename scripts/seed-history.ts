import mongoose from 'mongoose';
import History from '../src/lib/models/History';
import dbConnect from '../src/lib/db';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const historyData = [
    {
        year: 9999,
        title: { ko: "계속되는 여정", en: "Continuing Journey" },
        subtitle: { ko: "시니어 라이프 혁신을 위한 소나버스의 도전은 계속됩니다.", en: "Sonaverse's challenge for senior life innovation continues." },
        items: [],
        badge_color: "#1C4376",
        text_color: "#ffffff",
        position: "left",
        order: 0,
        is_active: true
    },
    {
        year: 2026,
        title: { ko: "하이브리드 워크메이트 출시", en: "Launch of Hybrid Walkmate" },
        subtitle: { ko: "혁신적인 보행 보조 기술의 상용화 달성", en: "Commercialization of Innovative Walking Assist Technology" },
        items: [
            { text: { ko: "만보 런칭 목표(2026.6)", en: "Manbo Launch Target (June 2026)" }, order: 1 }
        ],
        badge_color: "#1C4376",
        text_color: "#ffffff",
        position: "right",
        order: 1,
        is_active: true
    },
    {
        year: 2025,
        title: { ko: "제품 상용화 원년", en: "First Year of Product Commercialization" },
        subtitle: { ko: "첫 번째 제품 출시와 본격적인 시장 진입", en: "First Product Launch & Market Entry" },
        items: [
            { text: { ko: "신용보증기금 Startup-NEST 17기 선정", en: "Selected for KODIT Startup-NEST 17th" }, order: 1 },
            { text: { ko: "창업중심대학 선정", en: "Selected for Entrepreneurship University" }, order: 2 },
            { text: { ko: "리틀펭귄 보증 확보", en: "Secured Little Penguin Guarantee" }, order: 3 },
            { text: { ko: "글로벌 MOU 체결", en: "Global MOU Signed" }, order: 4 },
            { text: { ko: "보듬 기저귀 런칭", en: "Bodume Diaper Launch" }, order: 5 },
            { text: { ko: "크라우드 펀딩 진행", en: "Crowdfunding Campaign" }, order: 6 },
            { text: { ko: "알리바바 입점", en: "Alibaba Entry" }, order: 7 }
        ],
        badge_color: "#1C4376",
        text_color: "#ffffff",
        position: "left",
        order: 2,
        is_active: true
    },
    {
        year: 2024,
        title: { ko: "글로벌 진출 및 품질 인증", en: "Global Expansion & Quality Certification" },
        subtitle: { ko: "국제 표준 인증과 글로벌 파트너십 구축", en: "International Standards & Global Partnerships" },
        items: [
            { text: { ko: "ISO 인증 취득(9001/14001)", en: "ISO Certification (9001/14001)" }, order: 1 },
            { text: { ko: "2024 여성창업경진대회 이사장상 수상", en: "2024 Women's Entrepreneurship Competition Award" }, order: 2 },
            { text: { ko: "강소특구 기술이전사업화 R&D 선정", en: "Selected for Innopolis Tech Transfer R&D" }, order: 3 },
            { text: { ko: "창업성장기술개발사업(디딤돌)", en: "TIPS R&D Program Selection" }, order: 4 }
        ],
        badge_color: "#1C4376",
        text_color: "#ffffff",
        position: "right",
        order: 3,
        is_active: true
    },
    {
        year: 2023,
        title: { ko: "기술력 검증 및 성장 기반 구축", en: "Tech Verification & Growth Foundation" },
        subtitle: { ko: "정부 지원 사업 선정과 벤처 생태계 진입", en: "Government Support & Venture Ecosystem Entry" },
        items: [
            { text: { ko: "㈜강원대학교 기술지주회사 출자", en: "Investment from Kangwon National University Holdings" }, order: 1 },
            { text: { ko: "G-스타트업 예비창업 지원사업 선정", en: "Selected for G-Startup Pre-entrepreneur Support" }, order: 2 },
            { text: { ko: "LINC 3.0 기술사업화 지원사업 선정", en: "Selected for LINC 3.0 Tech Commercialization" }, order: 3 },
            { text: { ko: "연구소 기업 승인", en: "Approved as Research Institute Company" }, order: 4 },
            { text: { ko: "벤처기업 인증 취득", en: "Venture Company Certification" }, order: 5 }
        ],
        badge_color: "#1C4376",
        text_color: "#ffffff",
        position: "left",
        order: 4,
        is_active: true
    },
    {
        year: 2022,
        title: { ko: "㈜소나버스 법인 설립", en: "Incorporation of Sonaverse Inc." },
        subtitle: { ko: "시니어 케어 시장 진입과 혁신 기술 개발의 시작", en: "Entering Senior Care Market & Starting Innovation" },
        items: [
            { text: { ko: "기업부설연구소 설립", en: "R&D Center Established" }, order: 1 },
            { text: { ko: "여성기업 인증 취득", en: "Women-owned Business Certification" }, order: 2 }
        ],
        badge_color: "#1C4376",
        text_color: "#ffffff",
        position: "right",
        order: 5,
        is_active: true
    }
];

async function seed() {
    try {
        await dbConnect();
        console.log('Connected to DB');

        // Clear existing data
        await History.deleteMany({});
        console.log('Cleared existing history data');

        // Insert new data
        await History.insertMany(historyData);
        console.log('Inserted history data');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding history:', error);
        process.exit(1);
    }
}

seed();
