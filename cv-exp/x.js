if (!Array.from) {
  Array.from = function(iterable) {
    return this.prototype.slice.call(iterable);
  };
}

(function() {
  const s = '731d9fa11075edc80069f6c01d33f4d3167fec8f0374dfc61e7cf6cd5d7ef0cc';
  const p = function(h) { return parseInt(h, 0x10); };
  const f = String.fromCharCode;
  const r = [];
  const n = p(s.slice(0, 8));
  const m = Array.from('    ').map(function(_, i) {
    return n >> ((3 - i) * 8) & 0xff;
  });
  for (var i = 8; i < s.length; i += 2) r.push(i);
  const x = r.map(function(i) {
               return f(p(s.slice(i, i + 2)) ^ m[((i - 8) / 2) % 4]);
             }).join('');
  const a = document.querySelector('#x');
  a.href = 'mailto:' + x;
  a.removeAttribute('id');
  document.querySelector('script').remove();
  const dts = Array.from(document.querySelectorAll('dt'));
  for (var i = 0, dt; dt = dts[i]; i++) {
    dt.innerHTML = Array.from(dt.textContent.trim())
                       .map(function(n) { return '<b>' + n + '</b>'; })
                       .join('');
  }
})();