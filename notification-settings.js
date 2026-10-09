(() => {
  "use strict";
  const KEY = "pescaskills.notifications.v1";
  const settings = { fishing: false, event: false };
  function apply(saved) {
    for (const group of Object.keys(settings)) settings[group] = saved?.[group] === true;
    window.dispatchEvent(new Event("pescaskills-notification-settings"));
  }
  chrome.storage.local.get(KEY).then(result => apply(result[KEY])).catch(() => {});
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[KEY]) apply(changes[KEY].newValue);
  });
  window.PescaSkillsNotifications = {
    get: group => settings[group] === true,
    async toggle(group) {
      if (!Object.hasOwn(settings, group)) return;
      const saved = await chrome.storage.local.get(KEY);
      const next = { ...settings, ...saved[KEY] };
      next[group] = !next[group];
      await chrome.storage.local.set({ [KEY]: next });
    }
  };
})();
