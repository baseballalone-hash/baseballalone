# assets/ — 바이너리 에셋 (이미지 / 오디오)

게임은 이 폴더의 파일이 **없어도 정상 동작**한다 (이미지=SVG/로고 폴백, BGM=무음, 효과음=Web Audio 합성).
파일을 규약 이름으로 넣으면 **즉시 반영**된다. 매니페스트: `src/assets/manifest.js`.

> ⚠️ **다음 세션 주의 — 아래 "✅ 완료" 에셋은 이미 생성·가공·연결·배포까지 끝났다. 절대 재생성하지 말 것.**
> 새로 만들 것은 **"🔲 TODO" 섹션(결승 POV / 캐릭터 생성)뿐**이다.

## ✅ 완료된 에셋 (재생성 금지)
**이미지 14장** (`assets/img/*.webp`, 워터마크 제거+WebP, manifest 등록, 모달 wiring 완료):
`title-hero` · `event-champion` · `event-hof` · `event-draft` · `event-intl` · `event-allstar` ·
`event-military` · `event-training` · `event-award` · `event-injury` · `event-retire` ·
`event-demote` · `event-fa` · `event-trade`

**BGM 2곡** (`assets/audio/*.wav`, 모노 22050Hz, 자동재생 연결): `bgm-menu.wav` · `bgm-game.wav`

**효과음**: 파일 불필요 — `src/assets/audio.js` 합성 (타격/홈런/삼진/클릭 등). 음소거/볼륨은 설정 모달(⚙).

→ 라이브 배포 200 확인 완료. **위 16개 파일은 다시 만들 필요 없음.**

## 🔲 TODO — 아직 생성 안 한 에셋
**결승 POV / 캐릭터 생성 이미지 4장** (povBat/povPitch/charBatter/charPitcher) — 아래 프롬프트 시트 참고.
이것만 새로 생성하면 된다. (작업 명세: `.claude/handoff.md` "★ 다음 개발 사항")

---

## Phase 2 — 프롬프트 시트 (생성용)

생성 후 원본 PNG 를 `gemini_images/` 에 두면, 워터마크 제거 + WebP 축소 후 `assets/img/event-<name>.webp`
로 저장하고 `manifest.js` 키를 추가한다. (가공 절차: `DEVELOPMENT.md` §5.2)

**공통 스타일 접미(모든 이미지 끝에 붙임)** — 기존 9장과 톤 일치:
> `anime/manga style illustration, cel-shaded, vibrant colors, dramatic cinematic lighting, detailed background, high quality, no text, no watermark, portrait 9:16`

### ✅ 부족 이벤트 컷 (완료 — 재생성 금지, 기록용)
| 파일(→키) | 장면 | 프롬프트 (앞부분 + 공통 접미) |
|---|---|---|
| event-injury (eventInjury) | 부상 | `A young Korean baseball player in uniform wincing in pain, clutching his shoulder on the field, an athletic trainer rushing in to help, worried teammates blurred in background, tense dramatic atmosphere` |
| event-retire (eventRetire) | 은퇴 | `A veteran Korean baseball player in his late 30s standing alone on an empty stadium field at dusk, holding his cap to his chest, bittersweet emotional farewell, warm golden sunset, empty stands` |
| event-demote (eventDemote) | 강등 | `A Korean baseball player sitting dejected on the bench in a dim minor-league dugout, head down, gloves beside him, disappointment, cold muted lighting, quiet somber mood` |
| event-fa (eventFa) | FA 계약 | `A Korean baseball player at a press table signing a contract with a pen, confident smile, a new team cap and folded jersey on the table, camera flashes, celebratory professional press conference` |
| event-trade (eventTrade) | 트레이드 | `A Korean baseball player carrying a duffel bag over his shoulder, glancing back at his old stadium while wearing a new team's cap, moving-on mood, overcast evening sky` |

### 🔲 결승 POV / 캐릭터 생성 (TODO — 아직 미생성, 이것만 생성)

