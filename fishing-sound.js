(() => {
  "use strict";
  const KEY = "pescaskills.soundSettings.v2";
  const settings = { fishingAlert:{enabled:true,volume:7}, eventAlert:{enabled:true,volume:7} };
  const sounds = new Map();
  const clamp = value => Math.round(Math.max(1, Math.min(10, Number(value))));
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) {
      for (const group of Object.keys(settings)) {
        if (typeof saved[group]?.enabled === "boolean") settings[group].enabled = saved[group].enabled;
        if (Number.isFinite(saved[group]?.volume)) settings[group].volume = clamp(saved[group].volume);
        if (saved[group]?.volume === 0) settings[group].enabled = false;
      }
    }
  } catch (_) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch (_) {} }
  function update(group, patch) {
    if (!settings[group]) return;
    if (typeof patch.enabled === "boolean") settings[group].enabled = patch.enabled;
    if (Number.isFinite(Number(patch.volume))) settings[group].volume = clamp(patch.volume);
    save();
    for (const entry of sounds.values()) if (entry.group === group) {
      entry.audio.volume = settings[group].volume / 10;
      if (!settings[group].enabled || !settings[group].volume) { entry.audio.pause(); entry.audio.currentTime = 0; }
    }
  }
  function play(asset, group) {
    const pref = settings[group];
    if (!pref.enabled || !pref.volume) return;
    try {
      if (!sounds.has(asset)) sounds.set(asset, {group, audio:new Audio(chrome.runtime.getURL(`assets/${asset}`))});
      const audio = sounds.get(asset).audio;
      audio.volume = pref.volume / 10; audio.currentTime = 0;
      audio.play()?.catch(() => {});
    } catch (_) {}
  }
  window.PescaSkillsSound = {
    getSettings: group => ({...settings[group]}), update,
    playFishingAlert: () => play("fishing-ready.mp3","fishingAlert"), playEventAlert: () => play("event-ready.mp3","eventAlert")
  };
})();
