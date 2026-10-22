(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.PescaSkillsStatusCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STALE_AFTER_MS = 30000;
  const SMART_STALE_AFTER_MS = 60000;
  const BACKGROUND_STALE_AFTER_MS = 90000;
  function fresh(at, now, ttl = STALE_AFTER_MS) { return Number.isFinite(at) && now >= at && now - at <= ttl; }
  function stateFresh(state,now=Date.now()) { return !!state && fresh(state.updatedAt,now,state.source==="background"?BACKGROUND_STALE_AFTER_MS:STALE_AFTER_MS); }
  function formatSeconds(seconds) { return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`; }
  function parseTwishFishingApi(data, fetchedAt, now = Date.now()) {
    if (!fresh(fetchedAt, now) || !Number.isFinite(data?.cooldown_remaining) || data.cooldown_remaining < 0) return null;
    const remaining = data.cooldown_remaining;
    return { status: remaining > 0 ? "cooldown" : "available", readyAt: fetchedAt + remaining * 1000, cooldown: remaining > 0 ? formatSeconds(Math.ceil(remaining)) : null };
  }
  function getSmartData(state, keys, now = Date.now()) {
    if (!state?.data || !keys.every(key => state.data[key] && fresh(state.fetchedAt?.[key], now, SMART_STALE_AFTER_MS))) return null;
    return state.data;
  }
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
    const unknown = { mode: "unknown", tooltip: "Aguardando sincronização com o Twish" };
    if (!stateFresh(state,now)) return unknown;
    if (state.status === "cooldown" && Number.isFinite(state.readyAt)) {
      const seconds = Math.ceil((state.readyAt - now) / 1000);
      return seconds > 0 ? { mode: "cooldown", tooltip: `Próxima pesca em ${formatSeconds(seconds)}` } : unknown;
    }
    if (state.status === "cooldown" && state.cooldown) return { mode: "cooldown", tooltip: `Próxima pesca em ${state.cooldown}` };
    if (state.status === "available") return { mode: "available", tooltip: "Pesca disponível!" };
    return unknown;
  }

  function parseTwishEventCandidates(candidates) {
    let fallback = null;
    for (const raw of candidates || []) {
      const original = String(raw || "");
      const normalized = normalizeText(original);
      if (!normalized) continue;
      const eventName = ALL_EVENTS.find(name => fold(normalized).includes(fold(name)));
      if (!eventName) continue;
      const remaining = original.match(/(?:^|\s)(\d{1,2}:\d{2})(?:\s|$)/m)?.[1] || normalized.match(/\b(\d{1,2}:\d{2})\b/)?.[1] || null;
      if (!remaining) continue;
      if (fallback && fallback.name !== eventName) continue;
      const lines = original.split(/\n+/).map(normalizeText).filter(Boolean);
      const namePattern = new RegExp("\\b" + eventName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
      const description = lines.map(line => line.replace(namePattern, "").split(remaining).join("")
        .replace(/^([^\p{L}\p{N}]*?)[!:\-–—•|]+\s*/u, "$1").trim())
        .filter(line => /\p{L}/u.test(line) && !/^evento ativo$/i.test(line)).join("\n");
      const result = { active: true, name: eventName, description, remaining, kind: GRAND_EVENTS.includes(eventName) ? "grand" : "regular" };
      if (description) return result;
      // A short title/countdown element can precede its parent with the details.
      if (!fallback) fallback = result;
    }
    return fallback || { active: false };
  }

  function parseTwishEventApi(data, fetchedAt, now = Date.now()) {
    if (!data || !fresh(fetchedAt, now)) return null;
    if (!("event" in data) && !("grande_evento" in data)) return null;
    for (const event of [data.grande_evento, data.event]) {
      if (event != null && (typeof event !== "object" || typeof event.name !== "string" || !Number.isFinite(event.seconds_remaining) || event.seconds_remaining < 0)) return null;
    }
    for (const event of [data.grande_evento, data.event]) {
      if (!event || !Number.isFinite(event.seconds_remaining) || typeof event.name !== "string") continue;
      const seconds = Math.max(0, Math.ceil(event.seconds_remaining - (now - fetchedAt) / 1000));
      if (!seconds) continue;
      const result = { active: true, name: event.name, description: typeof event.message === "string" ? event.message : "", remaining: formatSeconds(seconds), endsAt: fetchedAt + event.seconds_remaining * 1000, kind: event === data.grande_evento ? "grand" : "regular" };
      if (event.name === "Barco Misterioso" && event.phase === "open" && Number.isFinite(event.progress_count) && event.progress_count >= 0 && Number.isFinite(event.progress_target) && event.progress_target > 0) {
        result.progressCount = event.progress_count;
        result.progressTarget = event.progress_target;
      }
      return result;
    }
    return { active: false };
  }

  function getEventUiState(state, now = Date.now()) {
    if (!state?.active || !stateFresh(state,now) || (Number.isFinite(state.endsAt) && state.endsAt <= now)) return { active: false, tooltip: "$evento" };
    const remaining = Number.isFinite(state.endsAt) ? formatSeconds(Math.ceil((state.endsAt - now) / 1000)) : state.remaining;
    return { active: true, name: state.name, description: state.description, remaining, kind: state.kind, progressCount: state.progressCount, progressTarget: state.progressTarget, tooltip: `${state.name} • ${remaining}` };
  }

  return { STALE_AFTER_MS, SMART_STALE_AFTER_MS, BACKGROUND_STALE_AFTER_MS, fresh, stateFresh, getSmartData, parseTwishFishingApi, REGULAR_EVENTS, GRAND_EVENTS, parseTwishFishingTitle, getFishingUiState, parseTwishEventCandidates, parseTwishEventApi, getEventUiState };
});
