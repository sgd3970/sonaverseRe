# Sonaverse 프로젝트 전체 문서화

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [데이터베이스 구조](#데이터베이스-구조)
4. [페이지별 상세 분석](#페이지별-상세-분석)
5. [관리자 CRUD 동작](#관리자-crud-동작)
6. [통계 및 분석 로직](#통계-및-분석-로직)
7. [API 엔드포인트](#api-엔드포인트)
8. [인증 및 보안](#인증-및-보안)

---

## 프로젝트 개요

**Sonaverse**는 시니어 헬스케어 제품(만보, 보듬)을 소개하고, 스토리와 언론보도를 관리하는 Next.js 기반 풀스택 웹 애플리케이션입니다.

### 주요 기능
- 🌐 다국어 지원 (한국어/영어)
- 👤 관리자 대시보드 (JWT 인증)
- 📝 콘텐츠 관리 시스템 (CMS)
- 📧 문의 접수 및 관리
- 📊 통계 및 분석 대시보드
- 🔍 SEO 최적화

---

## 기술 스택

### Frontend
- **Next.js 16.0.10** (App Router, React Server Components)
- **React 19.2.1**
- **TypeScript 5**
- **Tailwind CSS 4** + tailwindcss-animate
- **Material Symbols** (아이콘)
- **SWR 2.3.8** (데이터 페칭 및 캐싱)
- **React Hook Form 7.68.0** (폼 관리)
- **Zod 4.2.1** (스키마 검증)

### Backend
- **Next.js API Routes** (서버리스 함수)
- **MongoDB** (NoSQL 데이터베이스)
- **Mongoose 9.0.1** (ODM)
- **jose 6.1.3** (JWT 토큰)
- **bcryptjs 3.0.3** (비밀번호 해싱)

### 배포 및 스토리지
- **Vercel** (호스팅)
- **Vercel Blob 2.0.0** (파일 스토리지)

---

## 데이터베이스 구조

### MongoDB Collections (15개)

#### 1. adminusers (관리자)
```javascript
{
  email: String (unique, indexed),
  password_hash: String,
  name: String,
  role: 'super_admin' | 'admin' | 'editor' | 'viewer',
  permissions: {
    press_releases: { create, read, update, delete },
    stories: { create, read, update, delete },
    // ... 각 리소스별 권한
  },
  is_active: Boolean (indexed),
  failed_login_attempts: Number,
  locked_until: Date,
  last_login_at: Date,
  created_at: Date,
  updated_at: Date
}
```

**인덱스**:
- `{ email: 1 }` (unique)
- `{ is_active: 1, role: 1 }`

**보안 기능**:
- 로그인 5회 실패 시 15분 계정 잠금
- bcrypt 해싱 (salt rounds: 10)
- JWT 토큰 기반 세션

#### 2. sonaversestories (스토리)
```javascript
{
  slug: String (unique, indexed),
  story_id: String,
  category: 'product_story' | 'usage' | 'health_info' | 'welfare_info' | 'company_news' | 'interview',
  title: { ko: String, en: String },
  subtitle: { ko: String, en: String },
  excerpt: { ko: String, en: String },
  content: {
    ko: { body: String, blocks: Array },
    en: { body: String, blocks: Array }
  },
  thumbnail_image_id: ObjectId,
  youtube_url: String,
  youtube_video_id: String,
  tags: [String],
  is_published: Boolean (indexed),
  is_featured: Boolean,
  published_date: Date,
  view_count: Number,
  like_count: Number,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date (soft delete)
}
```

**인덱스**:
- `{ slug: 1 }` (unique)
- `{ published_date: -1, is_published: 1 }`
- `{ is_featured: 1 }`

#### 3. press (언론보도)
```javascript
{
  slug: String (unique, indexed),
  press_id: String,
  title: { ko: String, en: String },
  press_name: { ko: String, en: String },
  excerpt: { ko: String, en: String },
  content: { ko: String, en: String },
  thumbnail_image_id: ObjectId,
  external_url: String,
  published_date: Date,
  is_published: Boolean (indexed),
  is_featured: Boolean,
  view_count: Number,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date
}
```

#### 4. inquiries (문의)
```javascript
{
  inquiry_number: String (unique), // 형식: INQ-YYMMDD-XXXX
  inquiry_type: String,
  inquiry_type_label: { ko: String, en: String },
  inquirer: {
    name: String,
    position: String,
    company_name: String,
    phone_number: String,
    email: String (indexed),
    country: String,
    language: String
  },
  subject: String,
  message: String,
  status: 'pending' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed' | 'spam',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  assigned_to: ObjectId,
  responses: [{
    content: String,
    created_by: ObjectId,
    created_at: Date,
    is_internal_note: Boolean
  }],
  privacy_consented: Boolean,
  privacy_consented_at: Date,
  ip_address: String,
  user_agent: String,
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date
}
```

**문의 번호 생성 로직**:
```javascript
// 형식: INQ-YYMMDD-0001
const date = new Date()
const yearMonth = date.toISOString().slice(2, 10).replace(/-/g, '')
const todayCount = await Inquiry.countDocuments({
  inquiry_number: { $regex: `^INQ-${yearMonth}` }
})
const sequenceNumber = String(todayCount + 1).padStart(4, '0')
const inquiryNumber = `INQ-${yearMonth}-${sequenceNumber}`
```

#### 5. histories (연혁)
```javascript
{
  year: Number (unique),
  title: { ko: String, en: String },
  subtitle: { ko: String, en: String },
  items: [{
    text: { ko: String, en: String },
    order: Number
  }],
  badge_color: String, // HEX 색상
  text_color: String,  // HEX 색상
  position: 'left' | 'right',
  order: Number,
  is_active: Boolean,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date
}
```

**순서 자동 계산**:
```javascript
const lastHistory = await History.findOne({ deleted_at: { $exists: false } })
  .sort({ order: -1 })
const order = lastHistory ? lastHistory.order + 1 : 0
const position = order % 2 === 0 ? 'right' : 'left' // 좌우 교대
```

---

## 페이지별 상세 분석

### 1. 홈페이지 (`/`)

**컴포넌트 구성**:
```
┌─────────────────────────────────┐
│        HomeHero                 │  ← 메인 히어로
├─────────────────────────────────┤
│      ProblemSection             │  ← 문제 정의
├─────────────────────────────────┤
│      ProductSection             │  ← 제품 소개
├─────────────────────────────────┤
│      StoryHighlight             │  ← Featured 스토리 3개
├─────────────────────────────────┤
│      CompanyHistory             │  ← 회사 연혁 타임라인
├─────────────────────────────────┤
│      PressSection               │  ← 최신 언론보도 4개
└─────────────────────────────────┘
```

**데이터 소스**:
- `StoryHighlight`: `GET /api/stories?featured=true&limit=3`
- `CompanyHistory`: `GET /api/history?locale=ko`
- `PressSection`: `GET /api/press?limit=4`

**SEO 설정**:
```typescript
export const metadata: Metadata = {
  title: '소나버스 - 시니어 헬스케어 솔루션',
  description: '보행 보조기 만보, 성인용 기저귀 보듬',
  keywords: ['시니어', '헬스케어', '보행기', '기저귀'],
  openGraph: {
    title: '소나버스',
    description: '시니어를 위한 건강한 삶',
    images: ['/og-image.jpg'],
  }
}
```

---

### 2. 스토리 페이지

#### 2.1 목록 페이지 (`/stories`)

**UI 구조**:
```
┌─────────────────────────────────────────────┐
│ [카테고리 필터 버튼]                          │
├─────────────────────────────────────────────┤
│ [Featured 스토리 - 대형 카드]                │  ← is_featured: true
├──────────┬──────────┬──────────┬────────────┤
│ 스토리 1  │ 스토리 2  │ 스토리 3  │            │  ← 3열 그리드
├──────────┼──────────┼──────────┼────────────┤
│ [더보기 버튼]                                │  ← 무한 스크롤
└─────────────────────────────────────────────┘
```

**필터링 로직**:
```typescript
const [selectedCategory, setSelectedCategory] = useState('all')
const [displayLimit, setDisplayLimit] = useState(6)

const categories = [
  { id: 'all', label: '전체' },
  { id: 'product_story', label: '제품스토리' },
  { id: 'usage', label: '사용법' },
  { id: 'health_info', label: '건강정보' },
  { id: 'welfare_info', label: '복지정보' }
]

const { stories } = useStories({
  page: 1,
  limit: 50,
  category: selectedCategory
})

const displayedStories = stories.slice(0, displayLimit)
```

**더보기 기능**:
```typescript
const loadMore = () => {
  setDisplayLimit(prev => prev + 6) // 6개씩 추가
}
```

#### 2.2 상세 페이지 (`/stories/[id]`)

**UI 구조**:
```
┌─────────────────────────────────┐
│ [카테고리 배지]                   │
│ 제목                             │
│ 부제목                           │
│ 게시일 | 태그1 | 태그2            │
├─────────────────────────────────┤
│ [썸네일 이미지]                   │
├─────────────────────────────────┤
│ [YouTube 비디오 (있는 경우)]      │
├─────────────────────────────────┤
│ HTML 본문 내용                   │
├─────────────────────────────────┤
│ 관련 스토리 (3개)                │
└─────────────────────────────────┘
```

**데이터 로드**:
```typescript
const { data } = useSWR(`/api/stories/${params.id}`, fetcher)

// YouTube 비디오 임베드
if (story.youtubeVideoId) {
  <iframe
    src={`https://www.youtube.com/embed/${story.youtubeVideoId}`}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  />
}

// HTML 본문 렌더링 (XSS 주의)
<div dangerouslySetInnerHTML={{ __html: story.content }} />
```

**관련 스토리 추천**:
```typescript
// 같은 카테고리의 다른 스토리 3개
const relatedStories = stories
  .filter(s => s.category === story.category && s.id !== story.id)
  .slice(0, 3)
```

---

### 3. 언론보도 페이지

#### 3.1 목록 페이지 (`/press`)

**검색 기능**:
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [debouncedQuery, setDebouncedQuery] = useState('')

// 디바운싱 (500ms)
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery)
  }, 500)
  return () => clearTimeout(timer)
}, [searchQuery])

// API 호출
const { pressItems } = usePress({
  page: currentPage,
  limit: 8,
  search: debouncedQuery
})
```

**페이지네이션**:
```typescript
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 8

const totalPages = Math.ceil(total / itemsPerPage)

const PageButton = ({ page }) => (
  <button
    onClick={() => setCurrentPage(page)}
    className={currentPage === page ? 'active' : ''}
  >
    {page}
  </button>
)
```

#### 3.2 상세 페이지 (`/press/[id]`)

**외부 링크 처리**:
```typescript
{press.externalUrl && (
  <a
    href={press.externalUrl}
    target="_blank"
    rel="noopener noreferrer"  // 보안
    className="flex items-center gap-2"
  >
    원문 보기
    <span className="material-symbols-outlined">open_in_new</span>
  </a>
)}
```

---

### 4. 문의 페이지 (`/inquiry`)

**폼 구조**:
```typescript
const formSchema = z.object({
  inquiryType: z.enum([
    'service_introduction',    // 서비스 소개
    'product_inquiry',         // 제품 문의
    'quote_request',          // 견적 요청
    'demo_request',           // 데모 요청
    'technical_support',      // 기술 지원
    'partnership_proposal',   // 제휴 제안
    'technical_partnership',  // 기술 제휴
    'channel_partnership',    // 유통 제휴
  ]),
  name: z.string().min(1, '이름을 입력해주세요'),
  position: z.string().optional(),
  companyName: z.string().optional(),
  phoneNumber: z.string().regex(/^[0-9-]+$/, '올바른 전화번호를 입력해주세요'),
  email: z.string().email('올바른 이메일을 입력해주세요'),
  message: z.string().min(10, '최소 10자 이상 입력해주세요'),
  privacyConsented: z.boolean().refine(val => val === true, {
    message: '개인정보 수집에 동의해주세요'
  })
})
```

**제출 플로우**:
```
1. 클라이언트 유효성 검증 (Zod)
   ↓
2. POST /api/inquiries
   ↓
3. 서버 유효성 검증
   ↓
4. IP, User-Agent, Referrer 수집
   ↓
5. 문의 번호 생성 (INQ-YYMMDD-XXXX)
   ↓
6. DB 저장
   ↓
7. 이메일 알림 (향후 구현)
   ↓
8. 성공 메시지 표시
```

**메타데이터 수집**:
```typescript
// IP 주소
const ip = request.headers.get('x-forwarded-for') ||
           request.headers.get('x-real-ip') ||
           'unknown'

// User Agent
const userAgent = request.headers.get('user-agent') || ''

// Referrer
const referrer = request.headers.get('referer') || ''

// UTM 파라미터 (URL에서 추출)
const utmSource = searchParams.get('utm_source')
const utmMedium = searchParams.get('utm_medium')
const utmCampaign = searchParams.get('utm_campaign')
```

---

## 관리자 CRUD 동작

### Stories 관리

#### Create (생성)

**1. 슬러그 생성 알고리즘**:
```typescript
const generateSlug = (title: string) => {
  return title
    .toLowerCase()                      // 소문자 변환
    .replace(/[^가-힣a-z0-9\s]/g, '')   // 특수문자 제거
    .replace(/\s+/g, '-')               // 공백 → 하이픈
    .substring(0, 50)                   // 최대 50자
}
```

**2. 중복 확인**:
```typescript
const existingStory = await SonaverseStory.findOne({ slug: storySlug })
if (existingStory) {
  return NextResponse.json(
    { success: false, message: '이미 사용 중인 슬러그입니다.' },
    { status: 400 }
  )
}
```

**3. 문서 생성**:
```typescript
const story = await SonaverseStory.create({
  story_id: `STR-${uuidv4().substring(0, 8).toUpperCase()}`,
  slug: storySlug,
  category: mappedCategory,
  title: { ko: title, en: titleEn || '' },
  excerpt: { ko: excerpt || '', en: excerptEn || '' },
  content: {
    ko: { body: content || '' },
    en: { body: contentEn || '' }
  },
  is_published: isPublished || false,
  published_date: new Date(),
  view_count: 0,
  created_at: new Date(),
  updated_at: new Date(),
})
```

#### Read (조회)

**1. 목록 쿼리 최적화**:
```typescript
// 1) 쿼리 빌드
const query: any = { deleted_at: { $exists: false } }
if (category && category !== 'all') {
  query.category = category
}
if (search) {
  query.$or = [
    { 'title.ko': { $regex: search, $options: 'i' } },
    { 'title.en': { $regex: search, $options: 'i' } },
  ]
}

// 2) 총 개수 조회 (페이지네이션용)
const total = await SonaverseStory.countDocuments(query)

// 3) 데이터 조회
const stories = await SonaverseStory.find(query)
  .sort({ created_at: -1 })
  .skip((page - 1) * limit)
  .limit(limit)
  .lean()  // Plain JS 객체로 반환 (성능 향상)
```

**성능 최적화 팁**:
- `.lean()`: Mongoose 문서 대신 일반 객체 반환 (40% 빠름)
- `countDocuments()`: 개수만 세기 (find + count보다 빠름)
- 인덱스 활용: `{ created_at: -1, is_published: 1 }`

#### Update (수정)

**1. 부분 업데이트 패턴**:
```typescript
const updateData: Record<string, unknown> = {
  updated_at: new Date(),
}

// 제공된 필드만 업데이트
if (title !== undefined) updateData['title.ko'] = title
if (titleEn !== undefined) updateData['title.en'] = titleEn
if (excerpt !== undefined) updateData['excerpt.ko'] = excerpt
// ...

const story = await SonaverseStory.findByIdAndUpdate(
  id,
  updateData,
  { new: true }  // 업데이트된 문서 반환
)
```

**2. 게시 상태 전환**:
```typescript
if (isPublished !== undefined) {
  updateData.is_published = isPublished
  // 처음 게시되는 경우에만 published_date 설정
  if (isPublished && !currentStory.published_date) {
    updateData.published_date = new Date()
  }
}
```

#### Delete (삭제)

**Soft Delete 패턴**:
```typescript
const story = await SonaverseStory.findByIdAndUpdate(
  id,
  {
    deleted_at: new Date(),  // 삭제 시간 기록
    updated_at: new Date(),
  },
  { new: true }
)
```

**장점**:
- 데이터 복구 가능
- 삭제 이력 추적
- 연관 데이터 무결성 유지

**조회 시 자동 제외**:
```typescript
const query = {
  deleted_at: { $exists: false }  // 삭제되지 않은 항목만
}
```

---

### Press 관리

Press는 Stories와 거의 동일하지만 다음 차이점이 있음:

**1. 외부 링크 필드**:
```typescript
external_url: String  // 원문 기사 링크
```

**2. 주요 뉴스 표시**:
```typescript
is_featured: Boolean  // 메인 페이지 노출 여부

// 업데이트 시
if (isFeatured !== undefined) {
  updateData.is_featured = isFeatured
}
```

**3. 언론사명 필드**:
```typescript
press_name: { ko: String, en: String }
```

---

### Inquiries 관리

**특징**: Create 없음 (사용자가 프론트엔드에서 제출)

#### Read (조회)

**1. 상태 필터**:
```typescript
const statusOptions = [
  'all',
  'pending',      // 대기
  'in_progress',  // 처리중
  'resolved',     // 완료
  'closed',       // 종료
  'spam'          // 스팸
]

const query: any = { deleted_at: { $exists: false } }
if (status && status !== 'all') {
  query.status = status
}
```

**2. 메시지 미리보기**:
```typescript
const formattedInquiries = inquiries.map(inquiry => ({
  // ...
  message: inquiry.message?.slice(0, 100) +
           (inquiry.message?.length > 100 ? '...' : ''),
}))
```

#### Update (상태 변경)

**1. 상태 전환 UI**:
```typescript
const statusColors = {
  pending: 'bg-yellow-500',
  in_progress: 'bg-blue-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500',
  spam: 'bg-red-500'
}

<select
  value={inquiry.status}
  onChange={e => handleStatusChange(e.target.value)}
>
  {statusOptions.map(status => (
    <option key={status} value={status}>
      {statusLabels[status]}
    </option>
  ))}
</select>
```

**2. 낙관적 업데이트**:
```typescript
const handleStatusChange = async (newStatus: string) => {
  // 1) UI 즉시 업데이트 (낙관적)
  mutate({ ...inquiry, status: newStatus }, false)

  // 2) API 호출
  const res = await fetch(`/api/admin/inquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus }),
  })

  // 3) 실패 시 롤백
  if (!res.ok) {
    mutate()  // 서버 데이터로 되돌림
  }
}
```

---

### History 관리

#### Create (생성)

**1. 연도 중복 방지**:
```typescript
const existing = await History.findOne({
  year,
  deleted_at: { $exists: false }
})
if (existing) {
  return NextResponse.json(
    { success: false, message: '이미 해당 연도의 연혁이 존재합니다.' },
    { status: 400 }
  )
}
```

**2. 순서 자동 계산**:
```typescript
const lastHistory = await History.findOne({ deleted_at: { $exists: false } })
  .sort({ order: -1 })
  .lean()

