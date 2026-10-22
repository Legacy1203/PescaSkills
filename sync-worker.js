"use strict";
// One serialized writer commits snapshots collected by the extension worker.
const syncKeys = { fishing: "pescaskills.fishingStatus.v1", event: "pescaskills.eventStatus.v1", smart: "pescaskills.smartData.v1" };
const eventHistoryKey = "pescaskills.eventHistory.v1";
let syncQueue = Promise.resolve();
async function handleSyncMessage(message, sender) {
  const internal = sender === null;
  if (!internal && !sender?.tab) return { ok: false };
  const url = new URL(internal ? "https://twish.com.br/c/casalskills" : sender.url || sender.tab.url);
  if (!["https://twish.com.br", "https://www.twitch.tv"].includes(url.origin)) return { ok: false };
  if (!internal && message.type === "pescaskills.sync.publish") return { ok: false };
  let meta = (await chrome.storage.session.get("pescaskills.syncSession.v1"))["pescaskills.syncSession.v1"];
  if (!meta) {
    meta = { sessionId: crypto.randomUUID(), observed: {}, account: null, accountSince: 0 };
    await chrome.storage.local.remove(Object.values(syncKeys));
    await chrome.storage.session.set({ "pescaskills.notificationTransitions.v1": { fishing: null, eventInitialized: false, event: null } });
    await chrome.storage.session.set({ "pescaskills.syncSession.v1": meta });
  }
  if (message.type === "pescaskills.sync.read") return { ok: true, sessionId: meta.sessionId, states: await chrome.storage.local.get([...Object.values(syncKeys),eventHistoryKey]) };
  if (message.type === "pescaskills.sync.wake") return {ok:true};
  if (url.origin !== "https://twish.com.br" || !/^\/c\/casalskills(?:\/|$)/i.test(url.pathname)) return { ok: false };
  const { group, observedAt, value } = message;
  if (!Object.hasOwn(syncKeys, group) || !Number.isFinite(observedAt) || Date.now() < observedAt || Date.now() - observedAt > 30000) return { ok: false };
  const logout = group === "fishing" && value?.status === "unknown" && !value.account;
  const previousAt = meta.observed[group] ?? -1;
  if (observedAt < previousAt || (observedAt === previousAt && !logout)) return { ok: false };
  if (group !== "event" && observedAt < meta.accountSince) return { ok: false };
  if (group === "fishing" && !["available", "cooldown", "unknown"].includes(value?.status)) return { ok: false };
  if (group === "event" && (typeof value?.active !== "boolean" || (value.active && (!Number.isFinite(value.endsAt) || typeof value.name !== "string")))) return { ok: false };
  if (group === "smart" && (!value?.data || !value.account)) return { ok: false };
  const account = group !== "event" ? (value.account || null) : meta.account;
  if (group !== "event" && account !== meta.account) {
    if (observedAt < Math.max(meta.observed.fishing || 0, meta.observed.smart || 0)) return { ok: false };
    // On an ambiguous timestamp, invalidate instead of restoring another identity.
    if (observedAt <= meta.accountSince && !logout) return { ok: false };
    meta.account = account; meta.accountSince = observedAt;
    await chrome.storage.local.remove([syncKeys.fishing, syncKeys.smart]);
  }
  let next = { ...value, updatedAt: observedAt, sessionId: meta.sessionId, source: "background" };
  if (group === "smart") {
    const old = (await chrome.storage.local.get([syncKeys.smart]))[syncKeys.smart];
    next.data = { ...(old?.account === account ? old.data : {}), ...value.data };
    next.fetchedAt = { ...(old?.account === account ? old.fetchedAt : {}) };
    for (const key of Object.keys(value.data)) next.fetchedAt[key] = observedAt;
  }
  meta.observed[group] = observedAt;
  const patch = { [syncKeys[group]]: next };
  if (group === "event") {
    const saved = (await chrome.storage.local.get([eventHistoryKey]))[eventHistoryKey];
    const events = (Array.isArray(value.historyEvents) ? value.historyEvents : value.active ? [value] : []).map(event=>({...event,source:"background"}));
    patch[eventHistoryKey] = globalThis.PescaSkillsEventHistory.update(saved,events,observedAt);
  }
  await chrome.storage.local.set(patch);
  await chrome.storage.session.set({ "pescaskills.syncSession.v1": meta });
  return { ok: true, sessionId: meta.sessionId };
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (!["pescaskills.sync.read", "pescaskills.sync.publish", "pescaskills.sync.wake"].includes(message?.type)) return;
  syncQueue = syncQueue.then(() => handleSyncMessage(message, sender));
  syncQueue.then(result=>{
    respond(result);
    if(result.ok && ["pescaskills.sync.read","pescaskills.sync.wake"].includes(message.type)) globalThis.PescaSkillsBackgroundSync?.refresh();
  }, () => respond({ ok: false }));
  syncQueue = syncQueue.catch(() => {});
  return true;
});
function commitBackgroundSnapshot(message) {
  const task = syncQueue.then(() => handleSyncMessage(message,null));
  syncQueue = task.catch(() => {});
  return task;
}
