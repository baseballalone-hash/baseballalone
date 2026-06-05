// 3등신 캐릭터 (배팅 자세) — 카툰/원펀맨 일러스트 스타일로 대폭 업그레이드
import { svg, svgEl, group } from "./svg.js";
import { createFaceGroup } from "./avatars.js";

// hand: "right" (우투우타) | "left" (좌투좌타) | "mixed" (우투좌타)
export function createCharacterSVG(faceId, hand = "right", size = { w: 180, h: 240 }, talent = "all_round", equipment = { bat: 0, glove: 0, cleats: 0 }) {
  const root = svg(size.w, size.h, "0 0 180 240");

  // 배경 (홈플레이트 느낌)
  root.appendChild(svgEl("ellipse", {
    cx: 90, cy: 226, rx: 60, ry: 8,
    fill: "rgba(255,255,255,0.06)",
  }));
  // 흙
  root.appendChild(svgEl("rect", {
    x: 0, y: 220, width: 180, height: 20,
    fill: "url(#dirtGrad)",
  }));

  // 그래디언트 정의
  const defs = svgEl("defs", {}, []);
  
  // 흙바닥 그래디언트
  const grad = svgEl("linearGradient", { id: "dirtGrad", x1: "0%", y1: "0%", x2: "0%", y2: "100%" });
  grad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "rgba(120,80,40,0.0)" }));
  grad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "rgba(120,80,40,0.3)" }));
  defs.appendChild(grad);

  // 황금 장비용 리치 금색 그라데이션
  const goldGrad = svgEl("linearGradient", { id: "goldBatGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
  goldGrad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#ffe680" }));
  goldGrad.appendChild(svgEl("stop", { offset: "40%", "stop-color": "#fbbf24" }));
  goldGrad.appendChild(svgEl("stop", { offset: "80%", "stop-color": "#d97706" }));
  goldGrad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#78350f" }));
  defs.appendChild(goldGrad);

  // 나무 배트용 우드 그라데이션
  const woodGrad = svgEl("linearGradient", { id: "woodBatGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
  woodGrad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#b48a53" }));
  woodGrad.appendChild(svgEl("stop", { offset: "70%", "stop-color": "#8a5a2a" }));
  woodGrad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#5c3a17" }));
  defs.appendChild(woodGrad);

  // 실버 메탈릭 그라데이션
  const silverGrad = svgEl("linearGradient", { id: "silverGrad", x1: "0%", y1: "0%", x2: "100%", y2: "100%" });
  silverGrad.appendChild(svgEl("stop", { offset: "0%", "stop-color": "#f1f5f9" }));
  silverGrad.appendChild(svgEl("stop", { offset: "50%", "stop-color": "#cbd5e1" }));
  silverGrad.appendChild(svgEl("stop", { offset: "100%", "stop-color": "#64748b" }));
  defs.appendChild(silverGrad);

  root.appendChild(defs);

  // 발 밑 그림자
  root.appendChild(svgEl("ellipse", {
    cx: 90, cy: 206, rx: 42, ry: 6,
    fill: "rgba(0,0,0,0.35)",
  }));

  const charGroup = drawCharacterBody(faceId, hand, talent, equipment);
  root.appendChild(charGroup);

  // 손잡이 라벨
  const label = svgEl("text", {
    x: 90, y: 22,
    "text-anchor": "middle",
    fill: "#8b949e",
    "font-size": "13",
    "font-weight": "bold",
    "font-family": "monospace",
  });
  label.textContent = handLabel(hand);
  root.appendChild(label);

  return root;
}

function handLabel(hand) {
  if (hand === "right") return "우투우타";
  if (hand === "left") return "좌투좌타";
  if (hand === "mixed") return "우투좌타";
  if (hand === "lefty_rb") return "좌투우타";
  return hand;
}

function drawCharacterBody(faceId, hand, talent = "all_round", equipment = { bat: 0, glove: 0, cleats: 0 }) {
  const battingLeft = hand === "left" || hand === "mixed";
  const g = group([], { transform: `translate(90 30)` });

  // 체형 분기
  let shW = 28;     // shoulder half-width
  let waistW = 26;  // waist half-width
  let legW = 22;    // outer leg half-width
  
  if (talent === "power") {
    shW = 34;
    waistW = 31;
    legW = 27;
  } else if (talent === "speedster" || talent === "finesse" || talent === "breakerz") {
    shW = 23;
    waistW = 21;
    legW = 18;
  }

  // 1. 머리 (얼굴)
  const head = group([], { transform: "translate(-22 0) scale(0.44)" });
  head.appendChild(createFaceGroup(faceId));
  g.appendChild(head);

  // 2. 목 (목 그림자 디테일)
  g.appendChild(svgEl("rect", {
    x: -4.5, y: 44, width: 9, height: 9, fill: "#e6b889", stroke: "#111", "stroke-width": "1.5", rx: 2
  }));
  g.appendChild(svgEl("path", {
    d: "M -4.5 44 L 4.5 44 L 4.5 49 L -4.5 44 Z", fill: "rgba(0,0,0,0.12)"
  }));

  // 3. 유니폼 몸통 (카툰 음영 + 굵은 윤곽선)
  const bodyColor = "#e8edf3";
  const bodyAccent = "#4ea4ff";
  
  // 몸체 패스
  g.appendChild(svgEl("path", {
    d: `M -${shW} 52 Q -${shW} 48 -${waistW} 48 L ${waistW} 48 Q ${shW} 48 ${shW} 52 L ${waistW} 110 L -${waistW} 110 Z`,
    fill: bodyColor,
    stroke: "#111",
    "stroke-width": "1.8",
  }));
  
  // 몸체 셀식 음영 (우측 절반 그림자)
  g.appendChild(svgEl("path", {
    d: `M 0 48 L ${waistW} 48 Q ${shW} 48 ${shW} 52 L ${waistW} 110 L 0 110 Z`,
    fill: "rgba(0,0,0,0.06)",
  }));

  // 등번호 (테두리가 들어간 스포츠 폰트 느낌)
  const num = svgEl("text", {
    x: 0, y: 92,
    "text-anchor": "middle",
    fill: bodyAccent,
    stroke: "#13284f",
    "stroke-width": "2",
    "paint-order": "stroke fill",
    "font-size": "28",
    "font-weight": "900",
    "font-family": "Impact, system-ui, sans-serif",
  });
  num.textContent = "1";
  g.appendChild(num);

  // 벨트
  g.appendChild(svgEl("rect", {
    x: -waistW, y: 108, width: waistW * 2, height: 6, fill: "#1a1a1a", stroke: "#111", "stroke-width": "1.2"
  }));
  // 벨트 버클
  g.appendChild(svgEl("rect", {
    x: -4, y: 107, width: 8, height: 8, fill: "#ffb84e", stroke: "#111", "stroke-width": "1"
  }));

  // 4. 바지 (윤곽선 및 가랑이 음영)
  g.appendChild(svgEl("path", {
    d: `M -${waistW-2} 114 L -${legW} 168 L -6 168 L -4 130 L 4 130 L 6 168 L ${legW} 168 L ${waistW-2} 114 Z`,
    fill: "#bfc5d0",
    stroke: "#111",
    "stroke-width": "1.8",
  }));
  // 가랑이 그림자
  g.appendChild(svgEl("path", {
    d: "M -4 130 L 4 130 L 6 168 L 0 168 Z",
    fill: "rgba(0,0,0,0.08)",
  }));

  // 5. 신발/스파이크 (밑창 디테일 및 하이라이트)
  const cleatsLvl = equipment?.cleats ?? 0;
  let footColor = "#1a1a1a";
  let footDetail = "#333";
  
  if (cleatsLvl === 1) {
    footColor = "#3b82f6";
    footDetail = "#1d4ed8";
  } else if (cleatsLvl === 2) {
    footColor = "#ef4444";
    footDetail = "#b91c1c";
  } else if (cleatsLvl === 3) {
    footColor = "url(#goldBatGrad)";
    footDetail = "#fbbf24";
  }

  const footX = Math.round(legW * 0.65);
  // 왼쪽 신발
  g.appendChild(svgEl("ellipse", { cx: -footX, cy: 174, rx: 11.5, ry: 5.5, fill: footColor, stroke: "#111", "stroke-width": "1.8" }));
  g.appendChild(svgEl("line", { x1: -footX - 8, y1: 176, x2: -footX + 8, y2: 176, stroke: footDetail, "stroke-width": "2.2" })); // 신발 테두리 밑창 선
  // 오른쪽 신발
  g.appendChild(svgEl("ellipse", { cx: footX, cy: 174, rx: 11.5, ry: 5.5, fill: footColor, stroke: "#111", "stroke-width": "1.8" }));
  g.appendChild(svgEl("line", { x1: footX - 8, y1: 176, x2: footX + 8, y2: 176, stroke: footDetail, "stroke-width": "2.2" }));

  // 6. 팔 + 배트 자세 (카툰풍 그림자 추가)
  const dx = shW - 28;
  const armsTransform = battingLeft 
    ? `scale(-1 1) translate(${dx} 0)` 
    : `translate(${dx} 0)`;
  const armsG = group([], { transform: armsTransform });

  // 뒷팔 (윤곽선 + 음영)
  armsG.appendChild(svgEl("path", {
    d: "M 22 56 L 38 50 L 44 70 L 30 76 Z",
    fill: "#e6b889",
    stroke: "#111",
    "stroke-width": "1.8",
  }));
  // 뒷팔 그림자
  armsG.appendChild(svgEl("path", {
    d: "M 30 76 L 44 70 L 41 60 Z",
    fill: "rgba(0,0,0,0.12)"
  }));

  // 앞팔 (윤곽선 + 음영)
  armsG.appendChild(svgEl("path", {
    d: "M -18 56 L -10 70 L 4 82 L 14 76 L 12 64 L 0 58 Z",
    fill: "#e6b889",
    stroke: "#111",
    "stroke-width": "1.8",
  }));
  // 앞팔 그림자
  armsG.appendChild(svgEl("path", {
    d: "M 4 82 L 14 76 L 12 64 L 6 62 Z",
    fill: "rgba(0,0,0,0.12)"
  }));

  // 배팅 장갑 (glove 장비 레벨 연동)
  const gloveLvl = equipment?.glove ?? 0;
  let gloveColor = "#e6b889"; 
  let gloveBorder = "#111";
  
  if (gloveLvl === 1) {
    gloveColor = "#4ea4ff";
    gloveBorder = "#1d4ed8";
  } else if (gloveLvl === 2) {
    gloveColor = "#1e293b";
    gloveBorder = "#0f172a";
  } else if (gloveLvl === 3) {
    gloveColor = "url(#goldBatGrad)";
    gloveBorder = "#b45309";
  }

  // 뒷손 주먹 장갑 얹기 (뒷팔 끝)
  armsG.appendChild(svgEl("circle", { cx: 37, cy: 73, r: 6, fill: gloveColor, stroke: gloveBorder, "stroke-width": "1.5" }));
  // 앞손 주먹 장갑 얹기 (앞팔 끝)
  armsG.appendChild(svgEl("circle", { cx: 9, cy: 79, r: 6, fill: gloveColor, stroke: gloveBorder, "stroke-width": "1.5" }));

  // 배트 (bat 장비 레벨 연동)
  const batLvl = equipment?.bat ?? 0;
  let batColor = "url(#woodBatGrad)";
  let batTipColor = "#8a5a2a";
  let gripColor = "#3a2517";

  if (batLvl === 1) {
    batColor = "url(#silverGrad)";
    batTipColor = "#94a3b8";
    gripColor = "#1e293b";
  } else if (batLvl === 2) {
    batColor = "#1e293b";
    batTipColor = "#ef4444";
    gripColor = "#ef4444";
  } else if (batLvl === 3) {
    batColor = "url(#goldBatGrad)";
    batTipColor = "#fbbf24";
    gripColor = "#1e1b4b";
  }

  // 배트 3D 입체 바디
  armsG.appendChild(svgEl("line", {
    x1: 38, y1: 56,
    x2: 78, y2: -2,
    stroke: batColor,
    "stroke-width": "5.5",
    "stroke-linecap": "round",
  }));
  // 배트 카툰 윤곽선 (윤곽선 효과를 위해 라인 밑에 얇은 stroke선 얹거나 배트 끝을 원으로 감쌈)
  armsG.appendChild(svgEl("line", {
    x1: 38, y1: 56,
    x2: 78, y2: -2,
    stroke: "#111",
    "stroke-width": "5.5",
    "stroke-linecap": "round",
    "paint-order": "stroke fill",
    opacity: 0.15
  }));

  // 배트 끝 원통 마개 디테일
  armsG.appendChild(svgEl("circle", { cx: 78, cy: -2, r: 5.5, fill: batTipColor, stroke: "#111", "stroke-width": "1.5" }));
  
  // 그립 테이프
  armsG.appendChild(svgEl("rect", {
    x: 30, y: 50, width: 12, height: 6.5,
    fill: gripColor,
    stroke: "#111",
    "stroke-width": "1.2",
    transform: "rotate(-30 36 53)",
  }));

  g.appendChild(armsG);

  // 글러브 배지 (투타 손이 다를 때 — 던지는 손 표시)
  if (hand === "mixed" || hand === "lefty_rb") {
    const throwHand = hand === "mixed" ? "R" : "L";
    const badgeX = hand === "mixed" ? 36 : -36;
    const badge = group([], { transform: `translate(${badgeX} 130)` });

    let badgeBg = "#3a2517";
    let badgeBorder = "#111";
    if (gloveLvl === 1) {
      badgeBg = "#4ea4ff";
      badgeBorder = "#1d4ed8";
    } else if (gloveLvl === 2) {
      badgeBg = "#1f2937";
      badgeBorder = "#4b5563";
    } else if (gloveLvl === 3) {
      badgeBg = "url(#goldBatGrad)";
      badgeBorder = "#b45309";
    }

    badge.appendChild(svgEl("circle", { cx: 0, cy: 0, r: 13.5, fill: badgeBg, stroke: badgeBorder, "stroke-width": "1.8" }));
    // 배지 하이라이트 원반
    badge.appendChild(svgEl("circle", { cx: -4, cy: -4, r: 4, fill: "rgba(255,255,255,0.18)" }));
    
    const txt = svgEl("text", {
      x: 0, y: 4, "text-anchor": "middle",
      fill: "#e8edf3", "font-size": "10", "font-weight": "900",
      stroke: "#111", "stroke-width": "1.5", "paint-order": "stroke fill"
    });
    txt.textContent = throwHand;
    badge.appendChild(txt);
    g.appendChild(badge);
  }

  return g;
}
