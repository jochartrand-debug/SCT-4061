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
    render();
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

  // Inner available box (minus padding)
  const cs = getComputedStyle(circle);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

  // Safety margin so glyphs don't get clipped by the circle edge
  const availW = Math.max(0, (circle.clientWidth - padX) * 0.92);
  const availH = Math.max(0, (circle.clientHeight - padY) * 0.92);

  // Constrain the content box so scrollWidth/clientWidth comparisons are meaningful
  content.style.maxWidth  = Math.floor(availW) + "px";
  content.style.maxHeight = Math.floor(availH) + "px";

  const line1 = content.querySelector(".q-line1,.a-line1");
  const line2 = content.querySelector(".q-line2,.a-line2");
  if (!line1) return;

  // Reset to CSS sizes
  line1.style.fontSize = "";
  if (line2) line2.style.fontSize = "";

  const base1 = parseFloat(getComputedStyle(line1).fontSize);
  const base2 = line2 ? parseFloat(getComputedStyle(line2).fontSize) : 0;

  const isOverflowing = () => {
    // Height overflow
    if (content.scrollHeight > availH + 0.5) return true;

    // Line 1 is the only hard width constraint (nowrap titles)
    if (line1.scrollWidth > line1.clientWidth + 0.5) return true;

    // Line 2 should not trigger autoshrink (it can wrap / it’s short like (Ah))
    // BUT if it is explicitly nowrap somewhere, this still protects it from cropping:
    if (line2 && line2.scrollWidth > line2.clientWidth + 0.5) return true;

    return false;
  };

  let k = 0;
  while (k < 50 && isOverflowing()) {
    const fs1 = parseFloat(getComputedStyle(line1).fontSize);

    // Shrink line 1 first (most constrained)
    const next1 = Math.max(20, fs1 * 0.94);
    line1.style.fontSize = next1 + "px";

    // Keep line 2 readable: never below 75% of line 1, and never above its base size
    if (line2) {
      const min2 = next1 * 0.75;
      const desired2 = Math.min(base2, Math.max(min2, parseFloat(getComputedStyle(line2).fontSize)));
      line2.style.fontSize = desired2 + "px";
    }

    // If line 1 already hit minimum and we still overflow (rare: very small screens),
    // then gently scale both down together, but still protect line 2.
    if (next1 <= 20.01 && isOverflowing()) {
      const next1b = Math.max(18, next1 * 0.96);
      line1.style.fontSize = next1b + "px";
      if (line2) {
        const min2b = next1b * 0.75;
        line2.style.fontSize = Math.max(16, Math.min(base2, min2b)) + "px";
      }
    }

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

async function handleTap(){
  if (tapLocked) return;
  tapLocked = true;

  try {
    if (state.mode === "home"){
      startSession();
      state.mode = "question";
      render();
      return;
    }

    if (state.mode === "question"){
      await playTransitionQA();
      state.mode = "answer";
      render();
      return;
    }

    const nxt = nextIndex();
    if (nxt === null) return;
    state.mode = "question";
    render();

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

render();
