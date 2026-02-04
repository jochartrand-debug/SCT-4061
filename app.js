
(function () {
  const CIRCLE_PADDING_RATIO = 0.86;
  const MIN_FONT_PX = 14;
  const MAX_FONT_PX = 64;
  const LINE_GAP = 1.15;

  function fitTextInCircle(container) {
    const circle = container.querySelector('.circle');
    const lines = Array.from(container.querySelectorAll('.line'));
    if (!circle || !lines.length) return;

    const rect = circle.getBoundingClientRect();
    const diameter = Math.min(rect.width, rect.height) * CIRCLE_PADDING_RATIO;
    const radius = diameter / 2;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let low = MIN_FONT_PX, high = MAX_FONT_PX, best = MIN_FONT_PX;

    while (low <= high) {
      const mid = (low + high) >> 1;
      if (fitsAtSize(mid)) { best = mid; low = mid + 1; }
      else { high = mid - 1; }
    }
    applySize(best);

    function fitsAtSize(px) {
      const totalHeight = lines.length * px * LINE_GAP;
      const startY = -totalHeight / 2 + (px * LINE_GAP) / 2;

      for (let i = 0; i < lines.length; i++) {
        const y = startY + i * px * LINE_GAP;
        const maxWidthAtY = 2 * Math.sqrt(Math.max(0, radius * radius - y * y));
        const text = lines[i].textContent.trim();

        const cs = getComputedStyle(lines[i]);
        ctx.font = `${cs.fontWeight || 600} ${px}px ${cs.fontFamily || 'system-ui, -apple-system, Segoe UI, Roboto, Arial'}`;
        const measured = ctx.measureText(text).width;
        if (measured > maxWidthAtY * 0.98) return false;
      }
      return true;
    }

    function applySize(px) {
      lines.forEach(el => {
        el.style.fontSize = px + 'px';
        el.style.lineHeight = LINE_GAP.toString();
      });
    }
  }

  function fitAll() {
    document.querySelectorAll('.tile').forEach(fitTextInCircle);
  }

  window.addEventListener('load', fitAll);
  window.addEventListener('resize', () => requestAnimationFrame(fitAll));
  window.addEventListener('orientationchange', () => setTimeout(fitAll, 150));

  let lastTap = 0;
  document.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastTap < 350) {
      e.preventDefault(); e.stopPropagation(); return false;
    }
    lastTap = now;
  }, true);
})();
