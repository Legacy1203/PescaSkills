"use strict";
(() => {
  const ALARM = "pescaskills.sync.poll", ATTEMPT = "pescaskills.syncAttempt.v1";
  const BASE = "https://twish.com.br/api/casalskills";
  let pending = null;
  async function ensureAlarm() {
    const alarm = await chrome.alarms.get(ALARM);
    if (!alarm || alarm.periodInMinutes !== .5) await chrome.alarms.create(ALARM,{periodInMinutes:.5});
  }
  async function tracking() {
    const tabs = await chrome.tabs.query({url:"https://twish.com.br/*"});
    return tabs.some(tab=>{try{return /^\/c\/casalskills(?:\/|$)/i.test(new URL(tab.url).pathname)}catch(_){return false}});
  }
  async function get(path) {
    const response = await fetch(BASE+path,{credentials:"include",cache:"no-store",signal:AbortSignal.timeout(10000)});
    if (!response.ok) throw Object.assign(new Error(`Twish HTTP ${response.status}`),{status:response.status});
    return response.json();
  }
  async function cycle() {
    await ensureAlarm();
    if (!await tracking()) return {ok:true,tracking:false};
    const at = Date.now();
    const last = (await chrome.storage.session.get(ATTEMPT))[ATTEMPT];
    if (Number.isFinite(last) && at >= last && at-last < 5000) return {ok:true,skipped:true};
    await chrome.storage.session.set({[ATTEMPT]:at});
    // Clear old browser-session snapshots before any network response can arrive.
    await commitBackgroundSnapshot({type:"pescaskills.sync.read"});
    const [me,inventory,shop,titles,events] = await Promise.allSettled([
      get("/me"),get("/me/inventory"),get("/shop"),get("/titles"),get("/events/active")
    ]);
    if (!await tracking() || !PescaSkillsStatusCore.fresh(at,Date.now())) return {ok:false};
    const publish = (group,value)=>commitBackgroundSnapshot({type:"pescaskills.sync.publish",group,value,observedAt:at});
    if (me.status === "fulfilled" && typeof me.value?.login === "string" && me.value.login) {
      const account=me.value.login.toLowerCase();
      const fishing=PescaSkillsStatusCore.parseTwishFishingApi(me.value,at,Date.now());
      await publish("fishing",{...(fishing || {status:"unknown"}),account});
      const data={me:me.value};
      for(const [key,result] of [["inventory",inventory],["shop",shop],["titles",titles]]) {
        if(result.status === "fulfilled" && result.value && typeof result.value === "object") data[key]=result.value;
      }
      await publish("smart",{account,data});
    } else if (me.status === "fulfilled" || [401,403].includes(me.reason?.status)) {
      await publish("fishing",{status:"unknown",account:null});
    }
    if (events.status === "fulfilled") {
      const parsed=PescaSkillsStatusCore.parseTwishEventApi(events.value,at,Date.now());
      if(parsed) {
        const historyEvents=[events.value.event,events.value.grande_evento].flatMap((event,index)=>event?[{name:event.name,endsAt:at+event.seconds_remaining*1000,kind:index===1?"grand":"regular"}]:[]);
        await publish("event",{...parsed,historyEvents});
      }
    }
    return {ok:true};
  }
  function refresh() {
    if(pending)return pending;
    pending=cycle().catch(error=>{console.warn("PescaSkills: sincronização em segundo plano indisponível.",error.message);return {ok:false}}).finally(()=>{pending=null});
    return pending;
  }
  globalThis.PescaSkillsBackgroundSync={refresh};
  chrome.alarms.onAlarm.addListener(alarm=>alarm.name===ALARM?refresh():undefined);
  chrome.runtime.onStartup.addListener(()=>refresh());
  chrome.runtime.onInstalled.addListener(()=>refresh());
  ensureAlarm().catch(error=>console.warn("PescaSkills: não foi possível agendar a sincronização.",error.message));
})();
