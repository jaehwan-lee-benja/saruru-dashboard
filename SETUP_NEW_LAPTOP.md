# 새 노트북 설정 가이드

다른 노트북에서 saruru-dashboard 프로젝트를 시작하기 위한 단계별 가이드입니다.

## ✅ 체크리스트

### 1단계: 기본 개발 도구 설치

```bash
# Node.js 설치 확인
node --version
# 없으면 설치: brew install node

# Git 설치 확인
git --version
# 없으면 설치: brew install git

# GitHub CLI 설치 (선택사항, 편리함)
brew install gh
```

- [ ] Node.js 설치 완료
- [ ] Git 설치 완료
- [ ] GitHub CLI 설치 완료 (선택)

---

### 2단계: GitHub 인증

```bash
# GitHub CLI로 로그인
gh auth login
```

- [ ] GitHub 로그인 완료

---

### 3단계: 저장소 클론

```bash
# 원하는 위치로 이동 (예: ~/projects)
cd ~/projects

# 저장소 클론
git clone https://github.com/jaehwan-lee-benja/saruru-dashboard.git

# 프로젝트 폴더로 이동
cd saruru-dashboard
```

- [ ] 저장소 클론 완료
- [ ] 프로젝트 폴더로 이동 완료

---

### 4단계: ⚠️ 환경 변수 파일 생성 (중요!)

`.env` 파일은 GitHub에 업로드되지 않으므로 **반드시 수동으로 생성**해야 합니다.

```bash
# .env 파일 생성
nano .env
```

다음 내용을 복사해서 붙여넣기:

```
VITE_SUPABASE_URL=https://obpgmdutdzjkryxhbmpk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icGdtZHV0ZHpqa3J5eGhibXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTMwODcsImV4cCI6MjA3NzcyOTA4N30.Hj7vrkO-yTMTVvNIE5ixNFdhdFe1FhWl3sSywgnY8Vw
```

저장: `Ctrl+O` → `Enter` → `Ctrl+X`

- [ ] `.env` 파일 생성 완료
- [ ] Supabase URL 입력 완료
- [ ] Supabase API Key 입력 완료

---

### 5단계: 의존성 설치

```bash
# NPM 패키지 설치
npm install
```

- [ ] npm install 완료

---

### 6단계: 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev
```

브라우저에서 접속: http://localhost:5173/saruru-dashboard/

- [ ] 개발 서버 실행 완료
- [ ] 브라우저에서 접속 확인
- [ ] 목표 추가/삭제 테스트 완료
- [ ] Supabase 데이터 저장 확인

---

### 7단계: Claude Code 설정 (선택사항)

Claude Code를 사용하려면:
1. Claude 앱 실행
2. Code 탭 이동
3. 프로젝트 폴더 열기: `/Users/[사용자명]/projects/saruru-dashboard`

- [ ] Claude Code 설정 완료

---

## 🚨 문제 해결

### 문제: "Cannot find module '@supabase/supabase-js'"
**해결:** `npm install` 다시 실행

### 문제: 목표가 저장되지 않음
**해결:** `.env` 파일이 제대로 생성되었는지 확인

### 문제: 로컬 서버가 안 뜸
**해결:**
- 포트 5173이 사용 중인지 확인
- `npm run dev`를 다시 실행

---

## 📝 추가 정보

- **GitHub Repository:** https://github.com/jaehwan-lee-benja/saruru-dashboard
- **공개 웹사이트:** https://jaehwan-lee-benja.github.io/saruru-dashboard/
- **Supabase 대시보드:** https://supabase.com

---

## 🎯 완료 후 확인사항

모든 단계를 완료했다면:
- [ ] 로컬에서 목표 추가 가능
- [ ] 페이지 새로고침해도 데이터 유지됨
- [ ] Supabase Table Editor에서 데이터 확인됨
- [ ] Git 커밋 및 푸시 가능

---

**작성일:** 2025-11-03
**다음 작업:** 새로운 기능 개발 시작!