const order = lastHistory ? lastHistory.order + 1 : 0
```

**3. 좌우 교대 배치**:
```typescript
const position = order % 2 === 0 ? 'right' : 'left'
```

**4. 동적 항목 관리**:
```typescript
// 항목 추가
const addItem = () => {
  setFormData(prev => ({
    ...prev,
    items: [...prev.items, { text: '', textEn: '' }]
  }))
}

// 항목 삭제
const removeItem = (index: number) => {
  setFormData(prev => ({
    ...prev,
    items: prev.items.filter((_, i) => i !== index)
  }))
}

// 항목 수정
const updateItem = (index: number, field: 'text' | 'textEn', value: string) => {
  setFormData(prev => ({
    ...prev,
    items: prev.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
  }))
}
```

**5. 색상 미리보기**:
```typescript
<div
  className="w-16 h-16 rounded-full"
  style={{
    backgroundColor: formData.badgeColor,
    color: formData.textColor
  }}
>
  {formData.year}
</div>
```

#### 초기 데이터 시딩

**시딩 엔드포인트**: `POST /api/admin/history/seed`

```typescript
const seedData = [
  {
    year: 2024,
    title: { ko: '소나버스 시리즈 A 투자 유치', en: 'Series A Funding' },
    items: [
      { text: { ko: '30억원 규모 투자 유치', en: '3 billion KRW funding' } },
    ],
    badge_color: '#0b3877',
    text_color: '#ffffff',
    position: 'right',
    order: 0,
  },
  // ...
]

