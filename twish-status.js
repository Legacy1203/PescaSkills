(() => {
  "use strict";
  // Pages only signal navigation/resume. Alarms and fetch live in the extension worker.
  function wake() {
    if (!/^\/c\/casalskills(?:\/|$)/i.test(location.pathname)) return;
    chrome.runtime.sendMessage({type:"pescaskills.sync.wake"}).catch(()=>{});
  }
  wake();
  addEventListener("focus",wake);
  addEventListener("online",wake);
  addEventListener("pageshow",wake);
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")wake()});
})();
