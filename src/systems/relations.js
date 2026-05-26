// 멘토/라이벌 영구 NPC 시스템.
//
// 첫 시즌 종료 시점에 한 번 생성. 이후 매 시즌 종료마다 나이/능력치 진화, 은퇴 처리.
// 휴식기 이벤트(rival, mentor_pitcher) 와 carousel 슬라이드에서 표시.
//
// 단순화:
//   - 멘토 1명, 라이벌 1명만 유지 (확장 시 배열로 변경 가능)
//   - 멘토는 30~42세 베테랑, 라이벌은 메인 캐릭터와 비슷한 나이
//   - 38세부터 은퇴 확률, 42세 강제 은퇴
//   - 능력치 진화는 단순 (배경 동작)

import { state } from "../state.js";
import { randomName } from "../data/names.js";

function rndInt(min, max) { return Math.floor(min + Math.random() * (max - min + 1)); }
function pickRole() { return Math.random() < 0.5 ? "batter" : "pitcher"; }

function makeStats(role, baseline) {
  const dev = () => Math.max(20, baseline + rndInt(-8, 10));
  if (role === "pitcher") {
    return { velocity: dev(), control: dev(), breaking: dev(), stamina: dev(), mental: dev() };
  }
  return { contact: dev(), power: dev(), eye: dev(), speed: dev(), defense: dev() };
}

function generateNPC(name, age, role, baseline) {
  return {
    name,
    age,
    role,                 // "batter" | "pitcher"
    status: "active",     // "active" | "retired"
    stats: makeStats(role, baseline),
    history: [],          // {year, event}
  };
}

// 첫 호출에만 동작. 이미 있으면 noop.
export function initRelations(player) {
  if (!player) return;
  if (player.relations) return;
  const locale = state.locale ?? "ko";

  const mentor = generateNPC(
    randomName(locale),
    rndInt(32, 42),
    pickRole(),
    70,   // 베테랑이라 약간 높음
  );
  mentor.relation = "mentor";

  const rivalAge = Math.max(15, player.age + rndInt(-1, 1));
  const rival = generateNPC(
    randomName(locale),
    rivalAge,
    pickRole(),
    55,   // player 와 비슷한 수준
  );
  rival.relation = "rival";

  player.relations = { mentor, rival };
}

// 매 시즌 종료 후 호출 — 나이/능력치/은퇴 진화.
export function ageUpRelations(player) {
  if (!player?.relations) return;
  for (const key of ["mentor", "rival"]) {
    const npc = player.relations[key];
    if (!npc || npc.status === "retired") continue;

    npc.age += 1;

    // 능력치 드리프트 — 나이에 따른 성장/노화 곡선
    let lo, hi;
    if (npc.age < 27)      { lo = 1;  hi = 3; }
    else if (npc.age < 33) { lo = 0;  hi = 1; }
    else                   { lo = -3; hi = -1; }

    for (const k of Object.keys(npc.stats)) {
      npc.stats[k] = Math.max(20, Math.min(150, npc.stats[k] + rndInt(lo, hi)));
    }

    // 은퇴 — 38+ 부터 매년 30% 확률, 42 강제
    if (npc.age >= 42 || (npc.age >= 38 && Math.random() < 0.30)) {
      npc.status = "retired";
    }
  }
}

export function getMentor(player) {
  return player?.relations?.mentor ?? null;
}
export function getRival(player) {
  return player?.relations?.rival ?? null;
}

export function relationOverall(npc) {
  if (!npc?.stats) return 0;
  const vals = Object.values(npc.stats);
  if (vals.length === 0) return 0;
  return +(vals.reduce((a, c) => a + c, 0) / vals.length).toFixed(0);
}
