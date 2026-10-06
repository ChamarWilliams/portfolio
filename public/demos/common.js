var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(id) { return document.getElementById(id); }
function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function sizeCanvas(cv) {
  var dpr = window.devicePixelRatio || 1, r = cv.getBoundingClientRect();
  if (!r.width) return null;
  cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
  var ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx: ctx, W: r.width, H: r.height };
}
function laneLabel(ctx, text, x, y) {
  ctx.font = '600 13px ' + css('--font'); ctx.fillStyle = css('--ink'); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, x, y);
}
(function () {
  function applyTheme() {
    var t = null;
    try { t = parent.document.documentElement.getAttribute('data-theme'); } catch (e) {}
    if (t !== 'dark' && t !== 'light') t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (document.documentElement.getAttribute('data-theme') !== t) document.documentElement.setAttribute('data-theme', t);
  }
  applyTheme();
  try { if (parent !== window) new MutationObserver(applyTheme).observe(parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); } catch (e) {}
  function report() {
    try { parent.postMessage({ type: 'demo-height', height: Math.ceil(document.documentElement.getBoundingClientRect().height) }, '*'); } catch (e) {}
  }
  if (window.ResizeObserver) new ResizeObserver(report).observe(document.body);
  window.addEventListener('load', report);
})();
