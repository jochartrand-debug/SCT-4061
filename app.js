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

function fitTextToCircle(element){
  // Mesure précise de la largeur du texte avec un élément temporaire
  const circle = element.closest('.circle');
  if (!circle) return;
  
  const maxWidth = circle.clientWidth - 64; // marge de sécurité plus grande
  const minSize = 32;
  const maxSize = 110;
  
  // Créer un élément temporaire pour mesurer avec précision
  const temp = document.createElement('div');
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.whiteSpace = 'nowrap';
  temp.style.fontFamily = window.getComputedStyle(element).fontFamily;
  temp.style.fontWeight = window.getComputedStyle(element).fontWeight;
  temp.innerHTML = element.innerHTML;
  document.body.appendChild(temp);
  
  // Fonction pour obtenir la largeur réelle
  function getTextWidth(size) {
    temp.style.fontSize = size + 'px';
    return temp.offsetWidth;
  }
  
  // Recherche binaire pour trouver la taille optimale
  let low = minSize;
  let high = maxSize;
  let bestSize = minSize;
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const width = getTextWidth(mid);
    
    if (width <= maxWidth) {
      bestSize = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  
  // Nettoyer
  document.body.removeChild(temp);
  
  // Appliquer la taille optimale
  element.style.fontSize = bestSize + 'px';
  
  return bestSize;
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
    
    // Ajuster la taille après le rendu
    requestAnimationFrame(() => {
      const line1 = el.querySelector('.q-line1');
      const line2 = el.querySelector('.q-line2');
      
      if (line1) {
        const finalSize = fitTextToCircle(line1);
        
        // Appliquer la même taille à la ligne 2
        if (line2) {
          line2.style.fontSize = finalSize + 'px';
        }
      }
    });
    return;
  }

  // answer
  const a1 = esc(item.a1 ?? "");
  const a2 = (item.a2_html ?? "").trim();
  el.innerHTML = `
    <div class="a-line1">${a1}</div>
    ${a2 ? `<div class="a-line2">${a2}</div>` : ""}
  `;
  
  // Ajuster la taille après le rendu
  requestAnimationFrame(() => {
    const line1 = el.querySelector('.a-line1');
    const line2 = el.querySelector('.a-line2');
    
    if (line1) {
      const finalSize = fitTextToCircle(line1);
      
      // Appliquer la même taille à la ligne 2
      if (line2) {
        line2.style.fontSize = finalSize + 'px';
      }
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
