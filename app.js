let tapLocked = false;

// Unités de mesure — Q/R
// - Questions au hasard (deck) ; épuisement ; retour accueil
// - A × B : seul A et B en gras (× non gras)
// - Deuxième ligne des questions : jamais en gras
// - Deuxième ligne des réponses : contenu en italique (sans parenthèses)

const DATA = [
  {
    "q1": "newton",
    "q2": "(N)",
    "a1": "Force",
    "a2_html": "(<span class=\"italic\">F</span>)"
  },
{
    "q1": "Identité",
    "q2": "d'un atome",
    "a1": "Quantité",
    "a2": "de protons"
  },
{
    "q1": "Grain",
    "q2": "d'électricité",
    "a1": "Électron",
    "a2": ""
  },
{
    "q1": "Quantité",
    "q2": "d'électricité",
    "a1": "Charge",
    "a2": ""
  },
{
    "q1": "Quantité",
    "q2": "de matière",
    "a1": "Masse",
    "a2": ""
  },
{
    "q1": "Qualité",
    "q2": "particulière",
    "a1": "Charge",
    "a2": ""
  },
{
    "q1": "Qualité",
    "q2": "universelle",
    "a1": "Masse",
    "a2": ""
  },
{
    "q1": "3 600 coulombs",
    "q2": "(3 600 C)",
    "a1": "1  ampère-heure",
    "a2": "(1 Ah)"
  },
{
    "q1": "3 600 joules",
    "q2": "(3 600 J)",
    "a1": "1  watt-heure",
    "a2": "(1 Wh)"
  },
{
    "q1": "3 600 secondes",
    "q2": "(3 600 s)",
    "a1": "1  heure",
    "a2": "(1 h)"
  },
{
    "q1": "kilo",
    "q2": "(k)",
    "a1_html": "10<sup>3</sup>",
    "a2_html": ""
  },
{
    "q1": "milli",
    "q2": "(m)",
    "a1_html": "10<sup>-3</sup>",
    "a2_html": ""
  },
{
    "q1": "Méga",
    "q2": "(M)",
    "a1_html": "10<sup>6</sup>",
    "a2_html": ""
  },
{
    "q1": "Giga",
    "q2": "(G)",
    "a1_html": "10<sup>9</sup>",
    "a2_html": ""
  },
{
    "q1": "Micro",
    "q2": "(µ)",
    "a1_html": "10<sup>-6</sup>",
    "a2_html": ""
  },
{
    "q1": "Tera",
    "q2": "(T)",
    "a1_html": "10<sup>12</sup>",
    "a2_html": ""
  },
{
    "q1": "Nano",
    "q2": "(n)",
    "a1_html": "10<sup>-9</sup>",
    "a2_html": ""
  },
{
    "q1": "Pico",
    "q2": "(p)",
    "a1_html": "10<sup>-12</sup>",
    "a2_html": ""
  },
  {
    "q1": "coulomb",
    "q2": "(C)",
    "a1": "Charge",
    "a2_html": "(<span class=\"italic\">q</span>)"
  },
  {
    "q1": "ampère-heure",
    "q2": "(Ah)",
    "a1": "Charge",
    "a2_html": "(<span class=\"italic\">q</span>)"
  },
  {
    "q1": "ampère",
    "q2": "(A)",
    "a1": "Courant",
    "a2_html": "(<span class=\"italic\">I</span>)"
  },
  {
    "q1": "volt",
    "q2": "(V)",
    "a1": "Tension",
    "a2_html": "(<span class=\"italic\">T</span>)"
  },
  {
    "q1": "volt × ampère",
    "q2": "",
    "a1": "watt",
    "a2_html": ""
  },
  {
    "q1": "watt × heure",
    "q2": "",
    "a1": "Wh",
    "a2_html": ""
  },
{
    "q1": "coulomb/seconde",
    "q2": "",
    "a1": "ampère",
    "a2_html": ""
  },
{
    "q1": "joule/seconde",
    "q2": "",
    "a1": "watt",
    "a2_html": ""
  },
{
    "q1": "m/s",
    "q2": "",
    "a1": "Vitesse",
    "a2_html": ""
  },
{
    "q1": "m³/s",
    "q2": "",
    "a1": "Débit",
    "a2": "volumique"
  },
{
    "q1": "J/s",
    "q2": "",
    "a1": "Débit",
    "a2": "d'énergie"
  },
{
    "q1": "C/s",
    "q2": "",
    "a1": "Débit",
    "a2": "de charge"
  },
{
    "q1": "kg/s",
    "q2": "",
    "a1": "Débit",
    "a2": "massique"
  },
{
    "q1": "Distance/Temps",
    "q2": "",
    "a1": "Vitesse",
    "a2_html": ""
  },
{
    "q1": "watt × seconde",
    "q2": "",
    "a1": "joule",
    "a2_html": ""
  },
{
    "q1": "ampère × heure",
    "q2": "",
    "a1": "Ah",
    "a2_html": ""
  },
  {
    "q1": "joule",
    "q2": "(J)",
    "a1": "Énergie",
    "a2_html": "(<span class=\"italic\">E</span>)"
  },
  {
    "q1": "watt-heure",
    "q2": "(Wh)",
    "a1": "Énergie",
    "a2_html": "(<span class=\"italic\">E</span>)"
  },
  {
    "q1": "kilogramme",
    "q2": "(kg)",
    "a1": "Masse",
    "a2_html": "(<span class=\"italic\">m</span>)"
  },
  {
    "q1": "watt",
    "q2": "(W)",
    "a1": "Puissance",
    "a2_html": "(<span class=\"italic\">P</span>)"
  },
 {
    "q1": "mètre",
    "q2": "(m)",
    "a1": "Distance",
    "a2_html": "(<span class=\"italic\">d</span>)"
  },{
    "q1": "seconde",
    "q2": "(s)",
    "a1": "Temps",
    "a2_html": "(<span class=\"italic\">t</span>)"
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
    
// === Anti "rebondissement" iOS (rubber band) ===
// L'app n'a pas de scroll : on bloque le scroll natif pour empêcher l'effet de rebond.
// (nécessaire sur iOS, où overscroll-behavior n'est pas toujours respecté)
document.addEventListener("touchmove", (e) => {
  if (e.cancelable) e.preventDefault();
}, { passive: false });

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

function htmlToText(s){
  const div = document.createElement("div");
  div.innerHTML = (s ?? "").toString();
  return (div.textContent || "").trim();
}

function renderLine1HTML(s){
  // Option B: fraction empilée si exactement un "/" (ex: coulomb/seconde)
  const txt = htmlToText(s);
  // Cas spécial: on veut afficher "m/s" en une seule ligne (pas en fraction empilée)

const t = txt.trim().toLowerCase();

const oneLineUnits = new Set([
  "m/s",
  "c/s",
  "kg/s",
  "m³/s",
  "j/s",
]);

if (oneLineUnits.has(t)) {
  const [num, den] = txt.trim().split("/");
  return `<span class="qb">${num}</span><span class="op slash">/</span><span class="qb">${den}</span>`;
}



  const parts = txt.split("/");
  if(parts.length === 2 && parts[0].trim() && parts[1].trim()){
    return `<span class="frac"><span class="num qb">${esc(parts[0].trim())}</span><span class="bar"></span><span class="den qb">${esc(parts[1].trim())}</span></span>`;
  }

  // Sinon: mots en gras, opérateurs × ÷ - non gras, sans ajouter d'espaces
  let out = "";
  let buf = "";
  const flush = () => {
    if(buf){
      out += `<span class="qb">${esc(buf)}</span>`;
      buf = "";
    }
  };

  for(let i=0;i<txt.length;i++){
    const ch = txt[i];
    if(ch === "×" || ch === "÷" || ch === "-"){
      flush();
      out += `<span class="op${ch==="-" ? " hyph":""}">${ch}</span>`;
    }else{
      buf += ch;
    }
  }
  flush();
  return out || `<span class="qb">${esc(txt)}</span>`;
}


function renderExprBoldNoOp(s){
  // Rend:
  // - "A x B" ou "A × B" : A et B en gras, × non gras
  // - "A-heure" (ou tout composé avec "-") : mots en gras, trait d’union non gras
  const txt = (s ?? "").trim();
  // Normalise multiplication sans casser des mots (ex: "Lux")
  const norm = txt
    .replace(/([^\s])×([^\s])/g, "$1 × $2")
    .replace(/([A-Za-zÀ-ÖØ-öø-ÿ])x([A-Za-zÀ-ÖØ-öø-ÿ])/g, "$1 × $2")
    .replace(/\s+[x×]\s+/g, " × ")
    .replace(/\s+/g, " ")
    .trim();

  if (!txt) return "";

  // 1) Multiplication (espaces autour)
  const mulParts = norm.split(/\s+×\s+/);
  if (mulParts.length > 1){
    let html = `<span class="qb">${esc(mulParts[0])}</span>`;
    for (let k = 1; k < mulParts.length; k++){
      html += ` <span class="mult">×</span> <span class="qb">${esc(mulParts[k])}</span>`;
    }
    return html;
  }

  // 2) Composés avec trait d'union (sans espaces)
  const hyParts = norm.split(/-/);
  if (hyParts.length > 1){
    let html = `<span class="qb">${esc(hyParts[0])}</span>`;
    for (let k = 1; k < hyParts.length; k++){
      html += `<span class="hyph">-</span><span class="qb">${esc(hyParts[k])}</span>`;
    }
    return html;
  }

  // 3) Texte simple
  return `<span class="qb">${esc(norm)}</span>`;
}

function render(){
  card.classList.remove("home","question","answer");
  card.classList.add(state.mode);

  const homeImg = document.querySelector(".circle img");
  if(homeImg){ homeImg.style.display = (state.mode === "home") ? "block" : "none"; }

  if (state.mode === "home") return;

  const item = DATA[state.i] || {};

  if (state.mode === "question") {
    const q1 = item.q1 ?? "";
    const q2 = (item.q2 ?? "").trim();
    el.innerHTML = `
      <div class="q-line1">${renderLine1HTML(q1)}</div>
      ${q2 ? `<div class="q-line2">${esc(q2)}</div>` : ""}
    `;
    scheduleFit();
    return;
  }

  // answer
  const a1 = item.a1 ?? "";
  const a1_html = (item.a1_html ?? "").trim();

  // a2 peut être fourni en texte (comme q2) ou en HTML (a2_html)
  const a2_plain = (item.a2 ?? "").toString().trim();
  const a2_html = (item.a2_html ?? "").trim();

  // Si a1_html est fourni, on l'utilise tel quel (HTML), pour permettre <sup>…</sup>, etc.
  // Sinon, on utilise le rendu standard (gras + opérateurs non gras + fractions empilées).
  const a1LineHTML = a1_html ? `<span class="qb a1html">${a1_html}</span>` : renderLine1HTML(a1);

  // a2 : HTML prioritaire, sinon texte échappé
  const a2LineHTML = a2_html ? a2_html : (a2_plain ? esc(a2_plain) : "");


  el.innerHTML = `
    <div class="a-line1">${a1LineHTML}</div>
    ${a2LineHTML ? `<div class="a-line2">${a2LineHTML}</div>` : ""}
  `;
}


// ===== Auto-fit robuste de la LIGNE 1 dans le cercle (toutes tailles d'écran) =====
// Objectif : la ligne 1 ne doit jamais dépasser le cercle, quel que soit l'appareil.
// On calcule la largeur "permise" par la géométrie du cercle à la hauteur du texte, puis
// on réduit la taille (binary search) jusqu'à ce que ça rentre.

function __getLine1AndCircle(){
  const circle = card.querySelector(".circle");
  const line1 = el.querySelector(".q-line1, .a-line1");
  return { circle, line1 };
}

function fitLine1ToCircle(){
  const { circle, line1 } = __getLine1AndCircle();
  if (!circle || !line1) return;

  // Forcer nowrap sur la ligne 1 (au cas où)
  line1.style.whiteSpace = "nowrap";

  // Mesures cercle
  const cRect = circle.getBoundingClientRect();
  const cs = getComputedStyle(circle);
  const border = parseFloat(cs.borderLeftWidth) || 0;

  // padding en px (on prend le + grand des côtés)
  const padL = parseFloat(cs.paddingLeft) || 0;
  const padR = parseFloat(cs.paddingRight) || 0;
  const padT = parseFloat(cs.paddingTop) || 0;
  const padB = parseFloat(cs.paddingBottom) || 0;
  const pad = Math.max(padL, padR, padT, padB);

  // Rayon intérieur utile
  const r = (Math.min(cRect.width, cRect.height) / 2) - border - pad;
  if (!(r > 0)) return;

  // Position verticale réelle de la ligne 1 (pour savoir la corde disponible)
  // On centre le texte, donc dy est petit mais pas toujours 0 (différences de fonts/metrics).
  const lRect0 = line1.getBoundingClientRect();
  const cy = cRect.top + cRect.height / 2;
  const midY = (lRect0.top + lRect0.bottom) / 2;
  const dy = midY - cy;

  // Si le centre du texte est trop haut/bas pour le cercle utile, on garde une marge stricte
  const dyAbs = Math.min(Math.abs(dy), r * 0.95);

  // Largeur de corde disponible à cette hauteur : 2*sqrt(r^2 - dy^2)
  // SAFETY < 1 pour absorber les différences de rendu (iOS/Android/PC + gras + glyphes).
  const SAFETY = 0.78;
  const allowed = 2 * Math.sqrt(Math.max(0, r*r - dyAbs*dyAbs)) * SAFETY;

  const measure = () => line1.getBoundingClientRect().width;

  // Reset à la valeur CSS calculée
  const cssSize = parseFloat(getComputedStyle(line1).fontSize) || 64;
  line1.style.fontSize = cssSize + "px";
  line1.style.letterSpacing = "";

  if (measure() <= allowed) return;

  // Binary search (descend la taille jusqu'à rentrer)
  let lo = 12;
  let hi = cssSize;
  let best = lo;

  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    line1.style.fontSize = mid.toFixed(2) + "px";

    // petite compression si très petit (cas extrêmes)
    if (mid <= 22) line1.style.letterSpacing = "-0.02em";
    else line1.style.letterSpacing = "";

    if (measure() <= allowed) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  line1.style.fontSize = best.toFixed(2) + "px";
  if (best <= 22) line1.style.letterSpacing = "-0.02em";
  else line1.style.letterSpacing = "";
}

// Double RAF : attend que le layout/les fonts soient stabilisés (surtout iOS/PWA)
function scheduleFit(){
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fitLine1ToCircle();
    });
  });
}

