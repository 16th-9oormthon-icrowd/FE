# Hidden Jeju - 제주도 맞춤형 여행 추천 서비스

<img width="1746" height="982" alt="image" src="https://github.com/user-attachments/assets/03dbf299-10a9-4a3b-80de-db8140abc31f" />

## 🎯 프로젝트 소개

**Hidden Jeju**는 사용자의 취향을 분석하여 맞춤형 제주도 관광지를 추천하는 웹 애플리케이션입니다. 단순한 검색이 아닌, 사용자의 성향과 선호도를 기반으로 숨겨진 제주도의 매력을 발견할 수 있도록 돕습니다.

### 핵심 가치

- 🎨 **개인화된 추천**: 사용자의 성향 분석을 통한 맞춤형 관광지 추천
- 🗺️ **인터랙티브 지도**: 카카오맵을 활용한 직관적인 지도 탐색
- 📸 **여행 기록**: 방문한 장소의 사진을 업로드하여 나만의 여행 스토리 생성
- 🎁 **여행 카드**: 개인화된 여행 카드를 생성하여 소셜 미디어에 공유

### 사용자 여정

1. **온보딩**: 간단한 질문을 통해 사용자의 취향 파악
2. **추천 받기**: AI 기반 맞춤형 관광지 12곳 추천
3. **선택하기**: 추천받은 관광지 중 4곳 선택
4. **탐험하기**: 선택한 장소를 지도에서 확인하고 방문
5. **기록하기**: 방문한 장소의 사진을 업로드하여 캐릭터 완성
6. **공유하기**: 완성된 여행 카드를 다운로드하여 공유

---

## ✨ 주요 기능

### 1. 취향 기반 추천 시스템
- 4가지 질문을 통한 사용자 성향 분석
  - 지역 선호도 (동부/서부/남부 제주)
  - 성격 유형 (새로움 추구/편안함 선호/소통 즐김)
  - 활동성 (활동적/조용함/창의적)
  - 가치관 (사진/환경/이야기)
- 백엔드 AI 모델을 활용한 맞춤형 관광지 추천

### 2. 인터랙티브 지도
- 카카오맵 API를 활용한 실시간 지도 표시
- 추천 관광지 마커 표시 및 선택 상태 시각화
- 마커 클릭 시 상세 정보 및 길찾기 기능
- 지도 영역 제한 (제주도 영역 내로 제한)

### 3. 관광지 선택 시스템
- 추천받은 12개 관광지 중 4곳 선택
- 선택 순서 표시 및 시각적 피드백
- 선택된 관광지의 실시간 지도 마커 업데이트

### 4. 여행 기록 기능
- 방문한 장소의 사진 업로드
- 업로드된 사진에 따른 캐릭터 레이어 업데이트
- 4개 장소 모두 방문 시 여행 완료

### 5. 여행 카드 생성
- 사용자의 취향을 반영한 개인화된 여행 카드
- 고해상도 이미지 다운로드 기능
- 소셜 미디어 공유 최적화

### 6. PWA (Progressive Web App)
- 오프라인 지원
- 앱처럼 설치 가능
- 빠른 로딩 속도

---

## 🛠 기술 스택

### Frontend Core
- **React 19.2.0**: 최신 React 기능 활용
- **TypeScript 5.9.3**: 타입 안정성 보장
- **Vite 7.2.5**: 빠른 개발 서버 및 빌드 도구

### UI/UX
- **@vapor-ui/core**: 구름(Goorm) 공식 디자인 시스템
- **Tailwind CSS 4.0.0**: 유틸리티 퍼스트 CSS 프레임워크
- **Framer Motion 12.23.25**: 부드러운 애니메이션 효과

### 라우팅 및 상태 관리
- **React Router DOM 7.10.0**: 클라이언트 사이드 라우팅
- **React Hooks**: 컴포넌트 상태 관리

### 지도 및 위치 서비스
- **Kakao Maps API**: 제주도 관광지 지도 표시
- **Kakao Places API**: 장소 검색 및 상세 정보

### HTTP 클라이언트
- **Axios 1.13.2**: RESTful API 통신

### 이미지 처리
- **modern-screenshot 4.6.7**: DOM을 이미지로 변환
- **html2canvas 1.4.1**: 캔버스 기반 스크린샷

### 개발 도구
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **TypeScript ESLint**: TypeScript 전용 린팅

### 배포 및 인프라
- **Docker**: 컨테이너화
- **Kubernetes**: 오케스트레이션
- **Nginx**: 리버스 프록시 및 정적 파일 서빙
- **AWS ECR**: 컨테이너 이미지 저장소

### PWA
- **vite-plugin-pwa**: PWA 기능 구현
- **Workbox**: 서비스 워커 및 캐싱 전략


## 🚀 시작하기

### 사전 요구사항

