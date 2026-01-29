let tapLocked = false;

// Unités de mesure — Q/R
// - Questions au hasard (deck) ; épuisement ; retour accueil
// - A × B : seul A et B en gras (× non gras)
// - Deuxième ligne des questions : jamais en gras
// - Deuxième ligne des réponses : contenu en italique (sans parenthèses)

const DATA = [
  {
    "q1": "Newton",
    "q2": "(N)",
    "a1": "Force",
    "a2_html": "(<span class=\"italic\">F</span>)"
  },
  {
    "q1": "Coulomb",
    "q2": "(C)",
    "a1": "Charge",
    "a2_html": "(<span class=\"italic\">Q</span>)"
  },
  {
    "q1": "Ampère-heure",
    "q2": "(Ah)",
    "a1": "Charge",
    "a2_html": "(<span class=\"italic\">Q</span>)"
  },
  {
    "q1": "Ampère",
    "q2": "(A)",
    "a1": "Courant",
    "a2_html": "(<span class=\"italic\">I</span>)"
  },
  {
    "q1": "Volt",
    "q2": "(V)",
    "a1": "Tension",
    "a2_html": "(<span class=\"italic\">T</span>)"
  },
  {
    "q1": "Volt x Ampère",
    "q2": "",
    "a1": "Watt",
    "a2_html": ""
  },
  {
    "q1": "Watt x heure",
    "q2": "",
    "a1": "Wh",
    "a2_html": ""
  },
{
    "q1": "Ampère x heure",
    "q2": "",
    "a1": "Ah",
    "a2_html": ""
  },
  {
    "q1": "Joule",
    "q2": "(J)",
    "a1": "Énergie",
    "a2_html": "(<span class=\"italic\">E</span>)"
  },
  {
    "q1": "Watt-heure",
    "q2": "(Wh)",
    "a1": "Énergie",
    "a2_html": "(<span class=\"italic\">E</span>)"
  },
  {
    "q1": "Kilogramme",
    "q2": "(kg)",
    "a1": "Masse",
    "a2_html": "(<span class=\"italic\">m</span>)"
  },
  {
    "q1": "Watt",
    "q2": "(W)",
    "a1": "Puissance",
    "a2_html": "(<span class=\"italic\">P</span>)"
  }
];

const card = document.getElementById("card");
const el = document.getElementById("content");

const state = {
  mode: "home", // "home" | "question" | "answer"
  order: [],
  pos: 0,
  i: 0
};

// Dim global (QUESTION → RÉPONSE)
async function playTransitionQA(){
  document.body.classList.add("flash-answer");
  await new Promise(r => setTimeout(r, 140));
  document.body.classList.remove("flash-answer");
}

function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startSession(){
  state.order = shuffle([...Array(DATA.length).keys()]);
  state.pos = 0;
  state.i = state.order[0] ?? 0;
}

function nextIndex(){
  state.pos += 1;
  if (state.pos >= state.order.length) {
    state.mode = "home";
    renderAndFit();
    return null;
  }
  state.i = state.order[state.pos];
  return state.i;
}

