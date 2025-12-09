# 🎄 나의 크리스마스 MBTI 테스트

간단한 테스트를 통해 당신의 크리스마스 스타일을 알아보고, 어울리는 활동과 캐롤을 추천받아 보세요!

![Christmas MBTI App Demo](./public/demo.gif) 
*(데모 GIF는 예시이며, 실제 앱의 기능과 차이가 있을 수 있습니다.)*

---

## ✨ 주요 기능

- **MBTI 기반 테스트**: 12개의 질문을 통해 사용자의 크리스마스 유형을 분석합니다.
- **개인화된 결과**: 8가지 독특한 크리스마스 MBTI 유형 중 하나를 결과로 보여줍니다.
- **활동 및 캐롤 추천**: 결과 유형에 어울리는 크리스마스 활동과 캐롤송을 추천합니다.
- **결과 카드 저장**: 나만의 결과 카드를 이미지(.png) 또는 움직이는 GIF 파일로 저장할 수 있습니다.
- **링크 공유**: 테스트 결과를 친구들과 공유할 수 있는 링크 복사 기능을 제공합니다.
- **애니메이션 효과**: 질문 전환 시 부드러운 애니메이션 효과로 사용자 경험을 향상시켰습니다.

## 🛠️ 사용된 기술

- **Frontend**: React, TypeScript, Vite
- **Styling**: styled-components
- **Database**: Firebase Realtime Database (참여자 수 집계)
- **Deployment**: Netlify

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-username/christmas-mbti-app.git
cd christmas-mbti-app
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

Firebase 연동을 위해 `.env` 파일을 생성하고 아래와 같이 Firebase 설정 정보를 추가해야 합니다.

```
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_DATABASE_URL=your_database_url
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
```

### 4. 개발 서버 실행

```bash
npm run dev
```

이제 브라우저에서 `http://localhost:5173` (또는 다른 포트)으로 접속하여 앱을 확인할 수 있습니다.