- **Node.js**: 20.x 이상
- **npm**: 9.x 이상 (또는 yarn, pnpm)
- **카카오 개발자 계정**: 카카오맵 API 키 필요


## 🏗 빌드 및 배포

### Docker를 사용한 빌드

1. **Docker 이미지 빌드**

```bash
docker build \
  --build-arg VITE_BASE_URL=https://your-api-domain.com \
  --build-arg VITE_VITE_KAKAO_JAVASCRIPT_KEY=your-kakao-key \
  -t hidden-jeju-frontend:latest .
```

2. **컨테이너 실행**

```bash
docker run -p 3000:3000 hidden-jeju-frontend:latest
```

### Kubernetes 배포

1. **이미지 푸시**

```bash
docker tag hidden-jeju-frontend:latest \
  837126493345.dkr.ecr.ap-northeast-2.amazonaws.com/goormthon-4/frontend:latest

docker push 837126493345.dkr.ecr.ap-northeast-2.amazonaws.com/goormthon-4/frontend:latest
```

2. **Kubernetes 배포**

```bash
kubectl apply -f k8s/frontend.yaml
```

### Nginx 설정

프로덕션 환경에서는 Nginx를 리버스 프록시로 사용할 수 있습니다:

```bash
# Nginx 설정 파일 복사
cp nginx.conf /etc/nginx/conf.d/hidden-jeju.conf

# Nginx 재시작
sudo systemctl restart nginx
```

---

## 🎨 주요 기능 상세

### 1. 온보딩 플로우

#### 시작 화면
- 제주도 배경 이미지와 함께 서비스 소개
- "시작하기" 버튼으로 질문 플로우 시작

#### 질문 페이지
- **4가지 질문**:
  1. 지역 선호도 (동부/서부/남부 제주)
  2. 성격 유형 (새로움/편안함/소통)
  3. 활동성 (활동적/조용함/창의적)
  4. 가치관 (사진/환경/이야기)

- **시각적 피드백**:
  - 각 질문에 맞는 SVG 이미지 표시
  - 선택한 답변에 따라 배경 그라데이션 변경
  - 진행 바로 현재 진행 상황 표시

#### 닉네임 입력
- 자동 생성된 제주도 테마 닉네임 제공
- 사용자 커스터마이징 가능
- 닉네임 입력 필드에서 지운 후 자동 재생성 방지 (useRef 활용)

### 2. 추천 관광지 선택

#### 홈 화면
- 사용자 닉네임과 함께 맞춤형 인사말
- 추천받은 12개 관광지 카드 그리드 표시
- 각 카드에 썸네일 이미지, 제목, 주소 표시

#### 지도 통합
- 카카오맵을 통한 관광지 위치 시각화
- 마커 클릭 시 상세 정보 오버레이
- 선택된 관광지는 주황색 마커로 표시
- 모든 마커의 중심점으로 자동 이동

#### 선택 시스템
- 최대 4개 관광지 선택 가능
- 선택 순서 번호 표시 (1, 2, 3, 4)
- 선택 해제 시 순서 자동 재조정
- 4개 선택 완료 시 "지금 여행하기" 및 "링크 공유하기" 버튼 표시

### 3. 여행 기록

#### 선택 완료 페이지
- 선택한 4개 관광지 목록 표시
- 각 관광지의 지도 위치 표시
- 방문한 장소의 사진 업로드 기능

#### 캐릭터 시스템
- 업로드된 사진 개수에 따라 캐릭터 레이어 업데이트
- 4개 질문의 답변에 따라 다른 이미지 레이어 표시
- 구름 캐릭터가 항상 중앙에 위치

#### 이미지 업로드
- 각 관광지별로 사진 업로드
- 업로드된 이미지는 S3에 저장
- 실시간으로 캐릭터 업데이트

### 4. 여행 카드 생성

#### 최종 페이지
- 여행 완료 축하 메시지
- 개인화된 여행 카드 표시
- 카드 내부에 사용자의 취향이 반영된 이미지 레이어

#### 카드 다운로드
- `modern-screenshot` 라이브러리를 사용한 고해상도 이미지 생성
- 2배 스케일로 렌더링하여 선명한 이미지 제공
- PNG 형식으로 다운로드

---

## 🔌 API 연동

### API 구조

프로젝트는 Axios를 사용하여 RESTful API와 통신합니다.

### 주요 API 엔드포인트

#### 1. 사용자 생성

```typescript
POST /api/v1/users
Body: {
  name: string;
  background: 'EAST' | 'WEST' | 'SOUTH';
  personality: 'NOVELTY' | 'COMFORT' | 'SOCIAL';
  activity: 'ACTIVE' | 'QUIET' | 'CREATIVE';
  worth: 'PHOTO' | 'ECO' | 'STORY';
}
Response: {
  name: string;
  background: string;
  personality: string;
  activity: string;
  worth: string;
  recommendedPlace: RecommendedPlace[];
}
```

