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
- 이름 수정
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
- **Security & Proxy**: Let’s Encrypt SSL, AWS Certificate Manager, Nginx Reverse Proxy (SSL & 포트 관리)

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

#### Google OAuth 팝업 → 부모창 메시지 전달 안 됨

- 문제: Google OAuth 팝업에서 로그인 후 postMessage로 부모창에 토큰 전달 → 부모창이 메시지를 못 받아서 인증이 안됨.
- 원인: 팝업 → postMessage는 보내는데, 부모창에서 origin 검사 불일치
- 해결: 팝업에서 window.opener.postMessage 사용, 부모창에서 origin을 VITE_CLIENT_URL로 정확히 맞춤

  ```javaScript
  // 부모 창
  function handleMessage(event: MessageEvent) {
    // ✅ origin 검사!
    // 메시지를 보낸 출처(origin)가 내가 의도한 것과 다르면 무시
    if (event.origin !== import.meta.env.VITE_CLIENT_URL) return;

    if (event.data.type === "google-login-success") {
      // origin 검사가 없으면 무조건 실행됨
      // origin이 달라지면 메시지를 무시하거나, 보안 위험
      const token = event.data.token;
      authStore.token = token;
      localStorage.setItem("token", token);
      authStore.verifyCertificate();
      window.location.href = "/";
    }
  }
  ```

#### 라우터 가드 리다이렉트 무한 반복

- 문제: 라우터 가드에서 토큰 확인 + 인증 복원 + 리다이렉트 조건이 꼬여서 /login → / → /login 무한루프 발생. 인증 복원이 await 되기 전에 리다이렉트 조건이 실행됨
- 해결: verifyCertificate를 반드시 await 해서 인증 복원이 완료된 후에 다음 조건 실행.

  ```javaScript
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    // 수정 전: verifyCertificate()를 await 하지 않음
    // if (authStore.token && !authStore.user) {
    //  authStore.verifyCertificate();
    // }

    // ✅ 수정 후: 반드시 await!
    if (authStore.token && !authStore.user) {
      await authStore.verifyCertificate();
    }

    // ✅ 그리고 바로 다음 조건 실행
    if (
      (to.path === "/login" || to.path === "/register") &&
      authStore.token &&
      authStore.user
    ) {
      return next("/");
    }

    if (
      !authStore.token &&
      !["/login", "/register"].includes(to.path)
    ) {
      return next("/login");
    }

    next();
  });
  ```

#### EC2, RDS, Amplify 배포 시 CORS & 환경변수 문제

- 문제: 백엔드(EC2)와 DB(RDS), 프론트(Amplify)가 서로 다른 도메인으로 배포됨 → CORS 에러 발생

  환경변수(VITE_API_URL, VITE_CLIENT_URL, GOOGLE_CLIENT_ID) 설정 불일치로 API 요청 실패

- 해결

  **백엔드**

  - CORS 설정에서 origin에 Amplify 도메인과 로컬 모두 허용.
  - .env로 CLIENT_URL 관리.

  **프론트**

  - VITE_API_URL을 Amplify 환경변수로 추가 - 로컬 .env에도 동일한 값 유지.
  - 배포 후에도 postMessage의 origin이 정확해야 해서, 팝업과 부모창의 URL이 일치하도록 관리.

    ```javaScript
    function handleMessage(event: MessageEvent) {
      // 수정 전: 단일 환경변수 검사
      // if (event.origin !== import.meta.env.VITE_CLIENT_URL) return;

      // ✅ 수정 후: 로컬 + 배포 모두 허용하도록 배열 검사
      const allowedOrigins = [
        import.meta.env.VITE_CLIENT_URL, // 배포 URL
        window.location.origin, // 현재 창 origin (로컬 개발 시)
      ];

      if (!allowedOrigins.includes(event.origin)) return;

      if (event.data.type === "google-login-success") {
        const token = event.data.token;
        authStore.token = token;
        localStorage.setItem("token", token);
        authStore.verifyCertificate();

        window.location.href = "/";
      }
    }
    ```

### 6. 배포 & 운영

- **EC2**: Node.js 백엔드 서버 배포
- **Amplify**: 프론트엔드 CI/CD 배포
- **RDS**: MySQL DB 관리
- **도메인**: A 레코드로 EC2 연결, CNAME으로 Amplify 연결
- **SSL 인증서**:
  - Let’s Encrypt (무료)
  - AWS Certificate Manager (유료도 가능)
  - Nginx 리버스 프록시로 SSL 적용 & 포트 관리
  - Certbot 자동 갱신 스크립트
- **Nginx Reverse Proxy**
  - 80 → 443 리디렉션
  - Let’s Encrypt SSL 인증서 발급 및 자동 갱신 (`certbot renew`)
  - 백엔드(EC2 Node.js)와 프론트(AWS Amplify) 각각 HTTPS로 접근

## ✅ 최종 결과

- 이메일/비밀번호 회원가입 & 로그인
- Google OAuth2 로그인
- 사용자 정보 CRUD (이메일/이름/비밀번호/프로필 이미지)
- JWT 인증 미들웨어 + 라우터 가드
- AWS 풀스택 배포 (EC2, RDS, Amplify)
- 모바일 반응형 UI

## 👤 Author

- GitHub: [Chaewon](https://github.com/fromnowwon)
