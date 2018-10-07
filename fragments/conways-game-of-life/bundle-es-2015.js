'use strict';

if (Array.from === undefined) {
  Array.from = function (iterable) {
    if (iterable.length === undefined) {
      // Generators
      if (typeof iterable.next === 'function') {
        var array = [];
        while (true) {
          var yielded = iterable.next();
          if (yielded.done === true) {
            return array;
          }
          array.push(yielded.value);
        }
      }
      // Map and Set
      if (typeof iterable.forEach === 'function') {
        var list = [];
        var callback = typeof iterable.set === 'function' ? function (value, key) {
          list.push([key, value]);
        } : function (value) {
          list.push(value);
        };
        iterable.forEach(callback);
        return list;
      }
    }
    return Array.prototype.slice.call(iterable);
  };
  console.info('Patched Array.from');
}

if (Array.prototype.includes === undefined) {
  // eslint-disable-next-line
  Array.prototype.includes = function (item) {
    return this.indexOf(item) > -1;
  };
  console.info('Patched Array.prototype.includes');
}

if (Array.prototype.find === undefined) {
  // eslint-disable-next-line
  Array.prototype.find = function (callback) {
    for (var i = 0; i < this.length; i++) {
      var item = this[i];
      if (callback(item)) {
        return item;
      }
    }
    return null;
  };
  console.info('Patched Array.prototype.find');
}

if (Array.prototype.findIndex === undefined) {
  // eslint-disable-next-line
  Array.prototype.findIndex = function (callback) {
    for (var i = 0; i < this.length; i++) {
      var item = this[i];
      if (callback(item)) {
        return i;
      }
    }
    return -1;
  };
  console.info('Patched Array.prototype.findIndex');
}

if (window.Symbol === undefined) {
  window.Symbol = function (key) {
    var counter = Math.round(Math.random() * 0xfffffff);
    return function () {
      return '__key(' + (key || '') + ')__' + String(counter++) + '__';
    };
  }();
  Symbol.iterator = Symbol('iterator');
  console.info('Patched Symbol');
}

var GeneratorPolyfill = function GeneratorPolyfill(iterable) {
  this.iterable_ = Array.from(iterable);
  this.pointer_ = 0;
  this.done_ = false;
};

GeneratorPolyfill.generator = Array.prototype[Symbol.iterator] || function () {
  return new GeneratorPolyfill(this);
};

GeneratorPolyfill.prototype = new function () {
  this.next = function () {
    if (!this.done_) {
      this.done_ = this.pointer_ >= this.iterable_.length;
    }
    var value = undefined;
    if (!this.done_) {
      value = this.iterable_[this.pointer_++];
    }
    return { value: value, done: this.done_ };
  };

  this.return = function (value) {
    this.done_ = true;
    return { value: value, done: this.done_ };
  };
}();

(function () {
  var getName = function getName(class_) {
    if (class_.name !== undefined) {
      return class_.name;
    }
    var str = String(class_);
    var match = /[A-Z][^ (\]]+/.exec(str);
    if (match) {
      return match[0];
    }
    return str;
  };
  var classes = [Array, NodeList, Map, Set];
  for (var i = 0; i < classes.length; i++) {
    var class_ = classes[i];
    if (class_.prototype[Symbol.iterator] === undefined) {
      class_.prototype[Symbol.iterator] = GeneratorPolyfill.generator;
      console.info('Patched ' + getName(class_) + '.prototype[Symbol.iterator]');
    }
  }
})();

if (!new Map().entries && new Map().forEach) {
  Map.prototype.entries = function () {
    var list = [];
    this.forEach(function (value, key) {
      list.push([key, value]);
    });
    return new GeneratorPolyfill(list);
  };
  console.info('Patched entries for Map');
}

if (!new Map().keys && new Map().forEach) {
  Map.prototype.keys = function () {
    var list = [];
    this.forEach(function (value, key) {
      list.push(key);
    });
    return new GeneratorPolyfill(list);
  };
  console.info('Patched keys for Map');
}

if (new Map([[1, 1]]).size === 0) {
  (function (MapClass) {
    // eslint-disable-next-line
    Map = function Map(initList) {
      var map = new MapClass();
      if (initList !== undefined) {
        for (var i = 0; i < initList.length; i++) {
          map.set(initList[i][0], initList[i][1]);
        }
      }
      return map;
    };
    MapClass.prototype.constructor = Map;
    console.info('Patched initList for Map');
  })(Map);
}

