/* =====================================================
   FELIZ CUMPLE · Windows XP + MSN Messenger  ·  Lógica
   ===================================================== */

const K_MUTE = "felizcumple:mute";

const cfg = window.MSN_CONFIG || {};
// "me" por defecto (antes de que alguien se identifique) — se guarda
// aparte para poder restaurarlo al pulsar "reiniciar"
const defaultMe = Object.assign({}, cfg.me);
const defaultPersonalMessage = cfg.contact?.personalMessage || "";

const el = {
  window:     document.getElementById("msnWindow"),
  titleText:  document.getElementById("titleText"),
  toName:     document.getElementById("toName"),
  toStatus:   document.getElementById("toStatus"),
  toPersonal: document.getElementById("toPersonal"),
  log:        document.getElementById("msnLog"),
  typing:     document.getElementById("typingIndicator"),
  compose:    document.getElementById("composeArea"),
  sendBtn:    document.getElementById("sendBtn"),
  quickReplies: document.getElementById("quickReplies"),
  contactPhoto: document.getElementById("contactPhoto"),
  contactLabel: document.getElementById("contactLabel"),
  mePhoto:    document.getElementById("mePhoto"),
  meLabel:    document.getElementById("meLabel"),
  status:     document.getElementById("statusText"),
  mute:       document.getElementById("muteBtn"),
  clock:      document.getElementById("clock"),
  nudgeFlash: document.getElementById("nudgeFlash"),
  confettiLayer: document.getElementById("confettiLayer"),
  replayBtn:  document.getElementById("replayBtn"),
  decoModalOverlay: document.getElementById("decoModalOverlay"),
  decoModalClose:   document.getElementById("decoModalClose"),
  decoModalOk:      document.getElementById("decoModalOk"),
  decoModalTitleText: document.getElementById("decoModalTitleText"),
  taskbarLabel:     document.getElementById("taskbarLabel"),
};

let muted = localStorage.getItem(K_MUTE) === "1";
let currentNodeId = null;
let awaitingInput = false;

// =====================================================
//  SONIDO — estilo MSN / Windows (ondas sine)
// =====================================================
let audioCtx = null;
function getCtx() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, dur, vol = 0.07) {
  if (muted) return;
  try {
    const ctx = getCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + dur);
  } catch (e) {}
}

function playClick() {
  if (muted) return;
  try {
    const ctx = getCtx();
    const dur = 0.012;
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.035, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(g); g.connect(ctx.destination);
    src.start();
  } catch (e) {}
}

// Notificación "nuevo mensaje": audio real si hay uno configurado,
// si no, dos notas sintéticas ascendentes de repuesto
let messageAudio = null;
function getMessageAudio() {
  if (!messageAudio && cfg.sounds?.message) {
    messageAudio = new Audio(cfg.sounds.message);
    messageAudio.preload = "auto";
  }
  return messageAudio;
}

function msnNotify() {
  if (muted) return;
  const audio = getMessageAudio();
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    return;
  }
  playTone(587, 0.16);
  setTimeout(() => playTone(880, 0.22), 140);
}

// Nudge / zumbido: audio real si hay uno configurado (devuelve el
// elemento para poder sincronizar la animación con su duración),
// si no, dos notas sintéticas graves de repuesto
let nudgeAudio = null;
function getNudgeAudio() {
  if (!nudgeAudio && cfg.sounds?.nudge) {
    nudgeAudio = new Audio(cfg.sounds.nudge);
    nudgeAudio.preload = "auto";
  }
  return nudgeAudio;
}

function nudgeSound() {
  if (muted) return null;
  const audio = getNudgeAudio();
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    return audio;
  }
  playTone(220, 0.12, 0.09);
  setTimeout(() => playTone(180, 0.16, 0.09), 90);
  return null;
}

// Ding de celebración (nodo con celebrate: true)
function windowsDing() {
  playTone(800, 0.45, 0.06);
  setTimeout(() => playTone(1200, 0.5, 0.05), 160);
}

function windowsClick() {
  playTone(1000, 0.12, 0.04);
}