> ⚠️ **이 4장은 위 "공통 스타일 접미"의 `portrait 9:16` 을 쓰지 않는다.** 코드상 비율이 다르다:
> - **POV 2장**: `src/render/finalAnim.js` 씬이 viewBox **320×220 (가로 ≈3:2)**. → **landscape 3:2** 로 생성.
>   공(ball)·스트라이크존이 **이미지 위에 오버레이로 그려지므로**, 투수↔홈플레이트를 잇는 **화면 중앙 세로 라인은
>   비교적 비워둘 것**(인물·텍스트로 가리지 말 것). 정중앙 대칭 구도.
> - **캐릭터 2장**: `src/render/character.js` 기본 180×240 = **세로 3:4 전신**. → **portrait 3:4** 로 생성.
>   머리(모자)~발(스파이크)까지 전신 + 약간의 헤드룸, 배경은 균일한 무지/그라데이션(누끼 따기 쉽게).
>
> **공통 스타일 접미(이 4장용, 위 9:16 대신 사용):**
> `anime/manga style illustration, cel-shaded, vibrant colors, dramatic cinematic lighting, detailed background, high quality, no text, no watermark, no UI, no logos`
> **Negative(피할 것):** `text, watermark, letters, scoreboard numbers, blurry mush, extra limbs, cluttered center, multiple overlapping players blocking the center`

| 파일(→키) | 장면 / 비율 | 프롬프트 (앞부분 + 위 공통 접미) |
|---|---|---|
| pov-bat (povBat) | 타석 POV / **3:2 가로** | `First-person point of view from inside the batter's box at a packed night baseball stadium, looking out over home plate toward the pitcher's mound straight ahead, the pitcher mid wind-up about to throw. A blurred catcher's mitt and umpire frame the lower edge, floodlit green grass, dirt base paths and a glowing crowd in the background, shallow depth of field with the mound in sharp focus, centered symmetrical composition with the central lane toward the pitcher kept open and uncluttered, tense decisive at-bat atmosphere` |
| pov-pitch (povPitch) | 마운드 POV / **3:2 가로** | `First-person point of view standing on the pitcher's mound at a night baseball stadium, looking down the lane toward home plate ahead where a batter is set in the box with the catcher crouched giving signs and the umpire behind, infield dirt and foul lines and a packed glowing grandstand filling the background, shallow depth of field, centered symmetrical composition with the lane toward home plate kept open and uncluttered, intense focused closing-pitch mood` |
| char-batter (charBatter) | 생성-타자 / **3:4 세로** | `Full-body portrait of a young Korean baseball position player in a clean white home uniform and batting helmet, confident batting stance holding a wooden bat resting on the shoulder, facing the viewer at a slight three-quarter angle, full body from cap to cleats with a little headroom, neutral seamless soft-gradient studio background, even rim lighting, character-select roster-card pose, centered, heroic confident expression` |
| char-pitcher (charPitcher) | 생성-투수 / **3:4 세로** | `Full-body portrait of a young Korean baseball pitcher in a clean uniform and cap, dynamic wind-up pose with the glove raised at the chest and front leg lifted, facing the viewer at a slight three-quarter angle, full body with a little headroom, neutral seamless soft-gradient studio background, even rim lighting, character-select roster-card pose, centered, focused determined expression` |

> **생성 팁:** 한 키당 2~3장 뽑아 가장 중앙이 깨끗하고 톤이 기존 14장과 맞는 것을 고른다.
> 캐릭터는 좌/우타·얼굴 변형이 코드(`createCharacterSVG(faceId,hand)`)로 처리되므로, 일러스트는 **대표 1장이면 충분**(파라메트릭 SVG가 폴백·변형 담당).
> 애니메이션: Gemini는 정지뿐. 1순위 = 정지 이미지 + CSS 미세 모션(줌/흔들림/패럴랙스), 타격 순간 짧은 흔들림/플래시. 타격 폼은 스프라이트 시트(프레임 여러 장 → CSS steps()) 검토. 상세는 `.claude/handoff.md`.

### ✅ BGM (완료 — 재생성 금지, 기록용)
| 파일 | 프롬프트 |
|---|---|
| bgm-menu.mp3 | `Calm hopeful theme with soft piano, acoustic guitar and gentle strings, nostalgic and uplifting, Korean baseball coming-of-age drama main menu, seamless loop, instrumental` |
| bgm-game.mp3 | `Upbeat energetic instrumental, light rock and orchestral hybrid with driving percussion, momentum and competitive spirit, baseball game broadcast, seamless loop, instrumental` |
