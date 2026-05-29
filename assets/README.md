# assets/ — 바이너리 에셋 (이미지 / 오디오)

게임은 이 폴더의 파일이 **없어도 정상 동작**한다 (이미지=SVG/로고 폴백, BGM=무음, 효과음=Web Audio 합성).
아래 경로·파일명에 맞춰 파일을 넣으면 **즉시 반영**된다. 매니페스트: `src/assets/manifest.js`.

## 이미지 — `assets/img/`
| 파일명 | 용도 | 권장 스펙 |
|---|---|---|
| `title-hero.png` | 타이틀 화면 대표 일러스트 | 가로형 ~1024×640, 모바일 가독, 텍스트 없이(로고는 위에 덧씀) |
| `event-draft.png` | 특별이벤트 컷 — 드래프트 (예시) | 정사각/세로 ~768, 투명배경 선택 |
| `event-champion.png` | 특별이벤트 컷 — 우승 (예시) | 동상 |

- 포맷: PNG(투명 필요 시) 또는 WebP. 한 장당 가급적 ≤300KB (모바일 데이터).
- 생성: Gemini(Imagen) — 본인 로그인 브라우저에서. 프롬프트 시트는 Phase 2 에서.

## 오디오 — `assets/audio/`
| 파일명 | 용도 | 권장 스펙 |
|---|---|---|
| `bgm-menu.mp3` | 타이틀/메뉴 BGM (루프) | 30~60s 루프, 차분, ≤1MB |
| `bgm-game.mp3` | 경기(weekly) BGM (루프) | 30~60s 루프, 경쾌, ≤1MB |

- 효과음(타격/홈런/삼진/클릭)은 파일 불필요 — `src/assets/audio.js` 가 합성.
- BGM 생성: MusicFX / Lyria (labs.google) — Gemini 챗 아님. 막히면 CC0 무료음원.
- 음소거/볼륨: 설정 모달(⚙) 에서 조절.