if (String.prototype.includes === undefined) {
  // eslint-disable-next-line
  String.prototype.includes = function (item) {
    return this.indexOf(item) > -1;
  };
  console.info('Patched String.prototype.includes');
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
if (String.prototype.repeat === undefined) {
  // eslint-disable-next-line
  String.prototype.repeat = function (count) {
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    // eslint-disable-next-line
    if (count !== count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count === Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length === 0 || count === 0) {
      return '';
    }
    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (var i = 0; i < count; i++) {
      rpt += str;
    }
    return rpt;
  };
  console.info('Patched String.prototype.repeat');
}

if (Object.assign === undefined) {
  Object.assign = function (target, sources) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      if (source !== null && source !== undefined) {
        for (var prop in source) {
          if (source.hasOwnProperty(prop)) {
            target[prop] = source[prop];
          }
        }
      }
    }
    return target;
  };
  console.info('Patched Object.assign');
}

if (Element.prototype.remove === undefined) {
  Element.prototype.remove = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
  console.info('Patched Element.prototype.remove');
}

try {
  new Event('change', { bubbles: true });
} catch (error) {
  (function (EventPrototype) {
    // eslint-disable-next-line
    Event = function Event(type, options) {
      var event = document.createEvent('Event');
      event.initEvent(type, Boolean(options.bubbles), Boolean(options.cancelable));
      return event;
    };
    // TODO check this
    Event.prototype = EventPrototype.prototype;
  })(Event);
  console.info('Patched new Event(type, options)');
}

try {
  new CustomEvent('test', { detail: 'foo' });
} catch (error) {
  (function (EventPrototype) {
    // eslint-disable-next-line
    CustomEvent = function CustomEvent(type, options) {
      if (options === undefined) {
        options = { bubbles: false, cancelable: false, detail: undefined };
      }
      var event = document.createEvent('CustomEvent');
      event.initCustomEvent(type, Boolean(options.bubbles), Boolean(options.cancelable), options.detail);
      return event;
    };
    // TODO check this
    CustomEvent.prototype = EventPrototype.prototype;
  })(CustomEvent || Event);
  console.info('Patched new CusyomEvent(type, options)');
}

if (Number.parseInt === undefined) {
  Number.parseInt = parseInt;
  console.info('Patched Number.parseInt');
}

if (document.createElement('div').classList.toggle('foo', false) === true) {
  DOMTokenList.prototype.toggle = function (toggle) {
    return function (className, state) {
      if (state === undefined) {
        return toggle.call(this, className);
      }
      if (state) {
        this.add(className);
      } else {
        this.remove(className);
      }
      return this.contains(className);
    };
  }(DOMTokenList.prototype.toggle);
  console.info('Patched DOMTokenList.prototype.toggle');
}

if (SVGElement.prototype.__lookupGetter__('classList') === undefined) {
  var classListGetter = HTMLElement.prototype.__lookupGetter__('classList');
  if (classListGetter) {
    SVGElement.prototype.__defineGetter__('classList', function () {
      return classListGetter.call(this);
    });
    console.info('Patched SVGElement.prototype.classList');
  }
}

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || function (selector) {
    var candidates = this.parentNode.querySelectorAll(selector);
    for (var i = 0; i < candidates.length; i++) {
      var candidate = candidates[i];
      if (candidate === this) {
        return true;
      }
    }
    return false;
  };
  console.info('Patched Element.prototype.matches');
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (selector) {
    var ele = this;
    while (ele && ele.nodeType === Node.ELEMENT_NODE) {
      if (ele.matches(selector)) {
        return ele;
      }
      ele = ele.parentNode;
    }
    return null;
  };
  console.info('Patched Element.prototype.closest');
}

if (!Array.prototype.flat) {
  Array.prototype.flat = function () {
    var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    if (depth === 0) {
      return this;
    }
    return this.reduce(function (acc, item) {
      if (Array.isArray(item)) {
        acc.push.apply(acc, item.flat(depth - 1));
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
  };
}

if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function (callback) {
    return this.map(callback).flat();
  };
}
'use strict';

var shapes = [{
  name: '',
  width: 5,
  height: 5,
  data: [1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1]
}, {
  name: '',
  width: 8,
  height: 6,
  data: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0]
}, {
  name: 'acorn',
  width: 7,
  height: 3,
  data: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1]
}, {
  name: 'the r-pentomino',
  width: 3,
  height: 3,
  data: [0, 1, 1, 1, 1, 0, 0, 1, 0]
}, {
  name: '',
  width: 39,
  height: 1,
  data: [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1]
}, {
  name: 'gosper glider gun',
  width: 36,
  height: 9,
  data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}];
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var X = 9;

