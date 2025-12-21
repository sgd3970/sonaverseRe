# 클린코드 작성 규칙

> 읽기 쉽고, 이해하기 쉽고, 유지보수하기 쉬운 코드를 작성하기 위한 실용적인 가이드

## 📋 빠른 체크리스트

코드 작성 시 다음 항목을 확인하세요:

- [ ] 함수는 20줄 이내로 작성했는가?
- [ ] 함수는 한 가지 일만 하는가?
- [ ] 변수/함수 이름이 의도를 명확히 드러내는가?
- [ ] 중복 코드를 제거했는가?
- [ ] 매직 넘버를 상수로 정의했는가?
- [ ] 예외 처리를 적절히 했는가?
- [ ] `null` 체크를 최소화했는가?
- [ ] 주석 없이도 코드가 이해되는가?

---

## 1️⃣ 네이밍 (Naming)

### 핵심 원칙

**의도를 명확히 드러내라**

```typescript
// ❌ 나쁜 예
const d = new Date();
const list = getUsers();

// ✅ 좋은 예
const createdAt = new Date();
const activeUsers = getUsers();
```

**일관성 있는 용어를 사용하라**

```typescript
// ❌ 나쁜 예 - 같은 개념에 다른 단어 사용
getUserInfo();
fetchUserData();
retrieveUserDetails();

// ✅ 좋은 예 - 일관된 용어 사용
getUser();
getUsers();
getUserById();
```

**검색 가능한 이름을 사용하라**

```typescript
// ❌ 나쁜 예
setTimeout(fn, 86400000);

// ✅ 좋은 예
const MILLISECONDS_PER_DAY = 86400000;
setTimeout(fn, MILLISECONDS_PER_DAY);
```

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 변수/함수 | camelCase | `userName`, `getUserData()` |
| 클래스/인터페이스 | PascalCase | `UserService`, `IUserRepository` |
| 상수 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Private 멤버 | `_` 접두사 (선택) | `_privateMethod()` |

### 피해야 할 것들

- ❌ 의미 없는 약어: `usr`, `msg`, `btn`
- ❌ 연속된 숫자: `user1`, `user2`, `user3`
- ❌ 불용어: `UserData`, `UserInfo`, `UserObject`
- ❌ 타입 인코딩: `strName`, `boolIsActive`

---

## 2️⃣ 함수 (Functions)

### 핵심 원칙

**작게 만들어라 (20줄 이내)**

```typescript
// ❌ 나쁜 예 - 너무 긴 함수
function processUser(user) {
  // 50줄의 복잡한 로직...
}

// ✅ 좋은 예 - 작은 함수들로 분리
function processUser(user) {
  validateUser(user);
  saveUser(user);
  sendWelcomeEmail(user);
}
```

**한 가지만 하라 (Single Responsibility)**

```typescript
// ❌ 나쁜 예 - 여러 일을 함
function saveUserAndSendEmail(user) {
  db.save(user);
  emailService.send(user.email);
}

// ✅ 좋은 예 - 한 가지만 함
function saveUser(user) {
  return db.save(user);
}

function sendWelcomeEmail(user) {
  return emailService.send(user.email);
}
```

**인수는 최소화하라 (0-2개가 이상적)**

```typescript
// ❌ 나쁜 예 - 인수가 너무 많음
function createUser(name, email, age, address, phone, gender) {
  // ...
}

// ✅ 좋은 예 - 객체로 그룹화
interface CreateUserDto {
  name: string;
  email: string;
  age: number;
  address: string;
  phone: string;
  gender: string;
}

function createUser(userData: CreateUserDto) {
  // ...
}
```

**플래그 인수를 피하라**

```typescript
// ❌ 나쁜 예
function renderPage(isAdmin: boolean) {
  if (isAdmin) {
    // 관리자 페이지
  } else {
    // 일반 페이지
  }
}

// ✅ 좋은 예
function renderAdminPage() { /* ... */ }
function renderUserPage() { /* ... */ }
```

**명령과 조회를 분리하라**

```typescript
// ❌ 나쁜 예
function setAndCheckAttribute(name: string, value: string): boolean {
  setAttribute(name, value);
  return checkAttribute(name);
}

// ✅ 좋은 예
function setAttribute(name: string, value: string): void {
  // ...
}

function hasAttribute(name: string): boolean {
  // ...
}
```

### DRY (Don't Repeat Yourself)

```typescript
// ❌ 나쁜 예 - 중복 코드
function calculatePriceWithVAT(price: number): number {
  return price * 1.1;
}

function calculatePriceWithDiscount(price: number): number {
  return price * 0.9 * 1.1;
}

// ✅ 좋은 예 - 중복 제거
function applyVAT(price: number): number {
  return price * 1.1;
}

function calculatePriceWithDiscount(price: number): number {
  const discountedPrice = price * 0.9;
  return applyVAT(discountedPrice);
}
```

---

## 3️⃣ 주석 (Comments)

### 핵심 원칙

**코드로 의도를 표현하라 (주석 최소화)**

```typescript
// ❌ 나쁜 예 - 불필요한 주석
// 사용자가 성인인지 확인
if (user.age >= 18) {
  // ...
}

// ✅ 좋은 예 - 코드로 의도 표현
function isAdult(user: User): boolean {
  return user.age >= 18;
}

if (isAdult(user)) {
  // ...
}
```

### 좋은 주석

```typescript
// ✅ 법적 주석
// Copyright (c) 2024 Company Name

// ✅ 설명이 필요한 복잡한 정규식
// 이메일 형식: username@domain.com
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ TODO 주석 (단, 빠르게 해결할 것)
// TODO: API 응답 캐싱 추가 필요

// ✅ 경고 주석
// WARNING: 이 함수는 대용량 데이터에서 성능 문제가 있을 수 있음
```