// =====================================================
//  RELOJ
// =====================================================
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  el.clock.textContent = `${h}:${m}`;
}

// =====================================================
//  AVATARES
// =====================================================
function renderAvatar(target, person) {
  target.innerHTML = "";
  if (person.photo) {
    const img = document.createElement("img");
    img.src = person.photo;
    img.alt = person.name || "";
    target.appendChild(img);
  } else {
    const span = document.createElement("span");
    span.textContent = person.kaomoji || "(｡•ᴗ•｡)";
    span.style.fontSize = "13px";
    span.style.textAlign = "center";
    span.style.padding = "2px";
    target.appendChild(span);
  }
}

// =====================================================
//  IDENTIFICACIÓN DEL INVITAD@ ("¿quién eres?")
// =====================================================
function matchPerson(text) {
  const norm = normalize(text);
  return (cfg.people || []).find((p) =>
    (p.keywords || []).some((k) => norm.includes(normalize(k)))
  );
}

function applyIdentity(person) {
  cfg.me = Object.assign({}, cfg.me, {
    name: person.name || cfg.me?.name,
    photo: person.photo !== undefined ? person.photo : (cfg.me?.photo ?? null),
    kaomoji: person.kaomoji || cfg.me?.kaomoji,
  });
  renderAvatar(el.mePhoto, cfg.me);
  el.meLabel.textContent = cfg.me.name;

  // Si esta persona tiene su propio "mensaje personal", sustituye al
  // genérico de contact.personalMessage (el de "tramando algo...")
  if (person.personalMessage) {
    el.toPersonal.textContent = person.personalMessage;
  }
}

// =====================================================
//  ARRANQUE
// =====================================================
function init() {
  updateMuteLabel();
  updateClock();
  setInterval(updateClock, 10000);

  const contact = cfg.contact || { name: "Persona especial", kaomoji: "(｡◕‿◕｡)" };
  const me = cfg.me || { name: "Tú", kaomoji: "(ﾉ◕ヮ◕)ﾉ" };

  el.titleText.textContent = cfg.meta?.windowTitle || "Conversación — MSN Messenger";
  const pageTitle = cfg.meta?.pageTitle || "feliz_cumple.exe";
  document.title = pageTitle;
  el.decoModalTitleText.textContent = pageTitle;
  el.taskbarLabel.textContent = pageTitle;
  // En esta línea concreta no queremos el "✎" decorativo del nombre
  // (sí se sigue mostrando en el log de mensajes y en el panel de fotos)
  el.toName.textContent = contact.name.replace(/\s*✎\s*$/, "").trim();
  el.toStatus.textContent = contact.status || "";
  el.toPersonal.textContent = contact.personalMessage || "";

  renderAvatar(el.contactPhoto, contact);
  el.contactLabel.textContent = contact.name;
  renderAvatar(el.mePhoto, me);
  el.meLabel.textContent = me.name;

  el.status.textContent = contact.statusMsg || "En línea";

  el.mute.addEventListener("click", toggleMute);
  el.replayBtn.addEventListener("click", restart);
  el.sendBtn.addEventListener("click", handleSend);
  el.compose.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  // Chrome decorativo (menú, barra de herramientas, ventana, "Para:"…):
  // no hace nada salvo recordarte que sigues en la conversación
  el.window.addEventListener("click", (e) => {
    if (e.target.closest(".deco-btn")) showDecoModal();
  });
  el.decoModalClose.addEventListener("click", hideDecoModal);
  el.decoModalOk.addEventListener("click", hideDecoModal);
  el.decoModalOverlay.addEventListener("click", (e) => {
    if (e.target === el.decoModalOverlay) hideDecoModal();
  });

  // El navegador exige interacción para activar audio: arrancamos al primer toque
  // (esto también precarga la duración real de cada audio, para poder
  // sincronizar la animación del nudge con su sonido)
  const startOnce = () => {
    getCtx();
    [getMessageAudio(), getNudgeAudio()].forEach((audio) => {
      if (audio) {
        audio.play().then(() => { audio.pause(); audio.currentTime = 0; }).catch(() => {});
      }
    });
    document.removeEventListener("click", startOnce);
    document.removeEventListener("touchstart", startOnce);
  };
  document.addEventListener("click", startOnce, { once: true });
  document.addEventListener("touchstart", startOnce, { once: true });

  enterNode(cfg.startNode || "start");
}