function esc(s){
  return (s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function renderExprBoldNoOp(s){
  // Rend:
  // - "A x B" ou "A × B" : A et B en gras, × non gras
  // - "A-heure" (ou tout composé avec "-") : mots en gras, trait d’union non gras
  const txt = (s ?? "").trim();
  if (!txt) return "";

  // 1) Multiplication (espaces autour)
  const mulParts = txt.split(/\s+[x×]\s+/);
  if (mulParts.length > 1){
    let html = `<span class="qb">${esc(mulParts[0])}</span>`;
    for (let k = 1; k < mulParts.length; k++){
      html += ` <span class="mult">×</span> <span class="qb">${esc(mulParts[k])}</span>`;
    }
    return html;
  }

  // 2) Composés avec trait d'union (sans espaces)
  const hyParts = txt.split(/-/);
  if (hyParts.length > 1){
    let html = `<span class="qb">${esc(hyParts[0])}</span>`;
    for (let k = 1; k < hyParts.length; k++){
      html += `<span class="hyph">-</span><span class="qb">${esc(hyParts[k])}</span>`;
    }
    return html;
  }

  // 3) Texte simple
  return `<span class="qb">${esc(txt)}</span>`;
}

function fitTextToCircle(){
  const circle = document.querySelector(".circle");
  const content = document.getElementById("content");
  if (!circle || !content) return;

  // Available inner box of the circle (minus padding)
  const cs = getComputedStyle(circle);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  let availW = circle.clientWidth - padX;
  let availH = circle.clientHeight - padY;

  // Safety margin so glyphs don't get clipped by the circle edge
  availW = Math.max(0, availW * 0.92);
  availH = Math.max(0, availH * 0.92);

  // Make content take the measured box so scrollWidth/clientWidth are meaningful
  content.style.maxWidth = Math.floor(availW) + "px";
  content.style.maxHeight = Math.floor(availH) + "px";

  const lines = content.querySelectorAll(".q-line1,.q-line2,.a-line1,.a-line2");
  // Reset to CSS sizes
  lines.forEach(el => { el.style.fontSize = ""; });

  const isOverflowing = () => {
    if (content.scrollHeight > availH + 0.5) return true;
    for (const el of lines) {
      // +0.5 avoids false positives from subpixel rounding
      if (el.scrollWidth > el.clientWidth + 0.5) return true;
    }
    return false;
  };

  let k = 0;
  while (k < 40 && isOverflowing()) {
    lines.forEach(el => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      const next = Math.max(16, fs * 0.94);
      el.style.fontSize = next + "px";
    });
    k++;
  }
}

function render(){
  card.classList.remove("home","question","answer");
  card.classList.add(state.mode);

  if (state.mode === "home") return;

  const item = DATA[state.i] || {};

  if (state.mode === "question") {
    const q1 = renderExprBoldNoOp(item.q1);
    const q2 = (item.q2 ?? "").trim();
    el.innerHTML = `
      <div class="q-line1">${q1}</div>
      ${q2 ? `<div class="q-line2">${esc(q2)}</div>` : ""}
    `;
    requestAnimationFrame(fitTextToCircle);
    return;
  }

  // answer
  const a1 = esc(item.a1 ?? "");
  const a2 = (item.a2_html ?? "").trim();
  el.innerHTML = `
    <div class="a-line1">${a1}</div>
    ${a2 ? `<div class="a-line2">${a2}</div>` : ""}
  `;
  requestAnimationFrame(fitTextToCircle);
}


// ===== Auto-fit robuste (indépendant de la taille d'écran) =====
function fitToCircle(){
  const circle = document.querySelector(".circle");
  const content = document.getElementById("content");
  if(!circle || !content) return;

  // reset transform before measuring
  content.style.transform = "none";
  content.style.transformOrigin = "50% 50%";

  const cs = getComputedStyle(circle);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

  // marge de sécurité pour éviter le clipping sur bord circulaire
  const availW = (circle.clientWidth - padX) * 0.92;
  const availH = (circle.clientHeight - padY) * 0.92;

  const lines = content.querySelectorAll(".q-line1,.q-line2,.a-line1,.a-line2");
  if(!lines.length) return;

  // Largeur requise réelle (shrink-wrap des lignes)
  let neededW = 0;
  lines.forEach(l => { neededW = Math.max(neededW, l.scrollWidth); });

  const neededH = content.scrollHeight;

  // scale pour rentrer en largeur ET hauteur
  let s = 1;
  if(neededW > 0) s = Math.min(s, availW / neededW);
  if(neededH > 0) s = Math.min(s, availH / neededH);

  // clamp + tiny safety
  s = Math.max(0.5, Math.min(1, s)) * 0.99;

  content.style.transform = `translateZ(0) scale(${s})`;
}

function renderAndFit(){
  renderAndFit();
  // 1) après layout
  requestAnimationFrame(() => {
    fitToCircle();
    // 2) après que les polices soient prêtes (iOS peut changer la largeur après swap)
    if (document.fonts && document.fonts.ready){
      document.fonts.ready.then(() => requestAnimationFrame(fitToCircle)).catch(()=>{});
    }
  });
}

async function handleTap(){
  if (tapLocked) return;
  tapLocked = true;

  try {
    if (state.mode === "home"){
      startSession();
      state.mode = "question";
      renderAndFit();
      return;
    }

    if (state.mode === "question"){
      await playTransitionQA();
      state.mode = "answer";
      renderAndFit();
      return;
    }

    const nxt = nextIndex();
    if (nxt === null) return;
    state.mode = "question";
    renderAndFit();
  } finally {
    setTimeout(() => {
      tapLocked = false;
    }, 250);
  }
}


if (typeof window !== "undefined") {
  window.addEventListener("resize", () => requestAnimationFrame(fitTextToCircle), { passive: true });
  window.addEventListener("orientationchange", () => requestAnimationFrame(fitTextToCircle), { passive: true });

  // When fonts finish loading, refit (important on iOS)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => requestAnimationFrame(fitTextToCircle)).catch(() => {});
  }
}

card.addEventListener("pointerup", (e) => {
  e.preventDefault();
  handleTap().catch(console.error);
});

renderAndFit();