### 나쁜 주석

```typescript
// ❌ 코드를 중복 설명
// 카운터를 1 증가시킨다
counter++;

// ❌ 주석 처리된 코드 (삭제할 것!)
// const oldFunction = () => {
//   // ...
// }

// ❌ 변경 이력 (Git이 관리함)
// 2024-01-01: 홍길동 - 함수 추가
// 2024-01-02: 김철수 - 버그 수정
```

---

## 4️⃣ 오류 처리 (Error Handling)

### 핵심 원칙

**오류 코드보다 예외를 사용하라**

```typescript
// ❌ 나쁜 예
function getUserById(id: string): User | null {
  const user = db.findUser(id);
  if (!user) return null;
  return user;
}

const user = getUserById('123');
if (user === null) {
  // 오류 처리
}

// ✅ 좋은 예
function getUserById(id: string): User {
  const user = db.findUser(id);
  if (!user) {
    throw new UserNotFoundError(`User ${id} not found`);
  }
  return user;
}

try {
  const user = getUserById('123');
  // 정상 처리
} catch (error) {
  if (error instanceof UserNotFoundError) {
    // 오류 처리
  }
}
```

**null을 반환/전달하지 마라**

```typescript
// ❌ 나쁜 예
function getUsers(): User[] | null {
  if (error) return null;
  return users;
}

// ✅ 좋은 예 - 빈 배열 반환
function getUsers(): User[] {
  if (error) return [];
  return users;
}

// ✅ 좋은 예 - 예외 던지기
function getUsers(): User[] {
  if (error) throw new DatabaseError('Failed to fetch users');
  return users;
}
```

**의미 있는 오류 메시지**

```typescript
// ❌ 나쁜 예
throw new Error('Error');

// ✅ 좋은 예
throw new Error(`Failed to create user: Invalid email format (${email})`);
```

---

## 5️⃣ 클래스 & 객체 (Classes & Objects)

### 핵심 원칙

**단일 책임 원칙 (SRP - Single Responsibility Principle)**

```typescript
// ❌ 나쁜 예 - 여러 책임
class User {
  constructor(private name: string, private email: string) {}

  save() { /* DB 저장 */ }
  sendEmail() { /* 이메일 발송 */ }
  generateReport() { /* 보고서 생성 */ }
}

// ✅ 좋은 예 - 단일 책임
class User {
  constructor(private name: string, private email: string) {}

  getName(): string { return this.name; }
  getEmail(): string { return this.email; }
}

class UserRepository {
  save(user: User) { /* DB 저장 */ }
}

class EmailService {
  sendEmail(user: User) { /* 이메일 발송 */ }
}

class ReportService {
  generateUserReport(user: User) { /* 보고서 생성 */ }
}
```

**작은 클래스를 선호하라**

```typescript
// ❌ 나쁜 예 - 거대한 클래스 (500줄)
class UserManager {
  // 너무 많은 메서드와 책임
}

// ✅ 좋은 예 - 작은 클래스들로 분리
class UserValidator { /* ... */ }
class UserRepository { /* ... */ }
class UserService { /* ... */ }
```

**응집도를 높여라**

```typescript
// ✅ 좋은 예 - 높은 응집도
class Stack<T> {
  private elements: T[] = [];
  private size = 0;

  push(element: T): void {
    this.elements.push(element);
    this.size++;
  }

  pop(): T | undefined {
    this.size--;
    return this.elements.pop();
  }

  getSize(): number {
    return this.size;
  }
}
```

---

## 6️⃣ 테스트 (Testing)

### TDD 3법칙

1. 실패하는 단위 테스트를 작성하기 전에는 프로덕션 코드를 작성하지 않는다
2. 컴파일은 실패하지 않으면서 실행이 실패하는 정도로만 단위 테스트를 작성한다
3. 현재 실패하는 테스트를 통과할 정도로만 프로덕션 코드를 작성한다

### F.I.R.S.T 원칙

- **F**ast - 테스트는 빨라야 한다
- **I**ndependent - 각 테스트는 독립적이어야 한다
- **R**epeatable - 어떤 환경에서도 반복 가능해야 한다
- **S**elf-Validating - 테스트 결과는 bool(성공/실패)이어야 한다
- **T**imely - 테스트는 적시에 작성해야 한다

### 테스트 예시

```typescript
// ✅ 좋은 테스트
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {
      // Given
      const userData = { name: 'John', email: 'john@example.com' };

      // When
      const user = userService.createUser(userData);

      // Then
      expect(user.name).toBe('John');
      expect(user.email).toBe('john@example.com');
    });

    it('should throw error when email is invalid', () => {
      // Given
      const userData = { name: 'John', email: 'invalid-email' };

      // When & Then
      expect(() => userService.createUser(userData))
        .toThrow(InvalidEmailError);
    });
  });
});
```

---

## 7️⃣ 포매팅 (Formatting)

### 코드 구조

```typescript
// ✅ 좋은 구조 - 신문 기사처럼
class UserService {
  // 1. 상수
  private static readonly MAX_RETRY = 3;

  // 2. 인스턴스 변수
  private repository: UserRepository;

  // 3. 생성자
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  // 4. 공개 메서드 (추상화 수준 높음)
  async createUser(userData: CreateUserDto): Promise<User> {
    this.validateUserData(userData);
    return this.saveUser(userData);
  }

  // 5. 비공개 메서드 (추상화 수준 낮음)
  private validateUserData(userData: CreateUserDto): void {
    // ...
  }

  private async saveUser(userData: CreateUserDto): Promise<User> {
    // ...
  }
}
```

### 형식 규칙

- 행 길이: **120자 이내**
- 함수 길이: **20줄 이내**
- 파일 길이: **500줄 이내**
- 들여쓰기: **2 spaces** (프로젝트 설정 따름)
- 빈 줄: 개념 분리에 사용

