// 에셋 매니페스트 — 논리 키 → 파일 경로/메타.
//
// 파일이 아직 없어도 게임은 정상 동작한다:
//   - 이미지: 로드 실패 시 images.js 가 fallback(기존 SVG 등)으로 대체
//   - BGM:   파일 없으면 무음
//   - 효과음: 파일 불필요 (audio.js 가 Web Audio 로 합성)
//
// 생성된 에셋을 아래 경로/파일명에 맞춰 넣으면 즉시 반영된다.

export const IMAGES = {
  titleHero:     { src: "assets/img/title-hero.png",     preload: true },  // 타이틀 화면 대표 일러스트
  eventDraft:    { src: "assets/img/event-draft.png" },                    // 특별이벤트 컷 (예시)
  eventChampion: { src: "assets/img/event-champion.png" },
};

export const BGM = {
  menu: { src: "assets/audio/bgm-menu.mp3", loop: true },   // 타이틀/메뉴
  game: { src: "assets/audio/bgm-game.mp3", loop: true },   // 경기(weekly)
};
