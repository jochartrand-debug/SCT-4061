let tapLocked = false;

// Unités de mesure — Q/R
// - Questions au hasard (deck) ; épuisement ; retour accueil
// - A × B / A ÷ B : seul A et B en gras (× ÷ non gras)
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
    "q1": "coulomb",
    "q2": "(C)",
    "a1": "Charge",
    "a2_html": "(<span class=\"italic\">Q</span>)"
  },
  {
    "q1": "ampère-heure",
    "q2": "(Ah)",
    "a1": "Charge",
    "a2_html": "(<span class=\"italic\">Q</span>)"
  },
  {
    "q1": "ampère",
    "q2": "(A)",
    "a1": "Courant",
    "a2_html": "(<span class=\"italic\">I</span>)"
  },
 {
    "q1": "mètre",
    "q2": "(m)",
    "a1": "Distance",
    "a2_html": "(<span class=\"italic\">d</span>)"
  },
  {
    "q1": "volt",
    "q2": "(V)",
    "a1": "Tension",
    "a2_html": "(<span class=\"italic\">T</span>)"
  },
  {
    "q1": "volt x ampère",
    "q2": "",
    "a1": "watt",
    "a2_html": ""
  },
  {
    "q1": "watt x heure",
    "q2": "",
    "a1": "Wh",
    "a2_html": ""
  },
   {
    "q1": "mètre ÷ seconde",
    "q2": "",
    "a1": "vitesse",
    "a2_html": ""
  },
{
    "q1": "coulomb ÷ seconde",
    "q2": "",
    "a1": "ampère",
    "a2_html": ""
  },
  {
    "q1": "joule ÷ seconde",
    "q2": "",
    "a1": "watt",
    "a2_html": ""
  },
  {
    "q1": "ampère x heure",
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
    "q1": "seconde",
    "q2": "(s)",
    "a1": "Temps",
    "a2_html": "(<span class=\"italic\">t</span>)"
  }
];

const card = document.getElementById("card");
const el = document.getElementById("content");

const state = {
  mode: "home",
  order: [],
  pos: 0,
  i: 0
};

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

function htmlToText(s){
  // Nettoie un éventuel HTML résiduel dans les données pour n'afficher que du texte.
  const div = document.createElement("div");
  div.innerHTML = (s ?? "").toString();
  return (div.textContent || "").trim();
}

function renderLine1(targetSpan, s){
  // Construit la ligne 1 en DOM :
  // - texte en gras (.qb)
  // - opérateurs × ÷ - non gras (.op)
  // - si "a/b" (un seul slash), rend une fraction empilée (Option B)
  if(!targetSpan) return;
  const txt = htmlToText(s);
  targetSpan.textContent = "";

  // Option B: fraction empilée si un seul "/" et pas vide
  const parts = txt.split("/");
  if(parts.length === 2 && parts[0].trim() && parts[1].trim()){
    const frac = document.createElement("span");
    frac.className = "frac";

    const num = document.createElement("span");
    num.className = "num qb";
    num.textContent = parts[0].trim();

    const bar = document.createElement("span");
    bar.className = "bar";

    const den = document.createElement("span");
    den.className = "den qb";
    den.textContent = parts[1].trim();

    frac.appendChild(num);
    frac.appendChild(bar);
    frac.appendChild(den);
    targetSpan.appendChild(frac);
    return;
  }

  // Sinon: texte + opérateurs
  const frag = document.createDocumentFragment();
  let buf = "";
  const flush = () => {
    if(!buf) return;
    const w = document.createElement("span");
    w.className = "qb";
    w.textContent = buf;
    frag.appendChild(w);
    buf = "";
  };

  for(let i=0;i<txt.length;i++){
    const ch = txt[i];
    if(ch === "×" || ch === "÷" || ch === "-"){
      flush();
      const op = document.createElement("span");
      op.className = "op" + (ch === "-" ? " hyph" : "");
      op.textContent = ch;
      frag.appendChild(op);
    }else{
      buf += ch;
    }
  }
  flush();
  targetSpan.appendChild(frag);
}



/* ============================
   BOLD sans opérateurs × ÷ -
   ============================ */
function renderExprBoldNoOp(s){
  const txt = (s ?? "").trim();
  if (!txt) return "";

  // Normalisation × ÷ x
  const norm = txt
    .replace(/([^\s])×([^\s])/g, "$1 × $2")
    .replace(/([^\s])÷([^\s])/g, "$1 ÷ $2")
    .replace(/([A-Za-zÀ-ÖØ-öø-ÿ])x([A-Za-zÀ-ÖØ-öø-ÿ])/g, "$1 × $2")
    .replace(/\s+[x×]\s+/g, " × ")
    .replace(/\s+÷\s+/g, " ÷ ")
    .replace(/\s+/g, " ")
    .trim();

  // 1) Multiplication
  let parts = norm.split(/\s+×\s+/);
  if (parts.length > 1){
    let html = `<span class="qb">${esc(parts[0])}</span>`;
    for (let i = 1; i < parts.length; i++){
      html += ` <span class="mult">×</span> <span class="qb">${esc(parts[i])}</span>`;
    }
    return html;
  }

  // 2) Division
  parts = norm.split(/\s+÷\s+/);
  if (parts.length > 1){
    let html = `<span class="qb">${esc(parts[0])}</span>`;
    for (let i = 1; i < parts.length; i++){
      html += ` <span class="div">÷</span> <span class="qb">${esc(parts[i])}</span>`;
    }
    return html;
  }

  // 3) Trait d’union
  const hy = norm.split(/-/);
  if (hy.length > 1){
    let html = `<span class="qb">${esc(hy[0])}</span>`;
    for (let i = 1; i < hy.length; i++){
      html += `<span class="hyph">-</span><span class="qb">${esc(hy[i])}</span>`;
    }
    return html;
  }

  // 4) Texte simple
  return `<span class="qb">${esc(norm)}</span>`;
}

function render(){
  card.classList.remove("home","question","answer");
  card.classList.add(state.mode);

  // Affiche l'image uniquement sur l'accueil (évite toute superposition)
  const homeImg = document.querySelector(".circle img");
  if(homeImg){
    homeImg.style.display = (state.mode === "home") ? "block" : "none";
  }

  if (state.mode === "home") {
    el.innerHTML = ""; // aucune question affichée
    return;
  }

  const item = DATA[state.i] || {};

  if (state.mode === "question") {
    const q1 = item.q1 ?? "";
    const q2 = (item.q2 ?? "").trim();

    el.innerHTML = `
      <div class="q-line1"><span class="line1-text"></span></div>
      ${q2 ? `<div class="q-line2">${esc(q2)}</div>` : ""}
    `;
    renderLine1(el.querySelector(".q-line1 .line1-text"), q1);
    return;
  }

  // answer
  const a1 = item.a1 ?? "";
  const a2 = (item.a2_html ?? "").trim();
  el.innerHTML = `
    <div class="a-line1"><span class="line1-text"></span></div>
    ${a2 ? `<div class="a-line2">${a2}</div>` : ""}
  `;
  renderLine1(el.querySelector(".a-line1 .line1-text"), a1);
}

// … (le reste du fichier est inchangé)
