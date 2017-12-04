class Timer {
  constructor() {
    this.store_ = [];
    this.timeout_ = 0;
    this.stamps_ = [];
    this.stampsCursor_ = -1;
    this.timeFrame_ = null;
    this.beforeFrame_ = null;
    this.onFrame_ = this.onFrame_.bind(this);
  }

  set(callback) {
    let i = 0;
    let length = this.store_.length;
    for (; i < length && this.store_[i] !== callback; i++)
      ;
    if (i === length) {
      for (i = 0; this.store_[i] !== undefined; i++)
        ;
      this.store_[i] = callback;
      this.start();
    }
    return i;
  }

  clear(index) {
    this.store_[index] = undefined;
    return -1;
  }

  setOnFrame(callback) {
    this.timeFrame_ = callback;
  }

  clearOnFrame() {
    this.timeFrame_ = null;
  }

  setBeforeFrame(callback) {
    this.beforeFrame_ = callback;
  }

  clearBeforeFrame() {
    this.beforeFrame_ = null;
  }

  pause() {
    window.cancelAnimationFrame(this.timeout_);
    this.timeout_ = 0;
  }

  start() {
    if (!this.timeout_) {
      this.timeout_ = window.requestAnimationFrame(this.onFrame_);
    }
  }

  getFps_() {
    this.stampsCursor_++;
    this.stampsCursor_ %= 100;
    this.stamps_[this.stampsCursor_] = Date.now();
    const length = this.stamps_.length;
    const first = length === 100 ? (this.stampsCursor_ + 1) % 100 : 0;
    const delta = this.stamps_[this.stampsCursor_] - this.stamps_[first];
    return 1000 / delta * (length - 1) | 0;
  }

  onFrame_() {
    let is_running = false;
    if (this.beforeFrame_) {
      this.beforeFrame_();
    }

    for (let i = 0, length = this.store_.length; i < length; i++) {
      if (this.store_[i]) {
        if (!is_running) {
          is_running = true;
        }
        this.store_[i]();
      }
    }

    if (this.timeFrame_) {
      this.timeFrame_(this.getFps_());
    }

    if (is_running) {
      this.timeout_ = window.requestAnimationFrame(this.onFrame_);
    }
  }
}
