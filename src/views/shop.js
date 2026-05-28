// 회귀(NewGame+) 상점 — 5탭 UI.
//
// 진입 경로:
//   1) 은퇴 패널의 "상점 보기" 버튼 (recordRun 이미 완료된 시점)
//   2) 메인 메뉴의 "회귀 상점" 버튼 (잔액/누적 > 0 일 때만 노출)
//
// 탭:
//   - talent  : 재능 슬롯 확장 (영구)
//   - cap     : stage cap 보너스 (영구, 그룹별 누적)
//   - start   : 시작 능력치 프리셋 (캐릭터당 1회)
//   - trait   : 특성 1~3장 (캐릭터당 1회)
//   - relic   : 유물 1~2개 (캐릭터당 1회)
//
// 효과 적용은 P3 (createPlayer 분기) 에서 다룬다 — 여기서는 메타만 갱신.

import { state } from "../state.js";
import { t } from "../i18n/index.js";
import {
  loadRegressionMeta, saveRegressionMeta,
  spendBalance, addBalance,
  purchasePermanent, setStartingStat, setTraits, setRelics,
} from "../systems/regression.js";
import {
  TALENT_SLOTS_TIERS, CAP_BOOST_TIERS, CAP_BOOST_GROUPS,
  STARTING_STAT_PRESETS, TRAITS, RELICS, isTraitUnlocked,
} from "../data/shopCatalog.js";

let activeTab = "talent";
let routeRef = null;

export function renderShop(root, route) {
  routeRef = route;
  if (!state.regression) loadRegressionMeta();

  root.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "stack";

  wrap.appendChild(renderHeader());
  wrap.appendChild(renderTabBar());
  wrap.appendChild(renderTabContent());

  root.appendChild(wrap);
}

function renderHeader() {
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.style.padding = "10px";

  const top = document.createElement("div");
  top.style.cssText = "display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:8px;";

  const title = document.createElement("h2");
  title.style.cssText = "margin:0; font-size:15px;";
  title.textContent = t("shop.title");
  top.appendChild(title);

  const backBtn = document.createElement("button");
  backBtn.type = "button";
  backBtn.textContent = t("shop.backToMenu");
  backBtn.style.cssText = "padding:6px 10px; font-size:11px;";
  backBtn.addEventListener("click", () => routeRef("menu"));
  top.appendChild(backBtn);

  panel.appendChild(top);

  // 잔액 / 누적 / 회귀 횟수
  const m = state.regression;
  const stats = document.createElement("div");
  stats.style.cssText = "display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; font-size:11px;";
  for (const [labelKey, val, color] of [
    ["shop.balance",     m.balance,     "var(--accent)"],
    ["shop.totalEarned", m.totalEarned, "var(--accent-2)"],
    ["shop.runs",        m.runs,        "var(--muted)"],
  ]) {
    const cell = document.createElement("div");
    cell.style.cssText = "background:var(--panel-2); border:1px solid var(--border); border-radius:6px; padding:6px; text-align:center;";
    cell.innerHTML = `<div class="muted" style="font-size:10px;">${t(labelKey)}</div>
      <div style="font-weight:700; font-size:14px; color:${color};">${val}</div>`;
    stats.appendChild(cell);
  }
  panel.appendChild(stats);

  return panel;
}

function renderTabBar() {
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.style.padding = "6px";

  const row = document.createElement("div");
  row.style.cssText = "display:grid; grid-template-columns:repeat(5, 1fr); gap:3px;";

  const tabs = [
    { key: "talent", labelKey: "shop.tabTalent" },
    { key: "cap",    labelKey: "shop.tabCap" },
    { key: "start",  labelKey: "shop.tabStart" },
    { key: "trait",  labelKey: "shop.tabTrait" },
    { key: "relic",  labelKey: "shop.tabRelic" },
  ];
  for (const tab of tabs) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = t(tab.labelKey);
    btn.style.cssText = "padding:8px 2px; font-size:11px; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
    if (activeTab === tab.key) btn.classList.add("primary");
    btn.addEventListener("click", () => {
      activeTab = tab.key;
      renderShop(document.getElementById("view-root"), routeRef);
    });
    row.appendChild(btn);
  }
  panel.appendChild(row);
  return panel;
}

function renderTabContent() {
  if (activeTab === "talent") return renderTalentTab();
  if (activeTab === "cap")    return renderCapTab();
  if (activeTab === "start")  return renderStartTab();
  if (activeTab === "trait")  return renderTraitTab();
  if (activeTab === "relic")  return renderRelicTab();
  return renderTalentTab();
}

