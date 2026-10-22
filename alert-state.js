(() => {
  "use strict";
  let fishing = null;
  let eventInitialized = false;
  let eventName = null;
  let fishingAt = null, eventAt = null, account = null, session = null;
  function observe(fishingState, eventState, now = Date.now()) {
    const maxAge = state => state?.source === "background" ? 90000 : 30000;
    const fresh = state => state && Number.isFinite(state.updatedAt) && now >= state.updatedAt && now - state.updatedAt <= maxAge(state);
    const currentSession = fishingState?.sessionId || eventState?.sessionId || null;
    if (currentSession !== session) { fishing = null; eventInitialized = false; session = currentSession; }
    if (!fresh(fishingState) || fishingState.status === "unknown" || fishingState.account !== account || (fishingAt !== null && fishingState.updatedAt - fishingAt > maxAge(fishingState))) fishing = null;
    if (!fresh(eventState) || (eventAt !== null && eventState.updatedAt - eventAt > maxAge(eventState))) eventInitialized = false;
    if (fresh(fishingState) && ["available","cooldown"].includes(fishingState.status)) {
      if (fishing === "cooldown" && fishingState.status === "available") window.PescaSkillsSound?.playFishingAlert();
      fishing = fishingState.status;
      fishingAt = fishingState.updatedAt; account = fishingState.account;
    }
    if (fresh(eventState)) {
      const name = eventState.active ? eventState.name : null;
      if (eventInitialized && name && name !== eventName) window.PescaSkillsSound?.playEventAlert();
      eventName = name; eventInitialized = true;
      eventAt = eventState.updatedAt;
    }
  }
  window.PescaSkillsAlerts = {observe};
})();
