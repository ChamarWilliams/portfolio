(function () {
  'use strict';
  /* ---------- Demo 5: rubric weights ---------- */
  var CR = [
    { name: 'Anatomy', a: 0.9, b: 0.5 },
    { name: 'Water and reflections', a: 0.4, b: 0.85 },
    { name: 'Document text', a: 0.6, b: 0.9 },
    { name: 'Chart inspection', a: 0.8, b: 0.7 },
    { name: 'Tonal intent', a: 0.7, b: 0.6 }
  ];
  var jdRows = $('jd-rows'), jdInputs = [], jdBars = [];
  CR.forEach(function (c, i) {
    var row = document.createElement('div'); row.className = 'row';
    row.innerHTML = '<div class="crit"><label for="jd-w' + i + '"></label><input id="jd-w' + i + '" type="range" min="0" max="5" step="1" value="1"></div>' +
      '<div class="bars"><div class="bar a"><span>A</span><span class="track"><span class="fill" style="display:block"></span></span><span class="v"></span></div>' +
      '<div class="bar b"><span>B</span><span class="track"><span class="fill" style="display:block"></span></span><span class="v"></span></div></div>';
    jdRows.appendChild(row);
    var input = row.querySelector('input'), label = row.querySelector('label');
    label.textContent = c.name + ': weight ' + 1;
    var fills = row.querySelectorAll('.fill'), vals = row.querySelectorAll('.v');
    fills[0].style.width = (c.a * 100) + '%'; fills[1].style.width = (c.b * 100) + '%';
    vals[0].textContent = Math.round(c.a * 100); vals[1].textContent = Math.round(c.b * 100);
    input.addEventListener('input', function () { label.textContent = c.name + ': weight ' + input.value; jdUpdate(); });
    jdInputs.push(input);
  });
  function jdUpdate() {
    var sw = 0, sa = 0, sb = 0;
    CR.forEach(function (c, i) { var w = Number(jdInputs[i].value); sw += w; sa += w * c.a; sb += w * c.b; });
    var v = $('jd-verdict');
    if (!sw) { v.innerHTML = 'Set at least one weight above zero.'; return; }
    var A = sa / sw, B = sb / sw, d = A - B, who = Math.abs(d) < 0.02 ? 'Too close to call' : (d > 0 ? 'Image A wins' : 'Image B wins');
    v.innerHTML = '<span></span><small></small>';
    v.firstChild.textContent = who;
    v.lastChild.textContent = 'Weighted score: A ' + Math.round(A * 100) + ', B ' + Math.round(B * 100) + '. Sample scores.';
  }
  jdUpdate();

})();