#### 2. 사용자 정보 조회

```typescript
GET /api/v1/users/:name
Response: UserInfoResponse
```

#### 3. 관광지 선택 저장

```typescript
PATCH /api/v1/users/:name/place
Body: {
  place: string[];
}
```

#### 4. 이미지 업로드

```typescript
POST /api/v1/users/:name/place-images/:characterType
Body: FormData (file)
Response: {
  s3Key: string;
  index: number;
  message: string;
}
```

#### 5. VisitJeju 콘텐츠 조회

```typescript
GET /api/v1/visitjeju-contents/:title
Response: VisitJejuContent
```

### API 클라이언트 설정

```typescript
// src/api/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-type': 'application/json',
  },
});
```

### 에러 처리

- 네트워크 오류 시 사용자에게 알림
- CORS 오류 처리
- 타임아웃 설정

---

## 🗺 카카오맵 연동

### 카카오맵 초기화

```typescript
// src/hooks/useKakaoMap.ts
export const useKakaoMap = (options?: KakaoMapOptions) => {
  // 카카오맵 스크립트 동적 로드
  // 지도 초기화
  // 마커 관리
}
```

### 주요 기능

#### 1. 지도 영역 제한
- 제주도 영역으로 지도 이동 제한
- 남서쪽 좌표: (33.1, 126.1)
- 북동쪽 좌표: (33.8, 127.0)

#### 2. 마커 관리
- 주소를 좌표로 변환 (Geocoder API)
- 장소 검색 (Places API)
- 커스텀 마커 이미지 (SVG)
- 선택/비선택 상태에 따른 마커 색상 변경

#### 3. 정보 창 (InfoWindow)
- 마커 클릭 시 상세 정보 표시
- "큰 지도 보기" 및 "길찾기" 링크 제공
- 닫기 버튼으로 오버레이 제어

#### 4. 지도 중심 이동
- 모든 마커의 중심점 계산
- 부드러운 애니메이션으로 중심 이동

### 사용 예시

```typescript
const { mapContainer, addMarkerByAddress, updateMarkerColor } = useKakaoMap({
  center: { lat: 33.450701, lng: 126.570667 },
  level: 11,
});

// 마커 추가
addMarkerByAddress({ address: '제주시...', placeName: '성산일출봉' }, 0);

// 마커 색상 변경
updateMarkerColor(0, true); // 선택됨
```

---

## 📱 PWA 기능

### Service Worker

Vite PWA 플러그인을 사용하여 Service Worker를 자동 생성합니다.

### 캐싱 전략

#### 정적 리소스
- JS, CSS, HTML, 이미지, 폰트 등
- 1년 캐시 (immutable)

#### API 요청
- NetworkFirst 전략
- 1시간 캐시
- 최대 50개 항목

### 매니페스트 설정

```json
{
  "name": "Hidden Jeju",
  "short_name": "Hidden Jeju",
  "description": "Hidden Jeju Travel App",
  "theme_color": "#262626",
  "start_url": "/",
  "display": "standalone"
}
```

### 오프라인 지원

- 정적 리소스는 오프라인에서도 접근 가능
- API 요청은 네트워크 우선 전략 사용

---

## 🎨 UI/UX 특징

### 디자인 시스템

#### Vapor UI
- 구름(Goorm) 공식 디자인 시스템 사용
- 일관된 디자인 언어
- 접근성 준수

#### Tailwind CSS
- 유틸리티 퍼스트 접근
- 반응형 디자인
- 커스텀 디자인 토큰

### 애니메이션

#### Framer Motion
- 페이지 전환 애니메이션
- 카드 호버 효과
- 로딩 상태 표시

#### 주요 애니메이션
- 질문 전환 시 페이드 인/아웃
- 카드 선택 시 스케일 효과
- 진행 바 애니메이션

### 반응형 디자인

- 모바일 퍼스트 접근
- 최대 너비 375px 기준
- 터치 친화적 인터페이스

### 색상 시스템

#### 지역별 배경 그라데이션
- 동부 제주: `#C76E54` → `#E47F62`
- 서부 제주: `#051A30` → `#104174`
- 남부 제주: `#3C82B4` → `#4592CA`

#### 시맨틱 색상
- Primary: `#262626`
- Success: 초록색 계열
- Warning: 노란색 계열
- Danger: 빨간색 계열

---

## 👨‍💻 개발 가이드

### 코드 스타일

#### TypeScript
- 엄격한 타입 체크
- 인터페이스 우선 사용
- 타입 가드 활용

