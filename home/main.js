{
  const h5 = document.querySelector('h5');
  const markup = Array.from(h5.textContent).join('</span><span>');
  h5.innerHTML = `<span>${markup}</span>`;
}
