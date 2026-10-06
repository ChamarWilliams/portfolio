(function () {
  'use strict';
  var DT = 1 / 60;
  /* ---------- Demo 2: hit validation with rewind ---------- */
  var hc = $('hit'), hv = null;
  var hPingEl = $('hit-ping'), rewindEl = $('hit-rewind');
  var hTick = 0, hAcc = 0, snaps = {}, aim = 0.5, shots = [], nShots = 0, nHits = 0, marks = [];
  var TSPEED = 0.45, HALF = 0.04;
  function tpos(tick) {
    var u = (tick * DT * TSPEED) / 0.88, f = u % 2;
    return 0.06 + 0.88 * (f < 1 ? f : 2 - f);
  }
  function hitResize() { hv = sizeCanvas(hc); }
  function halfTicks() { return Math.round(Number(hPingEl.value) / 1000 / 2 / DT); }
  function hitStep() {
    snaps[hTick] = tpos(hTick); delete snaps[hTick - 600];
    for (var i = shots.length - 1; i >= 0; i--) {
      var s = shots[i];
      if (s.resolve <= hTick) {
        var checkTick = rewindEl.checked ? s.view : hTick;
        var p = snaps[checkTick] != null ? snaps[checkTick] : tpos(checkTick);
        var hit = Math.abs(p - s.aim) < HALF;
        nShots++; if (hit) nHits++;
        marks.push({ aim: s.aim, hit: hit, ttl: 70 });
        $('hit-readout').textContent = 'Shots: ' + nShots + ' | Hits: ' + nHits;
        $('hit-last').textContent = (hit ? 'Hit. ' : 'Miss. ') + 'The server checked the target at ' + Math.round(p * 100) +
          ' and you aimed at ' + Math.round(s.aim * 100) + (rewindEl.checked ? ' (snapshot from the tick you saw).' : ' (where the target is now).');
        shots.splice(i, 1);
      }
    }
    hTick++;
  }
  function fire() {
    var v = hTick - halfTicks(); if (v < 0) v = 0;
    shots.push({ aim: aim, view: v, resolve: hTick + halfTicks() });
  }
  function hitDraw() {
    if (!hv) return;
    var ctx = hv.ctx, W = hv.W, H = hv.H;
    var cS = css('--server'), cW = css('--wait'), line = css('--line'), ink = css('--ink'), ok = css('--ok'), bad = css('--bad');
    ctx.clearRect(0, 0, W, H);
    var x0 = 18, x1 = W - 18;
    function X(p) { return x0 + p * (x1 - x0); }
    var viewTick = Math.max(0, hTick - halfTicks());
    var seen = snaps[viewTick] != null ? snaps[viewTick] : tpos(viewTick);
    var truth = snaps[hTick - 1] != null ? snaps[hTick - 1] : tpos(hTick);
    var lanes = [
      { y: H * 0.3, label: 'What the shooter sees', color: cW, pos: seen },
      { y: H * 0.74, label: 'Server, now', color: cS, pos: truth }
    ];
    lanes.forEach(function (ln) {
      laneLabel(ctx, ln.label, x0, ln.y - 26);
      ctx.strokeStyle = line; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x0, ln.y); ctx.lineTo(x1, ln.y); ctx.stroke();
      var w = HALF * (x1 - x0);
      ctx.fillStyle = ln.color; ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(X(ln.pos) - w, ln.y - 11, w * 2, 22, 5); else ctx.rect(X(ln.pos) - w, ln.y - 11, w * 2, 22);
      ctx.fill();
    });
    if (rewindEl.checked) {
      ctx.strokeStyle = cS; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      var w2 = HALF * (x1 - x0);
      ctx.strokeRect(X(seen) - w2, lanes[1].y - 14, w2 * 2, 28); ctx.setLineDash([]);
      ctx.font = '400 12px ' + css('--font'); ctx.fillStyle = css('--muted'); ctx.textAlign = 'center';
      ctx.fillText('rewound to your tick', X(seen), lanes[1].y + 30);
    }
    ctx.strokeStyle = ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(X(aim), 10); ctx.lineTo(X(aim), H - 10); ctx.stroke();
    marks = marks.filter(function (m) { return m.ttl > 0; });
    marks.forEach(function (m) {
      ctx.globalAlpha = Math.min(1, m.ttl / 40); ctx.fillStyle = m.hit ? ok : bad;
      ctx.beginPath(); ctx.arc(X(m.aim), lanes[0].y, 7, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1; m.ttl--;
    });
  }
  hPingEl.addEventListener('input', function () { $('hit-ping-out').textContent = hPingEl.value + ' ms'; });
  function setAim(e) { var r = hc.getBoundingClientRect(); aim = clamp((e.clientX - r.left - 18) / (r.width - 36)); }
  hc.addEventListener('pointermove', setAim);
  hc.addEventListener('pointerdown', function (e) { setAim(e); fire(); });
  hc.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { aim = clamp(aim - 0.02); e.preventDefault(); }
    if (e.key === 'ArrowRight') { aim = clamp(aim + 0.02); e.preventDefault(); }
    if (e.key === ' ' || e.key === 'Enter') { fire(); e.preventDefault(); }
  });
  $('hit-fire').addEventListener('click', fire);


  var hLast = 0;
  function frame(ts) {
    var dt = Math.min(0.1, (ts - hLast) / 1000 || 0); hLast = ts;
    hAcc += dt; while (hAcc >= DT) { hitStep(); hAcc -= DT; }
    hitDraw();
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', hitResize);
  hitResize();
  requestAnimationFrame(frame);
})();
