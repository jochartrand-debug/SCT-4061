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
    "q1": "Constitue",
    "q2": "la matière",
    "a1": "Atomes",
    "a2": ""
  },
{
    "q1": "Constitue",
    "q2": "les atomes",
    "a1": "Particules",
    "a2": ""
  },
{
    "q1": "Noyau",
    "q2": "atomique",
    "a1": "Protons",
    "a2": "et neutrons"
  },
{
    "q1": "Déplacement",
    "q2": "d'électrons",
    "a1": "Électricité",
    "a2": ""
  },
{
    "q1": "Particule",
    "q2": "négative",
    "a1": "Électron",
    "a2": ""
  },
{
    "q1": "Particule",
    "q2": "positive",
    "a1": "Proton",
    "a2": ""
  },
{
    "q1": "Particule",
    "q2": "neutre",
    "a1": "Neutron",
    "a2": ""
  },
{
    "q1": "Qualité",
    "q2": "universelle",
    "a1": "Masse",
    "a2": ""
  },
{
    "q1": "3 600",
    "q2": "coulombs",
    "a1": "1  Ah",
    "a2": ""
  },
{
    "q1": "3 600",
    "q2": "kilojoules",
    "a1": "1  kWh",
    "a2": ""
  },
  {
    "q1": "3 600",
    "q2": "joules",
    "a1": "1  Wh",
    "a2": ""
  },
{
    "q1": "3 600",
    "q2": "secondes",
    "a1": "1  h",
    "a2": ""
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
    "a2_html": "(<span class=\"italic\">U</span>)"
  },
   {
    "q1": "volt × ampère-heure",
    "q2": "",
    "a1": "watt-heure",
    "a2_html": ""
  },
  {
    "q1": "volt × ampère",
    "q2": "",
    "a1": "watt",
    "a2_html": ""
  },
   {
    "q1": "ohm × ampère",
    "q2": "",
    "a1": "volt",
    "a2_html": ""
  },
  {
    "q1": "watt × heure",
    "q2": "",
    "a1": "Wh",
    "a2_html": ""
  },
  {
    "q1": "volt/ampère",
    "q2": "",
    "a1": "ohm",
    "a2_html": ""
  },
  {
    "q1": "volt/ohm",
    "q2": "",
    "a1": "ampère",
    "a2_html": ""
  },
    {
    "q1": "N/C",
    "q2": "",
    "a1": "Champ",
    "a2": "électrique"
  },
  {
    "q1": "V/m",
    "q2": "",
    "a1": "Champ",
    "a2": "électrique"
  },
{
    "q1": "coulomb/seconde",
    "q2": "",
    "a1": "ampère",
    "a2_html": ""
  },
    {
    "q1": "Potentiel",
    "q2": "électrique",
    "a1": "Tension",
    "a2": ""
  },
   {
    "q1": "J/C",
    "q2": "",
    "a1": "Tension",
    "a2": ""
  },
  {
    "q1": "joule/coulomb",
    "q2": "",
    "a1": "volt",
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
    "a1": "Débit",
    "a2": "de longueur"
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
    "q1": "Vitesse × Temps",
    "q2": "",
    "a1": "Distance",
    "a2_html": ""
  },
  {
    "q1": "ampère × seconde",
    "q2": "",
    "a1": "coulomb",
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

// ===== SVG ring (question) + auto-fit (ligne 1 seulement) =====
const RING_ID = "qring-svg";

// Crée (une fois) le cercle SVG décoratif, centré dans .card
function ensureQuestionRing(){
  let svg = document.getElementById(RING_ID);
  if (svg) return svg;

  svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", RING_ID);
  svg.setAttribute("class", "qring");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", "50");
  c.setAttribute("cy", "50");
  // r = 50 - stroke/2 en coordonnées viewBox ; le stroke est en CSS avec vector-effect
  c.setAttribute("r", "49");
  svg.appendChild(c);

  // On le met dans la carte, derrière le contenu
  card.style.position = card.style.position || "relative";
  card.insertBefore(svg, card.firstChild);
  return svg;
}

function showQuestionRing(show){
  const svg = ensureQuestionRing();
  svg.style.display = show ? "block" : "none";
}

// Utilitaires
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

// On ajuste UNIQUEMENT la ligne 1 pour qu'elle tienne dans le cercle intérieur sûr.
// La ligne 2 n'est jamais modifiée.
function fitLine1ToRing(){
  showQuestionRing(state.mode === "question");

  if (state.mode === "home") return;

  const line1 = el.querySelector(".q-line1, .a-line1");
  if (!line1) return;

  // Reset styles
  line1.style.fontSize = "";
  line1.style.letterSpacing = "";
  line1.style.transform = "";

  // IMPORTANT: #content est clip-path (masque) en CSS.
  // Si on mesure le texte alors qu'il est clippé, le navigateur peut retourner des rects "coupés",
  // ce qui fait croire que ça rentre alors que non. On désactive temporairement le clip pendant le fit.
  const prevClip = el.style.clipPath;
  el.style.clipPath = "none";

  // Le fitting est utile surtout en mode question (cercle), mais on peut aussi l'appliquer en réponse
  // si tu souhaites garder une cohérence visuelle.
  const ring = document.getElementById(RING_ID);
  if (!ring || ring.style.display === "none") { el.style.clipPath = prevClip; return; }

  const ringRect = ring.getBoundingClientRect();
  const cx = ringRect.left + ringRect.width / 2;
  const cy = ringRect.top  + ringRect.height / 2;

  // Rayon intérieur "sûr" = demi-diamètre - stroke - safe padding (cohérent avec le CSS clip-path)
  const styles = getComputedStyle(document.documentElement);
  const stroke = parseFloat(styles.getPropertyValue("--q-circle-stroke")) || 6;
  const safe = parseFloat(styles.getPropertyValue("--q-circle-safe")) || 12;
  const r = (Math.min(ringRect.width, ringRect.height) / 2) - stroke - safe;

  if (!(r > 0)) { el.style.clipPath = prevClip; return; }

  // Test: la ligne 1 doit tenir dans le cercle à 3 hauteurs (haut/milieu/bas)
  const getUnionRect = (root) => {
    // Mesure fiable de la "vraie" boîte du texte rendu (inclut les noeuds texte),
    // via Range.getClientRects() (fonctionne sur desktop + iOS).
    const range = document.createRange();
    range.selectNodeContents(root);

    const rects = Array.from(range.getClientRects());
    // Fallback: si aucun rect (élément vide), on prend le rect du conteneur
    if (!rects.length){
      return root.getBoundingClientRect();
    }

    let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
    for (const r of rects){
      if (!r.width && !r.height) continue;
      left = Math.min(left, r.left);
      top = Math.min(top, r.top);
      right = Math.max(right, r.right);
      bottom = Math.max(bottom, r.bottom);
    }

    if (left === Infinity){
      return root.getBoundingClientRect();
    }

    return { left, top, right, bottom, width: right - left, height: bottom - top };
  };

  const fits = () => {
    const rect = getUnionRect(line1);

    // On évalue la largeur dispo du cercle à 3 hauteurs (haut/milieu/bas)
    const ys = [rect.top + 1, (rect.top + rect.bottom) / 2, rect.bottom - 1];

    // marge anti-aliasing / accents
    const SAFETY = 0.92;

    for (const y of ys){
      const dy = y - cy;
      if (Math.abs(dy) >= r) return false;

      // largeur horizontale disponible dans le cercle à la hauteur y
      const allowedHalf = Math.sqrt(Math.max(0, r*r - dy*dy));
      const allowedWidth = 2 * allowedHalf * SAFETY;

      if (rect.width > allowedWidth) return false;
    }
    return true;
  };

  if (fits()) { el.style.clipPath = prevClip; return; }

  // Ajustement : on réduit la taille de police en fonction de la largeur horizontale disponible
  // dans le cercle à la hauteur du texte (robuste sur iOS / PWA).
  let fs = parseFloat(getComputedStyle(line1).fontSize || "0") || 64;

  // On centre optiquement la ligne 1 sur le cercle (utile si le conteneur #content n'a pas exactement le même centre).
  const centerLine1 = () => {
    const rect = getUnionRect(line1);
    const midX = (rect.left + rect.right) / 2;
    const dx = cx - midX;
    line1.style.transform = `translateX(${dx.toFixed(2)}px)`;
  };

  for (let iter = 0; iter < 10; iter++){
    const rect = getUnionRect(line1);
    if (!rect.width) break;

    const ys = [rect.top + 1, (rect.top + rect.bottom) / 2, rect.bottom - 1];
    const SAFETY = 0.92;

    let scale = 1;
    for (const y of ys){
      const dy = y - cy;
      if (Math.abs(dy) >= r) { scale = Math.min(scale, 0.8); continue; }
      const allowedHalf = Math.sqrt(Math.max(0, r*r - dy*dy));
      const allowedWidth = 2 * allowedHalf * SAFETY;
      scale = Math.min(scale, allowedWidth / rect.width);
    }

    if (scale >= 1) break;

    fs = Math.max(8, fs * scale);
    line1.style.fontSize = fs.toFixed(2) + "px";
  }

  // Dernière passe : centrage X + garde anti-clipping subpixel
  centerLine1();

  if (!fits() && fs > 8){
    // On baisse par petits pas si les arrondis subpixel laissent encore un léger débordement
    let guard = fs;
    while (!fits() && guard > 8){
      guard -= 0.5;
      line1.style.fontSize = guard.toFixed(2) + "px";
    }
    fs = guard;
    centerLine1();
  }

  if (fs <= 24) line1.style.letterSpacing = "-0.02em";

  el.style.clipPath = prevClip;
}

let __fitScheduled = false;
function scheduleFit(){
  if (__fitScheduled) return;
  __fitScheduled = true;

  const run = () => {
    __fitScheduled = false;
    fitLine1ToRing();
  };

  // Double rAF: DOM + layout + polices
  requestAnimationFrame(() => requestAnimationFrame(run));
  if (document.fonts && document.fonts.ready){
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => requestAnimationFrame(run));
    }).catch(() => {});
  }
}