#### 컴포넌트 구조
```typescript
// 1. Props 인터페이스 정의
interface ComponentProps {
  title: string;
  onClick: () => void;
}

// 2. 컴포넌트 정의
const Component: React.FC<ComponentProps> = ({ title, onClick }) => {
  // 3. Hooks
  const [state, setState] = useState();
  
  // 4. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 5. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

### 커스텀 훅

#### useKakaoMap
- 카카오맵 초기화 및 관리
- 마커 추가/업데이트
- 지도 중심 이동

#### 사용 예시
```typescript
const { mapContainer, addMarkerByAddress, updateMarkerColor } = useKakaoMap({
  center: { lat: 33.450701, lng: 126.570667 },
  level: 11,
});
```

### 상태 관리

#### 로컬 상태
- `useState`를 사용한 컴포넌트 내부 상태
- `useRef`를 사용한 DOM 참조 및 불변 값

#### 전역 상태
- `localStorage`를 사용한 사용자 정보 저장
- React Router의 `location.state`를 사용한 페이지 간 데이터 전달

### 라우팅

```typescript
// App.tsx
<Routes>
  <Route index element={<Start />} />
  <Route path="/question" element={<QuestionPage />} />
  <Route path="/selection/select" element={<SelectPage />} />
  <Route path="/selection/completion" element={<SelectCompletion />} />
  <Route path="/final" element={<Final />} />
</Routes>
```

### 에러 처리

#### API 에러
```typescript
try {
  const response = await api.post('/api/v1/users', data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Axios 에러 처리
  }
}
```

#### 네트워크 에러
- CORS 오류 감지 및 처리
- 타임아웃 설정
- 재시도 로직

### 테스트

현재 테스트는 구현되지 않았으나, 향후 추가 예정:
- Unit Tests (Vitest)
- Component Tests (React Testing Library)
- E2E Tests (Playwright)

---

## 🐛 트러블슈팅

### 자주 발생하는 문제

#### 1. 카카오맵이 로드되지 않음

**원인**: 카카오 JavaScript API 키가 설정되지 않음

**해결**:
```bash
# .env 파일 확인
VITE_KAKAO_JAVASCRIPT_KEY=your-key-here
```

#### 2. API 요청 실패

**원인**: CORS 오류 또는 잘못된 API URL

**해결**:
- 백엔드 CORS 설정 확인
- `VITE_BASE_URL` 환경 변수 확인
- 네트워크 탭에서 요청 상태 확인

#### 3. 빌드 시 환경 변수 누락

**원인**: Vite는 빌드 시점에만 환경 변수를 읽음

**해결**:
```bash
# Docker 빌드 시
docker build --build-arg VITE_BASE_URL=... --build-arg VITE_KAKAO_JAVASCRIPT_KEY=...
```

#### 4. 이미지 업로드 실패

**원인**: 파일 크기 제한 또는 S3 권한 문제

**해결**:
- 파일 크기 확인 (권장: 5MB 이하)
- S3 버킷 권한 확인
- 백엔드 로그 확인

#### 5. PWA가 작동하지 않음

**원인**: HTTPS가 아닌 환경에서 실행

**해결**:
- 프로덕션 환경에서는 HTTPS 필수
- 개발 환경에서는 `devOptions.enabled: false`로 설정

### 성능 최적화

#### 이미지 최적화
- WebP 형식 사용 고려
- 이미지 지연 로딩 (lazy loading)
- 썸네일 크기 최적화

#### 번들 크기 최적화
- 코드 스플리팅
- 동적 import 사용
- 불필요한 의존성 제거

#### 캐싱 전략
- Service Worker 캐싱
- API 응답 캐싱
- 정적 리소스 CDN 사용

---

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면 다음 단계를 따르세요:

1. **Fork** 저장소
2. **Feature 브랜치** 생성 (`git checkout -b feature/AmazingFeature`)
3. **변경사항 커밋** (`git commit -m 'Add some AmazingFeature'`)
4. **브랜치에 푸시** (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

### 커밋 컨벤션

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가
- `chore`: 빌드 업무 수정, 패키지 매니저 설정 등

### 코드 리뷰

- 모든 PR은 코드 리뷰를 거쳐야 합니다
- 테스트가 통과해야 합니다
- 린터 오류가 없어야 합니다

---

## 📄 라이선스

이 프로젝트는 [MIT License](LICENSE) 하에 배포됩니다.

---

## 🙏 감사의 말

- **구름(Goorm)**: Vapor UI 디자인 시스템 제공
- **카카오**: 카카오맵 API 제공
- **제주특별자치도**: VisitJeju API 제공
- **팀원들**: 프로젝트 개발에 참여한 모든 팀원들

---

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 다음으로 연락해주세요:

- **이메일**: [프로젝트 이메일]
- **이슈 트래커**: [GitHub Issues](https://github.com/16th-9oormthon-icrowd/FE/issues)

---

<div align="center">

**Made with ❤️ by Goorm 16th Team**

[⬆ 맨 위로 이동](#-목차)

</div>