---

## 8️⃣ 동시성 (Concurrency)

### 핵심 원칙

**동시성 코드는 분리하라**

```typescript
// ✅ 좋은 예
class DataProcessor {
  async processData(data: Data[]): Promise<Result[]> {
    return Promise.all(data.map(item => this.processItem(item)));
  }

  private async processItem(item: Data): Promise<Result> {
    // 단일 항목 처리 (동시성 없음)
  }
}
```

**불변 객체를 사용하라**

```typescript
// ✅ 좋은 예 - 불변 객체
interface User {
  readonly id: string;
  readonly name: string;
}

function updateUserName(user: User, newName: string): User {
  return { ...user, name: newName };
}
```

---

## 9️⃣ 실전 적용 가이드

### 우선순위

#### P0 (Critical) - 반드시 지킬 것
- ✅ 함수는 20줄 이내
- ✅ 한 가지 일만 하기
- ✅ 의미 있는 이름 사용
- ✅ 중복 코드 제거

#### P1 (High) - 적극 권장
- ✅ null 반환 최소화
- ✅ 예외 처리 적절히
- ✅ 매직 넘버 상수화
- ✅ 주석 최소화

#### P2 (Medium) - 점진적 개선
- ✅ 파일 크기 관리
- ✅ 테스트 코드 작성
- ✅ 클래스 크기 관리

### 코드 리뷰 체크리스트

```markdown
## 기능
- [ ] 요구사항을 충족하는가?
- [ ] 엣지 케이스를 처리하는가?
- [ ] 성능 문제는 없는가?

## 클린코드
- [ ] 함수가 한 가지 일만 하는가?
- [ ] 함수 이름이 명확한가?
- [ ] 중복 코드가 없는가?
- [ ] 매직 넘버가 없는가?

## 오류 처리
- [ ] 예외 처리가 적절한가?
- [ ] null 체크가 필요한가?
- [ ] 오류 메시지가 명확한가?

## 테스트
- [ ] 단위 테스트가 있는가?
- [ ] 테스트 커버리지가 충분한가?
```

---

## 9️⃣ 성능 최적화 (Performance)

### 핵심 원칙

**메모이제이션 (Memoization)**

```typescript
// ❌ 나쁜 예 - 매번 재계산
function ExpensiveComponent({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const average = total / items.length;

  return <div>{average}</div>;
}

// ✅ 좋은 예 - useMemo로 최적화
function ExpensiveComponent({ items }) {
  const stats = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    return {
      total,
      average: total / items.length
    };
  }, [items]);

  return <div>{stats.average}</div>;
}
```

**지연 로딩 (Lazy Loading)**

```typescript
// ✅ 코드 스플리팅
const AdminDashboard = lazy(() => import('./AdminDashboard'));
const UserProfile = lazy(() => import('./UserProfile'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Suspense>
  );
}
```

**불필요한 리렌더링 방지**

```typescript
// ❌ 나쁜 예
function Parent() {
  const [count, setCount] = useState(0);

  // 매번 새 함수 생성
  const handleClick = () => setCount(c => c + 1);

  return <Child onClick={handleClick} />;
}

// ✅ 좋은 예
function Parent() {
  const [count, setCount] = useState(0);

  // 함수 메모이제이션
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <MemoizedChild onClick={handleClick} />;
}

const MemoizedChild = memo(Child);
```

### 번들 크기 최적화

```typescript
// ❌ 나쁜 예 - 전체 라이브러리 임포트
import _ from 'lodash';
import moment from 'moment';

// ✅ 좋은 예 - 필요한 것만 임포트
import debounce from 'lodash/debounce';
import { format } from 'date-fns';
```

### 성능 측정

```typescript
// 성능 측정 유틸리티
function measurePerformance<T>(
  fn: () => T,
  label: string
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();

  console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
  return result;
}

// 사용
const sortedData = measurePerformance(
  () => data.sort((a, b) => a.value - b.value),
  'Sorting large dataset'
);
```

---

## 🔟 보안 Best Practices

### XSS (Cross-Site Scripting) 방지

```typescript
// ❌ 위험 - 사용자 입력을 직접 렌더링
function UserComment({ comment }) {
  return <div dangerouslySetInnerHTML={{ __html: comment }} />;
}

// ✅ 안전 - React가 자동으로 이스케이프
function UserComment({ comment }) {
  return <div>{comment}</div>;
}

// ✅ HTML 필요 시 - DOMPurify 사용
import DOMPurify from 'dompurify';

function SafeHtmlContent({ html }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### 인증 토큰 보안

```typescript
// ❌ 나쁜 예 - localStorage에 JWT 저장
localStorage.setItem('token', jwtToken);

// ✅ 좋은 예 - HttpOnly 쿠키 사용 (서버에서 설정)
// Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict

// 프론트엔드에서는 쿠키가 자동으로 전송됨
fetch('/api/user', {
  credentials: 'include'  // 쿠키 포함
});
```

### 환경 변수 보안

```typescript
// ❌ 나쁜 예 - 비밀키 노출
const API_SECRET = 'my-secret-key-12345';

// ✅ 좋은 예 - 환경 변수 사용
const API_KEY = import.meta.env.VITE_API_KEY;

// ⚠️ 주의: 프론트엔드 번들에 포함되므로
// 공개되어도 괜찮은 값만 사용
// 비밀키는 절대 프론트엔드에 넣지 말 것!
```

### Rate Limiting

```typescript
// 클라이언트 측 요청 제한
class RateLimiter {
  private timestamps: number[] = [];

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  canMakeRequest(): boolean {
    const now = Date.now();
    const cutoff = now - this.windowMs;

    // 오래된 타임스탬프 제거
    this.timestamps = this.timestamps.filter(t => t > cutoff);

    if (this.timestamps.length >= this.maxRequests) {
      return false;
    }

    this.timestamps.push(now);
    return true;
  }
}