await History.insertMany(seedData)
```

---

## 통계 및 분석 로직

### 대시보드 통계 (`/admin`)

#### 1. 데이터 소스 (`/api/admin/dashboard/stats`)

**쿼리 로직**:
```typescript
// 1) 스토리 수
const Story = mongoose.models.LegacyStory ||
              mongoose.model('LegacyStory', new mongoose.Schema({}, {
                collection: 'sonaversestories'
              }))
const storiesCount = await Story.countDocuments({ is_published: true })

// 2) 언론보도 수
const Press = mongoose.models.LegacyPress ||
              mongoose.model('LegacyPress', new mongoose.Schema({}, {
                collection: 'press'
              }))
const pressCount = await Press.countDocuments({ is_active: true })

// 3) 문의 수
const Inquiry = mongoose.models.Inquiry ||
                mongoose.model('Inquiry', new mongoose.Schema({}, {
                  collection: 'inquiries'
                }))
const totalInquiries = await Inquiry.countDocuments()
const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' })

// 4) 오늘 방문자 (visitorlogs 컬렉션이 있는 경우)
const today = new Date()
today.setHours(0, 0, 0, 0)  // 오늘 00:00:00

const VisitorLog = mongoose.models.VisitorLog ||
                   mongoose.model('VisitorLog', new mongoose.Schema({
                     createdAt: Date
                   }, { collection: 'visitorlogs' }))

