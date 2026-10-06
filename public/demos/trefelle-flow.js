(function () {
  'use strict';
  /* ---------- Demo: Trefelle app flow ---------- */
  var FIELDS = [
    { n: 'Web development', role: 'Front-end developer', i: ['websites', 'mobile'], l: ['JavaScript'] },
    { n: 'Backend engineering', role: 'Backend developer', i: ['websites', 'cloud', 'data'], l: ['JavaScript', 'Python', 'SQL'] },
    { n: 'Data engineering', role: 'Data engineer', i: ['data', 'cloud'], l: ['SQL', 'Python'] },
    { n: 'Data science and ML', role: 'Data analyst', i: ['data', 'ai'], l: ['Python', 'SQL'] },
    { n: 'AI engineering', role: 'AI application developer', i: ['ai', 'websites'], l: ['Python', 'JavaScript'] },
    { n: 'Game development', role: 'Gameplay programmer', i: ['games'], l: ['C/C++', 'JavaScript'] },
    { n: 'Security', role: 'Security analyst', i: ['security', 'systems'], l: ['Python', 'C/C++'] },
    { n: 'Cloud and DevOps', role: 'DevOps engineer', i: ['cloud', 'systems'], l: ['Python'] },
    { n: 'Mobile development', role: 'Mobile developer', i: ['mobile', 'games'], l: ['JavaScript'] },
    { n: 'Systems programming', role: 'Systems programmer', i: ['systems', 'security', 'games'], l: ['C/C++'] }
  ];
  var TESTS = [['Hello World', 'hello-world'], ['  Trim  me  ', 'trim-me'], ['Rock & Roll!', 'rock-roll'], ['--Already--slugged--', 'already-slugged'], ['', '']];
  var STARTER = 'function slugify(title) {\n  // return the slug\n  return title;\n}\n';
  var SOLUTION = "function slugify(title) {\n  return title\n    .toLowerCase()\n    .trim()\n    .replace(/[^a-z0-9]+/g, '-')\n    .replace(/^-+|-+$/g, '');\n}\n";

  var panes = [1, 2, 3, 4].map(function (n) { return $('p' + n); });
  var trailItems = Array.prototype.slice.call(document.querySelectorAll('#fl-trail li'));
  var aiConnected = false, chosen = '', timer = null;

  function show(step) {
    panes.forEach(function (p, i) { p.hidden = i !== step - 1; });
    trailItems.forEach(function (li, i) {
      li.classList.toggle('on', i === step - 1);
      li.classList.toggle('done', i < step - 1 && !(i === 1 && !aiConnected));
      li.classList.toggle('skip', i === 1 && !aiConnected && step > 2);
    });
  }

  function checked(name) {
    return Array.prototype.map.call(document.querySelectorAll('input[name="' + name + '"]:checked'), function (e) { return e.value; });
  }

  function recommend() {
    var ints = checked('int'), langs = checked('lang');
    var scored = FIELDS.map(function (f) {
      var hi = f.i.filter(function (x) { return ints.indexOf(x) > -1; });
      var hl = f.l.filter(function (x) { return langs.indexOf(x) > -1; });
      return { f: f, s: hi.length * 3 + hl.length, hi: hi, hl: hl };
    }).filter(function (x) { return ints.length ? x.hi.length > 0 : x.s > 0; }).sort(function (a, b) { return b.s - a.s; });
    if (!scored.length) scored = FIELDS.slice(0, 3).map(function (f) { return { f: f, s: 1, hi: [], hl: [] }; });
    return scored.slice(0, 6);
  }

  function why(x) {
    var bits = [];
    if (x.hi.length) bits.push('your interest in ' + x.hi.join(' and '));
    if (x.hl.length) bits.push('your ' + x.hl.join(' and ') + ' skills');
    return bits.length ? 'Fits ' + bits.join(' and ') + '.' : 'A common place to start.';
  }

  function fieldCard(f, reason, rec) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'field' + (rec ? ' rec' : '');
    b.innerHTML = '<strong></strong><span class="role"></span><span class="why"></span>';
    b.children[0].textContent = f.n; b.children[1].textContent = f.role; b.children[2].textContent = reason || '';
    b.addEventListener('click', function () { choose(f); });
    return b;
  }

  function renderFields(recs) {
    var box = $('fl-fields'); box.innerHTML = '';
    var recNames = recs ? recs.map(function (x) { return x.f.n; }) : [];
    if (recs) {
      var h = document.createElement('h4'); h.textContent = 'Recommended for you'; box.appendChild(h);
      var g = document.createElement('div'); g.className = 'grid';
      recs.forEach(function (x) { g.appendChild(fieldCard(x.f, why(x), true)); });
      box.appendChild(g);
    }
    var h2 = document.createElement('h4'); h2.textContent = recs ? 'Other fields' : 'All fields'; box.appendChild(h2);
    var g2 = document.createElement('div'); g2.className = 'grid';
    FIELDS.filter(function (f) { return recNames.indexOf(f.n) < 0; }).forEach(function (f) { g2.appendChild(fieldCard(f, '', false)); });
    box.appendChild(g2);
  }

  function choose(f) {
    chosen = f.n;
    $('fl-phelp').textContent = 'Practice for ' + f.n + ' (' + f.role + '). The real app builds a pathway of project-shaped tasks. This one is a single warm-up.';
    $('fl-code').value = STARTER; $('fl-tests').innerHTML = '';
    show(4);
  }

  $('fl-connect').addEventListener('click', function () { aiConnected = true; show(2); });
  $('fl-skip').addEventListener('click', function () {
    aiConnected = false;
    $('fl-fhelp').textContent = 'No AI is connected, so the flow skips the assessment and goes straight to a manual picker.';
    $('fl-fnote').textContent = 'Pick any field to continue.';
    renderFields(null); show(3);
  });
  $('fl-go').addEventListener('click', function () {
    var btn = $('fl-go'); if (timer) return;
    btn.disabled = true; btn.textContent = 'Waiting for one model call...';
    timer = setTimeout(function () {
      timer = null; btn.disabled = false; btn.textContent = 'Get recommendations';
      $('fl-fhelp').textContent = 'The model returned fields that fit your profile. In the real app it can return up to six.';
      $('fl-fnote').textContent = 'These are illustrative. This demo uses simple rules, not a live model call.';
      renderFields(recommend()); show(3);
    }, reduce ? 0 : 900);
  });

  /* ---- real in-browser execution ---- */
  var WORKER_SRC = 'onmessage=function(e){var d=e.data,fn;try{fn=new Function(d.code+"\\n;return typeof slugify===\\"function\\"?slugify:null;")();}catch(err){postMessage({error:String(err)});return;}' +
    'if(!fn){postMessage({error:"Define a function named slugify."});return;}' +
    'var out=d.tests.map(function(t){try{var got=fn(t[0]);return{ok:got===t[1],got:String(got)};}catch(err){return{ok:false,got:"error: "+err.message};}});postMessage({results:out});};';

  function execute(code) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(new Blob([WORKER_SRC], { type: 'text/javascript' }));
      var w = new Worker(url), done = false;
      function finish(v) { if (done) return; done = true; clearTimeout(t); w.terminate(); URL.revokeObjectURL(url); resolve(v); }
      var t = setTimeout(function () { finish({ error: 'Timed out after 1.5 seconds. Is there an infinite loop?' }); }, 1500);
      w.onmessage = function (e) { finish(e.data); };
      w.onerror = function (e) { finish({ error: e.message || 'The code failed to run.' }); };
      w.postMessage({ code: code, tests: TESTS });
    });
  }

  function li(cls, mark, text) {
    var el = document.createElement('li'); el.className = cls;
    el.innerHTML = '<span class="mark" aria-hidden="true">' + mark + '</span><span></span>'; el.lastChild.textContent = text; return el;
  }

  $('fl-run').addEventListener('click', function () {
    var out = $('fl-tests'); out.innerHTML = ''; out.appendChild(li('ok', '…', 'Running in a Web Worker'));
    execute($('fl-code').value).then(function (r) {
      out.innerHTML = '';
      if (r.error) { out.appendChild(li('warn', '!', r.error)); return; }
      var pass = 0;
      r.results.forEach(function (x, i) {
        if (x.ok) pass++;
        out.appendChild(li(x.ok ? 'ok' : 'warn', x.ok ? '✓' : '!',
          'slugify(' + JSON.stringify(TESTS[i][0]) + ') ' + (x.ok ? 'returned ' + JSON.stringify(x.got) : 'returned ' + JSON.stringify(x.got) + ', expected ' + JSON.stringify(TESTS[i][1]))));
      });
      out.appendChild(li(pass === TESTS.length ? 'ok' : 'warn', pass === TESTS.length ? '✓' : '!', pass + ' of ' + TESTS.length + ' tests passed'));
    });
  });
  $('fl-sol').addEventListener('click', function () { $('fl-code').value = SOLUTION; $('fl-tests').innerHTML = ''; });
  $('fl-reset').addEventListener('click', function () { aiConnected = false; chosen = ''; show(1); });
  $('fl-code').addEventListener('keydown', function (e) {
    if (e.key === 'Tab') { e.preventDefault(); var t = e.target, s = t.selectionStart; t.value = t.value.slice(0, s) + '  ' + t.value.slice(t.selectionEnd); t.selectionStart = t.selectionEnd = s + 2; }
  });

  show(1);
})();
