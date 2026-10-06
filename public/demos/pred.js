(function () {
  'use strict';
  /* ---------- Demo 1: client prediction ---------- */
  var pc = $('pred'), pv = null;
  var pingEl = $('pred-ping'), zoneEl = $('pred-zone'), smoothEl = $('pred-smooth');
  var DT = 1 / 60, SPEED = 0.5, ZONE = [0.42, 0.58], ZMULT = 0.3;
  var running = !reduce, now = 0, acc = 0, lastTs = 0;
  var seq = 0, toServer = [], toClient = [], lastS = 0, lastC = 0;
  var serverPos = 0.2, clientTarget = 0.2, pending = [], shownPred = 0.2, shownWait = 0.2, waitTarget = 0.2;
  var corrections = 0, userDir = 0, userTouch = 0, lastUser = -10, autoDir = 1, autoUntil = 0;
  function predResize() { pv = sizeCanvas(pc); }
  function pPing() { return Number(pingEl.value) / 1000; }
  function inZone(p) { return p > ZONE[0] && p < ZONE[1]; }
  function dirNow() {
    var d = userDir || userTouch;
    if (d) { lastUser = now; return d; }
    if (now - lastUser < 2.5) return 0;
    if (now > autoUntil) {
      autoDir = Math.random() < 0.15 ? 0 : (autoDir === 1 ? -1 : 1);
      autoUntil = now + 0.7 + Math.random() * 1.1;
    }
    return autoDir;
  }
  function predStep() {
    var dir = dirNow();
    seq++;
    clientTarget = clamp(clientTarget + dir * SPEED * DT);
    pending.push({ seq: seq, dir: dir });
    var aS = Math.max(now + pPing() / 2, lastS); lastS = aS;
    toServer.push({ at: aS, seq: seq, dir: dir });
    while (toServer.length && toServer[0].at <= now) {
      var m = toServer.shift();
      var mult = zoneEl.checked && inZone(serverPos) ? ZMULT : 1;
      serverPos = clamp(serverPos + m.dir * SPEED * DT * mult);
      var aC = Math.max(now + pPing() / 2, lastC); lastC = aC;
      toClient.push({ at: aC, pos: serverPos, seq: m.seq });
    }
    while (toClient.length && toClient[0].at <= now) {
      var s = toClient.shift();
      waitTarget = s.pos;
      while (pending.length && pending[0].seq <= s.seq) pending.shift();
      var p = s.pos;
      for (var i = 0; i < pending.length; i++) p = clamp(p + pending[i].dir * SPEED * DT);
      if (Math.abs(p - clientTarget) > 0.0015) corrections++;
      clientTarget = p;
    }
    var k = smoothEl.checked ? 0.22 : 1;
    shownPred += (clientTarget - shownPred) * k;
    shownWait += (waitTarget - shownWait) * k;
    now += DT;
  }
  function laneLabel(ctx, text, x, y) {
    ctx.font = '600 13px ' + css('--font'); ctx.fillStyle = css('--ink'); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, x, y);
  }
  function predDraw() {
    if (!pv) return;
    var ctx = pv.ctx, W = pv.W, H = pv.H;
    var cS = css('--server'), cC = css('--client'), cW = css('--wait'), line = css('--line'), muted = css('--muted');
    ctx.clearRect(0, 0, W, H);
    var x0 = 18, x1 = W - 18;
    function X(p) { return x0 + p * (x1 - x0); }
    var lanes = [
      { y: H * 0.24, label: 'Server', color: cS, pos: serverPos },
      { y: H * 0.57, label: 'Client that waits for the server', color: cW, pos: shownWait },
      { y: H * 0.88, label: 'Client that predicts', color: cC, pos: shownPred }
    ];
    lanes.forEach(function (ln, i) {
      laneLabel(ctx, ln.label, x0, ln.y - 17);
      ctx.strokeStyle = line; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x0, ln.y); ctx.lineTo(x1, ln.y); ctx.stroke();
      if (zoneEl.checked) {
        ctx.globalAlpha = i === 0 ? 0.25 : 0.5;
        ctx.fillStyle = i === 0 ? cS : line;
        ctx.fillRect(X(ZONE[0]), ln.y - 10, X(ZONE[1]) - X(ZONE[0]), 20);
        ctx.globalAlpha = 1;
        if (i === 0) {
          ctx.font = '400 12px ' + css('--font'); ctx.fillStyle = muted; ctx.textAlign = 'center';
          ctx.fillText('slow zone, server only', (X(ZONE[0]) + X(ZONE[1])) / 2, ln.y + 26);
        }
      }
    });
    [1, 2].forEach(function (i) {
      var ln = lanes[i], sx = X(serverPos), cx = X(ln.pos);
      ctx.strokeStyle = cS; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.arc(sx, ln.y, 12, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      if (Math.abs(sx - cx) > 14) {
        ctx.strokeStyle = ln.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sx + (cx > sx ? 12 : -12), ln.y); ctx.lineTo(cx + (cx > sx ? -10 : 10), ln.y); ctx.stroke();
      }
    });
    lanes.forEach(function (ln) {
      ctx.fillStyle = ln.color; ctx.beginPath(); ctx.arc(X(ln.pos), ln.y, 10, 0, Math.PI * 2); ctx.fill();
    });
  }
  pingEl.addEventListener('input', function () { $('pred-ping-out').textContent = pingEl.value + ' ms'; });
  $('pred-toggle').textContent = running ? 'Pause' : 'Run';
  $('pred-toggle').addEventListener('click', function () {
    running = !running; this.textContent = running ? 'Pause' : 'Run';
  });
  window.addEventListener('keydown', function (e) {
    var focused = document.activeElement === pc;
    if (e.key === 'ArrowLeft') { userDir = -1; if (focused) e.preventDefault(); }
    if (e.key === 'ArrowRight') { userDir = 1; if (focused) e.preventDefault(); }
  });
  window.addEventListener('keyup', function (e) {
    if ((e.key === 'ArrowLeft' && userDir === -1) || (e.key === 'ArrowRight' && userDir === 1)) userDir = 0;
  });
  function pDir(e) { var r = pc.getBoundingClientRect(); userTouch = (e.clientX - r.left) < r.width / 2 ? -1 : 1; }
  pc.addEventListener('pointerdown', function (e) { pc.setPointerCapture(e.pointerId); pDir(e); });
  pc.addEventListener('pointermove', function (e) { if (userTouch) pDir(e); });
  pc.addEventListener('pointerup', function () { userTouch = 0; });
  pc.addEventListener('pointercancel', function () { userTouch = 0; });


  function frame(ts) {
    var dt = Math.min(0.1, (ts - lastTs) / 1000 || 0); lastTs = ts;
    if (running) { acc += dt; while (acc >= DT) { predStep(); acc -= DT; } }
    predDraw();
    if (Math.floor(ts / 250) !== predDraw.last) { predDraw.last = Math.floor(ts / 250); $('pred-readout').textContent = 'Corrections so far: ' + corrections; }
    requestAnimationFrame(frame);
  }
  window.addEventListener('resize', predResize);
  predResize();
  requestAnimationFrame(frame);
})();
