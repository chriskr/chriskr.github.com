{
  const h5 = document.querySelector('h5');
  const markup = Array.from(h5.textContent).join('</span><span>');
  h5.innerHTML = `<span>${markup}</span>`;

  document.addEventListener(
      'mouseover',
      event => document.documentElement.classList.toggle(
          'menu-active', event.target.closest('.menu') !== null));

  const originalRatio = 1010 / 404;
  const defaultScale = .65;
  const borderWidth = 120;
  const targetScaledHeight = 70;
  const targetScaledDetaX = 30;
  // from bottom
  const targetScaledDeltaY = 30;
  const setStyles = (afterRule, hoverRule) => {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight - borderWidth;
    const width = defaultScale * innerWidth;
    const height = width / originalRatio;
    const scale = targetScaledHeight / height;
    const scaledDeltaX = (innerWidth - width) / 2 * scale;
    const scaledDeltaY = (innerHeight - height) / 2 * scale;
    const originX = (targetScaledDetaX - scaledDeltaX) / (1 - scale);
    const originY =
        innerHeight - (targetScaledDeltaY - scaledDeltaY) / (1 - scale);
    afterRule.transformOrigin =
        `${originX.toFixed(2)}px ${originY.toFixed(2)}px 0px`;
    hoverRule.transform = `scale(${scale.toFixed(3)})`;
  };
  const [afterRule, hoverRule] = ['html::after', 'html.menu-active::after'].map(
      selector => document.styleSheets.getDeclaration(selector));
  setStyles(afterRule, hoverRule);
  window.addEventListener('resize', event => setStyles(afterRule, hoverRule));
}
