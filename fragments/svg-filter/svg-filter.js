const color = new Color();
let gradient = 1;
const grayValues = [0.2989, 0.587, 0.114];

const setters = {
  red: (v) => (color.rgb.r = v),
  green: (v) => (color.rgb.g = v),
  blue: (v) => (color.rgb.b = v),
  redValue: (v) => (color.rgb.r = v),
  greenValue: (v) => (color.rgb.g = v),
  blueValue: (v) => (color.rgb.b = v),

  hue: (v) => (color.hsv.h = v),
  saturation: (v) => (color.hsv.s = v / 100),
  value: (v) => (color.hsv.v = v / 100),
  hueValue: (v) => (color.hsv.h = v),
  saturationValue: (v) => (color.hsv.s = v / 100),
  valueValue: (v) => (color.hsv.v = v / 100),

  hex: (v) => (color.hex = v),
};

const getters = {
  red: () => color.rgb.r,
  green: () => color.rgb.g,
  blue: () => color.rgb.b,
  redValue: () => color.rgb.r,
  greenValue: () => color.rgb.g,
  blueValue: () => color.rgb.b,

  hue: () => Math.round(color.hsv.h),
  saturation: () => Math.round(color.hsv.s * 100),
  value: () => Math.round(color.hsv.v * 100),
  hueValue: () => Math.round(color.hsv.h),
  saturationValue: () => Math.round(color.hsv.s * 100),
  valueValue: () => Math.round(color.hsv.v * 100),

  hex: () => color.hex.get(),
};

const updateInputs = (target) => {
  Object.keys(getters)
    .map((key) => document.querySelector(`#${key}`))
    .filter((e) => e !== target)
    .forEach((e) => (e.value = getters[e.id]()));
};

const setGradient = (percent) => {
  gradient = percent;
  update;
};

const updateMatrix = () => {
  const r = [...grayValues.map((v) => v * gradient), color.rgb.r / 255, 0];
  const g = [...grayValues.map((v) => v * gradient), color.rgb.g / 255, 0];
  const b = [...grayValues.map((v) => v * gradient), color.rgb.b / 255, 0];
  const a = [0, 0, 0, 1, 0];
  const matrix = [...r, ...g, ...b, ...a].map((n) => n.toFixed(3)).join(' ');
  document
    .querySelector('#filter-sample feColorMatrix')
    .setAttribute('values', matrix);
};

/*
const updateStyle = () => {
  const id = 'overlay-style';
  const style =
    document.querySelector(`#${id}`) ||
    document.head.appendChild(document.createElement('style'));
  style.id = id;
  style.textContent = `.overlay {
        fill: rgb(${color.map((c) => c * 255).join(', ')});
      }`;
};
*/

document.addEventListener('input', ({ target }) => {
  if (target.id === 'gradient') {
    document.querySelector('#gradientValue').value = target.value;
    gradient = Number.parseInt(target.value) / 100;
  } else if (target.id === 'gradientValue') {
    document.querySelector('#gradient').value = target.value;
    gradient = Number.parseInt(target.value) / 100;
  } else if (setters.hasOwnProperty(target.id)) {
    setters[target.id](Number.parseInt(target.value));
    updateInputs(target);
  }

  updateMatrix();
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach((name) => {
  document.addEventListener(name, (event) => event.preventDefault());
});

document.addEventListener('drop', (event) => {
  const objectURL = URL.createObjectURL(event.dataTransfer.files[0]);
  document.querySelector('#target').src = objectURL;
});