const todayVisitors = await VisitorLog.countDocuments({
  createdAt: { $gte: today }  // 오늘 이후
})
```

**응답 데이터**:
```typescript
{
  todayVisitors: 0,
  totalInquiries: 42,
  pendingInquiries: 3,
  storiesCount: 12,
  pressCount: 8,
  stats: [
    { title: '오늘 방문자', value: '0', icon: 'visibility', change: '+0%' },
    { title: '신규 문의', value: '3', icon: 'inbox', change: '전체 42건' },
    { title: '스토리', value: '12', icon: 'auto_stories', change: '게시됨' },
    { title: '언론보도', value: '8', icon: 'article', change: '게시됨' },
  ]
}
```

#### 2. 최근 활동 (하드코딩)

현재는 **정적 데이터**로 구현됨:
```typescript
const recentActivities = [
  {
    type: "Press",
    content: "신규 보도자료 등록: 소나버스 시리즈A...",
    time: "2시간 전",
    status: "게시됨",
  },
  // ...
]
```

**개선 방안** (향후):
```typescript
// 1) ActivityLog 컬렉션 생성
const ActivityLog = new mongoose.Schema({
  type: String,      // 'press_created', 'inquiry_received', etc.
  user_id: ObjectId,
  resource_id: ObjectId,
  resource_type: String,
  action: String,
  details: Object,
  created_at: Date,
})

