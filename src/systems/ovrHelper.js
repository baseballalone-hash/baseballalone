// OVR (Overall Rating) 계산 공통 모듈
// 3순위 중복 로직 제거의 일환으로 player.js와 simulator.js에 흩어져 있던 OVR 공식을 일원화합니다.

export function getBatterOVR(batter) {
  if (!batter) return 50;
  const b = batter.batter ?? batter;
  return ((b.contact ?? 50) + (b.power ?? 50) + (b.eye ?? 50) + (b.speed ?? 50)) / 4;
}

export function getPitcherOVR(pitcher) {
  if (!pitcher) return 50;
  const p = pitcher.pitcher ?? pitcher;
  return ((p.velocity ?? 50) + (p.control ?? 50) + (p.breaking ?? 50) + (p.stamina ?? 50)) / 4;
}

export function getCombinedOVR(player) {
  if (!player) return 50;
  const bat = getBatterOVR(player);
  const pit = getPitcherOVR(player);
  return +(bat * 0.6 + pit * 0.4).toFixed(1);
}
