# What is Hype? | MVP 기획서

## 1. 서비스 개요
- **서비스 이름:** What is Hype?
- **서비스 슬로건:** 지금 이 순간, 인터넷이 뜨거워하는 것들
- **핵심 목적 (MVP):** 검색/뉴스/컬쳐 트렌드(Google Trends, X, Google News, Melon)를 통합하여 "지금 뭐가 핫한지"를 다각도로 파악
- **최종 비전:** 분란 없는, 객관적이고 중립적인 실시간 Hype 트래커

## 2. 타겟 사용자 및 핵심 가치
- **주요 타겟 (Persona):** "지금 뭐가 이슈야?"를 빠르게 파악하고 싶은 20~30대 인터넷 유저
- **핵심 가치 제안 (UVP):** 검색 트렌드 + 커뮤니티 반응을 다각도로 교차 확인

## 3. MVP 기능 명세

| 카테고리 | 기능 명세 (MVP 범위) | 비고 (V2 확장 계획) |
| --- | --- | --- |
| **Google Trends Hero** | 실시간 급상승 키워드 카드 그리드<br>트래픽 규모별 시각적 강조 (500+, 2K+ 등)<br>관련 뉴스 제목·썸네일 표시 | 시간별 트렌드 그래프 |
| **X (Twitter) 트렌드** | 실시간 트렌드 Top 10 리스트<br>X 검색 링크 연결 | 트윗량 변동 추이 |
| **종합 News Hype** | Google News 실시간 주요 뉴스 10개<br>언론사 및 시간 표시 | 카테고리별 뉴스 제공 |
| **음원/Culture Hype** | Melon Chart Top 10 리스트<br>곡명 및 아티스트 표시 | 영화 박스오피스 추가 |
| **실시간 새로고침** | 수동 새로고침 버튼 + 마지막 업데이트 시간 | 자동 폴링 (30초 간격) |
| **다크 모드** | 기본 다크 + 토글 전환 (localStorage 저장) | 테마 커스터마이징 |
| **반응형 UI** | 모바일 1-col / 데스크톱 3-section | 태블릿 최적화 |

## 4. 데이터 및 기술 구현

### 핵심 데이터 확보 전략

| 소스 | 엔드포인트 | 방식 | 인증 | 갱신 |
|------|-----------|------|------|------|
| Google Trends KR | `trends.google.com/trending/rss?geo=KR` | RSS XML parse | 불필요 | 실시간 |
| X (Twitter) 트렌드 | `trends24.in/korea` | Cheerio 스크래핑 | 불필요 | 실시간 |
| Google News (KR) | `news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko` | RSS XML parse | 불필요 | 실시간 |
| Melon Chart | `melon.com/chart/index.htm` | Cheerio 스크래핑 | 불필요 | 1시간 |

### 기술 스택
- **프레임워크:** Next.js 16 (App Router, TypeScript)
- **스타일링:** Tailwind CSS v4
- **데이터 소스:** RSS/XML parse, JSON API, Cheerio HTML scraping
- **배포:** Vercel (사용자가 직접 연결)

### 핵심 사용자 워크플로우
- **[흐름 1] 접속:** 메인 페이지 → 4개 소스 동시 로드 → 키워드 중심 대시보드 표시
- **[흐름 2] 새로고침:** 새로고침 버튼 → 전체 API 재호출 → 피드 갱신
- **[흐름 3] 상세 보기:** 키워드/게시글 클릭 → 원본 사이트로 새 탭 이동

## 5. 운영 및 성장 전략 (MVP)
- **MVP 핵심 목표:** 서비스 정상 동작 확인 + Vercel 배포 완료
- **수익 모델 (초기/중기):** 없음 (사이드 프로젝트)
- **초기 사용자 확보 전략:** 개인 사용 + 친구 공유
