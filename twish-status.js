(() => {
  "use strict";

  const FISHING_STORAGE_KEY = "pescaskills.fishingStatus.v1";
  const EVENT_STORAGE_KEY = "pescaskills.eventStatus.v1";
  const SMART_DATA_STORAGE_KEY = "pescaskills.smartData.v1";
  const core = globalThis.PescaSkillsStatusCore;
  if (!core || !chrome?.storage?.local) return;

  let lastFishingSignature = "";
  let lastEventSignature = "";

  function publishFishing(force = false) {
    const parsed = core.parseTwishFishingTitle(document.title);
    const signature = `${parsed.status}|${parsed.cooldown || ""}`;
    if (!force && signature === lastFishingSignature) return;
    lastFishingSignature = signature;
    chrome.storage.local.set({ [FISHING_STORAGE_KEY]: { ...parsed, updatedAt: Date.now() } });
  }

  function collectEventCandidates() {
    const names = [...core.REGULAR_EVENTS, ...core.GRAND_EVENTS];
    const foldedNames = names.map(name => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());
    const candidates = [];
    document.querySelectorAll("div,section,aside,header,p,span").forEach(el => {
      const text = el.innerText?.trim();
      if (!text || text.length > 650 || !/\b\d{1,2}:\d{2}\b/.test(text)) return;
      const folded = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      if (foldedNames.some(name => folded.includes(name))) candidates.push(text);
    });
    candidates.sort((a, b) => a.length - b.length);
    return candidates.slice(0, 20);
  }

  function publishEvent(force = false) {
    const parsed = core.parseTwishEventCandidates(collectEventCandidates());
    const signature = parsed.active ? `${parsed.name}|${parsed.description}|${parsed.remaining}|${parsed.kind}` : "inactive";
    if (!force && signature === lastEventSignature) return;
    lastEventSignature = signature;
    chrome.storage.local.set({ [EVENT_STORAGE_KEY]: { ...parsed, updatedAt: Date.now() } });
  }


  async function publishSmartData() {
    try {
      const urls = { me:"/api/casalskills/me", inventory:"/api/casalskills/me/inventory", shop:"/api/casalskills/shop", titles:"/api/casalskills/titles" };
      const entries = await Promise.all(Object.entries(urls).map(async ([key,url]) => { const r=await fetch(url,{credentials:"same-origin"}); if(!r.ok) throw new Error(`${key}:${r.status}`); return [key,await r.json()]; }));
      chrome.storage.local.set({ [SMART_DATA_STORAGE_KEY]: { data:Object.fromEntries(entries), updatedAt:Date.now() } });
    } catch (_) {}
  }

  function publishAll(force = false) { publishFishing(force); publishEvent(force); }
  publishAll(true);
  publishSmartData();

  const title = document.querySelector("title");
  if (title) new MutationObserver(() => publishFishing()).observe(title, { childList: true, characterData: true, subtree: true });

  setInterval(() => publishAll(true), 1000);
  setInterval(publishSmartData, 15000);
  addEventListener("pagehide", () => chrome.storage.local.remove([FISHING_STORAGE_KEY, EVENT_STORAGE_KEY]), { once: true });
})();
