class Animation {
  constructor(timer) {
    this.timer_ = timer;
    this.current_ = 0;
    this.interval_ = -1;
    this.timeDelta_ = 1;
    this.onFrame_ = this.onFrame_.bind(this);
  }

  start() {}

  strategy() {}

  onfinish() {}

  run() {
    if (this.interval_ === -1) {
      this.current_ = 0;
      this.interval_ = this.timer_.set(this.onFrame_);
    }
  }

  restart() {
    if (this.interval_ === -1) {
      this.interval_ = this.timer_.set(this.onFrame_);
    }
  }

  pause() {
    this.interval_ = this.timer_.clear(this.interval_);
  }

  clear() {
    this.timer_.clear(this.interval_);
  }

  onFrame_() {
    this.current_ += this.timeDelta_;
    this.strategy();
    if (this.current_ > 100) {
      this.interval_ = this.timer_.clear(this.interval_);
      this.onfinish();
    }
  }
}