// 2) 최근 활동 조회
const activities = await ActivityLog.find()
  .sort({ created_at: -1 })
  .limit(10)
  .populate('user_id', 'name')
  .lean()
```

---

### 분석 대시보드 (`/admin/analytics`)

#### 1. 통계 카드 (8개)

**현재 구현**: 정적 데이터 (하드코딩)

```typescript
const stats = [
  {
    icon: "visibility",
    title: "전체 방문자수",
    value: "48,294",
    change: "+12.5%",
    trend: "up"
  },
  {
    icon: "timer",
    title: "평균 체류시간",
    value: "05:42",
    change: "+0.8%",
    trend: "up"
  },
  {
    icon: "ads_click",
    title: "문의 전환율",
    value: "3.42%",
    change: "-0.2%",
    trend: "down"
  },
  // ... 5개 더
]
```

**계산 로직 (향후 구현)**:

1. **전체 방문자수**:
```typescript
const totalVisitors = await VisitorLog.countDocuments({
  createdAt: {
    $gte: startDate,  // 기간 시작
    $lte: endDate     // 기간 종료
  }
})
```

2. **평균 체류시간**:
```typescript
const sessions = await VisitorLog.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  {
    $group: {
      _id: null,
      avgDuration: { $avg: '$duration' }  // 초 단위
    }
  }
])

const minutes = Math.floor(sessions[0].avgDuration / 60)
const seconds = sessions[0].avgDuration % 60
const avgTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
```

3. **문의 전환율**:
```typescript
const totalVisitors = await VisitorLog.countDocuments({ ... })
const totalInquiries = await Inquiry.countDocuments({
  created_at: { $gte: startDate }
})

const conversionRate = (totalInquiries / totalVisitors * 100).toFixed(2)
```

**왜 이렇게 계산하는가?**
- **전환율 = 목표 달성 수 / 전체 방문자 수 × 100**
- 예: 1,000명 방문, 34명 문의 → 3.4% 전환율

4. **이탈률**:
```typescript
const bouncedSessions = await VisitorLog.countDocuments({
  createdAt: { $gte: startDate },
  pageViews: 1  // 1페이지만 보고 나간 경우
})

const bounceRate = (bouncedSessions / totalVisitors * 100).toFixed(1)
```

**왜 이렇게 계산하는가?**
- **이탈률 = 1페이지만 본 세션 수 / 전체 세션 수 × 100**
- 낮을수록 좋음 (사용자가 여러 페이지 탐색)

5. **신규 방문자**:
```typescript
const newVisitors = await VisitorLog.countDocuments({
  createdAt: { $gte: startDate },
  isReturning: false  // 첫 방문
})
```

6. **페이지뷰 (PV)**:
```typescript
const pageViews = await VisitorLog.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  { $group: { _id: null, total: { $sum: '$pageViews' } } }
])
```

7. **활성 세션**:
```typescript
const now = new Date()
const fiveMinutesAgo = new Date(now - 5 * 60 * 1000)

const activeSessions = await VisitorLog.countDocuments({
  lastActivity: { $gte: fiveMinutesAgo }  // 5분 이내 활동
})
```

8. **순방문자 (UV)**:
```typescript
const uniqueVisitors = await VisitorLog.distinct('userId', {
  createdAt: { $gte: startDate }
}).length
```

**UV vs PV 차이**:
- **PV (Page Views)**: 총 페이지 조회 수
- **UV (Unique Visitors)**: 고유 방문자 수
- 예: 1명이 10페이지 보면 → PV: 10, UV: 1

#### 2. 방문자 트렌드 차트

**현재 구현**: SVG 하드코딩

```typescript
<svg viewBox="0 0 1000 300">
  {/* 영역 채우기 */}
  <path
    d="M0 250 L0 150 C 100 130, 200 200, 300 120 ..."
    fill="url(#gradientPrimary)"
  />

  {/* 선 그래프 */}
  <path
    d="M0 150 C 100 130, 200 200, 300 120 ..."
    stroke="#3b82f6"
    strokeWidth="4"
  />

  {/* 데이터 포인트 */}
  <circle cx="300" cy="120" r="6" fill="#3b82f6" />
</svg>
```

**실제 구현 방안**:

```typescript
// 1) 일별 방문자 데이터 조회
const dailyData = await VisitorLog.aggregate([
  {
    $match: {
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)  // 30일 전
      }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
      },
      visitors: { $sum: 1 },
      pageViews: { $sum: '$pageViews' }
    }
  },
  { $sort: { _id: 1 } }
])

// 2) SVG 좌표 계산
const maxVisitors = Math.max(...dailyData.map(d => d.visitors))
const chartHeight = 300
const chartWidth = 1000

const points = dailyData.map((d, i) => ({
  x: (i / (dailyData.length - 1)) * chartWidth,
  y: chartHeight - (d.visitors / maxVisitors * chartHeight)
}))

// 3) Path 생성
const linePath = points
  .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
  .join(' ')
```

**왜 이렇게 계산하는가?**
- **Y축 정규화**: 최댓값을 차트 높이에 맞춤
- **공식**: `y = chartHeight - (value / maxValue * chartHeight)`
- 예: 최댓값 1000, 현재값 500 → y = 300 - (500/1000 * 300) = 150

#### 3. 전환 퍼널 (Funnel)

**현재 구현**: 정적 데이터

```typescript
const funnelSteps = [
  { label: "전체 유입", value: "48,294 (100%)", width: 100 },
  { label: "제품 상세 조회", value: "12,042 (24.9%)", width: 24.9 },
  { label: "문의 폼 진입", value: "4,520 (9.3%)", width: 9.3 },
  { label: "문의 완료", value: "1,652 (3.4%)", width: 3.4 }
]
```

**실제 계산 로직**:

```typescript
// 1) 전체 유입
const totalVisitors = await VisitorLog.countDocuments({
  createdAt: { $gte: startDate }
})