// 사용
const limiter = new RateLimiter(5, 60000); // 분당 5회

async function sendMessage(msg: string) {
  if (!limiter.canMakeRequest()) {
    throw new Error('요청 한도 초과. 잠시 후 다시 시도하세요.');
  }

  return await api.sendMessage(msg);
}
```

---

## 1️⃣1️⃣ 디자인 패턴 (Design Patterns)

### Singleton Pattern

```typescript
// ✅ 싱글톤 - 단일 인스턴스 보장
class Logger {
  private static instance: Logger;
  private logs: string[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string): void {
    this.logs.push(`[${new Date().toISOString()}] ${message}`);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

// 사용
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();
console.log(logger1 === logger2); // true
```

### Factory Pattern

```typescript
// ✅ 팩토리 패턴 - 객체 생성 로직 캡슐화
interface Notification {
  send(message: string): void;
}

class EmailNotification implements Notification {
  send(message: string): void {
    console.log(`Email: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(message: string): void {
    console.log(`SMS: ${message}`);
  }
}

class PushNotification implements Notification {
  send(message: string): void {
    console.log(`Push: ${message}`);
  }
}

class NotificationFactory {
  static create(type: 'email' | 'sms' | 'push'): Notification {
    switch (type) {
      case 'email': return new EmailNotification();
      case 'sms': return new SMSNotification();
      case 'push': return new PushNotification();
      default: throw new Error(`Unknown type: ${type}`);
    }
  }
}

// 사용
const notification = NotificationFactory.create('email');
notification.send('Hello!');
```

### Observer Pattern

```typescript
// ✅ 옵저버 패턴 - 이벤트 기반 통신
type Listener<T> = (data: T) => void;

class EventEmitter<T> {
  private listeners: Listener<T>[] = [];

  subscribe(listener: Listener<T>): () => void {
    this.listeners.push(listener);

    // 구독 해제 함수 반환
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  emit(data: T): void {
    this.listeners.forEach(listener => listener(data));
  }
}

// 사용
const userEvents = new EventEmitter<{ userId: string; action: string }>();

const unsubscribe = userEvents.subscribe(data => {
  console.log(`User ${data.userId} did ${data.action}`);
});

userEvents.emit({ userId: '123', action: 'login' });
unsubscribe(); // 구독 해제
```

### Strategy Pattern

```typescript
// ✅ 전략 패턴 - 알고리즘 캡슐화
interface SortStrategy {
  sort(data: number[]): number[];
}

class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    // Quick sort 구현
    return data.sort((a, b) => a - b);
  }
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    // Bubble sort 구현
    const arr = [...data];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  sort(data: number[]): number[] {
    return this.strategy.sort(data);
  }
}

// 사용
const sorter = new Sorter(new QuickSort());
const sorted = sorter.sort([5, 2, 8, 1, 9]);
```

---

## 1️⃣2️⃣ 안티 패턴 (Anti-Patterns)

### God Object (전지전능 객체)

```typescript
// ❌ 나쁜 예 - 너무 많은 책임
class UserManager {
  createUser() {}
  updateUser() {}
  deleteUser() {}
  sendEmail() {}
  validateEmail() {}
  hashPassword() {}
  generateReport() {}
  exportToCsv() {}
  sendSMS() {}
  // ... 50개 이상의 메서드
}

// ✅ 좋은 예 - 책임 분리
class UserRepository {
  create() {}
  update() {}
  delete() {}
  findById() {}
}

class EmailService {
  send() {}
  validate() {}
}

class PasswordService {
  hash() {}
  compare() {}
}

class UserReportService {
  generate() {}
  exportToCsv() {}
}
```

### Spaghetti Code (스파게티 코드)

```typescript
// ❌ 나쁜 예 - 복잡한 제어 흐름
function processOrder(order) {
  if (order.status === 'pending') {
    if (order.items.length > 0) {
      let total = 0;
      for (let i = 0; i < order.items.length; i++) {
        if (order.items[i].available) {
          total += order.items[i].price;
          if (order.customer.isPremium) {
            total *= 0.9;
          }
        } else {
          if (order.items[i].substitute) {
            // ...
          }
        }
      }
      // ...
    }
  }
}

// ✅ 좋은 예 - 작은 함수로 분리
function processOrder(order: Order): OrderResult {
  if (!isValidOrder(order)) {
    return { success: false, error: 'Invalid order' };
  }

  const availableItems = filterAvailableItems(order.items);
  const total = calculateTotal(availableItems, order.customer);

  return { success: true, total };
}

function isValidOrder(order: Order): boolean {
  return order.status === 'pending' && order.items.length > 0;
}

function filterAvailableItems(items: Item[]): Item[] {
  return items.filter(item => item.available);
}

function calculateTotal(items: Item[], customer: Customer): number {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  return customer.isPremium ? subtotal * 0.9 : subtotal;
}
```

### Magic Numbers (매직 넘버)

```typescript
// ❌ 나쁜 예
function calculatePrice(quantity: number): number {
  if (quantity > 100) {
    return quantity * 9.99 * 0.85;
  }
  return quantity * 9.99;
}

// ✅ 좋은 예
const PRICE_PER_UNIT = 9.99;
const BULK_DISCOUNT_RATE = 0.85;
const BULK_DISCOUNT_THRESHOLD = 100;

function calculatePrice(quantity: number): number {
  const subtotal = quantity * PRICE_PER_UNIT;

  if (quantity >= BULK_DISCOUNT_THRESHOLD) {
    return subtotal * BULK_DISCOUNT_RATE;
  }

  return subtotal;
}
```

---

## 1️⃣3️⃣ 접근성 (Accessibility)

### 키보드 네비게이션

```typescript
// ✅ 키보드 접근 가능한 컴포넌트
function AccessibleButton({ onClick, children }) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label="Submit"
    >
      {children}
    </div>
  );
}
```

### ARIA 속성

```typescript
// ✅ ARIA로 스크린 리더 지원
function SearchInput() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <input
        type="text"
        aria-label="Search"
        aria-describedby="search-help"
        aria-live="polite"
        aria-busy={loading}
      />
      <span id="search-help" className="sr-only">
        검색어를 입력하세요
      </span>

      <ul role="listbox" aria-label="Search results">
        {results.map(item => (
          <li key={item.id} role="option">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 색상 대비

```css
/* ❌ 나쁜 예 - 대비 부족 */
.button {
  background: #ccc;
  color: #ddd;  /* 대비율 1.2:1 (최소 4.5:1 필요) */
}

/* ✅ 좋은 예 - 충분한 대비 */
.button {
  background: #0066cc;
  color: #ffffff;  /* 대비율 7.8:1 */
}
```

---

## 1️⃣4️⃣ 에러 처리 고급 패턴

### Result 타입

```typescript
// Result 타입 정의
type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

// ✅ Result 타입 사용
function divideNumbers(a: number, b: number): Result<number> {
  if (b === 0) {
    return {
      success: false,
      error: new Error('Division by zero')
    };
  }

  return {
    success: true,
    value: a / b
  };
}

// 사용
const result = divideNumbers(10, 2);

if (result.success) {
  console.log(`Result: ${result.value}`);
} else {
  console.error(`Error: ${result.error.message}`);
}
```

### Either 모나드

```typescript
// Either 타입 (함수형 프로그래밍 패턴)
class Either<L, R> {
  private constructor(
    private readonly left?: L,
    private readonly right?: R
  ) {}

  static left<L, R>(value: L): Either<L, R> {
    return new Either<L, R>(value, undefined);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either<L, R>(undefined, value);
  }

  isLeft(): boolean {
    return this.left !== undefined;
  }

  isRight(): boolean {
    return this.right !== undefined;
  }

  map<T>(fn: (value: R) => T): Either<L, T> {
    if (this.isRight()) {
      return Either.right(fn(this.right!));
    }
    return Either.left(this.left!);
  }

  getOrElse(defaultValue: R): R {
    return this.isRight() ? this.right! : defaultValue;
  }
}

// ✅ Either 사용
function parseJSON<T>(json: string): Either<Error, T> {
  try {
    const parsed = JSON.parse(json);
    return Either.right(parsed);
  } catch (error) {
    return Either.left(error as Error);
  }
}

// 사용
const result = parseJSON<{ name: string }>('{"name":"John"}');

result
  .map(data => data.name.toUpperCase())
  .map(name => console.log(name));

const name = result.getOrElse({ name: 'Unknown' }).name;
```

---

## 1️⃣5️⃣ 빠른 참조

### 나쁜 코드 징후 (Code Smells)

| 징후 | 문제 | 해결책 |
|------|------|--------|
| 긴 함수 | 복잡도 증가 | 작은 함수로 분리 |
| 긴 파라미터 | 이해 어려움 | 객체로 그룹화 |
| 중복 코드 | 유지보수 어려움 | 함수/클래스 추출 |
| 거대한 클래스 | 단일 책임 위반 | 작은 클래스로 분리 |
| 매직 넘버 | 의미 불명확 | 상수로 정의 |
| 주석이 많음 | 코드가 불명확 | 코드 개선 |

### 리팩토링 전략

1. **작은 단위로 개선** - 한 번에 하나씩
2. **테스트 유지** - 리팩토링 후 테스트 통과 확인
3. **커밋 자주** - 작은 변경마다 커밋
4. **팀과 공유** - 코드 리뷰로 학습

### 추천 도구

- **Linter**: ESLint, TSLint
- **Formatter**: Prettier
- **복잡도 분석**: SonarQube, Code Climate
- **테스트**: Jest, Vitest

---

## 1️⃣6️⃣ 팀 협업 가이드라인

### 코드 리뷰 원칙

**리뷰어 가이드라인**

```markdown
## 코드 리뷰 체크리스트

### 기능 (Functionality)
- [ ] 요구사항을 충족하는가?
- [ ] 엣지 케이스를 처리하는가?
- [ ] 에러 처리가 적절한가?

### 코드 품질 (Quality)
- [ ] 함수는 한 가지 일만 하는가?
- [ ] 변수/함수 이름이 명확한가?
- [ ] 중복 코드가 없는가?
- [ ] 복잡도가 적절한가? (≤10)

### 테스트 (Testing)
- [ ] 단위 테스트가 있는가?
- [ ] 테스트가 실패하지 않는가?
- [ ] 엣지 케이스를 테스트하는가?

### 보안 (Security)
- [ ] 입력 검증이 있는가?
- [ ] XSS/SQL Injection 방지를 하는가?
- [ ] 민감 정보가 노출되지 않는가?

### 성능 (Performance)
- [ ] 불필요한 연산이 없는가?
- [ ] 메모리 누수가 없는가?
- [ ] 적절한 캐싱이 있는가?
```

**건설적인 피드백**

```typescript
// ❌ 나쁜 피드백
// "이 코드는 끔찍해요. 다시 작성하세요."

// ✅ 좋은 피드백
// "이 함수가 너무 길어 보입니다 (150줄).
// validateUser(), saveUser(), sendEmail()로 분리하면
// 가독성이 향상될 것 같습니다. 어떻게 생각하시나요?"
```

### Git 브랜치 전략

**GitFlow 기반**

```bash
# Feature 브랜치
git checkout -b feature/user-authentication

# Bugfix 브랜치
git checkout -b bugfix/login-error

# Hotfix 브랜치
git checkout -b hotfix/security-patch

# Release 브랜치
git checkout -b release/v1.2.0
```

### 커밋 메시지 규칙

```bash
# 형식
<type>(<scope>): <subject>

<body>

<footer>

# 예시
feat(auth): Add JWT token authentication

- Implement JWT token generation
- Add token validation middleware
- Update login endpoint

Closes #123

# Types
feat: 새로운 기능
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅 (기능 변경 없음)
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드, 설정 등
```

### 페어 프로그래밍

**Driver & Navigator 역할**

```typescript
// Driver: 코드 작성
// Navigator: 전략, 방향 제시

// 15-30분마다 역할 교대
// 복잡한 로직, 새로운 기능에 효과적
```

---

## 1️⃣7️⃣ 코드 품질 메트릭

### 테스트 커버리지

**목표 기준**

| 레벨 | 커버리지 | 설명 |
|------|---------|------|
| Critical | ≥90% | 핵심 비즈니스 로직 |
| High | ≥80% | 중요 기능 |
| Medium | ≥70% | 일반 기능 |
| Low | ≥50% | UI 컴포넌트 |

**측정 방법**

```bash
# Jest 커버리지
npm test -- --coverage

# 커버리지 리포트
# ----------------------------|---------|----------|---------|---------|
# File                        | % Stmts | % Branch | % Funcs | % Lines |
# ----------------------------|---------|----------|---------|---------|
# All files                   |   85.23 |    78.45 |   82.11 |   86.34 |
#  auth/                      |   92.15 |    88.23 |   90.45 |   93.12 |
#   login.ts                  |   95.23 |    90.12 |   94.56 |   96.78 |
```

### 순환 복잡도 (Cyclomatic Complexity)

**복잡도 기준**

| 범위 | 평가 | 조치 |
|------|------|------|
| 1-5 | 매우 좋음 | 유지 |
| 6-10 | 좋음 | 모니터링 |
| 11-20 | 보통 | 리팩토링 고려 |
| 21-50 | 나쁨 | 리팩토링 필요 |
| 50+ | 매우 나쁨 | 즉시 리팩토링 |

**복잡도 계산**

```typescript
// 복잡도 = 1 (기본) + 분기 개수
// if, else, for, while, case, &&, || 각각 +1

// ❌ 복잡도 15 (나쁨)
function processPayment(payment, user, discount) {
  if (payment.type === 'credit') {
    if (user.isPremium) {
      if (discount > 0) {
        // ...
      }
    } else {
      if (payment.amount > 1000) {
        // ...
      }
    }
  } else if (payment.type === 'debit') {
    // ...
  } else if (payment.type === 'cash') {
    // ...
  }
}

// ✅ 복잡도 3 (좋음)
function processPayment(payment, user, discount) {
  const processor = getPaymentProcessor(payment.type);
  const amount = calculateAmount(payment, user, discount);
  return processor.process(amount);
}
```

### 기술 부채 측정

**SonarQube 메트릭**

```typescript
// 기술 부채 비율 (Technical Debt Ratio)
// = 수정 시간 / 개발 시간 × 100

// 목표: ≤ 5%
// 경고: 5-10%
// 위험: > 10%
```

**부채 추적**

```typescript
// TODO 주석으로 추적
// TODO(tech-debt): 이 함수는 복잡도가 높습니다 (복잡도 15)
// 리팩토링 이슈: #456
// 예상 시간: 4시간

// FIXME: 성능 문제 - 대용량 데이터 처리 시 느림
// 이슈: #789
```

### 코드 중복도

**목표 기준**

- 중복도 < 3%
- 중복 블록 길이 < 10줄

**도구**

```bash
# jscpd - JavaScript Copy/Paste Detector
npx jscpd ./src

# 결과
# Duplications: 2.3%
# Total files: 150
# Duplicated lines: 234 / 10,000
```

### 유지보수성 지수 (Maintainability Index)

**계산식**

```
MI = 171 - 5.2 × ln(V) - 0.23 × G - 16.2 × ln(L)

V = Halstead Volume (코드 복잡도)
G = Cyclomatic Complexity (순환 복잡도)
L = Lines of Code (코드 줄 수)
```

**평가 기준**

| 점수 | 평가 | 조치 |
|------|------|------|
| 85-100 | 매우 좋음 | 유지 |
| 65-84 | 좋음 | 모니터링 |
| 50-64 | 보통 | 개선 고려 |
| 0-49 | 나쁨 | 리팩토링 필요 |

---

## 1️⃣8️⃣ 성능 예산 (Performance Budget)

### 번들 크기 제한

```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "200kb",
      "maximumError": "300kb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "6kb"
    }
  ]
}
```

### Core Web Vitals 목표

| 메트릭 | 목표 | 설명 |
|--------|------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 최대 콘텐츠 로딩 |
| FID (First Input Delay) | < 100ms | 첫 입력 지연 |
| CLS (Cumulative Layout Shift) | < 0.1 | 누적 레이아웃 이동 |
| TBT (Total Blocking Time) | < 200ms | 총 차단 시간 |
| FCP (First Contentful Paint) | < 1.8s | 첫 콘텐츠 페인트 |

### 성능 측정 도구

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --config=.lighthouserc.js

# Bundle Analyzer
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

---

## 8️⃣ Sonaverse 홈페이지 전용 추가 규칙 (성능·모듈화)

> 이 섹션은 **소나버스 공식 홈페이지(Next.js 15 / App Router 기반)** 프론트엔드 작업을 위한 추가 규칙입니다.  
> 공통 규칙을 그대로 따르되, **“속도 최우선·모듈화·일관된 UI”** 를 강하게 요구합니다.

### 8-1. 페이지 성능 예산 (Homepage 전용)

- 초기 JS 번들(홈 화면 기준, gzip 기준)은 **200KB 이하**를 목표로 합니다.
- Core Web Vitals는 다음을 만족해야 합니다.
  - LCP < **2.5s**
  - FID < **100ms**
  - CLS < **0.1**
  - TBT < **200ms**
- Lighthouse 성능 점수 90점 이상을 기본 목표로 합니다.

### 8-2. 이미지 로딩 규칙

- Above-the-fold(첫 화면)에 보이는 이미지만 **필요 시 프리로드** 합니다.
- 그 외 모든 이미지는 **지연 로딩(lazy)** 을 기본으로 합니다.
- Next.js `next/image` 사용을 기본으로 하며, 다음을 지킵니다.
  - `sizes` 를 반드시 지정하여 불필요한 해상도 요청을 막습니다.
  - 레이아웃 시프트 방지를 위해 항상 `width/height` 또는 `fill + 컨테이너 크기`를 명시합니다.
- 동일 이미지를 여러 크기로 사용하는 경우, **하나의 소스 + 다양한 `sizes`** 로 해결하고, 중복 파일을 만들지 않습니다.

### 8-3. 콘텐츠 로딩 및 코드 스플리팅

- TipTap 에디터, 관리자 전용 컴포넌트, 모달, 차트 등 무거운 UI는 `next/dynamic` 으로 동적 임포트합니다.
- 상단(히어로, 주요 메시지)에 필요한 최소 컴포넌트만 **SSR + 정적 생성(SSG)** 으로 렌더링합니다.
- 리스트/카드(스토리, 언론보도 등)는:
  - 데이터 페칭 훅(`useStories`, `usePressList` 등)으로 로직을 분리하고
  - 렌더링 컴포넌트는 최대한 **단순한 표현 책임만** 갖도록 합니다.

### 8-4. 모듈화·폴더 구조 규칙 (Next.js 15 / App Router)

#### 8-4-1. 기능 기반 폴더 구조

- URL 기준이 아니라 **기능(Feature) 기준**으로 코드를 묶습니다.
  - 예: `features/home`, `features/products/manbo`, `features/products/bodeum`, `features/stories`, `features/press`, `features/inquiry`
- **개선된 구조 제안**:
  ```
  src/
  ├── app/                          # Next.js App Router
  │   ├── (public)/                 # 공개 페이지 그룹
  │   │   ├── page.tsx             # 홈페이지
  │   │   ├── products/
  │   │   │   ├── manbo-walker/
  │   │   │   └── bodeum-diaper/
  │   │   ├── press/
  │   │   ├── sonaverse-story/
  │   │   └── inquiry/
  │   └── (admin)/                  # 관리자 페이지 그룹
  │       └── admin/
  │
  ├── features/                     # 기능별 모듈화
  │   ├── home/                     # 홈페이지 기능
  │   │   ├── components/           # 홈 전용 컴포넌트
  │   │   ├── hooks/                # 홈 전용 훅
  │   │   └── lib/                  # 홈 전용 유틸리티
  │   ├── products/                 # 제품 기능
  │   │   ├── manbo/
  │   │   │   ├── components/
  │   │   │   ├── hooks/
  │   │   │   └── lib/
  │   │   └── bodeum/
  │   ├── stories/                  # 스토리 기능
  │   ├── press/                    # 언론보도 기능
  │   └── inquiry/                  # 문의 기능
  │
  ├── shared/                       # 공유 모듈
  │   ├── components/               # 공통 컴포넌트
  │   │   ├── ui/                   # 기본 UI 컴포넌트
  │   │   ├── layout/               # 레이아웃 컴포넌트
  │   │   └── common/               # 공통 기능 컴포넌트
  │   ├── hooks/                    # 공통 훅
  │   ├── lib/                      # 공통 유틸리티
  │   └── types/                    # 공통 타입
  ```

#### 8-4-2. 컴포넌트 모듈화 전략

- **공통 컴포넌트 분리**
  - `shared/components/ui/`: 버튼, 카드, 배지, 입력 필드 등 기본 UI 컴포넌트
  - `shared/components/layout/`: Header, Footer, MainLayout 등 레이아웃 컴포넌트
  - `shared/components/common/`: Toast, Modal, ScrollToTop 등 공통 기능 컴포넌트
  - 각 컴포넌트는 단일 책임 원칙(SRP) 준수

- **기능별 컴포넌트 분리**
  - 각 기능(feature) 내부에 해당 기능 전용 컴포넌트 배치
  - 예: `features/stories/components/StoryCard.tsx`, `features/press/components/PressCard.tsx`
  - 공통 패턴은 `shared/components`로 추출하여 재사용

#### 8-4-3. 로직 분리 (Custom Hooks)

- **데이터 페칭 훅**
  - `usePressList`, `useStories`, `useInquiryForm` 등
  - API 호출 로직을 컴포넌트에서 분리
  - React Query 또는 SWR 활용 고려 (캐싱 및 성능 최적화)

- **UI 상태 관리 훅**
  - `useCarousel`, `useModal`, `useDropdown` 등
  - 재사용 가능한 UI 로직을 훅으로 추출
  - 컴포넌트는 렌더링에만 집중

- **비즈니스 로직 훅**
  - `useInquirySubmit`, `useProductFilter` 등
  - 폼 처리, 필터링 등 비즈니스 로직 분리

#### 8-4-4. API 레이어 분리

- **API 모듈 구조**
  ```
  lib/
  ├── api/
  │   ├── client.ts                 # API 클라이언트 설정
  │   ├── press.ts                  # 언론보도 API
  │   ├── stories.ts                # 스토리 API
  │   ├── products.ts               # 제품 API
  │   ├── inquiries.ts              # 문의 API
  │   └── admin/                    # 관리자 API
  │       ├── press.ts
  │       └── stories.ts
  ```

- **API 함수 예시**
  ```typescript
  // lib/api/stories.ts
  export async function getStories(params: StoriesParams) {
    const response = await fetch(`/api/sonaverse-story?${new URLSearchParams(params)}`)
    return response.json()
  }
  
  export async function getStoryBySlug(slug: string) {
    const response = await fetch(`/api/sonaverse-story/${slug}`)
    return response.json()
  }
  ```

- **서비스 레이어 (선택적)**
  - 복잡한 비즈니스 로직이 있는 경우 서비스 레이어 추가
  - API 호출과 비즈니스 로직 분리
  ```
  features/
  └── stories/
      └── services/
          └── storyService.ts        # 스토리 관련 비즈니스 로직
  ```

#### 8-4-5. 성능을 고려한 모듈화

- **동적 임포트 전략**
  - 무거운 컴포넌트는 `next/dynamic`으로 지연 로딩
  - 관리자 페이지, 모달, 차트 등은 필요 시에만 로드
  ```typescript
  const AdminDashboard = dynamic(() => import('@/features/admin/components/Dashboard'), {
    loading: () => <Loading />,
    ssr: false
  })
  ```

- **코드 스플리팅**
  - 기능별로 자동 코드 스플리팅
  - 라우트 그룹(`(public)`, `(admin)`) 활용
  - 큰 라이브러리는 동적 임포트

- **트리 쉐이킹 최적화**
  - Named export 우선 사용
  - Barrel exports(`index.ts`) 최소화 (필요한 경우만)
  - 라이브러리에서 필요한 모듈만 import

#### 8-4-6. 타입 정의 모듈화

- **타입 구조**
  ```
  shared/
  └── types/
      ├── api.ts                    # API 응답 타입
      ├── common.ts                 # 공통 타입
      └── index.ts                  # 타입 재export
  features/
  └── stories/
      └── types/
          └── story.ts              # 스토리 관련 타입
  ```

- **타입 재사용**
  - 공통 타입은 `shared/types`에 배치
  - 기능별 타입은 해당 기능 폴더 내부에 배치
  - 타입 중복 최소화

#### 8-4-7. 스타일 모듈화

- **스타일 구조**
  ```
  shared/
  └── styles/
      ├── tokens.css                # 디자인 토큰 (색상, 간격 등)
      ├── components.css            # 공통 컴포넌트 스타일
      └── utilities.css             # 유틸리티 클래스
  ```

- **Tailwind 활용**
  - Tailwind CSS 유틸리티 클래스 우선 사용
  - 반복되는 패턴은 `@apply`로 컴포넌트 클래스 생성
  - 커스텀 유틸리티는 `tailwind.config.ts`에 정의

#### 8-4-8. 모듈화 체크리스트

- [ ] 기능별 폴더 구조로 재구성
- [ ] 공통 컴포넌트를 `shared/components`로 분리
- [ ] 데이터 페칭 로직을 커스텀 훅으로 분리
- [ ] API 호출을 별도 모듈로 분리
- [ ] 타입 정의를 적절히 모듈화
- [ ] 무거운 컴포넌트는 동적 임포트 적용
- [ ] 코드 스플리팅으로 번들 크기 최적화
- [ ] 불필요한 추상화 제거 (YAGNI 원칙)
- [ ] 성능 측정 후 모듈화 적용

### 8-5. 홈페이지 전용 네이밍·컴포넌트 규칙

- 섹션 컴포넌트는 **의미 + 페이지 기준**으로 작명합니다.
  - 예: `HomeHeroSection`, `HomeProblemsSection`, `HomeProductsSection`, `HomeTimelineSection`, `HomePressSection`
- 재사용 가능한 카드/리스트 패턴은 별도 컴포넌트로 분리합니다.
  - 예: `StoryCard`, `PressCard`, `ProductCard`, `SectionHeader`
- 스타일은 Tailwind를 기본으로 하되, **반복되는 패턴은 소규모 래퍼 컴포넌트**로 추출합니다.

### 8-6. 실제 텍스트·콘텐츠 사용 원칙

- 목업/디자인/와이어프레임 작업 시 **가능한 실제 텍스트(소나버스 프로젝트에서 사용하는 카피)** 를 사용합니다.
  - 예: “시니어의 더 나은 일상을 위해”, “만보 하이브리드 워크메이트”, “보듬 프리미엄 성인용 기저귀” 등.
- 더미 텍스트(`Lorem ipsum`)는 **테스트용에서만** 허용하며, 실제 화면 작업 시에는 모두 교체합니다.

### 8-7. 리팩토링·디자인 변경 시 체크리스트

- [ ] 성능 지표(Lighthouse, Core Web Vitals) 악화 여부를 확인했는가?
- [ ] 이미지 개수/용량이 불필요하게 증가하지 않았는가?
- [ ] 공통 컴포넌트/훅으로 추출할 수 있는 중복이 남아 있지 않은가?
- [ ] URL·컴포넌트 구조가 기능(Feature) 단위로 이해하기 쉬운가?
- [ ] 접근성(a11y)과 다국어(i18n)를 깨지 않았는가?

---

## 📚 참고 자료

- **Clean Code** - Robert C. Martin
- **Refactoring** - Martin Fowler
- **The Pragmatic Programmer** - Andrew Hunt, David Thomas

---

## 💡 기억하세요

> "깨끗한 코드는 목적지가 아니라 여정입니다."

- 완벽을 추구하지 말고, **점진적으로 개선**하세요
- 팀과 **일관된 규칙**을 정하고 따르세요
- **코드 리뷰**를 통해 서로 배우세요
- **리팩토링**을 두려워하지 마세요
