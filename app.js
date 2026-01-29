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


// ===== Auto-fit robuste du texte dans le cercle =====
// - Ligne 1 (ex. Ampère-heure) = contrainte
// - Ligne 2 (ex. (Ah)) = protégée, jamais minuscule
function fitTextToCircle(){
  const circle = document.querySelector(".circle");
  const content = document.getElementById("content");
  if(!circle || !content) return;

  const cs = getComputedStyle(circle);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

  // marge de sécurité pour éviter le clipping au bord du cercle (iOS varie)
  const availW = (circle.clientWidth - padX) * 0.92;
  const availH = (circle.clientHeight - padY) * 0.92;

  const line1 = content.querySelector(".q-line1,.a-line1");
  const line2 = content.querySelector(".q-line2,.a-line2");
  if(!line1) return;

  // reset tailles (repart des tailles CSS clamp)
  line1.style.fontSize = "";
  if(line2) line2.style.fontSize = "";

  // bornes (évite micro-texte)
  const min1 = 26;
  const min2Abs = 18;

  let i = 0;
  while(i < 60){
    const r = content.getBoundingClientRect();

    // overflow réel : nowrap => scrollWidth
    const overflow =
      r.width > availW + 0.5 ||
      r.height > availH + 0.5 ||
      (line1.scrollWidth > line1.clientWidth + 0.5);

    if(!overflow) break;

    const fs1 = parseFloat(getComputedStyle(line1).fontSize);
    const next1 = Math.max(min1, fs1 * 0.94);
    line1.style.fontSize = next1 + "px";

    if(line2){
      // ligne 2 doit rester lisible : au moins 75% de la ligne 1, mais jamais sous min2Abs
      const min2 = Math.max(min2Abs, next1 * 0.75);
      const fs2 = parseFloat(getComputedStyle(line2).fontSize);
      // Si la ligne 2 est déjà plus grande, on la garde (elle ne doit pas rétrécir à cause de la ligne 1)
      line2.style.fontSize = Math.max(min2, fs2) + "px";
    }

    i++;
  }
}

function scheduleFit(){
  // 1) après layout
  requestAnimationFrame(() => {
    fitTextToCircle();
    // 2) après chargement des polices (sinon iPhone peut recalculer et couper)
    if(document.fonts && document.fonts.ready){
      document.fonts.ready.then(() => fitTextToCircle()).catch(()=>{});
    }
  });
}

window.addEventListener("resize", scheduleFit);
window.addEventListener("orientationchange", scheduleFit);


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
    
    scheduleFit();
return;
  }

  // answer
  const a1 = esc(item.a1 ?? "");
  const a2 = (item.a2_html ?? "").trim();
  el.innerHTML = `
    <div class="a-line1">${a1}</div>
    ${a2 ? `<div class="a-line2">${a2}</div>` : ""}
  `;

    scheduleFit();
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

card.addEventListener("pointerup", (e) => {
  e.preventDefault();
  handleTap().catch(console.error);
});

render();
