function* range(n, start = 0) {
  for (let i = start; i < n; i++) yield i;
}
const cell = i => `<td><span>cell ${i}</span></td>`;
const row = (n, start) =>
  `<tr>${[...range(n)].map(i => cell(i + start)).join('')}</tr>`;

const table = (n, m) =>
  `<table><tbody>${[...range(n)]
    .map(i => row(m, i * m))
    .join('')}</tbody></table>`;

const boxProps = ['top', 'left', 'right', 'bottom', 'width', 'height'];

const scaleBox = (box, scale) =>
  boxProps.reduce(
    (newBox, prop) => ((newBox[prop] = box[prop] * scale), newBox),
    {}
  );

const clamp = (value, min, max) => Math.max(Math.min(value, max), min);

const DELTA = 0.1;
const DRAG_START_DELTA = 15;
const MAX_SCALE = 2;

const getDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
  ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;

class ScaleManager {
  _contaninerElement = null;
  _contentElement = null;
  _scale = 1;
  _translateX = 0;
  _translateY = 0;
  _dragStart = {
    deltaX: 0,
    deltaY: 0
  };
  _isDrag = false;

  _mousemove = event => {
    const { clientX: x, clientY: y } = event;
    if (
      !this._isDrag &&
      getDistance({ x, y }, { x: this._dragStart.x, y: this._dragStart.y }) <
        DRAG_START_DELTA
    ) {
      return;
    }
    this._isDrag = true;
    this._move({ x, y });
  };

  _mouseup = event => {
    document.removeEventListener('mousemove', this._mousemove);
    document.removeEventListener('mouseup', this._mouseup);
    this._isDrag = false;
  };

  set contaninerElement(contaninerElement) {
    this._contaninerElement = contaninerElement;
  }

  set contentElement(contentElement) {
    this._contentElement = contentElement;
  }

  get scale() {
    return this._scale;
  }

  setDragStartPoint({ x, y }) {
    this._dragStart = {
      deltaX: this._translateX - x,
      deltaY: this._translateY - y
    };
    document.addEventListener('mousemove', this._mousemove);
    document.addEventListener('mouseup', this._mouseup);
    event.preventDefault();
    event.stopPropagation();
  }

  center() {
    const containerBox = this._contaninerElement.getBoundingClientRect();
    const contentBox = scaleBox(
      this._contentElement.getBoundingClientRect(),
      1 / this._scale
    );
    this._scale = Math.min(
      containerBox.width / contentBox.width,
      containerBox.height / contentBox.height
    );
    const scaledBox = scaleBox(contentBox, this._scale);
    this._translateX = (containerBox.width - scaledBox.width) / 2;
    this._translateY = (containerBox.height - scaledBox.height) / 2;
    this._update();
  }

  scaleAt(scale, { x, y }) {
    const containerBox = this._contaninerElement.getBoundingClientRect();
    const contentBox = this._contentElement.getBoundingClientRect();

    const contentBoxScaled = scaleBox(contentBox, 1 / this._scale);
    const minScale = Math.min(
      containerBox.width / contentBoxScaled.width,
      containerBox.height / contentBoxScaled.height
    );

    scale = clamp(scale, minScale, MAX_SCALE);

    const deltaX = x - containerBox.left;
    const deltaY = y - containerBox.top;
    const contentX = deltaX - this._translateX;
    const contentY = deltaY - this._translateY;

    this._setTranslate(
      {
        x: deltaX - (contentX / this._scale) * scale,
        y: deltaY - (contentY / this._scale) * scale
      },
      containerBox,
      contentBox
    );

    this._scale = scale;
    this._update();
  }

  _update() {
    this._contentElement.style.transform = `translate(${this._translateX}px, ${
      this._translateY
    }px) scale(${this._scale})`;
  }

  _move({ x, y }) {
    this._setTranslate({
      x: this._dragStart.deltaX + x,
      y: this._dragStart.deltaY + y
    });
    this._update();
  }

  _setTranslate(
    { x, y },
    containerBox = this._contaninerElement.getBoundingClientRect(),
    contentBox = this._contentElement.getBoundingClientRect()
  ) {
    const maxDeltaX = containerBox.width - contentBox.width;
    const maxDeltaY = containerBox.height - contentBox.height;
    this._translateX = clamp(x, Math.min(maxDeltaX, 0), Math.max(maxDeltaX, 0));
    this._translateY = clamp(y, Math.min(maxDeltaY, 0), Math.max(maxDeltaY, 0));
  }
}

window.onload = () => {
  document.addEventListener('click', event =>
    console.log(event.target.textContent)
  );
  const containerElement = document.querySelector('#container');
  const contentElement = document.querySelector('#inner-container');
  contentElement.innerHTML = table(20, 20);
  contentElement.style.width = `${contentElement.firstChild.offsetWidth}px`;

  const scaleManger = new ScaleManager();
  scaleManger.contaninerElement = containerElement;
  scaleManger.contentElement = contentElement;

  document
    .querySelector('#center-content')
    .addEventListener('click', () => scaleManger.center());

  scaleManger.center();

  containerElement.addEventListener('mousedown', ({ clientX: x, clientY: y }) =>
    scaleManger.setDragStartPoint({ x, y })
  );

  document.addEventListener('wheel', event => {
    const scale =
      scaleManger.scale +
      (event.deltaY < 0 ? 1 : -1) * DELTA * scaleManger.scale;

    scaleManger.scaleAt(scale, {
      x: event.clientX,
      y: event.clientY
    });
  });
};