// 2) 제품 상세 조회
const productViews = await VisitorLog.countDocuments({
  createdAt: { $gte: startDate },
  visitedPages: { $in: ['/products/manbo', '/products/bodume'] }
})

// 3) 문의 폼 진입
const formEntries = await VisitorLog.countDocuments({
  createdAt: { $gte: startDate },
  visitedPages: '/inquiry'
})

// 4) 문의 완료
const completedInquiries = await Inquiry.countDocuments({
  created_at: { $gte: startDate }
})

// 5) 비율 계산
const funnelSteps = [
  {
    label: "전체 유입",
    count: totalVisitors,
    percentage: 100,
    width: 100
  },
  {
    label: "제품 상세 조회",
    count: productViews,
    percentage: (productViews / totalVisitors * 100).toFixed(1),
    width: (productViews / totalVisitors * 100)
  },
  {
    label: "문의 폼 진입",
    count: formEntries,
    percentage: (formEntries / totalVisitors * 100).toFixed(1),
    width: (formEntries / totalVisitors * 100)
  },
  {
    label: "문의 완료",
    count: completedInquiries,
    percentage: (completedInquiries / totalVisitors * 100).toFixed(1),
    width: (completedInquiries / totalVisitors * 100)
  }
]
```

**퍼널 분석의 의미**:
- **각 단계별 이탈률 파악**
- 예: 제품 상세(24.9%) → 문의 폼(9.3%)
  - 이탈률: (24.9 - 9.3) / 24.9 × 100 = **62.7%**
  - 해석: 제품을 본 사용자 중 62.7%가 문의 폼에 진입하지 않음
  - 개선: 제품 페이지에 문의 버튼 강조

#### 4. 유입 키워드 분석

**현재 구현**: 정적 데이터

```typescript
const keywords = [
  { keyword: "노인 보행기 추천", searches: "12,402", change: "+24%", percentage: 70 },
  // ...
]
```

**실제 구현** (Google Analytics 4 연동 필요):

```typescript
// GA4 Data API 사용
import { BetaAnalyticsDataClient } from '@google-analytics/data'

const analyticsDataClient = new BetaAnalyticsDataClient()

const [response] = await analyticsDataClient.runReport({
  property: `properties/${GA4_PROPERTY_ID}`,
  dateRanges: [
    {
      startDate: '30daysAgo',
      endDate: 'today',
    },
  ],
  dimensions: [
    { name: 'searchTerm' },  // 검색어
  ],
  metrics: [
    { name: 'sessions' },  // 세션 수
  ],
  orderBys: [
    {
      metric: { metricName: 'sessions' },
      desc: true,
    },
  ],
  limit: 10,
})

const keywords = response.rows.map(row => ({
  keyword: row.dimensionValues[0].value,
  searches: row.metricValues[0].value,
  // 전월 대비 변화율 계산...
}))
```

#### 5. 인기 방문 페이지

**계산 로직**:

```typescript
const topPages = await VisitorLog.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  { $unwind: '$visitedPages' },  // 배열 풀기
  {
    $group: {
      _id: '$visitedPages',
      pageViews: { $sum: 1 },
      avgDuration: { $avg: '$duration' },
      bounces: {
        $sum: { $cond: [{ $eq: ['$pageViews', 1] }, 1, 0] }
      },
      totalSessions: { $sum: 1 }
    }
  },
  {
    $project: {
      path: '$_id',
      pageViews: 1,
      avgDuration: 1,
      bounceRate: {
        $multiply: [
          { $divide: ['$bounces', '$totalSessions'] },
          100
        ]
      }
    }
  },
  { $sort: { pageViews: -1 } },
  { $limit: 10 }
])

// 체류시간 포맷팅
topPages.forEach(page => {
  const minutes = Math.floor(page.avgDuration / 60)
  const seconds = Math.floor(page.avgDuration % 60)
  page.avgDurationFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
```

#### 6. 세부 통계 (접속 기기, 연령대, 유입 채널, 지역)

**계산 로직**:

```typescript
// 1) 접속 기기
const devices = await VisitorLog.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  {
    $group: {
      _id: '$deviceType',  // mobile, desktop, tablet
      count: { $sum: 1 }
    }
  }
])

const totalDevices = devices.reduce((sum, d) => sum + d.count, 0)
const deviceStats = devices.map(d => ({
  name: d._id,
  value: (d.count / totalDevices * 100).toFixed(0)
}))

// 2) 주요 연령대 (Google Analytics 필요)
// GA4에서 age 데이터 가져오기

// 3) 유입 채널
const channels = await VisitorLog.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  {
    $group: {
      _id: '$source',  // search, direct, social, referral
      count: { $sum: 1 }
    }
  }
])

// 4) 방문 지역 (IP 기반 지역 분석)
const regions = await VisitorLog.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  {
    $group: {
      _id: '$region',  // 서울, 경기, 부산, ...
      count: { $sum: 1 }
    }
  }
])
```

---

## API 엔드포인트

### 공개 API

#### 1. Stories API

**GET /api/stories**
```typescript
// 요청
GET /api/stories?page=1&limit=10&category=product_story&locale=ko

// 응답
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "slug": "manbo-walkmate-launch",
      "category": "product_story",
      "title": "만보 워크메이트 출시 스토리",
      "excerpt": "시니어를 위한 혁신적인 보행 보조기",
      "thumbnailUrl": "/uploads/stories/thumb.jpg",
      "tags": ["만보", "보행기"],
      "publishedAt": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

**GET /api/stories/[slug]**
```typescript
// 요청
GET /api/stories/manbo-walkmate-launch?locale=ko

// 응답
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "slug": "manbo-walkmate-launch",
    "category": "product_story",
    "title": "만보 워크메이트 출시 스토리",
    "subtitle": "걷는 즐거움을 다시 찾다",
    "content": "<p>HTML 본문...</p>",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "tags": ["만보", "보행기"],
    "relatedStories": [...]
  }
}
```

