{
  const h5 = document.querySelector('h5');
  const markup = Array.from(h5.textContent).join('</span><span>');
  h5.innerHTML = `<span>${markup}</span>`;
  document.addEventListener(
      'mouseover',
      event => document.documentElement.classList.toggle(
          'menu-active', event.target.closest('.menu') !== null));
}
