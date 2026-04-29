# KODIT 일경험 인턴 SPAR 관찰일지

신보(KODIT) 일경험 인턴십 중 겪은 경험을 SPAR 구조로 기록하고, 자소서·면접 준비 소재로 관리하는 웹앱입니다.

**라이브 데모:** https://kodit-journal.vercel.app

## 주요 기능

- **SPAR 구조 기록** — 상황(S) / 문제(P) / 행동(A) / 결과(R) 형식으로 경험 작성
- **역량 태그** — 문제해결, 커뮤니케이션, 팀워크 등 8개 역량으로 분류
- **완성도 관리** — 0~100% 슬라이더로 소재 완성도 추적
- **오프라인 지원** — IndexedDB(Dexie) 로컬 캐시로 인터넷 없이도 동작
- **자동 동기화** — Supabase와 실시간 동기화, 동기화 상태 표시
- **내보내기** — Excel(.xlsx), Markdown(.md), JSON 백업 지원
- **대시보드** — 역량 태그별 분포 차트, 최근 소재 목록
- **모바일 대응** — 반응형 레이아웃 + 하단 탭바

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite 8 |
| 상태 관리 | Zustand + Immer |
| 로컬 DB | Dexie.js (IndexedDB) |
| 백엔드 | Supabase (PostgreSQL + Auth) |
| 인증 | Google OAuth 2.0 |
| 차트 | Chart.js + react-chartjs-2 |
| 엑셀 | SheetJS (xlsx) |
| PWA | vite-plugin-pwa |
| 배포 | Vercel |

## 보안

- **Row Level Security(RLS)** 적용 — 사용자는 자신의 데이터만 접근 가능
- Google OAuth 전용 (비밀번호 없음)
- 환경변수로 자격증명 관리 (소스코드에 시크릿 없음)

## 로컬 실행

```bash
# 저장소 클론
git clone https://github.com/jenglow00-create/kodit-journal.git
cd kodit-journal

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env에 Supabase URL과 anon key 입력

# 개발 서버
npm run dev
```

### 환경변수 설정

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. Authentication → Sign In / Providers → Google OAuth 활성화
3. SQL Editor에서 스키마 실행 (아래 참조)

```sql
-- materials 테이블
create table public.materials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  scene text not null,
  raw_note text,
  spar_s text, spar_p text, spar_a text, spar_r text,
  competency_tags text[] default '{}',
  completion integer default 0 check (completion between 0 and 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.materials enable row level security;
create policy "materials_own" on public.materials
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## 라이선스

MIT
