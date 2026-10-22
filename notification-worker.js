"use strict";
importScripts("twish-status-core.js", "event-history.js", "sync-worker.js", "background-sync.js");

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
  const maxAge = value => value?.source === "background" ? 90000 : 30000;
  const fresh = value => value && Number.isFinite(value.updatedAt) && Date.now() >= value.updatedAt && Date.now() - value.updatedAt <= maxAge(value);
  const notices = [];
  let changed = false;
  const fishing = changes[fishingKey]?.newValue;
  if (fishing && (fishing.status === "unknown" || !fresh(fishing) || (tracker.fishingAt != null && fishing.updatedAt - tracker.fishingAt > maxAge(fishing)) || tracker.account !== fishing.account || tracker.fishingSession !== fishing.sessionId)) {
    changed = tracker.fishing !== null; tracker.fishing = null;
  }
  if (fresh(fishing) && ["available", "cooldown"].includes(fishing.status)) {
    if (tracker.fishing === "cooldown" && fishing.status === "available" && prefs.fishing === true) {
      notices.push({ id: "pescaskills-fishing", title: "Pesca disponível!", message: "Sua próxima pesca no CasalSkills está disponível. Abra a Twitch para pescar." });
    }
    changed = changed || tracker.fishing !== fishing.status || tracker.fishingAt !== fishing.updatedAt;
    tracker.fishing = fishing.status;
    tracker.fishingAt = fishing.updatedAt; tracker.account = fishing.account; tracker.fishingSession = fishing.sessionId;
  }
  const event = changes[eventKey]?.newValue;
  if (event && (!fresh(event) || (tracker.eventAt != null && event.updatedAt - tracker.eventAt > maxAge(event)) || tracker.eventSession !== event.sessionId)) { tracker.eventInitialized = false; changed = true; }
  if (fresh(event)) {
    const name = event.active && typeof event.name === "string" ? event.name : null;
    if (tracker.eventInitialized && name && name !== tracker.event && prefs.event === true) {
      notices.push({ id: "pescaskills-event", title: "Evento: " + name, message: event.description || "Um novo evento começou no CasalSkills. Confira na Twitch." });
    }
    changed = changed || !tracker.eventInitialized || name !== tracker.event || tracker.eventAt !== event.updatedAt;
    tracker.event = name;
    tracker.eventInitialized = true;
    tracker.eventAt = event.updatedAt; tracker.eventSession = event.sessionId;
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
