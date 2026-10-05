(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.PescaSkillsStatusCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STALE_AFTER_MS = 30000;
  const REGULAR_EVENTS = ["Coins em Dobro", "Desconto na Loja", "Maré Turbo", "Sorte Rara", "Venda Turbinada", "XP em Dobro"];
  const GRAND_EVENTS = ["Invasão Pirata", "Julgamento de Njord", "Barco Misterioso"];
  const ALL_EVENTS = [...REGULAR_EVENTS, ...GRAND_EVENTS];

  function normalizeText(value) { return String(value || "").replace(/\s+/g, " ").trim(); }
  function fold(value) { return normalizeText(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

  function parseTwishFishingTitle(title) {
    const text = String(title || "");
    const cooldown = text.match(/\((\d{1,2}:\d{2})\)/)?.[1] || null;
    if (cooldown) return { status: "cooldown", cooldown };
    if (text.includes("🎣")) return { status: "available", cooldown: null };
    return { status: "unknown", cooldown: null };
  }

  function getFishingUiState(state, now = Date.now()) {
    if (!state || !Number.isFinite(state.updatedAt) || now - state.updatedAt > STALE_AFTER_MS) return { mode: "unknown", tooltip: "$pescar" };
    if (state.status === "cooldown" && state.cooldown) return { mode: "cooldown", tooltip: `Próxima pesca em ${state.cooldown}` };
    if (state.status === "available") return { mode: "available", tooltip: "Pesca disponível!" };
    return { mode: "unknown", tooltip: "$pescar" };
  }

  function parseTwishEventCandidates(candidates) {
    for (const raw of candidates || []) {
      const original = String(raw || "");
      const normalized = normalizeText(original);
      if (!normalized) continue;
      const eventName = ALL_EVENTS.find(name => fold(normalized).includes(fold(name)));
      if (!eventName) continue;
      const remaining = original.match(/(?:^|\s)(\d{1,2}:\d{2})(?:\s|$)/m)?.[1] || normalized.match(/\b(\d{1,2}:\d{2})\b/)?.[1] || null;
      if (!remaining) continue;
      const lines = original.split(/\n+/).map(normalizeText).filter(Boolean);
      const description = lines.find(line => fold(line).includes(fold(eventName)) && fold(line) !== fold(eventName)) ||
        lines.find(line => !/^\d{1,2}:\d{2}$/.test(line) && fold(line) !== fold(eventName)) || eventName;
      return { active: true, name: eventName, description, remaining, kind: GRAND_EVENTS.includes(eventName) ? "grand" : "regular" };
    }
    return { active: false };
  }

  function getEventUiState(state, now = Date.now()) {
    if (!state || !state.active || !Number.isFinite(state.updatedAt) || now - state.updatedAt > STALE_AFTER_MS) return { active: false, tooltip: "$evento" };
    return { active: true, name: state.name, description: state.description, remaining: state.remaining, kind: state.kind, tooltip: `${state.name} • ${state.remaining}` };
  }

  return { STALE_AFTER_MS, REGULAR_EVENTS, GRAND_EVENTS, parseTwishFishingTitle, getFishingUiState, parseTwishEventCandidates, getEventUiState };
});