var translate = function translate(matrix, left, top) {
  return matrix.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        x = _ref2[0],
        y = _ref2[1];

    return [left + x, top + y];
  });
};

var scale = function scale(_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2),
      x = _ref4[0],
      y = _ref4[1];

  return [x * X, y * X];
};

var isOnScreen = function isOnScreen(_ref5) {
  var _ref6 = _slicedToArray(_ref5, 2),
      x = _ref6[0],
      y = _ref6[1];

  return -X < x && x < window.innerWidth && -X < y && y < window.innerHeight;
};

var snap = function snap(x) {
  var s = x / X | 0;
  return s * X;
};

var addStyle = function addStyle() {
  var sheet = document.body.appendChild(document.createElement('style'));
  sheet.textContent = '.cell {width: ' + X + 'px; height: ' + X + 'px;}';
};

var getPosFromIndexAndWidth = function getPosFromIndexAndWidth(width, index) {
  var x = index % width;
  var y = (index - x) / width;
  return [x, y];
};

var getCellsFromShape = function getCellsFromShape(_ref7) {
  var data = _ref7.data,
      width = _ref7.width,
      height = _ref7.height;
  return data.map(function (bit, index) {
    return bit === 0 ? null : getPosFromIndexAndWidth(width, index);
  }).filter(Boolean);
};

var shapeToCanvas = function shapeToCanvas(_ref8, scale) {
  var data = _ref8.data,
      width = _ref8.width,
      height = _ref8.height;

  var canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  data.forEach(function (bit, index) {
    if (bit == 1) {
      var _getPosFromIndexAndWi = getPosFromIndexAndWidth(width, index),
          _getPosFromIndexAndWi2 = _slicedToArray(_getPosFromIndexAndWi, 2),
          x = _getPosFromIndexAndWi2[0],
          y = _getPosFromIndexAndWi2[1];

      ctx.rect(x * scale, y * scale, scale, scale);
    }
  });
  ctx.fill();
  return canvas;
};

var addShapes = function addShapes() {
  var shapeList = document.querySelector('#shape-list');
  var scale = 4;
  var maxHeight = shapes.reduce(function (max, _ref9) {
    var height = _ref9.height;
    return Math.max(max, height);
  }, 0) * scale;
  shapes.forEach(function (shape, index) {
    var canvas = shapeToCanvas(shape, scale);
    var padding = (maxHeight - scale * shape.height) / 2;
    canvas.style.paddingTop = padding + 'px';
    canvas.style.paddingBottom = padding + 'px';
    var li = document.createElement('li');
    li.dataset.legend = shape.name;
    li.classList.add('shape');
    li.dataset.index = String(index);
    li.appendChild(canvas);
    shapeList.appendChild(li);
  });
};

var createElementForCell = function createElementForCell(_ref10) {
  var _ref11 = _slicedToArray(_ref10, 2),
      x = _ref11[0],
      y = _ref11[1];

  var span = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document.createElement('span');

  span.classList.add('cell');
  span.style.left = x + 'px';
  span.style.top = y + 'px';
  return span;
};

var paintStartState = function paintStartState() {
  var shape = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : shapes[0];

  var wikiBox = document.querySelector('a').getBoundingClientRect();
  var buttonBox = document.querySelector('#controls').getBoundingClientRect();
  var top = ((wikiBox.bottom + buttonBox.top) / 2 - shape.height * X / 2) / X | 0;
  var left = (window.innerWidth / 2 - shape.width * X / 2) / X | 0;
  updateDOM(new Cells(translate(getCellsFromShape(shape), left, top)));
};

var getStateFromDOM = function getStateFromDOM() {
  return new Cells([].concat(_toConsumableArray(document.querySelector('#container').children)).map(function (_ref12) {
    var _ref12$style = _ref12.style,
        top = _ref12$style.top,
        left = _ref12$style.left;
    return [Number.parseInt(left) / X | 0, Number.parseInt(top) / X | 0];
  }));
};

