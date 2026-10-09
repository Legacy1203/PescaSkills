(() => {
  "use strict";
  let fishing = null;
  let eventInitialized = false;
  let eventName = null;
  function observe(fishingState, eventState, now = Date.now()) {
    const fresh = state => state && Number.isFinite(state.updatedAt) && now - state.updatedAt <= 30000;
    if (fresh(fishingState) && ["available","cooldown"].includes(fishingState.status)) {
      if (fishing === "cooldown" && fishingState.status === "available") window.PescaSkillsSound?.playFishingAlert();
      fishing = fishingState.status;
    }
    if (fresh(eventState)) {
      const name = eventState.active ? eventState.name : null;
      if (eventInitialized && name && name !== eventName) window.PescaSkillsSound?.playEventAlert();
      eventName = name; eventInitialized = true;
    }
  }
  window.PescaSkillsAlerts = {observe};
})();
