const X = 9;

const translate = (matrix, left, top) => matrix.map(([x, y]) => [left + x, top + y]);

const scale = ([x, y]) => [x * X, y * X];

const isOnScreen = ([x, y]) => (-X < x && x < window.innerWidth &&
                                -X < y && y < window.innerHeight);

const snap = x  => {
  const s = (x / X) | 0;
  return s * X;
};

const addStyle = () => {
  const sheet = document.body.appendChild(document.createElement('style'));
  sheet.textContent = `.cell {width: ${X}px; height: ${X}px;}`;
};

const getPosFromIndexAndWidth =(width, index) => {
  const x = index % width;
  const y = (index - x) / width;
  return [x, y];
}

const getCellsFromShape = ({data, width, height}) => data.map(
  (bit, index) => bit === 0 ? null : getPosFromIndexAndWidth(width, index)
).filter(Boolean);

const shapeToCanvas = ({data, width, height}, scale) => {
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  data.forEach((bit, index) => {
    if (bit == 1) {
      const [x, y] = getPosFromIndexAndWidth(width, index);
      ctx.rect(x * scale, y * scale, scale, scale);
    }
  });
  ctx.fill();
  return canvas;
};

const addShapes = () => {
  const shapeList = document.querySelector('#shape-list');
  const scale = 4;
  const maxHeight = shapes.reduce((max, {height}) => Math.max(max, height), 0) * scale;
  shapes.forEach((shape, index) => {
    const canvas = shapeToCanvas(shape, scale);
    const padding = (maxHeight - scale * shape.height) / 2;
    canvas.style.paddingTop = `${padding}px`;
    canvas.style.paddingBottom = `${padding}px`;
    const li = document.createElement('li');
    li.dataset.legend = shape.name;
    li.classList.add('shape');
    li.dataset.index = String(index);
    li.appendChild(canvas);
    shapeList.appendChild(li);
  });
};

const createElementForCell = ([x, y], span = document.createElement('span')) => {
  span.classList.add('cell');
  span.style.left = `${x}px`;
  span.style.top = `${y}px`;
  return span;
};

const paintStartState = (shape = shapes[0]) => {
  const wikiBox = document.querySelector('a').getBoundingClientRect();
  const buttonBox = document.querySelector('#controls').getBoundingClientRect();
  const top = (((wikiBox.bottom + buttonBox.top) / 2) - (shape.height * X / 2)) / X | 0;
  const left = ((window.innerWidth / 2) - (shape.width * X / 2)) / X | 0;
  updateDOM(new Cells(translate(getCellsFromShape(shape), left, top)));
};

const getStateFromDOM = () => new Cells(
  [...document.querySelector('#container').children]
  .map(({style: {top, left}}) => [
    (Number.parseInt(left) / X) | 0,
    (Number.parseInt(top) / X) | 0,
  ])
);

const updateDOM = liveCells => {
  const container = document.querySelector('#container');
  const children = [...container.children];
  container.textContent = '';
  liveCells.getAll().map(scale).filter(isOnScreen)
  .forEach(pos => container.appendChild(createElementForCell(pos, children.pop())));
};

class Cells {
  constructor (list = []) {
    this._x = new Map();
    list.forEach(pos => this.add(pos));
  }

  add ([x, y]) {
    if (!this._x.has(x)) {
      this._x.set(x, new Set());
    }
    this._x.get(x).add(y);
  }

  has ([x, y]) {
    return this._x.has(x) && this._x.get(x).has(y);
  }

  getAll () {
    return [
      ...this._x.entries()
    ].flatMap(([x, ySet]) => [...ySet].map(y => [x, y]));
  }
}

const getNeighbours = ([x, y]) => [
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
  [x - 1, y],                 [x + 1, y],
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
];

const getNeighboursWithFilter = (pos, filter) => getNeighbours(pos).filter(filter);

const getLiveNeighboursCount = (liveCells, pos) =>
  getNeighboursWithFilter(pos, neighbour => liveCells.has(neighbour)).length;

const getDeadNeighbours = (liveCells, pos) =>
  getNeighboursWithFilter(pos, neighbour => !liveCells.has(neighbour));

const iterate = (liveCells) => {
  // Any live cell with fewer than two live neighbors dies, as if by under population.
  // Any live cell with two or three live neighbors lives on to the next generation.
  // Any live cell with more than three live neighbors dies, as if by overpopulation.
  // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  //const children = [...document.querySelector('#container').children];
  const newLiveCells = new Cells();
  liveCells.getAll().forEach(pos => {
    const liveNeighboursCount = getLiveNeighboursCount(liveCells, pos);
    if (1 < liveNeighboursCount && liveNeighboursCount < 4) {
      newLiveCells.add(pos);
    }
    getDeadNeighbours(liveCells, pos).forEach(deadPos => {
      const liveNeighboursCount = getLiveNeighboursCount(liveCells, deadPos);
      if (liveNeighboursCount === 3) {
        newLiveCells.add(deadPos);
      }
    });
  });
  return newLiveCells;
};

const getIterator = (currentState, callabck) => () => {
  currentState = iterate(currentState);
  callabck(currentState);
};

const setUp = () => {
  let interval = null;

  addStyle();
  addShapes();
  paintStartState();

  document.addEventListener('click', event => {
    if (interval) {
      return;
    }
    const cell = event.target.closest('.cell');
    if (cell) {
      cell.remove();
    } else if (!event.target.closest('.button, a, h1')) {
      const {clientX: x, clientY: y} = event;
      document.querySelector('#container')
      .appendChild(createElementForCell([snap(x), snap(y)]));
    }
  });

  document.addEventListener('mousemove', event => {
    const style = document.querySelector('.indicator').style;
    if (interval || event.target.closest('.button, a, h1')) {
      style.opacity = 0;
    } else {
      const {clientX: left, clientY: top} = event;
      style.opacity = 0.5;
      style.left = `${snap(left)}px`;
      style.top = `${snap(top)}px`;
    }
  });

  document.querySelector('#controls').addEventListener('click', ({target}) => {
    const button = target.closest('[id].button');
    if (!button) {
      return;
    }
    switch (button.id) {
      case 'menu': {
        const shape = target.closest('.shape');
        if (shape) {
          const index = shape.dataset.index;
          paintStartState(shapes[index]);
        }
        break;
      }
      case 'start':
        button.parentElement.classList.add('running');
        interval = setInterval(getIterator(getStateFromDOM(), updateDOM), 100);
        break;

      case 'pause':
        button.parentElement.classList.remove('running');
        clearInterval(interval);
        interval = null;
        break;

      case 'clear':
        document.querySelector('#container').textContent = '';
        break;
    }
  });

  window.addEventListener('resize', () => {
    if (!interval) {
      paintStartState();
    }
  });
};

setUp();