// Refit au chargement + changements d'orientation/dimension
window.addEventListener("load", scheduleFit);
window.addEventListener("resize", scheduleFit);
window.addEventListener("orientationchange", scheduleFit);



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

// Tap + swipe (haut/bas/gauche/droite) : même effet qu'un tap (v65)
// Version robuste iOS "Ajouter à l'écran d'accueil" : on utilise touchend (fiable) + suppression du ghost-click.
let __suppressClickUntil = 0;
let __touchActive = false;

card.addEventListener("pointerup", (e) => {
  // Sur iOS, les PointerEvents peuvent être irréguliers en mode standalone.
  // On laisse touchend gérer les gestes tactiles; pointerup sert surtout desktop/souris.
  if ((e.pointerType || "") === "touch") return;
  e.preventDefault();
  handleTap().catch(console.error);
}, { passive: false });

card.addEventListener("touchstart", (e) => {
  if (!e.touches || e.touches.length !== 1) return;
  __touchActive = true;
}, { passive: true });

card.addEventListener("touchend", (e) => {
  if (!__touchActive) return;
  __touchActive = false;

  // Empêche le click synthétique qui suit souvent sur iOS/PWA
  e.preventDefault();
  __suppressClickUntil = Date.now() + 500;

  // Tap OU swipe → même effet : avancer (handleTap)
  handleTap().catch(console.error);
}, { passive: false });

// Bloque le "ghost click" après un touchend (surtout après un swipe)
card.addEventListener("click", (e) => {
  if (Date.now() < __suppressClickUntil) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  e.preventDefault();
  handleTap().catch(console.error);
}, { passive: false });
render();
