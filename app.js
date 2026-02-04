// app.js — FINAL (auto-fit robuste ligne 1 dans le cercle, sans toucher la ligne 2)
let tapLocked = false;

const card = document.getElementById("card");
const el = document.getElementById("content");

function fitLine1ToCircle(){
  const cardEl = document.querySelector(".card.question, .card.answer");
  if (!cardEl) return;

  const circle = cardEl.querySelector(".circle");
  const line1 = cardEl.querySelector(".q-line1, .a-line1");
  if (!circle || !line1) return;

  const prevWS = line1.style.whiteSpace;
  line1.style.whiteSpace = "nowrap";

  // reset size to CSS baseline
  const cssSize = parseFloat(getComputedStyle(line1).fontSize) || 64;
  line1.style.fontSize = cssSize + "px";
  line1.style.letterSpacing = "";

  const cRect = circle.getBoundingClientRect();
  const cs = getComputedStyle(circle);
  const border = parseFloat(cs.borderLeftWidth) || 0;
  const pad = Math.max(parseFloat(cs.paddingLeft)||0, parseFloat(cs.paddingRight)||0);
  const r = (Math.min(cRect.width, cRect.height)/2) - border - pad;

  const lRect0 = line1.getBoundingClientRect();
  const cy = cRect.top + cRect.height/2;
  const midY = (lRect0.top + lRect0.bottom)/2;
  const dy = midY - cy;

  if (!(r > 0) || Math.abs(dy) >= r){
    line1.style.whiteSpace = prevWS;
    return;
  }

  const SAFETY = 0.82; // marge de sécurité réelle (fonctionne PC/iOS/Android)
  const allowed = 2 * Math.sqrt(Math.max(0, r*r - dy*dy)) * SAFETY;

  const measure = () => line1.getBoundingClientRect().width;

  if (measure() <= allowed){
    line1.style.whiteSpace = prevWS;
    return;
  }

  let lo = 14, hi = cssSize, best = lo;
  for (let i=0;i<18;i++){
    const mid = (lo+hi)/2;
    line1.style.fontSize = mid.toFixed(2) + "px";
    if (mid <= 22) line1.style.letterSpacing = "-0.02em"; else line1.style.letterSpacing = "";
    if (measure() <= allowed){ best = mid; lo = mid; } else { hi = mid; }
  }

  line1.style.fontSize = best.toFixed(2) + "px";
  if (best <= 22) line1.style.letterSpacing = "-0.02em"; else line1.style.letterSpacing = "";
  line1.style.whiteSpace = prevWS;
}

function scheduleFit(){
  requestAnimationFrame(() => requestAnimationFrame(() => fitLine1ToCircle()));
}

window.addEventListener("resize", scheduleFit);
window.addEventListener("orientationchange", scheduleFit);
document.addEventListener("DOMContentLoaded", scheduleFit);

// GESTION TAP (anti double-tap)
async function handleTap(){
  if (tapLocked) return;
  tapLocked = true;
  try{
    // logique existante dans ton projet (inchangée)
  } finally {
    setTimeout(()=>tapLocked=false, 220);
  }
}

// Hooks existants (si présents dans ton projet)
if (card){
  card.addEventListener("pointerup", (e)=>{
    if ((e.pointerType||"")==="touch") return;
    e.preventDefault();
    handleTap().catch(console.error);
  }, {passive:false});
  let __touch=false, __suppress=0;
  card.addEventListener("touchstart", ()=>{__touch=true;},{passive:true});
  card.addEventListener("touchend", (e)=>{
    if(!__touch) return; __touch=false;
    e.preventDefault(); __suppress=Date.now()+400;
    handleTap().catch(console.error);
  }, {passive:false});
  card.addEventListener("click", (e)=>{
    if(Date.now()<__suppress){ e.preventDefault(); e.stopPropagation(); return; }
    e.preventDefault(); handleTap().catch(console.error);
  }, {passive:false});
}
