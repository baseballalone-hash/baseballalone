# DEVELOPMENT.md — 개발 · 테스트 · 배포 가이드

개발 환경 설정, 테스트·검증 방법, 배포 절차, 에셋 파이프라인을 정리한 개발자용 가이드.

> **문서 원칙**: 코드 = *무엇을* / 문서 = *왜·상태·다음*  
> 모든 주요 변경 시 관련 문서를 함께 갱신합니다.

---

## 1. 프로젝트 한 줄 요약

빌드 없음 · Vanilla JS(ESM) · SVG 코드생성 · localStorage 세이브(+Firebase) · Firebase Hosting · i18n(ko/en) · GameMonetize 광고  
`index.html` 정적 서빙만으로 동작. `main` 푸시 시 GitHub Actions → Firebase Hosting 자동 배포 (<https://baseball-alone.web.app>).

---

## 2. 필요 도구 / 의존성

**런타임 의존성: 없음.** 프레임워크/번들러/npm 패키지 0개 (Vanilla JS ESM).

| 구분 | 항목 | 용도 |
|---|---|---|
| **런타임(설치 불필요)** | Firebase SDK 10.13.0 | 클라우드 세이브/로그인. CDN(gstatic) 직접 import |
| **로컬 서버** | Python 3 | `python3 -m http.server` (ESM은 file:// 불가) |
| **시뮬 테스트** | Node ≥ 18 | `probe.mjs` / `probe-career.mjs` 실행 (ESM, 의존성 0) |
| **브라우저 테스트** | Playwright 1.60.0 | `npm install --no-save` (커밋 X). 헤드리스 Chromium |
| **이미지 가공** | Python Pillow(PIL) | 해상도 조정 및 WebP 변환 |
| **배포 확인** | GitHub CLI `gh` | `gh run list`로 Actions 확인 (선택) |
| **버전관리** | git | main 푸시 → 자동 배포 |

---

## 3. 로컬 실행

```bash
# ES Module은 file:// 로 열면 CORS 에러 — 반드시 HTTP 서버 경유
python3 -m http.server 8765
# → http://localhost:8765 접속
```

---

## 4. 테스트 / 검증

### 4.1 시뮬 회귀 테스트 (Node.js)

코드 변경 후 반드시 실행. Node ≥ 18 필요.

```bash
node probe.mjs          # 단위 검증 — 마지막에 "✅ 전체 통과" 출력 확인
node probe-career.mjs   # 16세~38세 풀 커리어 22시즌 자동 시뮬
node probe-regression.mjs  # 회귀 시스템 89항목 검증
```

**기대치:**
- `probe.mjs`: `[FAIL]` 0건, "✅ 전체 통과"
- `probe-career.mjs`: 통산 AVG `.230` 대, 시즌 ERA `4~6`, OVR 32~34세 피크 후 노화 감소
- `probe-regression.mjs`: capBoosts 관련 기존 실패 제외 전체 통과

### 4.2 브라우저 검증 (Playwright)

로컬 서버 구동 상태에서 핵심 시나리오 자동 검증.

```bash
npm install --no-save playwright@1.60.0
npx playwright install chromium
# 테스트 스크립트 실행
```

### 4.3 수동 시나리오 체크리스트

브라우저에서 직접 확인이 필요한 항목들:

- [ ] **단경기 마일스톤** — 노히트/완봉/사이클링/끝내기 토스트
- [ ] **통산 마일스톤** — 100안타/50홈런/100K 임계 도달 토스트
- [ ] **HBP 부상** — 사구 후 부상 토스트 (부위 + 후유증)
- [ ] **골든글러브** — 수비형 1시즌 후 시즌 종료 carousel 수상
- [ ] **드래프트 라이브** — KBO 선택 → 라운드 누적 → 호명 → 계약금
- [ ] **포스트시즌 시리즈** — 순위권 → 라운드별 시리즈 진행
- [ ] **명예의 전당** — 은퇴 시 점수 breakdown + 헌액/영구결번/일반 등급
- [ ] **i18n 토글** — 모든 알림/모달이 KO ↔ EN 즉시 전환

### 4.4 알려진 한계 (실기 확인 대기)

- **BGM 백그라운드**: `visibilitychange` pause — 샌드박스에서 재현 불가, 실기 필요
- **Google 로그인**: authDomain 정렬 후 배포 실기 확인 필요
- **결승 마지막 주 멈춤**: DOM 의존 버그, 실기 재현 확인 대기
- **능력치 스케일업 밸런스**: `probe-career`가 전지훈련을 거치지 않아 주인공 과소평가 → 실기 확인

---

## 5. 배포

```bash
# main 브랜치 푸시 시 GitHub Actions가 자동 배포
git push origin main

# 배포 상태 확인
gh run list --limit 5
```

- **자동 배포**: `main` 푸시 → `Deploy to Firebase Hosting on merge` Actions 실행
- **GameMonetize 번들**: `baseballalone-gm.zip` (index.html + src + styles + assets, .md/probe 제외, ~4MB)
- `.gitignore`: `node_modules/`, `package-lock.json`, `*.zip` 등록

---

## 6. 에셋 파이프라인

### 6.1 폴백 원칙

에셋 파일이 없어도 게임은 에러 없이 정상 구동합니다.

- **이미지**: 로드 실패 시 `src/assets/images.js`가 SVG 벡터로 즉시 대체
- **BGM**: 오디오 파일 없으면 무음
- **효과음**: 파일 없이 Web Audio API로 코드 합성

### 6.2 이미지 에셋 추가

```python
from PIL import Image
im = Image.open('source.png')
W = 512  # 이벤트 컷 기준 (타이틀은 640)
im = im.resize((W, round(im.size[1]*W/im.size[0])), Image.Resampling.LANCZOS)
im.save('assets/img/target.webp', 'WEBP', quality=82)
```

생성된 `assets/img/<이름>.webp`를 `src/assets/manifest.js`에 키와 경로로 매핑.

에셋 규약 상세는 [`assets/README.md`](./assets/README.md) 참조.

### 6.3 캐릭터 커스터마이징 파츠 고품질화 (미완성)

이미지 생성 API 쿼타 한도로 85종 커스텀 파츠가 PIL 드로잉 코드로 대체되어 있습니다.  
쿼타 해제 후 카툰 일러스트 화풍으로 교체 필요:

**대상 에셋:**
- 커스텀 얼굴형 15종 (`head-[round/square/vshape]-skin[1..5].webp`)
- 커스텀 눈 5종 (`eye-[calm/sharp/smile/cool/fierce].webp`)
- 앞/뒷머리 50종 (`hair-front/back-[style]-color[1..5].webp`)
- 액세서리 5종 (`acc-[cap/glasses/helmet/scar/blush].webp`)
- 몸통 5종 (`body-bat-skin[1..5].webp`)
- POV 레이어 11종 (`pov-fg-bat-skin[1..5].webp` 등)

**가공 가이드:**
- AI 생성 프롬프트에 `on a solid white background` 필수 기재
- 흰 배경을 투명(알파 0)으로 제거 후 420x562 WebP로 저장

### 6.4 오디오 에셋

- **효과음**: `src/assets/audio.js`가 Web Audio API 오실레이터로 타격음·환호성 합성
- **BGM**: `assets/audio/bgm-menu.wav`, `bgm-game.wav`. 설정 모달에서 볼륨 조절

---

## 7. 자주 쓰는 명령

```bash
# 검증
node probe.mjs
node probe-career.mjs

# 로컬 서버
python3 -m http.server 8765

# 배포 확인
gh run list --limit 5
```