// =====================================================
//  MOTOR DE FLUJO (árbol de decisión)
// =====================================================
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

function interpolate(text) {
  return String(text).replace(/\{\{event\.(\w+)\}\}/g, (_, key) => (cfg.event && cfg.event[key]) || "");
}

async function enterNode(nodeId) {
  const node = (cfg.flow || {})[nodeId];
  if (!node) return;
  currentNodeId = nodeId;
  awaitingInput = false;
  setInputEnabled(false);
  hideQuickReplies();

  for (const m of node.bot || []) {
    showTyping(cfg.contact?.name, m.typingMs || 1200);
    await sleep(m.typingMs || 1200);
    hideTyping();

    appendMessage(cfg.contact?.name, interpolate(m.text), false);
    msnNotify();

    if (m.nudge) {
      await sleep(150);
      triggerNudge();
    }
    await sleep(280);
  }

  if (node.celebrate) {
    windowsDing();
    spawnConfetti();
  }

  if (Array.isArray(node.options) && node.options.length) {
    renderQuickReplies(node.options);
    setInputEnabled(true);
    awaitingInput = true;
    el.status.textContent = "Escribe una respuesta o toca una opción.";
  } else if (nodeId === cfg.identifyNode) {
    // Nodo de identificación: sin chips, solo espera texto libre
    // (se compara contra cfg.people en handleSend)
    setInputEnabled(true);
    awaitingInput = true;
    el.status.textContent = "Escribe tu respuesta.";
  } else if (node.next) {
    await sleep(500);
    enterNode(node.next);
  } else {
    el.status.textContent = "Fin de la conversación.";
    el.compose.placeholder = "(fin de la conversación — pulsa ↻ para reiniciar)";
  }
}

function normalize(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function matchKeyword(text, options) {
  const norm = normalize(text);
  let wildcardGoto = null;
  for (const opt of options) {
    if (opt.keywords.includes("*")) {
      wildcardGoto = opt.goto;
      continue;
    }
    if (opt.keywords.some(k => norm.includes(normalize(k)))) return opt.goto;
  }
  return wildcardGoto;
}

function handleSend() {
  if (!awaitingInput) return;
  const raw = el.compose.value.trim();
  if (!raw) return;

  const node = (cfg.flow || {})[currentNodeId];
  appendMessage(cfg.me?.name, raw, true);
  el.compose.value = "";
  windowsClick();
  awaitingInput = false;
  setInputEnabled(false);
  hideQuickReplies();

  if (currentNodeId === cfg.identifyNode) {
    const person = matchPerson(raw);
    setTimeout(async () => {
      if (person) {
        applyIdentity(person);
        enterNode(person.entryNode || cfg.afterIdentifyNode || "start");
        return;
      }
      const fb = node.fallback || cfg.fallback;
      if (fb) {
        showTyping(cfg.contact?.name, fb.typingMs || 900);
        await sleep(fb.typingMs || 900);
        hideTyping();
        appendMessage(cfg.contact?.name, interpolate(fb.text), false);
        msnNotify();
      }
      setInputEnabled(true);
      awaitingInput = true;
    }, 300);
    return;
  }

  const goto = matchKeyword(raw, node.options || []);

  setTimeout(async () => {
    if (goto) {
      enterNode(goto);
    } else {
      const fb = node.fallback || cfg.fallback;
      if (fb) {
        showTyping(cfg.contact?.name, fb.typingMs || 900);
        await sleep(fb.typingMs || 900);
        hideTyping();
        appendMessage(cfg.contact?.name, interpolate(fb.text), false);
        msnNotify();
      }
      renderQuickReplies(node.options || []);
      setInputEnabled(true);
      awaitingInput = true;
    }
  }, 300);
}

function sendReply(label, goto) {
  if (!awaitingInput) return;
  appendMessage(cfg.me?.name, label, true);
  el.compose.value = "";
  windowsClick();
  awaitingInput = false;
  setInputEnabled(false);
  hideQuickReplies();
  setTimeout(() => enterNode(goto), 300);
}

function renderQuickReplies(options) {
  el.quickReplies.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "qbtn";
    btn.textContent = opt.label;
    btn.addEventListener("click", () => sendReply(opt.label, opt.goto));
    el.quickReplies.appendChild(btn);
  });
  el.quickReplies.classList.add("active");
}

