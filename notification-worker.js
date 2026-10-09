"use strict";

// One background worker handles all Twish tabs and remembers transitions
// across worker suspension without replaying the same notification.
var notificationQueue = Promise.resolve();
async function handleNotificationChanges(changes, area) {
  if (area !== "local") return;
  const fishingKey = "pescaskills.fishingStatus.v1";
  const eventKey = "pescaskills.eventStatus.v1";
  if (!changes[fishingKey] && !changes[eventKey]) return;
  const trackerKey = "pescaskills.notificationTransitions.v1";
  const [saved, preferences] = await Promise.all([
    chrome.storage.session.get(trackerKey),
    chrome.storage.local.get("pescaskills.notifications.v1")
  ]);
  const tracker = saved[trackerKey] || { fishing: null, eventInitialized: false, event: null };
  const prefs = preferences["pescaskills.notifications.v1"] || {};
  const fresh = value => value && Number.isFinite(value.updatedAt) && Date.now() - value.updatedAt <= 30000;
  const notices = [];
  let changed = false;
  const fishing = changes[fishingKey]?.newValue;
  if (fresh(fishing) && ["available", "cooldown"].includes(fishing.status)) {
    if (tracker.fishing === "cooldown" && fishing.status === "available" && prefs.fishing === true) {
      notices.push({ id: "pescaskills-fishing", title: "Pesca disponível!", message: "Sua próxima pesca no CasalSkills está disponível. Abra a Twitch para pescar." });
    }
    changed = tracker.fishing !== fishing.status;
    tracker.fishing = fishing.status;
  }
  const event = changes[eventKey]?.newValue;
  if (fresh(event)) {
    const name = event.active && typeof event.name === "string" ? event.name : null;
    if (tracker.eventInitialized && name && name !== tracker.event && prefs.event === true) {
      notices.push({ id: "pescaskills-event", title: "Evento: " + name, message: event.description || "Um novo evento começou no CasalSkills. Confira na Twitch." });
    }
    changed = changed || !tracker.eventInitialized || name !== tracker.event;
    tracker.event = name;
    tracker.eventInitialized = true;
  }
  if (changed) await chrome.storage.session.set({ [trackerKey]: tracker });
  for (const notice of notices) {
    try {
      await chrome.notifications.create(notice.id, {
        type: "basic", iconUrl: chrome.runtime.getURL("assets/pescaskills-logo.png"),
        title: notice.title, message: notice.message, silent: true
      });
    } catch (error) { console.warn("PescaSkills: não foi possível mostrar a notificação.", error); }
  }
}
chrome.storage.onChanged.addListener((changes, area) => {
  notificationQueue = notificationQueue.then(() => handleNotificationChanges(changes, area)).catch(error => {
    console.warn("PescaSkills: falha ao acompanhar notificações.", error);
  });
});