#### 2. Press API

**GET /api/press**
```typescript
// 요청
GET /api/press?page=1&limit=8&search=투자

// 응답
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "slug": "series-a-funding",
      "title": "소나버스, 시리즈A 30억 투자 유치",
      "pressName": "한국경제",
      "excerpt": "시니어 헬스케어 스타트업...",
      "externalUrl": "https://hankyung.com/article/...",
      "publishedDate": "2024-01-10T00:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### 3. Inquiries API

**POST /api/inquiries**
```typescript
// 요청
POST /api/inquiries
Content-Type: application/json

{
  "inquiryType": "partnership_proposal",
  "name": "홍길동",
  "position": "팀장",
  "companyName": "(주)ABC",
  "phoneNumber": "010-1234-5678",
  "email": "hong@abc.com",
  "message": "제휴 제안 드립니다...",
  "privacyConsented": true,
  "locale": "ko"
}

// 응답
{
  "success": true,
  "data": {
    "inquiryNumber": "INQ-241215-0042",
    "message": "문의가 정상적으로 접수되었습니다."
  }
}
```

### 관리자 API

**인증 방식**: JWT 토큰 (HttpOnly 쿠키)

#### 1. Auth API

**POST /api/admin/auth/login**
```typescript
// 요청
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@sonaverse.kr",
  "password": "password123"
}

// 응답 (성공)
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439013",
      "email": "admin@sonaverse.kr",
      "name": "소나버스 관리자",
      "role": "admin"
    }
  }
}

// Set-Cookie: admin_token=eyJhbGciOiJIUzI1NiIs...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800

// 응답 (실패)
{
  "success": false,
  "message": "이메일 또는 비밀번호가 잘못되었습니다.",
  "remainingAttempts": 3  // 남은 시도 횟수
}
```

**로그인 보안 로직**:
```typescript
// 1) 계정 잠금 확인
if (user.locked_until && user.locked_until > new Date()) {
  const remainingMinutes = Math.ceil(
    (user.locked_until - new Date()) / 60000
  )
  return NextResponse.json({
    success: false,
    message: `계정이 잠겼습니다. ${remainingMinutes}분 후 다시 시도하세요.`
  }, { status: 403 })
}

// 2) 비밀번호 검증
const isValid = await bcrypt.compare(password, user.password_hash)

if (!isValid) {
  // 실패 횟수 증가
  user.failed_login_attempts += 1

  // 5회 실패 시 15분 잠금
  if (user.failed_login_attempts >= 5) {
    user.locked_until = new Date(Date.now() + 15 * 60 * 1000)
    user.failed_login_attempts = 0
  }

  await user.save()

  return NextResponse.json({
    success: false,
    message: '이메일 또는 비밀번호가 잘못되었습니다.',
    remainingAttempts: 5 - user.failed_login_attempts
  }, { status: 401 })
}

// 3) 성공 처리
user.failed_login_attempts = 0
user.locked_until = null
user.last_login_at = new Date()
await user.save()

// 4) JWT 토큰 생성
const token = await new SignJWT({
  userId: user._id.toString(),
  email: user.email,
  role: user.role
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('7d')
  .sign(new TextEncoder().encode(process.env.JWT_SECRET))

// 5) 쿠키 설정
const response = NextResponse.json({ success: true, data: { user } })
response.cookies.set('admin_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7  // 7일
})

return response
```

**POST /api/admin/auth/logout**
```typescript
// 요청
POST /api/admin/auth/logout

// 응답
{
  "success": true,
  "message": "로그아웃되었습니다."
}

// 쿠키 삭제
Set-Cookie: admin_token=; Max-Age=0
```

**GET /api/admin/auth/me**
```typescript
// 요청
GET /api/admin/auth/me
Cookie: admin_token=eyJhbGci...

// 응답
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439013",
      "email": "admin@sonaverse.kr",
      "name": "소나버스 관리자",
      "role": "admin",
      "isAuthenticated": true
    }
  }
}
```

#### 2. Dashboard API

**GET /api/admin/dashboard/stats**
```typescript
// 요청
GET /api/admin/dashboard/stats

// 응답
{
  "success": true,
  "data": {
    "todayVisitors": 0,
    "totalInquiries": 42,
    "pendingInquiries": 3,
    "storiesCount": 12,
    "pressCount": 8,
    "stats": [
      {
        "title": "오늘 방문자",
        "value": "0",
        "icon": "visibility",
        "change": "+0%"
      },
      // ...
    ]
  }
}
```

#### 3. Stories 관리 API

**POST /api/admin/stories**
```typescript
// 요청
POST /api/admin/stories
Content-Type: application/json
Cookie: admin_token=...

{
  "title": "새로운 스토리",
  "titleEn": "New Story",
  "slug": "new-story",
  "category": "product_story",
  "excerpt": "요약...",
  "content": "<p>본문...</p>",
  "isPublished": true
}

// 응답
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "message": "스토리가 생성되었습니다."
  }
}
```

**PATCH /api/admin/stories/[id]**
```typescript
// 요청
PATCH /api/admin/stories/507f1f77bcf86cd799439014
Content-Type: application/json

{
  "title": "수정된 제목",
  "isPublished": true
}

// 응답
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "message": "스토리가 수정되었습니다."
  }
}
```

**DELETE /api/admin/stories/[id]**
```typescript
// 요청
DELETE /api/admin/stories/507f1f77bcf86cd799439014

// 응답
{
  "success": true,
  "message": "스토리가 삭제되었습니다."
}
```

---

## 인증 및 보안

### JWT 인증 플로우

```
[로그인 요청]
     ↓
[비밀번호 검증 (bcrypt)]
     ↓
[JWT 토큰 생성 (jose)]
     ↓
[HttpOnly 쿠키 설정]
     ↓
[클라이언트 저장]
     ↓
[API 요청 시 자동 전송]
     ↓