ensureQuestionRing();
showQuestionRing(false);

window.addEventListener("resize", () => {
  if (state.mode !== "home") scheduleFit();
}, { passive: true });


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
  "j/c",
]);

if (oneLineUnits.has(t)) {
  const [num, den] = txt.trim().split("/");
  return `<span class="qb">${num}</span><span class="op slash">/</span><span class="qb">${den}</span>`;
}



  const parts = txt.split("/");
  if(parts.length === 2 && parts[0].trim() && parts[1].trim()){
    return `<span class="frac"><span class="num qb">${esc(parts[0].trim())}</span><span class="bar"></span><span class="den qb">${esc(parts[1].trim())}</span></span>`;
  }

  // Sinon: mots en gras, opérateurs × ÷ - non gras
  // On veut des espaces AUTOUR de × et ÷, mais sans les mettre en gras.
  // Donc: on normalise d'abord pour enlever les espaces autour des opérateurs,
  // puis on injecte des espaces insécables autour de l'opérateur rendu.
  const txt2 = txt
    .replace(/\s*×\s*/g, "×")
    .replace(/\s*÷\s*/g, "÷");

  let out = "";
  let buf = "";
  const flush = () => {
    if (buf) {
      out += `<span class="qb">${esc(buf)}</span>`;
      buf = "";
    }
  };

  for (let i = 0; i < txt2.length; i++) {
    const ch = txt2[i];
    if (ch === "×" || ch === "÷" || ch === "-") {
      flush();
      if (ch === "×" || ch === "÷") {
        // Espaces insécables pour éviter un retour à la ligne autour de l'opérateur
        out += `<span class="op">&nbsp;${ch}&nbsp;</span>`;
      } else {
        out += `<span class="op hyph">-</span>`;
      }
    } else {
      buf += ch;
    }
  }
  flush();
  return out || `<span class="qb">${esc(txt2)}</span>`;
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
  scheduleFit();
  return;
}


// ===== Auto-fit robuste du contenu dans le cercle (toutes tailles d'écran) =====


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
