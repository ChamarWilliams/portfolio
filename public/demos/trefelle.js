(function () {
  'use strict';
  /* ---------- Demo: Trefelle key-stack rotation ---------- */
  var run = $('tf-run'), flow = $('tf-flow'), result = $('tf-result'), timer = null;
  var rows = Array.prototype.slice.call(document.querySelectorAll('.keyrow'));
  var failText = { rate: '429 rate limited', model: '404 model not found', down: 'no response from the endpoint' };

  function empty() { flow.innerHTML = '<li class="empty">The steps appear here.</li>'; }
  function clearRows() { rows.forEach(function (r) { r.classList.remove('active', 'failed', 'won'); }); }
  function reset() {
    if (timer) { clearTimeout(timer); timer = null; run.disabled = false; }
    empty(); clearRows(); result.textContent = 'Press Send profile.';
  }
  empty();

  function plan() {
    var rule = document.querySelector('input[name="rule"]:checked').value;
    var states = rows.map(function (r) { return r.querySelector('select').value; });
    var steps = [{ k: 'ok', t: 'Send one structured profile from the browser straight to the provider' }];
    var text = '', lastErr = '';

    for (var i = 0; i < states.length; i++) {
      var name = 'Key ' + (i + 1);
      steps.push({ k: 'ok', mark: '→', t: 'Try ' + name, row: i, state: 'active' });
      if (states[i] === 'ok') {
        steps.push({ k: 'ok', t: name + ' answered: 200 OK', row: i, state: 'won' });
        steps.push({ k: 'ok', t: 'Parse the recommended fields and roles' });
        text = i === 0
          ? 'The first key worked, so nothing rotated.'
          : 'The failed key was skipped and the next one answered. The session carried on.';
        return { steps: steps, text: text };
      }
      lastErr = failText[states[i]];
      steps.push({ k: 'warn', t: name + ' failed: ' + lastErr, row: i, state: 'failed' });
      if (rule === 'rate' && states[i] !== 'rate') {
        steps.push({ k: 'warn', t: 'This rule only rotates on rate limits, so the stack stops here' });
        text = 'The first version of the rotation behaved like this. One misconfigured key blocked the whole stack, even when the others were fine.';
        return { steps: steps, text: text };
      }
    }
    steps.push({ k: 'warn', t: 'Every key was tried. Show the last error: ' + lastErr });
    text = 'Only after every key has failed does the app show an error.';
    return { steps: steps, text: text };
  }

  run.addEventListener('click', function () {
    if (timer) return;
    var p = plan(), i = 0;
    flow.innerHTML = ''; clearRows(); result.textContent = 'Running...'; run.disabled = true;
    function add() {
      var s = p.steps[i], li = document.createElement('li');
      li.className = s.k;
      li.innerHTML = '<span class="mark" aria-hidden="true">' + (s.mark || (s.k === 'ok' ? '✓' : '!')) + '</span><span></span>';
      li.lastChild.textContent = s.t;
      flow.appendChild(li);
      if (s.row != null) {
        rows.forEach(function (r, idx) { if (idx === s.row) { r.classList.remove('active', 'failed', 'won'); r.classList.add(s.state); } else { r.classList.remove('active'); } });
      }
      i++;
      if (i < p.steps.length) { timer = setTimeout(add, reduce ? 0 : 480); }
      else { timer = null; run.disabled = false; result.textContent = p.text; }
    }
    add();
  });

  Array.prototype.forEach.call(document.querySelectorAll('select, input[name="rule"]'), function (el) {
    el.addEventListener('change', reset);
  });
})();