// ── 재능 슬롯 탭 ──────────────────────────────────────────────────
function renderTalentTab() {
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.style.padding = "10px";

  const m = state.regression;
  const owned = m.permanentPurchases.talentSlots;

  const desc = document.createElement("div");
  desc.className = "muted small";
  desc.style.cssText = "font-size:11px; margin-bottom:8px; line-height:1.4;";
  desc.textContent = t("shop.talentDesc", { current: 1 + owned });
  panel.appendChild(desc);

  for (let i = 0; i < TALENT_SLOTS_TIERS.length; i++) {
    const tier = TALENT_SLOTS_TIERS[i];
    const isOwned = owned >= i + 1;
    const canBuy = !isOwned && (i === owned) && m.balance >= tier.cost;
    panel.appendChild(makeShopCard({
      title: t("shop.talentTierTitle", { n: tier.tier, total: tier.totalSlots }),
      desc: t("shop.talentTierDesc", { total: tier.totalSlots }),
      cost: tier.cost,
      state: isOwned ? "owned" : (i > owned ? "locked" : (canBuy ? "buyable" : "insufficient")),
      onClick: () => {
        const r = purchasePermanent("talentSlots");
        if (r.ok) renderShop(document.getElementById("view-root"), routeRef);
      },
    }));
  }
  return panel;
}

// ── stage cap 탭 ──────────────────────────────────────────────────
function renderCapTab() {
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.style.padding = "10px";

  const m = state.regression;

  const desc = document.createElement("div");
  desc.className = "muted small";
  desc.style.cssText = "font-size:11px; margin-bottom:8px; line-height:1.4;";
  desc.textContent = t("shop.capDesc");
  panel.appendChild(desc);

  for (const group of CAP_BOOST_GROUPS) {
    const header = document.createElement("div");
    header.style.cssText = "font-weight:700; font-size:12px; color:var(--accent-2); margin:8px 0 4px;";
    header.textContent = t("shop.capGroup." + group);
    panel.appendChild(header);

    const owned = m.permanentPurchases.capBoosts[group] ?? 0;
    const tiers = CAP_BOOST_TIERS[group];
    for (let i = 0; i < tiers.length; i++) {
      const tier = tiers[i];
      const isOwned = owned >= i + 1;
      const canBuy = !isOwned && (i === owned) && m.balance >= tier.cost;
      panel.appendChild(makeShopCard({
        title: t("shop.capTierTitle", { tier: tier.tier, add: tier.add }),
        desc: "",
        cost: tier.cost,
        state: isOwned ? "owned" : (i > owned ? "locked" : (canBuy ? "buyable" : "insufficient")),
        onClick: () => {
          const r = purchasePermanent("capBoost", { group });
          if (r.ok) renderShop(document.getElementById("view-root"), routeRef);
        },
      }));
    }
  }
  return panel;
}

// ── 시작 능력치 탭 ───────────────────────────────────────────────
function renderStartTab() {
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.style.padding = "10px";

  const m = state.regression;

  const desc = document.createElement("div");
  desc.className = "muted small";
  desc.style.cssText = "font-size:11px; margin-bottom:8px; line-height:1.4;";
  desc.textContent = t("shop.startDesc");
  panel.appendChild(desc);

  for (const key of Object.keys(STARTING_STAT_PRESETS)) {
    const preset = STARTING_STAT_PRESETS[key];
    const isSelected = m.loadout.startingStat === key;
    const canBuy = !isSelected && m.balance >= preset.cost;
    panel.appendChild(makeShopCard({
      title: t("shop.start." + key),
      desc: t("shop.startDescOf." + key),
      cost: preset.cost,
      state: isSelected ? "equipped" : (canBuy ? "buyable" : "insufficient"),
      onClick: () => {
        if (isSelected) {
          setStartingStat(null);
        } else {
          if (!spendBalance(preset.cost)) return;
          setStartingStat(key);
        }
        renderShop(document.getElementById("view-root"), routeRef);
      },
    }));
  }
  return panel;
}

// ── 특성 탭 ───────────────────────────────────────────────────────
function renderTraitTab() {
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.style.padding = "10px";

  const m = state.regression;

  const desc = document.createElement("div");
  desc.className = "muted small";
  desc.style.cssText = "font-size:11px; margin-bottom:8px; line-height:1.4;";
  desc.textContent = t("shop.traitDesc", { equipped: m.loadout.traits.length });
  panel.appendChild(desc);

  for (const key of Object.keys(TRAITS)) {
    const tr = TRAITS[key];
    const equipped = m.loadout.traits.includes(key);
    const unlocked = isTraitUnlocked(key, m.unlockedItems);
    const capacity = m.loadout.traits.length < 3;
    const canBuy = !equipped && unlocked && capacity && m.balance >= tr.cost;

    let cardState;
    if (!unlocked) cardState = "lockedAchievement";
    else if (equipped) cardState = "equipped";
    else if (canBuy) cardState = "buyable";
    else if (!capacity) cardState = "full";
    else cardState = "insufficient";

    panel.appendChild(makeShopCard({
      title: t("trait." + key + ".name"),
      desc: t("trait." + key + ".desc") + (unlocked ? "" : " · " + t("shop.unlockReq", { req: t("unlock." + tr.unlock) })),
      cost: tr.cost,
      state: cardState,
      onClick: () => {
        if (equipped) {
          // 해제 (환불 없음 — P2 단계)
          const next = m.loadout.traits.filter(k => k !== key);
          setTraits(next);
        } else {
          if (!spendBalance(tr.cost)) return;
          setTraits([...m.loadout.traits, key]);
        }
        renderShop(document.getElementById("view-root"), routeRef);
      },
    }));
  }
  return panel;
}