var updateDOM = function updateDOM(liveCells) {
  var container = document.querySelector('#container');
  var children = [].concat(_toConsumableArray(container.children));
  container.textContent = '';
  liveCells.getAll().map(scale).filter(isOnScreen).forEach(function (pos) {
    return container.appendChild(createElementForCell(pos, children.pop()));
  });
};

var Cells = function () {
  function Cells() {
    var _this = this;

    var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, Cells);

    this._x = new Map();
    list.forEach(function (pos) {
      return _this.add(pos);
    });
  }

  _createClass(Cells, [{
    key: 'add',
    value: function add(_ref13) {
      var _ref14 = _slicedToArray(_ref13, 2),
          x = _ref14[0],
          y = _ref14[1];

      if (!this._x.has(x)) {
        this._x.set(x, new Map());
      }
      var column = this._x.get(x);
      if (!column.has(y)) {
        column.set(y, 0);
      }
      column.set(y, column.get(y) + 1);
    }
  }, {
    key: 'has',
    value: function has(_ref15) {
      var _ref16 = _slicedToArray(_ref15, 2),
          x = _ref16[0],
          y = _ref16[1];

      return this.get([x, y]) > 0;
    }
  }, {
    key: 'get',
    value: function get(_ref17) {
      var _ref18 = _slicedToArray(_ref17, 2),
          x = _ref18[0],
          y = _ref18[1];

      var column = this._x.get(x);
      return column ? column.get(y) : 0;
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return [].concat(_toConsumableArray(this._x.entries())).flatMap(function (_ref19) {
        var _ref20 = _slicedToArray(_ref19, 2),
            x = _ref20[0],
            yMap = _ref20[1];

        return [].concat(_toConsumableArray(yMap.keys())).map(function (y) {
          return [x, y];
        });
      });
    }
  }]);

  return Cells;
}();

var getNeighbours = function getNeighbours(_ref21) {
  var _ref22 = _slicedToArray(_ref21, 2),
      x = _ref22[0],
      y = _ref22[1];

  return [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]];
};

var iterate = function iterate(liveCells) {
  // Any live cell with fewer than two live neighbors dies, as if by under population.
  // Any live cell with two or three live neighbors lives on to the next generation.
  // Any live cell with more than three live neighbors dies, as if by overpopulation.
  // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  var neighboursCounts = new Cells();
  var addNeighbourCount = function addNeighbourCount(neighboursPos) {
    return neighboursCounts.add(neighboursPos);
  };
  var countNeighbours = function countNeighbours(pos) {
    return getNeighbours(pos).forEach(addNeighbourCount);
  };
  liveCells.getAll().forEach(countNeighbours);
  return new Cells(neighboursCounts.getAll().filter(function (pos) {
    var liveCount = neighboursCounts.get(pos);
    return liveCount === 3 || liveCells.has(pos) && liveCount === 2;
  }));
};

var getIterator = function getIterator(currentState, callabck) {
  return function () {
    currentState = iterate(currentState);
    callabck(currentState);
  };
};

var setUp = function setUp() {
  var interval = null;

  addStyle();
  addShapes();
  paintStartState();

  document.addEventListener('click', function (event) {
    if (interval) {
      return;
    }
    var cell = event.target.closest('.cell');
    if (cell) {
      cell.remove();
    } else if (!event.target.closest('.button, a, h1')) {
      var x = event.clientX,
          y = event.clientY;

      document.querySelector('#container').appendChild(createElementForCell([snap(x), snap(y)]));
    }
  });

  document.addEventListener('mousemove', function (event) {
    var style = document.querySelector('.indicator').style;
    if (interval || event.target.closest('.button, a, h1')) {
      style.opacity = 0;
    } else {
      var left = event.clientX,
          top = event.clientY;

      style.opacity = 0.5;
      style.left = snap(left) + 'px';
      style.top = snap(top) + 'px';
    }
  });

  document.querySelector('#controls').addEventListener('click', function (_ref23) {
    var target = _ref23.target;

    var button = target.closest('[id].button');
    if (!button) {
      return;
    }
    switch (button.id) {
      case 'menu':
        {
          var shape = target.closest('.shape');
          if (shape) {
            var index = shape.dataset.index;
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

  window.addEventListener('resize', function () {
    if (!interval) {
      paintStartState();
    }
  });
};

setUp();
