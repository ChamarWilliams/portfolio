(function () {
  'use strict';
  /* ---------- Demo 4: Arboryn three-way merge ---------- */
  var MG = [
    { obj: 'Workspace.Door', prop: 'Color', base: 'Red', ours: 'Blue', theirs: 'Green', o: true, t: true },
    { obj: 'Workspace.Door', prop: 'Anchored', base: 'true', ours: 'false', theirs: 'false', o: true, t: true },
    { obj: 'Workspace.Door', prop: 'Size', base: '4, 7, 1', ours: '4, 8, 1', theirs: '5, 7, 1', o: true, t: false },
    { obj: 'Workspace.Door.Opener', prop: 'Source', base: 'v1', ours: 'v2', theirs: 'v3', o: false, t: true }
  ];
  var mgRows = [];
  function mgReset() { mgRows = MG.map(function (r) { var c = {}; for (var k in r) c[k] = r[k]; c.choice = null; return c; }); mgRender(); }
  function mgRender() {
    var body = document.querySelector('#mg tbody'); body.innerHTML = '';
    var clean = 0, open = 0, resolved = 0;
    mgRows.forEach(function (r, idx) {
      var tr = document.createElement('tr');
      var ov = r.o ? r.ours : r.base, tv = r.t ? r.theirs : r.base;
      function cell(label, pressed, fn) {
        var td = document.createElement('td'), b = document.createElement('button');
        b.type = 'button'; b.className = 'cell'; b.textContent = label; b.setAttribute('aria-pressed', pressed);
        if (fn) b.addEventListener('click', fn); td.appendChild(b); return td;
      }
      var p = document.createElement('td'); p.className = 'prop';
      p.innerHTML = '<span></span>'; p.firstChild.textContent = r.obj; p.insertBefore(document.createTextNode(r.prop), p.firstChild);
      tr.appendChild(p);
      var bt = document.createElement('td'); bt.textContent = r.base; tr.appendChild(bt);
      tr.appendChild(cell(ov, r.o, function () { r.o = !r.o; r.choice = null; mgRender(); }));
      tr.appendChild(cell(tv, r.t, function () { r.t = !r.t; r.choice = null; mgRender(); }));
      var m = document.createElement('td');
      if (!r.o && !r.t) { m.textContent = r.base; clean++; }
      else if (r.o && !r.t) { m.className = 'merged-ok'; m.textContent = ov; clean++; }
      else if (!r.o && r.t) { m.className = 'merged-ok'; m.textContent = tv; clean++; }
      else if (ov === tv) { m.className = 'merged-ok'; m.textContent = ov; clean++; }
      else if (r.choice) {
        m.className = 'merged-ok'; m.textContent = (r.choice === 'ours' ? ov : tv) + ' (you chose ' + r.choice + ')'; resolved++;
      } else {
        open++; m.className = 'merged-conflict'; m.textContent = 'Conflict';
        var pick = document.createElement('div'); pick.className = 'pick';
        ['ours', 'theirs'].forEach(function (c) {
          var b = document.createElement('button'); b.type = 'button'; b.textContent = 'Take ' + c;
          b.addEventListener('click', function () { r.choice = c; mgRender(); }); pick.appendChild(b);
        });
        m.appendChild(pick);
      }
      tr.appendChild(m); body.appendChild(tr);
    });
    $('mg-sum').textContent = clean + ' merged cleanly' + (resolved ? ', ' + resolved + ' resolved by you' : '') + ', ' + open + ' need a decision';
  }
  $('mg-reset').addEventListener('click', mgReset);
  mgReset();

})();
