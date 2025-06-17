# Login System (Fullstack)

이 프로젝트는 간편한 **이메일 회원가입/로그인**과 **구글 OAuth 로그인**을 모두 지원하는 Vue + Node.js 기반 인증 시스템입니다.

👉 [DEMO](https://main.d2vnv368tnvtm1.amplifyapp.com/)

![미리보기](./client/public/demo.png)

## ✨ 주요 기능

🗝️ 인증 & 회원 관리

- 회원가입
- 이메일 & 비밀번호 기반 회원가입
- 비밀번호 해시 처리 (bcrypt)
- 중복 이메일 체크
- 로그인
- 이메일 & 비밀번호 로그인
- JWT 발급 및 로컬스토리지 저장
- Google 소셜 로그인 (OAuth2)
- Google OAuth 인증
- 팝업 방식으로 안전한 토큰 처리
- 로그인 후 자동 회원가입(최초) 또는 기존 계정 로그인
- 로그아웃
- Pinia 상태 & 로컬스토리지 토큰 제거
- 인증 상태 초기화

👤 유저 정보 관리

- 프로필 조회
- 로그인된 사용자의 기본 정보 반환 (ID, 이메일, 이름, 프로필 이미지)
- 이메일 수정
- 유저가 자신의 이메일 변경 가능
- 변경 시 중복 체크
- 이름(닉네임) 수정
- 유저가 자신의 이름 수정 가능
- 비밀번호 변경
- 현재 비밀번호 확인 후 새로운 비밀번호로 변경
- 안전한 해시 처리
- 프로필 이미지 업로드 & 변경
- 파일 업로드 지원
- 프로필 사진 DB에 경로 저장
- 변경된 이미지 반영

🔒 보안 및 인증

- JWT 토큰 인증
- 모든 보호된 API는 JWT 인증 필요
- 라우터 가드로 인증 상태 없으면 접근 차단
- 토큰 갱신 로직
- 페이지 새로고침 시 로컬 토큰으로 인증 복원 (verifyCertificate)
- CORS & Same-Origin Policy 대응
- OAuth 팝업 → 부모창 postMessage 안전 처리
- origin 검사로 보안 강화

## ⚙️ 기술 스택

- **Frontend**: Vue 3, Vite, Pinia, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: MySQL
- **OAuth**: Google OAuth2 API
- **Deployment**: AWS EC2 (Backend), AWS Amplify (Frontend), AWS RDS (DB)

## 프로젝트 구조

```bash
login-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts       # 로그인/회원가입 처리
│   │   │   └── user.controller.ts       # 사용자 정보 조회/수정
│   │   ├── routes/
│   │   │   ├── auth.routes.ts           # /api/auth 라우트
│   │   │   └── user.routes.ts           # /api/user 라우트
│   │   ├── middlewares/
│   │   │   └── authMiddleware.ts        # JWT 인증 미들웨어
│   │   ├── db/
│   │   │   ├── index.ts                 # MySQL 연결 풀
│   │   │   └── schema.sql               # DB 스키마 정의
│   │   ├── types/                       # 타입 정의 모음
│   │   ├── utils/
│   │   │   └── jwt.ts                   # JWT 발급/검증 유틸리티
│   │   ├── app.ts                       # Express 앱 설정
│   │   └── index.ts                     # 서버 실행 진입점
│   ├── tsconfig.json
│   ├── package.json
│   └── ...
│
├── client/
│   ├── src/
│   │   ├── components/                  # UI 컴포넌트
│   │   │   ├── LoginForm.vue
│   │   │   ├── GoogleLoginButton.vue
│   │   │   ├── Navbar.vue
│   │   │   └── BottomTabs.vue
│   │   ├── router/                      # Vue Router 설정
│   │   │   └── index.ts
│   │   ├── stores/                      # 전역 스토어
│   │   │   └── auth.ts
│   │   ├── views/                       # 페이지 단위 컴포넌트
│   │   │   ├── HomePage.vue
│   │   │   ├── LoginPage.vue
│   │   │   ├── RegisterPage.vue
│   │   │   ├── GoogleLoginSuccessPage.vue
│   │   │   ├── ProfilePage.vue
│   │   │   └── EditProfilePage.vue
│   │   ├── App.vue                      # 루트 컴포넌트
│   │   ├── main.ts                      # 진입점
│   │   └── style.css                    # 전역 스타일
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── ...
```

## 개발 과정 전체 요약 (Step-by-Step)

### 1. 프로젝트 초기 세팅

- Node.js Express 서버 & Vue 3 Vite 프론트엔드 생성
- ESLint, TypeScript, Pinia 스토어 세팅
- Git & GitHub 레포 연결
- CORS, 환경변수 .env 설정

### 2. Backend API 개발

- auth.controller.ts : 회원가입, 로그인, JWT 발급
- user.controller.ts : 사용자 정보 조회/수정, 비밀번호 변경, 프로필 이미지 처리
- JWT 인증 미들웨어로 보호된 API 구현
- DB(MySQL) 테이블 & 스키마 작성, 연결 풀 구성

### 3. Frontend 기능 개발

- Pinia 스토어로 authStore 설계 (토큰 & 사용자 상태)
- Vue Router & 라우터 가드 설정: 인증 상태에 따라 페이지 이동 제한
- 로그인/회원가입/마이페이지/프로필 편집 뷰 작성
- Tailwind CSS로 반응형 UI 구현

### 4. Google OAuth 연동

- Google API Console에 앱 등록 & OAuth Client ID 발급
- 팝업 방식 OAuth 처리 구현 (팝업에서 인증 → 부모창으로 토큰 전달)
- postMessage와 origin 검사로 보안 강화
- 팝업 방식 & 리디렉션 방식 모두 테스트

### 5. 문제 해결 및 디버깅

- 팝업 닫힘 문제, 새로고침 시 인증 복원 로직 (verifyCertificate)
- 라우터 가드 리다이렉트 반복 이슈
- OAuth 팝업의 origin 검사 버그 수정
- EC2, RDS, Amplify 배포 시 CORS & 환경변수 차이 대응

### 6. 배포

- Backend: AWS EC2 + PM2로 Node 서버 무중단 배포
- DB: AWS RDS (MySQL)
- Frontend: AWS Amplify 호스팅으로 CI/CD 자동화
- 서버 도메인 연결

### ✅ 최종 결과

- 이메일/비밀번호 회원가입 & 로그인
- Google OAuth2 로그인
- 사용자 정보 CRUD (이메일/이름/비밀번호/프로필 이미지)
- JWT 인증 미들웨어 + 라우터 가드
- AWS 풀스택 배포 (EC2, RDS, Amplify)
- 모바일 반응형 UI
