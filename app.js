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
    "q1": "mètre/seconde",
    "q2": "",
    "a1": "m/s",
    "a2_html": ""
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
    "a2_html": "(<span class=\"italic\">P</span>)"
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
  const a2 = (item.a2_html ?? "").trim();
  el.innerHTML = `
    <div class="a-line1">${renderLine1HTML(a1)}</div>
    ${a2 ? `<div class="a-line2">${a2}</div>` : ""}
  `;
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

card.addEventListener("pointerup", (e) => {
  e.preventDefault();
  handleTap().catch(console.error);
});


render();
