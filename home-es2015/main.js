'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var main = function main() {
    var h5 = document.querySelector('h5');
    var markup = Array.from(h5.textContent).join('</span><span>');
    h5.innerHTML = '<span>' + markup + '</span>';

    document.addEventListener('mouseover', function (event) {
        return document.documentElement.classList.toggle('menu-active', event.target.closest('.menu') !== null);
    });

    var originalRatio = 1010 / 404;
    var defaultScale = .65;
    var borderWidth = 120;
    var targetScaledHeight = 70;
    var targetScaledDetaX = 30;
    // from bottom
    var targetScaledDeltaY = 30;
    var setStyles = function setStyles(afterRule, hoverRule) {
        var innerWidth = window.innerWidth;
        var innerHeight = window.innerHeight - borderWidth;
        var width = defaultScale * innerWidth;
        var height = width / originalRatio;
        var scale = targetScaledHeight / height;
        var scaledDeltaX = (innerWidth - width) / 2 * scale;
        var scaledDeltaY = (innerHeight - height) / 2 * scale;
        var originX = (targetScaledDetaX - scaledDeltaX) / (1 - scale);
        var originY = innerHeight - (targetScaledDeltaY - scaledDeltaY) / (1 - scale);
        afterRule.transformOrigin = originX.toFixed(2) + 'px ' + originY.toFixed(2) + 'px 0px';
        hoverRule.transform = 'scale(' + scale.toFixed(3) + ')';
    };

    var _map = ['html::after', 'html.menu-active::after'].map(function (selector) {
        return document.styleSheets.getDeclaration(selector);
    }),
        _map2 = _slicedToArray(_map, 2),
        afterRule = _map2[0],
        hoverRule = _map2[1];

    setStyles(afterRule, hoverRule);
    window.addEventListener('resize', function (event) {
        return setStyles(afterRule, hoverRule);
    });
};