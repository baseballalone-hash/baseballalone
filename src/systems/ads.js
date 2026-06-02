// 게임 광고(전면 인터스티셜) — GameMonetize.com SDK.
//
// 노출 시점: 시작(앱 진입) / 3시즌마다 새 시즌 / 은퇴 (호출부: main.js·weekly.js).
// SDK 가 전면 광고 UI 와 게임 일시정지(SDK_GAME_PAUSE/START)를 직접 처리하므로 여기선 "호출"만 한다.
//
// ⚠ 설정: index.html 의 SDK_OPTIONS.gameId 를 GameMonetize 에 게임 등록 후 받은 ID로 교체.
//   gameId placeholder 거나 SDK 미로드 시 — 조용히 무시(게임 흐름 영향 없음).
//
// 보상형 광고가 필요하면 showRewardedAd() 사용(보상 지급은 SDK_REWARDED_WATCH_COMPLETE 이벤트로
//   index.html onEvent 에서 처리하도록 확장).

// 시즌 광고 주기 — 매 N시즌(새 시즌 시작 시) 1회. 고교 3시즌 → 졸업 후 첫 프로시즌에 첫 노출.
const SEASON_AD_INTERVAL = 3;

// 새 시즌 시작 시 호출 — 진행 시즌 수가 주기 배수면 전면 광고.
export function maybeShowSeasonAd(seasonCount) {
  if (seasonCount > 0 && seasonCount % SEASON_AD_INTERVAL === 0) showInterstitialAd();
}

// 전면(인터스티셜) 광고 — GameMonetize 의 showBanner() 가 전면 광고를 띄운다(네이밍 주의).
export function showInterstitialAd() {
  try {
    if (window.sdk && typeof window.sdk.showBanner === "function") {
      window.sdk.showBanner();
    }
  } catch (_) { /* SDK 미준비/미설정 — 무시 */ }
}

// 보상형 광고(선택) — 동일 SDK. 보상 지급은 onEvent(SDK_REWARDED_WATCH_COMPLETE)에서.
export function showRewardedAd() {
  try {
    if (window.sdk && typeof window.sdk.showBanner === "function") {
      window.sdk.showBanner();
    }
  } catch (_) {}
}
