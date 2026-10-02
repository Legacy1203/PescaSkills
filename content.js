(() => {
  "use strict";

  if (window.__twishCommandsV2Loaded) return;
  window.__twishCommandsV2Loaded = true;

  const INVENTORY_URL = "https://twish.com.br/c/casalskills/inventory";
  const SHOP_URL = "https://twish.com.br/c/casalskills/shop";
  const COMMANDS_URL = "https://twish.com.br/c/casalskills/commands";
  const ROOT_ID = "twish-commands-v2-root";
  const PANEL_ID = "twish-commands-v2-panel";
  const QUICK_STORAGE_KEY = "twish.quick.shortcuts.v1";
  const MAX_QUICK_SHORTCUTS = 6;
  const DEFAULT_QUICK_IDS = ["$pescar", "$evento", "$hoje", "$ranking", "$vender todos"];

  const COMMAND_GROUPS = [
    {
      id: "jogador", icon: "👤", label: "Jogador",
      commands: [
        ["💰","Coins","$coins","Saldo de twishcoins"],
        ["✨","Pontos","$points","Seus pontos acumulados · alias: $pts"],
        ["⭐","Nível","$nivel","Nível, XP total e progresso · alias: $level"],
        ["📅","Hoje","$hoje","Resumo das pescarias de hoje"],
        ["💎","Apoio","$apoio","Progresso nos selos de apoio"],
        ["🏷","Título","$titulo ","Digite o ID depois do comando"]
      ]
    },
    {
      id: "pesca", icon: "🎣", label: "Pesca",
      commands: [
        ["🎣","Pescar","$pescar","Joga a isca e tenta pescar"],
        ["🐟","Destaque","$destaque","Peixe em destaque do canal"],
        ["🪱","Equipar isca","$isca ","Digite o ID e, opcionalmente, a quantidade"],
        ["↩","Desequipar isca","$desequiparisca","Alias: $di"],
        ["🪝","Desequipar anzol","$desequiparanzol","Alias: $da"],
        ["⚙","Autovenda ON","$autovenda on","Ativa a venda automática"],
        ["⚙","Autovenda OFF","$autovenda off","Desativa a venda automática"],
        ["🛡","Whitelist","$whitelist ","Protege uma espécie · alias: $wl"],
        ["✖","Remover whitelist","$whitelistremove ","Remove uma espécie · alias: $wlr"]
      ]
    },
    {
      id: "duelos", icon: "⚔", label: "Duelos",
      commands: [
        ["⚔","Duelar","$duelar ","Digite o oponente depois do comando"],
        ["✓","Aceitar","$aceitar","Aceita o duelo pendente"],
        ["✕","Recusar","$recusar","Recusa o duelo pendente"],
        ["🚫","Cancelar","$cancelarduelo","Cancela o duelo pendente · alias: $cd"],
        ["⌛","Cooldown","$cooldown","Tempo restante para pescar e duelar"]
      ]
    },
    {
      id: "eventos", icon: "🎪", label: "Eventos",
      commands: [
        ["🎪","Evento","$evento","Evento especial ativo no canal"],
        ["🎟️","Entrar","$entrar","Participa do torneio ativo · alias: $join"],
        ["🏆","Ranking torneio","$rankingtorneio","Ranking atual · alias: $rt"],
        ["⏱","Tempo torneio","$tempotorneio","Tempo até o próximo · alias: $tt"]
      ]
    },
    {
      id: "rankings", icon: "🏆", label: "Rankings",
      commands: [
        ["🏆","Ranking","$ranking","Top 3 pela maior captura"],
        ["⬆","Ascensão","$rankingascensao","Maior peixe ascendido · alias: $ra"],
        ["✨","Ranking pontos","$rankingpts","Top 3 por pontos acumulados"],
        ["💰","Ranking coins","$rankingcoins","Top 3 por twishcoins · alias: $rc"],
        ["📍","Meu rank","$meurank","Sua posição em todos os rankings"]
      ]
    },
    {
      id: "loja", icon: "🎒", label: "Loja",
      commands: [
        ["🎒","Inventário",null,"Abrir seu inventário no site", "inventory"],
        ["🏪","Loja",null,"Abrir a loja no site", "shop"],
        ["🛒","Comprar","$comprar ","Digite o ID e, opcionalmente, a quantidade"],
        ["💵","Vender","$vender ","Digite o ID, todos ou categoria e a quantidade"],
        ["💰","Vender todos","$vender todos","Vende todos os peixes permitidos"]
      ]
    },
    {
      id: "ajuda", icon: "?", label: "Ajuda",
      commands: [
        ["⌨","Comandos",null,"Abrir a página de comandos", "commands"],
        ["?","Tutorial","$tutorial","Receber o link do manual"]
      ]
    }
  ];

  function actionId(command, type, name) {
    return type ? `link:${type}` : command || `name:${name}`;
  }

  function allActions() {
    return COMMAND_GROUPS.flatMap(group =>
      group.commands.map(([icon, name, command, desc, type]) => ({
        id: actionId(command, type, name), icon, label: name, command, desc, type
      }))
    );
  }

  function loadQuickIds() {
    try {
      const parsed = JSON.parse(localStorage.getItem(QUICK_STORAGE_KEY));
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_QUICK_SHORTCUTS);
    } catch (_) {}
    return [...DEFAULT_QUICK_IDS];
  }

  function saveQuickIds(ids) {
    try { localStorage.setItem(QUICK_STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_QUICK_SHORTCUTS))); } catch (_) {}
  }

  function getQuickIds() {
    const valid = new Set(allActions().map(a => a.id));
    return loadQuickIds().filter(id => valid.has(id)).slice(0, MAX_QUICK_SHORTCUTS);
  }

  function updateShortcutCounter() {
    const count = document.querySelector(`#${PANEL_ID} .twish-shortcut-count`);
    if (count) count.textContent = `ATALHOS RÁPIDOS • ${getQuickIds().length}/${MAX_QUICK_SHORTCUTS}`;
  }

  function renderQuickBar() {
    const quick = document.querySelector(`#${ROOT_ID} .twish-quick`);
    if (!quick) return;
    quick.replaceChildren();

    const actions = allActions();
    const selected = getQuickIds();
    selected.forEach(id => {
      const item = actions.find(a => a.id === id);
      if (item) quick.appendChild(makeQuickButton(item));
    });

    for (let i = selected.length; i < MAX_QUICK_SHORTCUTS; i++) {
      const empty = document.createElement("span");
      empty.className = "twish-quick-empty";
      empty.setAttribute("aria-hidden", "true");
      quick.appendChild(empty);
    }

    const menu = document.createElement("button");
    menu.type = "button";
    menu.className = "twish-px-btn twish-menu-btn";
    menu.setAttribute("aria-label", "Abrir menu Twish");
    menu.innerHTML = `<span aria-hidden="true">≡</span><span class="twish-tip">Menu de comandos</span>`;
    menu.addEventListener("click", () => togglePanel());
    quick.appendChild(menu);
  }

  function toggleQuickShortcut(id) {
    let ids = getQuickIds();
    if (ids.includes(id)) {
      ids = ids.filter(x => x !== id);
    } else {
      if (ids.length >= MAX_QUICK_SHORTCUTS) {
        const count = document.querySelector(`#${PANEL_ID} .twish-shortcut-count`);
        if (count) {
          const original = `ATALHOS RÁPIDOS • ${ids.length}/${MAX_QUICK_SHORTCUTS}`;
          count.textContent = "LIMITE DE 6 ATALHOS";
          setTimeout(() => { if (count.isConnected) count.textContent = original; }, 1200);
        }
        return;
      }
      ids.push(id);
    }
    saveQuickIds(ids);
    renderQuickBar();
    updateShortcutCounter();
    const panel = document.getElementById(PANEL_ID);
    const activeGroup = panel?.querySelector(".twish-tab[data-active='true']")?.dataset.group;
    if (panel && activeGroup) renderGroup(panel, activeGroup);
  }

  function findEditor() {
    const candidates = [
      '[data-a-target="chat-input"] [contenteditable="true"]',
      '[data-a-target="chat-input"][contenteditable="true"]',
      '[data-a-target="chat-input"] textarea',
      '[data-a-target="chat-input"] input',
      '[contenteditable="true"][data-a-target="chat-input"]',
      '[contenteditable="true"][role="textbox"]'
    ];
    for (const selector of candidates) {
      const el = document.querySelector(selector);
      if (el && el.getBoundingClientRect().width > 0) return el;
    }
    return null;
  }

  function selectAll(editor) {
    if (editor instanceof HTMLInputElement || editor instanceof HTMLTextAreaElement) {
      editor.select();
      return;
    }
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function moveCaretToEnd(editor) {
    if (editor instanceof HTMLInputElement || editor instanceof HTMLTextAreaElement) {
      const end = editor.value.length;
      editor.setSelectionRange(end, end);
      return;
    }
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function insertCommand(command) {
    const editor = findEditor();
    if (!editor) return;
    editor.focus();
    selectAll(editor);

    let allowed = true;
    try {
      allowed = editor.dispatchEvent(new InputEvent("beforeinput", {
        bubbles: true, cancelable: true, composed: true,
        inputType: "insertText", data: command
      }));
    } catch (_) {}

    let inserted = false;
    if (allowed) {
      try { inserted = document.execCommand("insertText", false, command); } catch (_) {}
    }

    if (!inserted && (editor instanceof HTMLInputElement || editor instanceof HTMLTextAreaElement)) {
      const proto = editor instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
      if (setter) setter.call(editor, command);
      else editor.value = command;
      editor.dispatchEvent(new InputEvent("input", {
        bubbles: true, composed: true, inputType: "insertText", data: command
      }));
    }

    editor.focus();
    moveCaretToEnd(editor);
  }

  function runAction(action) {
    if (action.type === "inventory") {
      window.open(INVENTORY_URL, "_blank", "noopener,noreferrer");
      return;
    }
    if (action.type === "shop") {
      window.open(SHOP_URL, "_blank", "noopener,noreferrer");
      return;
    }
    if (action.type === "commands") {
      window.open(COMMANDS_URL, "_blank", "noopener,noreferrer");
      return;
    }
    if (action.command) insertCommand(action.command);
  }

  function css() {
    return `
      #${ROOT_ID}{position:relative;width:100%;box-sizing:border-box;margin:0 0 7px;font-family:"Courier New",monospace;z-index:50}
      #${ROOT_ID} *{box-sizing:border-box}
      .twish-quick{display:grid;grid-template-columns:repeat(7,34px);justify-content:space-between;gap:4px;align-items:center;width:100%;padding:0 2px}
      .twish-px-btn{width:34px;height:34px;min-width:34px;padding:0;border:2px solid #2b170d;border-radius:2px;background:#a95f2d;box-shadow:inset 0 0 0 2px #d59a49,3px 3px 0 #1c100a;color:#fff0bd;font:700 16px/1 "Courier New",monospace;cursor:pointer;position:relative;display:flex;align-items:center;justify-content:center;text-align:center}
      .twish-px-btn>span:first-child{display:flex;width:100%;height:100%;align-items:center;justify-content:center;line-height:1;text-align:center}
      .twish-px-btn:hover,.twish-px-btn[data-active="true"]{background:#c87a38;transform:translate(-1px,-1px);box-shadow:inset 0 0 0 2px #efbd62,4px 4px 0 #1c100a}
      .twish-px-btn:active{transform:translate(2px,2px);box-shadow:inset 0 0 0 2px #efbd62,1px 1px 0 #1c100a}
      .twish-tip{visibility:hidden;opacity:0;pointer-events:none;position:absolute;bottom:43px;left:50%;transform:translateX(-50%);white-space:nowrap;background:#4a2a18;border:2px solid #2a160c;box-shadow:2px 2px 0 #160c07;padding:5px 7px;color:#fff0bd;font:700 10px/1.2 "Courier New",monospace;transition:opacity .08s}
      .twish-px-btn:hover .twish-tip{visibility:visible;opacity:1}
      .twish-menu-btn{margin-left:0}
      .twish-quick-empty{width:34px;height:34px;display:block;border:2px dashed rgba(213,154,73,.42);background:rgba(90,50,30,.18);box-sizing:border-box}
      #${PANEL_ID}{position:fixed;left:50%;top:50%;right:auto;bottom:auto;width:min(600px,calc(100vw - 32px));height:min(650px,calc(100vh - 48px));max-width:none;max-height:none;transform:translate(-50%,-50%);display:none;flex-direction:column;border:3px solid #2a160c;background:#e7c98c;box-shadow:inset 0 0 0 2px #8c4e28,5px 5px 0 rgba(0,0,0,.5);overflow:hidden;color:#3a2114;z-index:2147483646}
      #${PANEL_ID}[data-open="true"]{display:flex}
      .twish-header{height:42px;display:flex;align-items:center;padding:0 10px;background:repeating-linear-gradient(0deg,#7d4426 0,#7d4426 8px,#884b29 8px,#884b29 16px);border-bottom:3px solid #2a160c;color:#fff0bd;text-shadow:2px 2px 0 #351b0f;font-weight:900;letter-spacing:.7px}
      .twish-header-title{font-size:14px;white-space:nowrap}.twish-header-sub{font-size:9px;opacity:.8;margin-left:7px;white-space:nowrap}
      .twish-shortcut-count{font-size:9px;margin-left:10px;color:#ffe6a6;white-space:nowrap;text-shadow:1px 1px 0 #351b0f}
      .twish-close{margin-left:auto;background:#a64d2d;color:#fff0bd;border:2px solid #2a160c;width:25px;height:25px;min-width:25px;padding:0;font-weight:900;font-size:14px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;text-align:center}
      .twish-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px;padding:6px;background:#5a321e;border-bottom:3px solid #2a160c;overflow:visible}
      .twish-tab{min-width:0;height:29px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:2px solid #2a160c;background:#9c592d;color:#ffe6a6;padding:4px 3px;font:700 9px/1 "Courier New",monospace;cursor:pointer;box-shadow:inset 0 0 0 1px #d99a4e;text-align:center;display:flex;align-items:center;justify-content:center}
      .twish-tab[data-active="true"]{background:#d09a4d;color:#2d190f}
      
      .twish-list{padding:10px;overflow-y:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;flex:1;min-height:0;align-content:start;background:linear-gradient(#efd9a8,#e2c184)}
      .twish-card{width:100%;min-width:0;display:grid;grid-template-columns:31px 1fr auto 27px;align-items:center;gap:7px;text-align:left;border:2px solid #6c3c22;background:#d2bd92;color:#594735;padding:6px;cursor:pointer;box-shadow:inset 0 0 0 1px #e4d3ae,2px 2px 0 #72553b;font-family:"Courier New",monospace;filter:saturate(.42);opacity:.72;transition:filter .1s,opacity .1s,background .1s,box-shadow .1s}
      .twish-card[data-quick-selected="true"]{background:#f4dfad;color:#3b2114;filter:none;opacity:1;border-color:#6c3c22;box-shadow:inset 0 0 0 2px #fff0c9,0 0 0 2px #d69a43,3px 3px 0 #6f4326}
      .twish-card[data-quick-selected="true"] .twish-card-icon{background:#b96d32;box-shadow:inset 0 0 0 1px #efbd62}
      .twish-card:hover{background:#ffe9b6;transform:translate(-1px,-1px);box-shadow:inset 0 0 0 1px #fff6dc,3px 3px 0 #8a5a31}
      .twish-card-icon{width:29px;height:29px;min-width:29px;min-height:29px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#9e5c31;border:2px solid #542d19;color:#fff;font-size:14px;line-height:1;font-family:"Segoe UI Emoji","Arial",sans-serif}
      .twish-card-main{min-width:0}.twish-card-name{display:block;font-weight:900;font-size:11px}.twish-card-desc{display:block;margin-top:2px;font-size:9px;line-height:1.2;color:#765038;white-space:normal}
      .twish-card-command{max-width:105px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:3px 4px;background:#5a321e;color:#ffe6a6;border:1px solid #2a160c;font-size:9px}
      .twish-favorite{width:25px;height:25px;padding:0;display:flex;align-items:center;justify-content:center;border:2px solid #6c3c22;background:#8b6747;color:#d9c39a;font-size:13px;line-height:1;cursor:pointer;filter:none}
      .twish-favorite:hover{background:#a77949;color:#fff0bd}
      .twish-favorite[data-selected="true"]{background:#d69a43;color:#fff4b8;border-color:#542d19;box-shadow:inset 0 0 0 1px #f6c96d}
      @media(max-width:700px){#${PANEL_ID}{width:min(94vw,600px);height:min(82vh,650px)}.twish-list{grid-template-columns:1fr}.twish-tabs{grid-template-columns:repeat(3,minmax(0,1fr))}} @media(max-width:340px){.twish-px-btn{width:31px;height:31px;min-width:31px}.twish-quick{grid-template-columns:repeat(7,31px);gap:2px}.twish-quick-empty{width:31px;height:31px}.twish-tabs{grid-template-columns:repeat(2,minmax(0,1fr))}.twish-card{grid-template-columns:29px 1fr}.twish-card-command{display:none}}
    `;
  }

  function makeQuickButton(item) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "twish-px-btn";
    b.setAttribute("aria-label", item.label);
    const tip = item.type ? item.label : item.command;
    b.innerHTML = `<span aria-hidden="true">${item.icon}</span><span class="twish-tip">${tip}</span>`;
    b.addEventListener("click", () => runAction(item));
    return b;
  }

  function renderGroup(panel, groupId) {
    const group = COMMAND_GROUPS.find(g => g.id === groupId) || COMMAND_GROUPS[0];
    panel.querySelectorAll(".twish-tab").forEach(t => t.dataset.active = String(t.dataset.group === group.id));
    const list = panel.querySelector(".twish-list");
    list.replaceChildren();

    group.commands.forEach(([icon, name, command, desc, type]) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "twish-card";
      const id = actionId(command, type, name);
      const selected = getQuickIds().includes(id);
      card.dataset.quickSelected = String(selected);
      const shown = ["inventory", "shop", "commands"].includes(type) ? "ABRIR ↗" : command;
      card.innerHTML = `<span class="twish-card-icon">${icon}</span><span class="twish-card-main"><span class="twish-card-name">${name}</span><span class="twish-card-desc">${desc}</span></span><span class="twish-card-command">${shown}</span><span class="twish-favorite" role="button" tabindex="0" aria-label="${selected ? "Remover dos" : "Adicionar aos"} atalhos rápidos" data-selected="${selected}">${selected ? "★" : "☆"}</span>`;
      const favorite = card.querySelector(".twish-favorite");
      const toggleFavorite = event => {
        event.preventDefault();
        event.stopPropagation();
        toggleQuickShortcut(id);
      };
      favorite.addEventListener("click", toggleFavorite);
      favorite.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") toggleFavorite(event);
      });
      card.addEventListener("click", () => {
        runAction({ command, type });
        if (!["inventory", "shop", "commands"].includes(type)) togglePanel(false);
      });
      list.appendChild(card);
    });
  }

  function togglePanel(force) {
    const panel = document.getElementById(PANEL_ID);
    const menu = document.querySelector(`#${ROOT_ID} .twish-menu-btn`);
    if (!panel) return;
    const next = typeof force === "boolean" ? force : panel.dataset.open !== "true";
    panel.dataset.open = String(next);
    if (menu) menu.dataset.active = String(next);
  }

  function buildPanel() {
    const panel = document.createElement("section");
    panel.id = PANEL_ID;
    panel.dataset.open = "false";
    panel.innerHTML = `
      <div class="twish-header">
        <span class="twish-header-title">TWISH • COMANDOS</span>
        <span class="twish-header-sub">atalhos de pesca</span>
        <span class="twish-shortcut-count"></span>
        <button type="button" class="twish-close" aria-label="Fechar">×</button>
      </div>
      <nav class="twish-tabs"></nav>
      <div class="twish-list"></div>
    `;
    panel.querySelector(".twish-close").addEventListener("click", () => togglePanel(false));
    const tabs = panel.querySelector(".twish-tabs");
    COMMAND_GROUPS.forEach(group => {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = "twish-tab";
      tab.dataset.group = group.id;
      tab.textContent = `${group.icon} ${group.label}`;
      tab.addEventListener("click", () => renderGroup(panel, group.id));
      tabs.appendChild(tab);
    });
    renderGroup(panel, COMMAND_GROUPS[0].id);
    return panel;
  }

  function findMountPoint() {
    const editor = findEditor();
    if (!editor) return null;
    const chatInput = editor.closest('[data-a-target="chat-input"]');
    if (chatInput?.parentElement) return chatInput.parentElement;

    let node = editor;
    for (let i = 0; i < 6 && node?.parentElement; i++, node = node.parentElement) {
      const rect = node.parentElement.getBoundingClientRect();
      if (rect.width >= 220 && rect.width <= 600) return node.parentElement;
    }
    return editor.parentElement;
  }

  function mount() {
    if (document.getElementById(ROOT_ID)) return;
    const orphanPanel = document.getElementById(PANEL_ID);
    if (orphanPanel) orphanPanel.remove();
    const mountPoint = findMountPoint();
    if (!mountPoint) return;

    const style = document.createElement("style");
    style.dataset.twishCommandsV2 = "true";
    style.textContent = css();
    document.head.appendChild(style);

    const root = document.createElement("div");
    root.id = ROOT_ID;
    const quick = document.createElement("div");
    quick.className = "twish-quick";

    const panel = buildPanel();
    document.body.appendChild(panel);
    root.appendChild(quick);
    mountPoint.insertBefore(root, mountPoint.firstChild);
    renderQuickBar();
  }

  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const root = document.getElementById(ROOT_ID);
      if (root && !root.isConnected) root.remove();
      mount();
    });
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  mount();
})();