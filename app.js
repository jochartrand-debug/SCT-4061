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

function setExpr(targetSpan, s){
  // Remplit targetSpan avec du texte + spans .op pour les opérateurs, sans .replace() et sans HTML fragile.
  if(!targetSpan) return;
  const txt = (s ?? "").toString();
  targetSpan.textContent = ""; // clear
  const frag = document.createDocumentFragment();

  // Buffer pour regrouper les caractères non-opérateurs
  let buf = "";
  const flush = () => {
    if(buf){
      frag.appendChild(document.createTextNode(buf));
      buf = "";
    }
  };

  for(let i=0; i<txt.length; i++){
    const ch = txt[i];
    if(ch === "×" || ch === "÷" || ch === "-"){
      flush();
      const sp = document.createElement("span");
      sp.className = "op" + (ch === "-" ? " op-hyph" : "");
      sp.textContent = ch;
      frag.appendChild(sp);
    }else{
      buf += ch;
    }
  }
  flush();
  targetSpan.appendChild(frag);
}

function esc(s){
  return (s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}


function render(){
  card.classList.remove("home","question","answer");
  card.classList.add(state.mode);

  if (state.mode === "home") return;

  const item = DATA[state.i] || {};

  if (state.mode === "question") {
    const q1 = ((item.q1 ?? "")).toString().trim();
    const q2 = (item.q2 ?? "").toString().trim();
    el.innerHTML = `
      <div class="q-line1"><span class="line1-text"></span></div>
      ${q2 ? `<div class="q-line2">${esc(q2)}</div>` : ""}
    `;
    setExpr(el.querySelector(".line1-text"), q1);
    scheduleFit();
    return;
  }

  // answer
  const a1 = (item.a1 ?? "").toString().trim();
  const a2 = (item.a2_html ?? "").toString().trim();
  el.innerHTML = `
    <div class="a-line1"><span class="line1-text"></span></div>
    ${a2 ? `<div class="a-line2">${a2}</div>` : ""}
  `;
  setExpr(el.querySelector(".line1-text"), a1);
  scheduleFit();
}


// ===== Auto-fit robuste du contenu dans le cercle (toutes tailles d'écran) =====
function fitToCircle(){
  const circle = document.querySelector(".circle");
  const content = document.getElementById("content");
  if(!circle || !content) return;

  // Reset transform for accurate measures
  content.style.transform = "translate(-50%, -50%)";
  content.style.transformOrigin = "0 0";
  content.style.left = "50%";
  content.style.top = "50%";

  const cs = getComputedStyle(circle);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

  // Marge conservatrice pour éviter tout rognage sur iPhone
  const availW = Math.max(0, (circle.clientWidth - padX) * 0.84);
  const availH = Math.max(0, (circle.clientHeight - padY) * 0.90);

  const line1 = content.querySelector(".line1-text");
  const line2 = content.querySelector(".q-line2, .a-line2");

  const w1 = line1 ? line1.scrollWidth : 0;
  const w2 = line2 ? line2.scrollWidth : 0;
  const neededW = Math.max(w1, w2, 1);
  const neededH = Math.max(content.scrollHeight, 1);

  let s = 1;
  s = Math.min(s, availW / neededW);
  s = Math.min(s, availH / neededH);

  s = Math.max(0.25, Math.min(1, s)) * 0.99;
  content.style.transform = `translate(-50%, -50%) scale(${s})`;
}

function scheduleFit(){
  requestAnimationFrame(() => {
    fitToCircle();
    if (document.fonts && document.fonts.ready){
      document.fonts.ready.then(() => requestAnimationFrame(fitToCircle)).catch(()=>{});
    }
  });
}

/* Refit automatique sur changements de taille (desktop + iPhone) */
(function installRefitHooks(){
  let raf = null;
  const refitSoon = () => {
    if (state.mode === "home") return;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => fitToCircle());
  };
  window.addEventListener("resize", refitSoon, { passive: true });
  window.addEventListener("orientationchange", refitSoon, { passive: true });
  try{
    const ro = new ResizeObserver(refitSoon);
    const circle = document.querySelector(".circle");
    const content = document.getElementById("content");
    if (circle) ro.observe(circle);
    if (content) ro.observe(content);
  }catch(e){}
})();

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

window.addEventListener('resize', () => requestAnimationFrame(fitToCircle), { passive: true });
window.addEventListener('orientationchange', () => requestAnimationFrame(fitToCircle), { passive: true });

render();