function hideQuickReplies() {
  el.quickReplies.innerHTML = "";
  el.quickReplies.classList.remove("active");
}

function setInputEnabled(enabled) {
  el.compose.disabled = !enabled;
  el.sendBtn.classList.toggle("disabled", !enabled);
  if (enabled) el.compose.placeholder = "Escribe aquí…";
}

function showTyping(name, duration) {
  el.typing.classList.add("active");
  el.typing.textContent = `${name} está escribiendo…`;
}
function hideTyping() {
  el.typing.classList.remove("active");
  el.typing.textContent = "";
}

function appendMessage(name, text, isMe) {
  const wrap = document.createElement("div");
  wrap.className = "msg " + (isMe ? "from-me" : "from-contact");

  const nameEl = document.createElement("div");
  nameEl.className = "msg-name";
  nameEl.textContent = name;

  const textEl = document.createElement("div");
  textEl.className = "msg-text";
  textEl.textContent = text;

  wrap.appendChild(nameEl);
  wrap.appendChild(textEl);
  el.log.appendChild(wrap);
  el.log.scrollTop = el.log.scrollHeight;
}

// =====================================================
//  NUDGE (zumbido)
// =====================================================
function triggerNudge() {
  const audio = nudgeSound();
  el.window.classList.add("nudge");
  el.nudgeFlash.classList.add("flash");
  // la ventana tiembla mientras dure el audio real; si no hay audio
  // (sintético o silenciado), usa la duración corta de siempre
  const fallbackMs = audio ? 1870 : 400;
  const durationMs = (audio && audio.duration && !isNaN(audio.duration))
    ? audio.duration * 1000
    : fallbackMs;
  setTimeout(() => {
    el.window.classList.remove("nudge");
    el.nudgeFlash.classList.remove("flash");
  }, durationMs);
}

// =====================================================
//  AVISO DE "ESO NO HACE NADA"
// =====================================================
function showDecoModal() {
  el.decoModalOverlay.classList.add("active");
}
function hideDecoModal() {
  el.decoModalOverlay.classList.remove("active");
}

// =====================================================
//  CONFETI (dentro de la propia ventana, sin overlay)
// =====================================================
function spawnConfetti() {
  const symbols = ["✦", "✎", "♪", "❀", "✧", "•"];
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      piece.style.left = Math.random() * 100 + "%";
      piece.style.top = "-10px";
      piece.style.animationDuration = (1.4 + Math.random() * 1.2) + "s";
      el.confettiLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 3000);
    }, i * 90);
  }
}

// =====================================================
//  REINICIAR
// =====================================================
function restart() {
  windowsClick();
  el.log.innerHTML = "";
  el.confettiLayer.innerHTML = "";
  hideQuickReplies();
  el.compose.placeholder = "Escribe aquí…";
  // vuelve a "me" genérico — hay que identificarse otra vez
  cfg.me = Object.assign({}, defaultMe);
  renderAvatar(el.mePhoto, cfg.me);
  el.meLabel.textContent = cfg.me.name;
  el.toPersonal.textContent = defaultPersonalMessage;
  enterNode(cfg.startNode || "start");
}

// =====================================================
//  MUTE
// =====================================================
function toggleMute() {
  muted = !muted;
  localStorage.setItem(K_MUTE, muted ? "1" : "0");
  updateMuteLabel();
  if (!muted) windowsClick();
}
function updateMuteLabel() {
  el.mute.textContent = muted ? "(-_-)zzz" : "♪ ON";
}

init();
