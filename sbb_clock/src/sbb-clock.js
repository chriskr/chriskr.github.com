'use strict';

class SBBClock {
  static get DEFAULT_CIRCLE_ATTRS() {
    return { cx: '0', cy: '0', fill: 'none', }
  }

  static create(container) {
    const clockElement = container.appendTemplate(this.clock());
    const groupCenter = clockElement.appendTemplate(this.groupCenter());
    const pointerHours = groupCenter.appendTemplate(this.pointerHours());
    const pointerMinutes = groupCenter.appendTemplate(this.pointerMinutes());
    const pointerSeconds = groupCenter.appendTemplate(this.pointerSeconds());
    const timezoneOffset = new Date().getTimezoneOffset();
    setInterval(() => {
      requestAnimationFrame(() => {
        const totalSeconds = Date.now() / 1000;
        const totalMinutes = totalSeconds / 60;
        const totalHours = (totalMinutes - timezoneOffset) / 60;
        this.updateSeconds(pointerSeconds, totalSeconds);
        this.updateMinutes(pointerMinutes, totalMinutes);
        this.updateHours(pointerHours, totalHours);
      });
    }, 32);
  }

  static updateSeconds(pointer, seconds) {
    this.setRotation(pointer, Math.min(360, (seconds % 60) * 6.1));
  }

  static updateMinutes(pointer, minutes) {
    this.setRotation(pointer, ((minutes | 0) % 60) * 6);
  }

  static updateHours(pointer, hours) {
    this.setRotation(pointer, (hours % 12) * 30);
  }

  static setRotation(element, rotation) {
    element.setAttribute('transform', `rotate(${rotation})`);
  }

  static pointerHours() {
    return this.path({
      'class': 'pointer-hours',
      'd': 'M-19,-232 l38,0 4,312 -46,0 z',
    });
  }

  static pointerMinutes() {
    return this.path({
      'class': 'pointer-minutes',
      'd': 'M-14,-340 l28,0 4,420 -36,0 z',
    });
  }

  static pointerSeconds() {
    return this.g({'class': 'pointer-seconds'}, [
      this.circle({
        'cy': '-222',
        'r': '40',
        'fill': 'hsl(0, 88%, 56%)',
      }),
      this.rect({
        'x': '-5',
        'y': '-220',
        'width': '10',
        'height': '356',
        'fill': 'hsl(0, 88%, 56%)',
      }),
      this.circle({'r': '3', 'fill': 'white'}),
    ]);
  }

  static dial() {
    const template = [];
    for (let i = 0; i < 12; i++) {
      template.push(this.rect({
        'transform': `rotate(${i * 30}) translate(0, -352)`,
        'x': '-12',
        'y': '0',
        'width': '24',
        'height': '92',
      }));
    }
    for (let i = 0; i < 60; i++) {
      template.push(this.rect({
        'transform': `rotate(${i * 6}) translate(0, -352)`,
        'x': '-5',
        'y': '0',
        'width': '10',
        'height': '24',
      }));
    }
    return template;
  }

  static groupCenter() {
    const border = this.circle({
      'r': '378',
      'stroke-width': '4',
      'stroke': 'hsla(0, 0%, 25%, 0.7)',
      'fill': 'hsla(0, 100%, 100%, 1)',
    });
    const dial = this.dial();
    return this.g({'transform': 'translate(400, 400)'}, [border, dial]);
  }

  static clock() {
    return this.svg({'viewBox': '0 0 800 800'});
  }

  static svg(attrs, children = []) {
    return ['svg:svg', attrs, ...children];
  }

  static circle(attrs) {
    return ['svg:circle', Object.assign({}, this.DEFAULT_CIRCLE_ATTRS, attrs)];
  }

  static rect(attrs) {
    return ['svg:rect', attrs];
  }

  static path(attrs) {
    return ['svg:path', attrs];
  }

  static g(attrs, children = []) {
    return ['svg:g', attrs, ...children];
  }
}