// ── 유물 탭 ───────────────────────────────────────────────────────
function renderRelicTab() {
  const panel = document.createElement("section");
  panel.className = "panel";
  panel.style.padding = "10px";

  const m = state.regression;

  const desc = document.createElement("div");
  desc.className = "muted small";
  desc.style.cssText = "font-size:11px; margin-bottom:8px; line-height:1.4;";
  desc.textContent = t("shop.relicDesc", { equipped: m.loadout.relics.length });
  panel.appendChild(desc);

  for (const key of Object.keys(RELICS)) {
    const re = RELICS[key];
    const equipped = m.loadout.relics.includes(key);
    const capacity = m.loadout.relics.length < 2;
    const canBuy = !equipped && capacity && m.balance >= re.cost;

    let cardState;
    if (equipped) cardState = "equipped";
    else if (canBuy) cardState = "buyable";
    else if (!capacity) cardState = "full";
    else cardState = "insufficient";

    panel.appendChild(makeShopCard({
      title: t("relic." + key + ".name"),
      desc: t("relic." + key + ".desc"),
      cost: re.cost,
      state: cardState,
      onClick: () => {
        if (equipped) {
          const next = m.loadout.relics.filter(k => k !== key);
          setRelics(next);
        } else {
          if (!spendBalance(re.cost)) return;
          setRelics([...m.loadout.relics, key]);
        }
        renderShop(document.getElementById("view-root"), routeRef);
      },
    }));
  }
  return panel;
}

// ── 카드 컴포넌트 ────────────────────────────────────────────────
// state: "buyable" | "owned" | "equipped" | "insufficient" | "locked" | "lockedAchievement" | "full"
function makeShopCard({ title, desc, cost, state: cardState, onClick }) {
  const card = document.createElement("button");
  card.type = "button";

  const isDisabled = cardState === "locked" || cardState === "lockedAchievement" || cardState === "insufficient" || cardState === "full" || cardState === "owned";
  const accent = (cardState === "owned" || cardState === "equipped") ? "var(--accent)" : "var(--border)";
  const opacity = isDisabled && cardState !== "owned" && cardState !== "equipped" ? "0.55" : "1";

  card.style.cssText = `
    display:block; width:100%; padding:10px; margin-bottom:6px;
    background:var(--panel-2); border:1.5px solid ${accent}; border-radius:6px;
    text-align:left; color:inherit; font-family:inherit;
    cursor:${isDisabled ? "not-allowed" : "pointer"}; opacity:${opacity};
  `;
  card.disabled = isDisabled;

  const row = document.createElement("div");
  row.style.cssText = "display:flex; justify-content:space-between; align-items:flex-start; gap:8px;";

  const left = document.createElement("div");
  left.style.cssText = "flex:1; min-width:0;";
  const titleEl = document.createElement("div");
  titleEl.style.cssText = "font-weight:700; font-size:13px; margin-bottom:2px; color:var(--accent);";
  titleEl.textContent = title;
  left.appendChild(titleEl);
  if (desc) {
    const descEl = document.createElement("div");
    descEl.style.cssText = "font-size:10.5px; color:var(--muted); line-height:1.4;";
    descEl.textContent = desc;
    left.appendChild(descEl);
  }
  row.appendChild(left);

  const right = document.createElement("div");
  right.style.cssText = "text-align:right; min-width:60px; font-size:11px; font-weight:700;";
  const statusLabel = {
    buyable: t("shop.cost", { cost }),
    owned:   t("shop.owned"),
    equipped: t("shop.equipped"),
    insufficient: t("shop.cost", { cost }),
    locked:  t("shop.lockedTier"),
    lockedAchievement: t("shop.lockedAchievement"),
    full:    t("shop.full"),
  }[cardState] ?? "";
  const statusColor = {
    buyable: "var(--accent)",
    owned: "var(--accent-2)",
    equipped: "var(--accent-2)",
    insufficient: "var(--danger, #c66)",
    locked: "var(--muted)",
    lockedAchievement: "var(--muted)",
    full: "var(--muted)",
  }[cardState] ?? "var(--muted)";
  right.style.color = statusColor;
  right.textContent = statusLabel;
  row.appendChild(right);

  card.appendChild(row);

  if (onClick && !isDisabled) {
    card.addEventListener("click", onClick);
  }
  return card;
}