[서버 토큰 검증]
     ↓
[사용자 정보 추출]
```

### 보안 기능

#### 1. 비밀번호 보안
- **bcrypt 해싱** (salt rounds: 10)
- **로그인 실패 제한** (5회 → 15분 잠금)
- **비밀번호 정책** (향후 구현 권장):
  - 최소 8자 이상
  - 대소문자, 숫자, 특수문자 포함

#### 2. 세션 보안
- **JWT 토큰**: 서버 검증 가능
- **HttpOnly 쿠키**: XSS 공격 방지
- **SameSite=Lax**: CSRF 공격 방지
- **Secure 플래그**: HTTPS 전용 (프로덕션)
- **유효기간**: 7일

#### 3. API 보안
- **인증 확인**: 모든 관리자 API에서 세션 검증
- **권한 확인**: 역할 기반 접근 제어 (향후)
- **입력 검증**: 서버 측 유효성 검사
- **Rate Limiting**: 요청 횟수 제한 (향후)

#### 4. 데이터 보안
- **Soft Delete**: 데이터 복구 가능
- **Audit Log**: 변경 이력 추적 (향후)
- **암호화**: 민감 정보 암호화 (향후)

### 보안 개선 권장사항

1. **환경 변수 보호**:
```bash
# .env.local
JWT_SECRET=랜덤한_32자_이상_시크릿_키
MONGODB_URI=mongodb+srv://...
```

2. **CORS 설정**:
```typescript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://sonaverse.kr' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE' },
        ],
      },
    ]
  },
}
```

3. **Rate Limiting**:
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15분
  max: 100,  // 최대 100회 요청
})

export async function POST(request: NextRequest) {
  await limiter(request)
  // ... API 로직
}
```

---

## 성능 최적화

### 1. 데이터베이스 최적화

**인덱스 전략**:
```javascript
// 자주 조회되는 필드 인덱스
StorySchema.index({ slug: 1 })  // unique
StorySchema.index({ published_date: -1, is_published: 1 })  // 복합
StorySchema.index({ category: 1, is_published: 1 })

// 텍스트 검색 인덱스
StorySchema.index({
  'title.ko': 'text',
  'title.en': 'text',
  'content.ko.body': 'text'
})

// TTL 인덱스 (세션 자동 만료)
AdminSessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 })
```

**쿼리 최적화**:
```typescript
// ❌ 나쁜 예
const stories = await Story.find()  // 모든 필드 조회

// ✅ 좋은 예
const stories = await Story.find()
  .select('title slug excerpt thumbnail_url')  // 필요한 필드만
  .lean()  // Plain JS 객체
  .limit(10)  // 개수 제한
```

### 2. 프론트엔드 최적화

**이미지 최적화**:
```typescript
import Image from 'next/image'

<Image
  src={story.thumbnailUrl}
  alt={story.title}
  width={800}
  height={600}
  loading="lazy"  // 지연 로딩
  placeholder="blur"
  blurDataURL={story.blurDataUrl}
/>
```

**코드 분할**:
```typescript
import dynamic from 'next/dynamic'

const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false  // 클라이언트 측 렌더링
})
```

### 3. 캐싱 전략

**SWR 캐싱**:
```typescript
const { data } = useSWR('/api/stories', fetcher, {
  revalidateOnFocus: false,     // 포커스 시 재검증 비활성화
  revalidateOnReconnect: true,  // 재연결 시 재검증
  dedupingInterval: 2000,        // 2초 내 중복 요청 방지
})
```

**API 캐싱** (향후):
```typescript
// Redis 캐싱
import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL)

export async function GET(request: NextRequest) {
  const cacheKey = `stories:page:1:limit:10`
  const cached = await redis.get(cacheKey)

  if (cached) {
    return NextResponse.json(JSON.parse(cached))
  }

  const stories = await Story.find()...
  await redis.set(cacheKey, JSON.stringify(stories), 'EX', 60)  // 60초 캐시

  return NextResponse.json(stories)
}
```

---

## 배포 및 운영

### Vercel 배포 설정

**환경 변수**:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
NODE_ENV=production
```

**빌드 설정**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### 모니터링 (권장)

1. **에러 추적**: Sentry
2. **성능 모니터링**: Vercel Analytics
3. **로그 관리**: Logtail
4. **업타임 모니터링**: UptimeRobot

---

## 개발 워크플로우

### Git 브랜치 전략

```
main (프로덕션)
  ↑
develop (개발)
  ↑
feature/... (기능 개발)
hotfix/... (긴급 수정)
```

### 커밋 메시지 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드, 설정 변경
```

---

## 향후 개선 과제

### 우선순위 높음
1. ✅ **실시간 통계**: Google Analytics 4 연동
2. ✅ **이메일 알림**: 문의 접수 시 관리자에게 알림
3. ✅ **이미지 최적화**: Sharp 활용 자동 리사이징
4. ✅ **검색 기능**: MongoDB Atlas Search 또는 Elasticsearch
5. ✅ **권한 관리**: 역할 기반 접근 제어 (RBAC)

### 우선순위 중간
6. ⏳ **버전 관리**: 콘텐츠 수정 이력 추적
7. ⏳ **다국어 확장**: 중국어, 일본어 추가
8. ⏳ **SEO 개선**: 구조화된 데이터 (Schema.org)
9. ⏳ **PWA**: 오프라인 지원
10. ⏳ **테스트**: 단위 테스트, E2E 테스트

### 우선순위 낮음
11. 📝 **마크다운 에디터**: 관리자 페이지에 WYSIWYG 에디터
12. 📝 **파일 관리**: 미디어 라이브러리
13. 📝 **댓글 시스템**: 스토리에 댓글 기능
14. 📝 **소셜 공유**: Open Graph, Twitter Cards

---

## 문의 및 지원

**기술 문의**: tech@sonaverse.kr
**버그 리포트**: GitHub Issues
**문서 최종 업데이트**: 2024-12-15

