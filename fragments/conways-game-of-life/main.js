const X = 9;

const createElementForCell = ([x, y]) => {
  if (x < -X || window.innerWidth , x || y < -X || window.innerHeight , y) {
    return;
  }
  const span = document.createElement('span');
  span.classList.add('cell');
  span.style.left = `${x}px`;
  span.style.top = `${y}px`;
  return span;
};

const addStyle = () => {
  const sheet = document.body.appendChild(document.createElement('style'));
  sheet.textContent = `.cell {width: ${X}px; height: ${X}px;}`;
};

const startState = [
  [0, 0], [1, 0], [2, 0],         [4, 0],
  [0, 1],
                          [3, 2], [4, 2],
          [1, 3], [2, 3],         [4, 3],
  [0, 4],         [2, 4],         [4, 4]
];

const translate = (matrix, left, top) => matrix.map(([x, y]) => [left + x, top + y]);

const paintStartState = () => {
  const wikiBox = document.querySelector('a').getBoundingClientRect();
  const buttonBox = document.querySelector('button').getBoundingClientRect();
  const top = (((wikiBox.bottom + buttonBox.top) / 2) - (5 * X / 2)) / X | 0;
  const left = ((window.innerWidth / 2) - (5 * X / 2)) / X | 0;
  updateDOM(new Cells(translate(startState, left, top)));
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
  container.textContent = '';
  liveCells.getAll().forEach(
    ([x, y]) => container.appendChild(createElementForCell([x * X, y * X])));
};

const snap = x  => {
  const s = (x / X) | 0;
  return s * X;
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
  paintStartState();

  document.addEventListener('click', event => {
    if (interval) {
      return;
    }
    const cell = event.target.closest('.cell');
    if (cell) {
      cell.remove();
    } else if (!event.target.closest('button, a, h1')) {
      const {clientX: x, clientY: y} = event;
      document.querySelector('#container')
          .appendChild(createElementForCell([snap(x), snap(y)]));
    }
  });

  document.addEventListener('mousemove', event => {
    const style = document.querySelector('.indicator').style;
    if (interval || event.target.closest('button, a, h1')) {
      style.opacity = 0;
    } else {
      const {clientX: left, clientY: top} = event;
      style.opacity = 0.5;
      style.left = `${snap(left)}px`;
      style.top = `${snap(top)}px`;
    }
  });

  document.querySelector('#controls').addEventListener('click', ({target}) => {
    const button = target.closest('button[id]');
    if (!button) {
      return;
    }
    switch (button.id) {
      case 'home':
        paintStartState();
        break;

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
