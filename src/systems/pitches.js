// 구종 시스템 — Phase 2 Stage 1
//
// 각 투수는 stat 분포에 따라 보유 구종 + 주력 구종이 결정된다.
// 매 PA 마다 simulator 가 pickPitch() 로 한 구종을 선택. 결과 event 에 pitchType 부착.
//
// 구종 차이는 Stage 1 에선 *표시용* (라이브 로그 표기). 시뮬 stat 효과는
// Stage 2 에서 (예: 슬라이더 = K+, 체인지업 = BB-) 추가 예정.

export const PITCH_TYPES = ["fastball", "slider", "curve", "changeup", "splitter"];

// 각 구종 보유 조건 (pitcher stat 기준)
const PITCH_REQUIREMENTS = {
  fastball:  () => true,                                          // 모두 보유
  slider:    p => (p.breaking ?? 0) >= 60,                         // 변화구 60+
  curve:     p => (p.breaking ?? 0) >= 75,
  changeup:  p => (p.control  ?? 0) >= 70,
  splitter:  p => (p.velocity ?? 0) >= 80 && (p.breaking ?? 0) >= 70,
};

// 투수 stat → 보유 구종 + 주력 (primary).
//   pitcher.pitches: { available: ["fastball","slider"...], primary: "fastball" }
// 주력: 가장 stat 친화적인 구종 (단순 매핑 — velocity 높으면 fastball, breaking 높으면 slider/curve, control 높으면 changeup).
export function assignPitches(pitcher) {
  if (!pitcher) return { available: ["fastball"], primary: "fastball" };
  const available = PITCH_TYPES.filter(k => PITCH_REQUIREMENTS[k](pitcher));
  if (available.length === 0) available.push("fastball");

  // 주력 결정 — 가장 큰 stat 와 매핑.
  const vel  = pitcher.velocity ?? 0;
  const ctrl = pitcher.control  ?? 0;
  const brk  = pitcher.breaking ?? 0;
  let primary = "fastball";
  if (brk > vel && brk > ctrl) {
    if (available.includes("curve"))  primary = "curve";
    else if (available.includes("slider")) primary = "slider";
  } else if (ctrl > vel && ctrl > brk) {
    if (available.includes("changeup")) primary = "changeup";
  } else {
    // velocity 우세 — 직구 또는 splitter
    if (available.includes("splitter") && Math.random() < 0.3) primary = "splitter";
    else primary = "fastball";
  }
  return { available, primary };
}

// ──── 좌/우투타 분배 + 매치업 ───────────────────────────────────
//
// 메인 player.hand 매핑:
//   right    → throws:R / bats:R    (우투우타)
//   left     → throws:L / bats:L    (좌투좌타)
//   mixed    → throws:R / bats:L    (우투좌타)
//   lefty_rb → throws:L / bats:R    (좌투우타)
//
// NPC: 무작위 분배 (좌 25%, 우 75%, 스위치 5% — 타자만).
export function decodeMainHand(hand) {
  switch (hand) {
    case "left":     return { throws: "L", bats: "L" };
    case "mixed":    return { throws: "R", bats: "L" };
    case "lefty_rb": return { throws: "L", bats: "R" };
    case "right":
    default:         return { throws: "R", bats: "R" };
  }
}

export function rollNpcThrows() { return Math.random() < 0.25 ? "L" : "R"; }
export function rollNpcBats() {
  const r = Math.random();
  if (r < 0.30) return "L";
  if (r < 0.35) return "S";  // 스위치
  return "R";
}

// 좌/우 매치업 — 같은 손이면 타자 불리. 스위치는 항상 반대 손 적용 (불리 X).
// 효과: contactDiff 에 -3 (같은 손) ~ 0 (반대 손).
export function handMatchupPenalty(bats, throws_) {
  if (!bats || !throws_) return 0;
  if (bats === "S") return 0;
  return bats === throws_ ? -3 : 0;
}

// 매 PA 마다 한 구종 선택. 주력 60% + 보조 균등 분배.
export function pickPitch(pitcher) {
  const meta = pitcher?.pitches;
  if (!meta || !Array.isArray(meta.available) || meta.available.length === 0) {
    return "fastball";
  }
  const { available, primary } = meta;
  if (available.length === 1) return primary;
  if (Math.random() < 0.6) return primary;
  // 보조 — primary 외 균등
  const others = available.filter(p => p !== primary);
  if (others.length === 0) return primary;
  return others[Math.floor(Math.random() * others.length)];
}
