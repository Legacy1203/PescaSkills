(() => {
  "use strict";
  const PANEL_ID = "twish-commands-v2-panel";
  const STYLE_ID = "pescaskills-theme";
  const THEME_STORAGE_KEY = "pescaskills.theme.v1";
  const DEFAULT_THEME = "skills";

  function getTheme() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved === "classic" || saved === "skills" ? saved : DEFAULT_THEME;
    } catch (_) {
      return DEFAULT_THEME;
    }
  }

  function applyTheme(theme) {
    const normalized = theme === "classic" ? "classic" : "skills";
    const style = document.getElementById(STYLE_ID);
    if (style) style.disabled = normalized === "classic";
    document.documentElement.dataset.pescaskillsTheme = normalized;
  }

  function setTheme(theme) {
    const normalized = theme === "classic" ? "classic" : "skills";
    try { localStorage.setItem(THEME_STORAGE_KEY, normalized); } catch (_) {}
    applyTheme(normalized);
    return normalized;
  }

  window.PescaSkillsTheme = { getTheme, setTheme };

  function getExtensionVersion() {
    try { return chrome?.runtime?.getManifest?.().version || ""; } catch (_) { return ""; }
  }

  function normalizeCounter(counter) {
    const match = counter.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    if (match) counter.textContent = `Atalhos ${match[1]}/${match[2]}`;
  }

  function applyBranding() {
    const panel = document.getElementById(PANEL_ID);
    if (!panel) return;
    const title = panel.querySelector(".twish-header-title");
    if (title) title.textContent = "PescaSkills";
    panel.querySelector(".twish-header-sub")?.remove();
    const counter = panel.querySelector(".twish-shortcut-count");
    if (counter) {
      let footer = panel.querySelector(".twish-shortcut-footer");
      if (!footer) {
        footer = document.createElement("div");
        footer.className = "twish-shortcut-footer";
        panel.appendChild(footer);
      }
      let version = footer.querySelector(".pescaskills-version");
      if (!version) {
        version = document.createElement("span");
        version.className = "pescaskills-version";
        footer.prepend(version);
      }
      const extensionVersion = getExtensionVersion();
      version.textContent = extensionVersion ? `PescaSkills • v${extensionVersion}` : "PescaSkills";
      if (counter.parentElement !== footer) footer.appendChild(counter);
      normalizeCounter(counter);
    }
  }

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #twish-commands-v2-root .twish-px-btn{border:1px solid #7c3cff!important;border-radius:3px!important;background:#111225!important;box-shadow:inset 0 0 0 1px #28145a,0 0 8px rgba(124,60,255,.45)!important;color:#f5f0ff!important}
      #twish-commands-v2-root .twish-px-btn:hover,#twish-commands-v2-root .twish-px-btn[data-active="true"]{background:#21104d!important;border-color:#b35cff!important;box-shadow:inset 0 0 0 1px #7c3cff,0 0 13px rgba(179,92,255,.8)!important}
      #twish-commands-v2-root .twish-px-btn[data-event-active="true"]{background:#21104d!important;border-color:#12dff3!important;box-shadow:inset 0 0 0 1px #7c3cff,0 0 14px rgba(18,223,243,.85)!important}
      #twish-commands-v2-root .twish-px-btn[data-fishing-status="cooldown"]{opacity:1!important;background:#171522!important;color:#77748a!important;border-color:#343047!important;box-shadow:inset 0 0 0 1px #262238,3px 3px 0 #090811!important}
      #twish-commands-v2-root .twish-px-btn[data-fishing-status="available"]{opacity:1!important;filter:none!important;border-color:#b35cff!important;box-shadow:inset 0 0 0 1px #7c3cff,0 0 16px rgba(179,92,255,.95),0 0 5px rgba(62,210,255,.8)!important}
      #twish-commands-v2-root .twish-tip{background:#090b17!important;border:1px solid #7c3cff!important;color:#f5f0ff!important;box-shadow:0 0 10px rgba(124,60,255,.65)!important}
      #twish-commands-v2-root .twish-quick-empty{border:1px dashed rgba(124,60,255,.48)!important;background:rgba(20,12,45,.45)!important}
      #twish-commands-v2-panel{border:2px solid #7c3cff!important;background:#090b17!important;color:#f5f0ff!important;box-shadow:inset 0 0 0 1px #26124f,0 0 24px rgba(124,60,255,.55),0 0 45px rgba(18,223,243,.12)!important}
      #twish-commands-v2-panel .twish-header{height:46px!important;padding:0 12px!important;background:linear-gradient(90deg,#090b17 0%,#17102e 55%,#0b1224 100%)!important;border-bottom:1px solid #7c3cff!important;color:#fff!important;text-shadow:0 0 8px rgba(179,92,255,.95)!important;box-shadow:0 3px 12px rgba(124,60,255,.2)!important}
      #twish-commands-v2-panel .twish-header-title{font-size:16px!important;color:#fff!important;letter-spacing:.7px!important}
      #twish-commands-v2-panel .twish-close{background:#111225!important;color:#f5f0ff!important;border:1px solid #7c3cff!important;box-shadow:0 0 7px rgba(124,60,255,.45)!important}
      #twish-commands-v2-panel .twish-close:hover{background:#35106a!important;border-color:#b35cff!important;box-shadow:0 0 12px rgba(179,92,255,.8)!important}
      #twish-commands-v2-panel .twish-tabs{gap:5px!important;padding:7px!important;background:#0d0e1c!important;border-bottom:1px solid #32196a!important}
      #twish-commands-v2-panel .twish-tab{border:1px solid #4d2a8f!important;background:#151329!important;color:#cfc4e8!important;box-shadow:none!important}
      #twish-commands-v2-panel .twish-tab:hover{border-color:#7c3cff!important;color:#fff!important;box-shadow:0 0 8px rgba(124,60,255,.38)!important}
      #twish-commands-v2-panel .twish-tab[data-active="true"]{background:linear-gradient(135deg,#38106f,#191b46)!important;border-color:#b35cff!important;color:#fff!important;box-shadow:inset 0 0 0 1px #7c3cff,0 0 10px rgba(124,60,255,.55)!important}
      #twish-commands-v2-panel .twish-list{background:radial-gradient(circle at 50% 0%,#17112f 0,#0b0d1b 42%,#070912 100%)!important}
      #twish-commands-v2-panel .twish-card{border:1px solid #353450!important;background:#121421!important;color:#aaa8ba!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.02)!important;filter:saturate(.55)!important;opacity:.7!important}
      #twish-commands-v2-panel .twish-card[data-quick-selected="true"]{background:linear-gradient(135deg,#18152d,#11172b)!important;color:#f7f3ff!important;filter:none!important;opacity:1!important;border-color:#7c3cff!important;box-shadow:inset 0 0 0 1px rgba(179,92,255,.25),0 0 9px rgba(124,60,255,.35)!important}
      #twish-commands-v2-panel .twish-card:hover{background:#18162d!important;border-color:#8e4dff!important;filter:none!important;opacity:1!important;box-shadow:0 0 10px rgba(124,60,255,.4)!important}
      #twish-commands-v2-panel .twish-card-icon{background:#17182a!important;border:1px solid #464460!important;color:#fff!important}
      #twish-commands-v2-panel .twish-card[data-quick-selected="true"] .twish-card-icon{background:#24134c!important;border-color:#8e4dff!important;box-shadow:0 0 8px rgba(124,60,255,.5)!important}
      #twish-commands-v2-panel .twish-card-desc{color:#85849a!important}
      #twish-commands-v2-panel .twish-card-command{background:#0a0c18!important;color:#12dff3!important;border:1px solid #34315b!important;text-shadow:0 0 5px rgba(18,223,243,.35)!important}
      #twish-commands-v2-panel .twish-event-active,#twish-commands-v2-root .twish-event-active{background:linear-gradient(135deg,#18152d,#11172b)!important;color:#f7f3ff!important;border-color:#12dff3!important;box-shadow:inset 0 0 0 1px rgba(124,60,255,.35),0 0 12px rgba(18,223,243,.28)!important}#twish-commands-v2-panel .twish-event-kicker,#twish-commands-v2-root .twish-event-kicker{color:#bfa8ff!important}#twish-commands-v2-panel .twish-event-time,#twish-commands-v2-root .twish-event-time{color:#12dff3!important}#twish-commands-v2-panel .twish-event-desc,#twish-commands-v2-root .twish-event-desc{color:#c8c5d6!important}
      #twish-commands-v2-panel .twish-favorite{border:1px solid #49465f!important;background:#171827!important;color:#77758b!important}
      #twish-commands-v2-panel .twish-favorite:hover{background:#24134c!important;color:#fff!important;border-color:#7c3cff!important}
      #twish-commands-v2-panel .twish-favorite[data-selected="true"]{background:#35106a!important;color:#fff!important;border-color:#b35cff!important;box-shadow:inset 0 0 0 1px #7c3cff,0 0 8px rgba(179,92,255,.65)!important}
      #twish-commands-v2-panel .twish-settings-title{color:#f5f0ff!important}
      #twish-commands-v2-panel .twish-user-search-title{color:#f5f0ff!important}#twish-commands-v2-panel .twish-user-search-sub,#twish-commands-v2-panel .twish-user-empty{color:#85849a!important}#twish-commands-v2-panel .twish-user-search-input{border:1px solid #4d2a8f!important;background:#0a0c18!important;color:#f5f0ff!important}#twish-commands-v2-panel .twish-user-result,#twish-commands-v2-panel .twish-user-manual{border:1px solid #4d2a8f!important;background:#151329!important;color:#cfc4e8!important}#twish-commands-v2-panel .twish-user-result:hover,#twish-commands-v2-panel .twish-user-manual:hover{border-color:#7c3cff!important;background:#21104d!important;color:#fff!important}
      #twish-commands-v2-panel .twish-card[data-fishing-status="cooldown"]{opacity:.5!important;filter:saturate(.2)!important;cursor:not-allowed!important}#twish-commands-v2-panel .twish-card[data-event-active="true"]{opacity:1!important;filter:none!important;border-color:#12dff3!important;box-shadow:inset 0 0 0 1px rgba(124,60,255,.35),0 0 12px rgba(18,223,243,.35)!important}
      #twish-commands-v2-panel .twish-theme-option{border:1px solid #4d2a8f!important;background:#151329!important;color:#cfc4e8!important;box-shadow:none!important}
      #twish-commands-v2-panel .twish-theme-option:hover{border-color:#7c3cff!important;color:#fff!important;box-shadow:0 0 8px rgba(124,60,255,.38)!important}
      #twish-commands-v2-panel .twish-theme-option[data-selected="true"]{background:linear-gradient(135deg,#38106f,#191b46)!important;border-color:#b35cff!important;color:#fff!important;box-shadow:inset 0 0 0 1px #7c3cff,0 0 10px rgba(124,60,255,.55)!important}
      #twish-commands-v2-panel .twish-smart-head{border-bottom-color:#2b2450!important}#twish-commands-v2-panel .twish-smart-back{border:1px solid #4d2a8f!important;background:#151329!important;color:#cfc4e8!important}#twish-commands-v2-panel .twish-smart-back:hover{border-color:#7c3cff!important;background:#21104d!important;color:#fff!important}#twish-commands-v2-panel .twish-smart-title{color:#f5f0ff!important}#twish-commands-v2-panel .twish-smart-input{border:1px solid #4d2a8f!important;background:#0a0c18!important;color:#f5f0ff!important;border-radius:3px!important}#twish-commands-v2-panel .twish-smart-input:focus{border-color:#b35cff!important;box-shadow:0 0 0 2px rgba(124,60,255,.18),0 0 10px rgba(124,60,255,.3)!important}#twish-commands-v2-panel .twish-smart-item{border:1px solid #34315b!important;background:linear-gradient(135deg,#151625,#101321)!important;color:#f5f0ff!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.02),0 3px 10px rgba(0,0,0,.18)!important;border-radius:4px!important}#twish-commands-v2-panel .twish-smart-item:hover{border-color:#6840b6!important;background:linear-gradient(135deg,#19172d,#11172b)!important}#twish-commands-v2-panel .twish-smart-meta{color:#9895aa!important}#twish-commands-v2-panel .twish-smart-badge{border:1px solid #12dff3!important;background:#102a38!important;color:#6ff4ff!important;box-shadow:0 0 8px rgba(18,223,243,.2)!important}#twish-commands-v2-panel .twish-smart-actions{border-top-color:#2b2942!important}#twish-commands-v2-panel .twish-smart-qty-label{color:#9895aa!important}#twish-commands-v2-panel .twish-smart-step{border:1px solid #4d2a8f!important;background:#151329!important;color:#f5f0ff!important;border-radius:3px!important}#twish-commands-v2-panel .twish-smart-step:hover{background:#21104d!important;border-color:#8e4dff!important}#twish-commands-v2-panel .twish-smart-qty-input{border:1px solid #4d2a8f!important;background:#0a0c18!important;color:#fff!important;border-radius:3px!important}#twish-commands-v2-panel .twish-smart-go{border:1px solid #b35cff!important;background:linear-gradient(135deg,#4c168e,#29205d)!important;color:#fff!important;border-radius:3px!important;box-shadow:0 0 8px rgba(124,60,255,.28)!important}#twish-commands-v2-panel .twish-smart-go:hover{background:linear-gradient(135deg,#6320b2,#333078)!important;box-shadow:0 0 12px rgba(179,92,255,.5)!important}#twish-commands-v2-panel .twish-smart-manual{border:1px solid #3d3857!important;background:#10111d!important;color:#9895aa!important;border-radius:3px!important}#twish-commands-v2-panel .twish-smart-manual:hover{border-color:#6840b6!important;color:#f5f0ff!important;background:#171528!important}#twish-commands-v2-panel .twish-smart-empty{border-color:#3d3857!important;color:#9895aa!important}
      #twish-commands-v2-panel .twish-shortcut-footer{height:31px;min-height:31px;display:flex;align-items:center;justify-content:space-between;padding:0 10px;background:#090b17;border-top:1px solid #24144c}
      #twish-commands-v2-panel .pescaskills-version{display:none;font-size:9px;color:#85849a;white-space:nowrap}
      #twish-commands-v2-panel[data-active-group="ajustes"] .pescaskills-version{display:inline}
      #twish-commands-v2-panel .twish-shortcut-count{font-size:10px!important;margin-left:0!important;color:#c9baff!important;white-space:nowrap;text-shadow:0 0 7px rgba(124,60,255,.75)!important;border:1px solid #4d2a8f;background:#101222;padding:3px 6px}
    `;
    document.head.appendChild(style);
  }

  applyTheme(getTheme());
  applyBranding();

  // A Twitch atualiza o DOM constantemente. Evitamos observar a página inteira:
  // um polling leve mantém o branding aplicado sem reagir a cada mutação interna.
  const BRANDING_INTERVAL_MS = 750;
  setInterval(applyBranding, BRANDING_INTERVAL_MS);
})();
