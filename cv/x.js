(function() {
  const s = '731d9fa11075edc80069f6c01d33f4d3167fec8f0374dfc61e7cf6cd5d7ef0cc';
  const p = h => Number.parseInt(h, 0x10);
  const f = String.fromCharCode;
  const r = [];
  const n = p(s.slice(0, 8));
  const m = Array.from('    ').map((_, i) => n >> ((3 - i) * 8) & 0xff);
  for (let i = 8; i < s.length; i += 2) r.push(i);
  const x = r.map(i => f(p(s.slice(i, i + 2)) ^ m[((i - 8) / 2) % 4])).join('');
  const a = document.querySelector('#x');
  a.href = 'mailto:' + x;
  a.removeAttribute('id');
  document.querySelector('script').remove();
  for (let dt of Array.from(document.querySelectorAll('dt'))) {
    dt.innerHTML =
        Array.from(dt.textContent.trim()).map(n => `<b>${n}</b>`).join('');
  }
})();