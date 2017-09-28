'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SBBClock = function () {
  function SBBClock() {
    _classCallCheck(this, SBBClock);
  }

  _createClass(SBBClock, null, [{
    key: 'create',
    value: function create(container) {
      var _this = this;

      var clockElement = container.appendTemplate(this.clock());
      var groupCenter = clockElement.appendTemplate(this.groupCenter());
      var pointerHours = groupCenter.appendTemplate(this.pointerHours());
      var pointerMinutes = groupCenter.appendTemplate(this.pointerMinutes());
      var pointerSeconds = groupCenter.appendTemplate(this.pointerSeconds());
      var timezoneOffset = new Date().getTimezoneOffset();
      setInterval(function () {
        requestAnimationFrame(function () {
          var totalSeconds = Date.now() / 1000;
          var totalMinutes = totalSeconds / 60;
          var totalHours = (totalMinutes - timezoneOffset) / 60;
          _this.updateSeconds(pointerSeconds, totalSeconds);
          _this.updateMinutes(pointerMinutes, totalMinutes);
          _this.updateHours(pointerHours, totalHours);
        });
      }, 32);
    }
  }, {
    key: 'updateSeconds',
    value: function updateSeconds(pointer, seconds) {
      this.setRotation(pointer, Math.min(360, seconds % 60 * 6.1));
    }
  }, {
    key: 'updateMinutes',
    value: function updateMinutes(pointer, minutes) {
      this.setRotation(pointer, (minutes | 0) % 60 * 6);
    }
  }, {
    key: 'updateHours',
    value: function updateHours(pointer, hours) {
      this.setRotation(pointer, hours % 12 * 30);
    }
  }, {
    key: 'setRotation',
    value: function setRotation(element, rotation) {
      element.setAttribute('transform', 'rotate(' + rotation + ')');
    }
  }, {
    key: 'pointerHours',
    value: function pointerHours() {
      return this.path({
        'class': 'pointer-hours',
        'd': 'M-19,-232 l38,0 4,312 -46,0 z'
      });
    }
  }, {
    key: 'pointerMinutes',
    value: function pointerMinutes() {
      return this.path({
        'class': 'pointer-minutes',
        'd': 'M-14,-340 l28,0 4,420 -36,0 z'
      });
    }
  }, {
    key: 'pointerSeconds',
    value: function pointerSeconds() {
      return this.g({ 'class': 'pointer-seconds' }, [this.circle({
        'cy': '-222',
        'r': '40',
        'fill': 'hsl(0, 88%, 56%)'
      }), this.rect({
        'x': '-5',
        'y': '-220',
        'width': '10',
        'height': '356',
        'fill': 'hsl(0, 88%, 56%)'
      }), this.circle({ 'r': '3', 'fill': 'white' })]);
    }
  }, {
    key: 'dial',
    value: function dial() {
      var template = [];
      for (var i = 0; i < 12; i++) {
        template.push(this.rect({
          'transform': 'rotate(' + i * 30 + ') translate(0, -352)',
          'x': '-12',
          'y': '0',
          'width': '24',
          'height': '92'
        }));
      }
      for (var _i = 0; _i < 60; _i++) {
        template.push(this.rect({
          'transform': 'rotate(' + _i * 6 + ') translate(0, -352)',
          'x': '-5',
          'y': '0',
          'width': '10',
          'height': '24'
        }));
      }
      return template;
    }
  }, {
    key: 'groupCenter',
    value: function groupCenter() {
      var border = this.circle({
        'r': '378',
        'stroke-width': '4',
        'stroke': 'hsla(0, 0%, 25%, 0.7)',
        'fill': 'hsla(0, 100%, 100%, 1)'
      });
      var dial = this.dial();
      return this.g({ 'transform': 'translate(400, 400)' }, [border, dial]);
    }
  }, {
    key: 'clock',
    value: function clock() {
      return this.svg({ 'viewBox': '0 0 800 800' });
    }
  }, {
    key: 'svg',
    value: function svg(attrs) {
      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      return ['svg:svg', attrs].concat(_toConsumableArray(children));
    }
  }, {
    key: 'circle',
    value: function circle(attrs) {
      return ['svg:circle', Object.assign({}, this.DEFAULT_CIRCLE_ATTRS, attrs)];
    }
  }, {
    key: 'rect',
    value: function rect(attrs) {
      return ['svg:rect', attrs];
    }
  }, {
    key: 'path',
    value: function path(attrs) {
      return ['svg:path', attrs];
    }
  }, {
    key: 'g',
    value: function g(attrs) {
      var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

      return ['svg:g', attrs].concat(_toConsumableArray(children));
    }
  }, {
    key: 'DEFAULT_CIRCLE_ATTRS',
    get: function get() {
      return { cx: '0', cy: '0', fill: 'none' };
    }
  }]);

  return SBBClock;
}();